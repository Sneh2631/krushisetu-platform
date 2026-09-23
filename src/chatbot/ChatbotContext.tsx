import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import { matchUserIntent } from './chatbotIntents';
import {
  CHATBOT_NAME,
  CHATBOT_WELCOME,
  CHATBOT_KNOWLEDGE,
  type ChatbotAction,
} from './chatbotKnowledge';
import { voiceService } from '../services/voiceService';
import {
  askGeminiAi,
  hasGeminiApiKey,
  getGeminiApiKey,
  saveGeminiApiKey,
} from '../services/geminiService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  steps?: string[];
  action?: ChatbotAction;
  suggestions?: string[];
  timestamp: string;
  isAiGenerated?: boolean;
}

interface ChatbotContextType {
  isOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  isGenerating: boolean;
  startVoiceInput: () => void;
  stopVoiceInput: () => void;
  speakMessage: (text: string) => void;
  stopSpeaking: () => void;
  autoReadReplies: boolean;
  setAutoReadReplies: (val: boolean) => void;
  voiceError: string | null;
  botName: string;
  hasUnread: boolean;
  isGeminiConfigured: boolean;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  onTriggerAction?: (action: ChatbotAction) => void;
  setTriggerActionHandler: (handler: (action: ChatbotAction) => void) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [geminiKey, setGeminiKeyState] = useState<string>(() => getGeminiApiKey());
  const [triggerActionHandler, setTriggerActionHandler] = useState<((action: ChatbotAction) => void) | null>(null);

  const setGeminiKey = (key: string) => {
    saveGeminiApiKey(key);
    setGeminiKeyState(key);
  };

  const isGeminiConfigured = Boolean(geminiKey.trim() || hasGeminiApiKey());

  // Auto read replies preference (default false as required)
  const [autoReadReplies, setAutoReadRepliesState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('krishisetu_chat_autoread');
      return saved ? JSON.parse(saved) : false;
    } catch (_) {
      return false;
    }
  });

  const setAutoReadReplies = (val: boolean) => {
    setAutoReadRepliesState(val);
    try {
      localStorage.setItem('krishisetu_chat_autoread', JSON.stringify(val));
    } catch (_) {}
  };

  const getInitialWelcomeMessage = (lang: Language): ChatMessage => {
    const welcome = CHATBOT_WELCOME[lang];
    return {
      id: `welcome-${lang}-${Date.now()}`,
      sender: 'bot',
      text: welcome.message,
      suggestions: welcome.suggestions,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Messages with localStorage persistence
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`krishisetu_chat_${language}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [getInitialWelcomeMessage(language)];
  });

  // When language changes: stop active speech/listening and reset/translate welcome conversation
  useEffect(() => {
    voiceService.stopSpeaking();
    voiceService.stopListening();
    setIsSpeaking(false);
    setIsListening(false);
    setVoiceError(null);

    try {
      const saved = localStorage.getItem(`krishisetu_chat_${language}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (_) {}

    setMessages([getInitialWelcomeMessage(language)]);
  }, [language]);

  // Persist messages whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(`krishisetu_chat_${language}`, JSON.stringify(messages));
    } catch (_) {}
  }, [messages, language]);

  // Subscribe to voiceService
  useEffect(() => {
    const unsubscribe = voiceService.subscribe((status) => {
      setIsSpeaking(status.isSpeaking);
      setIsListening(status.isListening);
    });
    return () => unsubscribe();
  }, []);

  const openChatbot = () => {
    setIsOpen(true);
    setHasOpenedBefore(true);
    setHasUnread(false);
  };

  const closeChatbot = () => {
    voiceService.stopSpeaking();
    voiceService.stopListening();
    setIsOpen(false);
  };

  const toggleChatbot = () => {
    if (isOpen) {
      closeChatbot();
    } else {
      openChatbot();
    }
  };

  const speakMessage = (text: string) => {
    setVoiceError(null);
    voiceService.speak(
      text,
      language,
      () => setIsSpeaking(false),
      (err) => {
        setIsSpeaking(false);
        if (err === 'voice_unavailable_gu') {
          setVoiceError(
            language === 'gu'
              ? 'આ ઉપકરણમાં ગુજરાતી અવાજ ઉપલબ્ધ નથી'
              : 'Gujarati voice is not installed on this device'
          );
        } else if (err === 'voice_unavailable_hi') {
          setVoiceError(
            language === 'hi'
              ? 'इस उपकरण पर हिंदी आवाज़ उपलब्ध नहीं है'
              : 'Hindi voice is not installed on this device'
          );
        }
      }
    );
  };

  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  const startVoiceInput = () => {
    setVoiceError(null);
    const started = voiceService.startListening(
      language,
      (transcript, isFinal) => {
        if (isFinal && transcript.trim()) {
          sendMessage(transcript);
        }
      },
      (errCode) => {
        setIsListening(false);
        if (errCode === 'permission_denied' || errCode === 'not-allowed') {
          setVoiceError(
            language === 'gu'
              ? 'માઇક્રોફોનની પરવાનગી જરૂરી છે'
              : language === 'hi'
              ? 'माइक्रोफ़ोन की अनुमति आवश्यक है'
              : 'Microphone permission is required'
          );
        } else if (errCode === 'recognition_not_supported') {
          setVoiceError(
            language === 'gu'
              ? 'આ બ્રાઉઝર અવાજ દ્વારા પ્રશ્ન પૂછવાની સુવિધાને સપોર્ટ કરતું નથી'
              : language === 'hi'
              ? 'यह ब्राउज़र आवाज़ से प्रश्न पूछने की सुविधा का समर्थन नहीं करता'
              : 'Voice input is not supported in this browser'
          );
        }
      }
    );
    if (!started && !voiceError) {
      setVoiceError(
        language === 'gu'
          ? 'આ બ્રાઉઝર અવાજ દ્વારા પ્રશ્ન પૂછવાની સુવિધાને સપોર્ટ કરતું નથી'
          : language === 'hi'
          ? 'यह ब्राउज़र आवाज़ से प्रश्न पूछने की सुविधा का समर्थन नहीं करता'
          : 'Voice input is not supported in this browser'
      );
    }
  };

  const stopVoiceInput = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const sendMessage = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: clean,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    if (!isOpen) {
      setHasUnread(true);
    }

    const match = matchUserIntent(clean, language);
    const hasIntentAction = match.intent !== 'fallback' && CHATBOT_KNOWLEDGE[language][match.intent]?.action;

    // If Gemini key is configured and user hasn't asked for a specific platform button action
    if (isGeminiConfigured && !hasIntentAction) {
      setIsGenerating(true);
      try {
        const aiResult = await askGeminiAi(clean, language, messages);
        if (aiResult.isAiGenerated && aiResult.text) {
          const aiBotMsg: ChatMessage = {
            id: `bot-${Date.now() + 1}`,
            sender: 'bot',
            text: aiResult.text,
            isAiGenerated: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, aiBotMsg]);
          setIsGenerating(false);

          if (autoReadReplies) {
            speakMessage(aiResult.text);
          }
          return;
        }
      } catch (e) {
        console.warn('Gemini query fallback:', e);
      } finally {
        setIsGenerating(false);
      }
    }

    // Fallback to structured knowledge base
    const responseItem = CHATBOT_KNOWLEDGE[language][match.intent] || CHATBOT_KNOWLEDGE[language].fallback;

    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: responseItem.message,
      steps: responseItem.steps,
      action: responseItem.action,
      suggestions: responseItem.suggestions,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botMsg]);

    if (autoReadReplies) {
      const fullSpeech = responseItem.steps
        ? `${responseItem.message}. ${responseItem.steps.join('. ')}`
        : responseItem.message;
      speakMessage(fullSpeech);
    }
  };

  const clearConversation = () => {
    voiceService.stopSpeaking();
    voiceService.stopListening();
    const initial = [getInitialWelcomeMessage(language)];
    setMessages(initial);
    try {
      localStorage.removeItem(`krishisetu_chat_${language}`);
    } catch (_) {}
  };

  const handleActionClick = (action: ChatbotAction) => {
    if (triggerActionHandler) {
      triggerActionHandler(action);
    }
    // On mobile screens, minimize drawer when taking an action so user sees target
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      closeChatbot();
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        openChatbot,
        closeChatbot,
        toggleChatbot,
        messages,
        sendMessage,
        clearConversation,
        isListening,
        isSpeaking,
        isGenerating,
        startVoiceInput,
        stopVoiceInput,
        speakMessage,
        stopSpeaking,
        autoReadReplies,
        setAutoReadReplies,
        voiceError,
        botName: CHATBOT_NAME[language],
        hasUnread: hasUnread && !hasOpenedBefore,
        isGeminiConfigured,
        geminiKey,
        setGeminiKey,
        onTriggerAction: handleActionClick,
        setTriggerActionHandler: (handler) => setTriggerActionHandler(() => handler),
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
