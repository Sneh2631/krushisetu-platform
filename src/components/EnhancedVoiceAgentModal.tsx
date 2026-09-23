import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { enhancedVoiceAgent, type ConversationTurn } from '../services/enhancedVoiceAgentService';
import { voiceService } from '../services/voiceService';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Loader2,
  Phone,
  Sparkles,
  AlertCircle,
  Radio,
  Heart,
  Lightbulb,
  TrendingUp,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface EnhancedVoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedVoiceAgentModal: React.FC<EnhancedVoiceAgentModalProps> = ({ isOpen, onClose }) => {
  const { language } = useTranslation();

  // Mic state: micActive is user's master switch (default ON for auto voice tracking)
  const [micActive, setMicActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentIntent, setCurrentIntent] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const conversationEndRef = useRef<HTMLDivElement>(null);
  const autoRestartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronized refs to avoid stale closures in event callbacks
  const micActiveRef = useRef(micActive);
  micActiveRef.current = micActive;

  const isSpeakingRef = useRef(isSpeaking);
  isSpeakingRef.current = isSpeaking;

  const isProcessingRef = useRef(isProcessing);
  isProcessingRef.current = isProcessing;

  const isListeningRef = useRef(isListening);
  isListeningRef.current = isListening;

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  // Clear pending restart timers safely
  const clearAutoRestartTimer = () => {
    if (autoRestartTimerRef.current) {
      clearTimeout(autoRestartTimerRef.current);
      autoRestartTimerRef.current = null;
    }
  };

  // Update voice agent config when language or state changes
  useEffect(() => {
    enhancedVoiceAgent.updateConfig({
      language,
      autoListen: micActive,
      autoSpeak: true,
      personalityMode: 'friendly',
      useRealTimeData: true,
    });
  }, [language, micActive]);

  // Subscribe to voiceService state
  useEffect(() => {
    const unsubscribe = voiceService.subscribe((status) => {
      setIsSpeaking(status.isSpeaking);
      setIsListening(status.isListening);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, interimTranscript]);

  // Forward declaration of handleUserInput via ref to break cyclic dependency with startListening
  const handleUserInputRef = useRef<(text: string) => Promise<void>>(async () => {});

  /**
   * Continuous auto voice tracker:
   * Start listening if micActive is true and not speaking/processing
   */
  const startListening = useCallback(() => {
    if (!isOpenRef.current || !micActiveRef.current || isSpeakingRef.current || isProcessingRef.current) {
      return;
    }

    clearAutoRestartTimer();
    setVoiceError(null);
    setInterimTranscript('');

    const started = enhancedVoiceAgent.startListening(
      (interimText) => {
        if (!micActiveRef.current) return;
        setInterimTranscript(interimText);
      },
      (finalText) => {
        setIsListening(false);
        setInterimTranscript('');
        if (micActiveRef.current && finalText.trim()) {
          handleUserInputRef.current(finalText.trim());
        }
      },
      (errMsg) => {
        setIsListening(false);
        setInterimTranscript('');
        // If silence or aborted, this is natural when user pauses speaking: auto-rearm listening
        if (errMsg === 'no_speech' || errMsg === 'aborted') {
          scheduleAutoListen(300);
        } else {
          setVoiceError(errMsg);
        }
      },
      () => {
        // Recognition ended (browser silence timeout or speech cycle finish)
        setIsListening(false);
        scheduleAutoListen(300);
      }
    );

    if (!started && micActiveRef.current) {
      setVoiceError(
        language === 'gu'
          ? 'આ બ્રાઉઝર અવાજ રેકોર્ડિંગને સપોર્ટ કરતું નથી'
          : language === 'hi'
          ? 'यह ब्राउज़र आवाज़ इनपुट का समर्थन नहीं करता'
          : language === 'mr'
          ? 'हा ब्राउझर आवाजाचे समर्थन करत नाही'
          : 'Voice input not supported in this browser'
      );
    }
  }, [language]);

  /**
   * Schedule the next auto-listening iteration
   */
  const scheduleAutoListen = useCallback((delayMs: number = 300) => {
    clearAutoRestartTimer();
    if (!isOpenRef.current || !micActiveRef.current || isSpeakingRef.current || isProcessingRef.current) {
      return;
    }
    autoRestartTimerRef.current = setTimeout(() => {
      if (
        isOpenRef.current &&
        micActiveRef.current &&
        !isSpeakingRef.current &&
        !isProcessingRef.current &&
        !isListeningRef.current
      ) {
        startListening();
      }
    }, delayMs);
  }, [startListening]);

  /**
   * Stop listening and pause auto-listen
   */
  const stopListening = useCallback(() => {
    clearAutoRestartTimer();
    enhancedVoiceAgent.stopListening();
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  /**
   * Toggle master microphone on/off
   * If user turns mic off: stop listening and do not take voice input
   * If user turns mic on: resume continuous auto voice tracking
   */
  const toggleMic = () => {
    if (micActive) {
      // User requested mic OFF
      setMicActive(false);
      stopListening();
    } else {
      // User requested mic ON
      setMicActive(true);
      setTimeout(() => {
        startListening();
      }, 150);
    }
  };

  /**
   * Process user input (from speech or quick chips)
   */
  const handleUserInput = async (text: string) => {
    if (!text.trim()) return;

    // Temporarily pause listening while thinking and preparing reply
    stopListening();
    setIsProcessing(true);

    const userTurn: ConversationTurn = {
      id: `user-${Date.now()}`,
      speaker: 'user',
      text: text.trim(),
      timestamp: Date.now(),
      isFinal: true,
    };
    setConversationHistory((prev) => [...prev, userTurn]);

    await enhancedVoiceAgent.processUserInput(
      text.trim(),
      (responseText) => {
        const history = enhancedVoiceAgent.getHistory();
        const lastAgentTurn = history.find((t) => t.speaker === 'agent' && t.timestamp > Date.now() - 5000);

        const agentTurn: ConversationTurn = {
          id: `agent-${Date.now()}`,
          speaker: 'agent',
          text: responseText,
          timestamp: Date.now(),
          isFinal: true,
          intent: lastAgentTurn?.intent,
        };
        setConversationHistory((prev) => [...prev, agentTurn]);

        if (lastAgentTurn?.intent) {
          setCurrentIntent(lastAgentTurn.intent);
          setTimeout(() => setCurrentIntent(null), 4000);
        }

        setIsProcessing(false);
      },
      (errorMsg) => {
        setVoiceError(errorMsg);
        setIsProcessing(false);
        // Resume auto-listening after error
        scheduleAutoListen(600);
      }
    );
  };

  handleUserInputRef.current = handleUserInput;

  // Speak welcome message when opened for the first time
  useEffect(() => {
    if (isOpen && showWelcome && voiceService.areVoicesLoaded()) {
      setShowWelcome(false);
      const welcomeMsg = enhancedVoiceAgent.getWelcomeMessage();
      const timer = setTimeout(() => {
        enhancedVoiceAgent.speak(welcomeMsg);
      }, 600);
      return () => clearTimeout(timer);
    } else if (isOpen && !showWelcome && micActive && !isSpeaking && !isListening && !isProcessing) {
      // Re-opened: start listening directly
      scheduleAutoListen(400);
    }
  }, [isOpen, showWelcome, language, micActive, isSpeaking, isListening, isProcessing, scheduleAutoListen]);

  // When speech finishes: automatically re-arm continuous listening!
  useEffect(() => {
    if (!isSpeaking && isOpen && micActive && !isProcessing && !isListening) {
      scheduleAutoListen(350);
    }
  }, [isSpeaking, isOpen, micActive, isProcessing, isListening, scheduleAutoListen]);

  // When modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setMicActive(true);
    } else {
      clearAutoRestartTimer();
      stopListening();
      enhancedVoiceAgent.stopSpeaking();
    }
    return () => {
      clearAutoRestartTimer();
    };
  }, [isOpen, stopListening]);

  const handleClose = () => {
    clearAutoRestartTimer();
    stopListening();
    enhancedVoiceAgent.stopSpeaking();
    enhancedVoiceAgent.clearHistory();
    setConversationHistory([]);
    setShowWelcome(true);
    setVoiceError(null);
    setInterimTranscript('');
    setCurrentIntent(null);
    onClose();
  };

  const getIntentIcon = () => {
    switch (currentIntent) {
      case 'price_inquiry':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-400" />;
      case 'crop_health_advice':
        return <Heart className="w-3.5 h-3.5 text-red-400" />;
      case 'selling_guidance':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />;
    }
  };

  const getIntentLabel = () => {
    if (!currentIntent) return null;
    const labels: Record<string, Record<string, string>> = {
      mr: {
        price_inquiry: '💰 थेट बाजारभाव',
        crop_health_advice: '🌱 पीक आरोग्य',
        selling_guidance: '🤝 थेट विक्री सल्ला',
        weather_inquiry: '🌦️ हवामान अंदाज',
        platform_help: '📱 प्लॅटफॉर्म मदत',
      },
      hi: {
        price_inquiry: '💰 लाइव मंडी भाव',
        crop_health_advice: '🌱 फसल स्वास्थ्य',
        selling_guidance: '🤝 सीधी बिक्री मदद',
        weather_inquiry: '🌦️ मौसम पूर्वानुमान',
        platform_help: '📱 मंच सहायता',
      },
      gu: {
        price_inquiry: '💰 લાઈવ બજાર ભાવ',
        crop_health_advice: '🌱 પાક આરોગ્ય સલાહ',
        selling_guidance: '🤝 સીધું વેચાણ માર્ગદર્શન',
        weather_inquiry: '🌦️ હવામાન',
        platform_help: '📱 પ્લેટફોર્મ મદદ',
      },
      en: {
        price_inquiry: '💰 Live Market Rates',
        crop_health_advice: '🌱 Crop Health Guide',
        selling_guidance: '🤝 Direct Selling Support',
        weather_inquiry: '🌦️ Weather Updates',
        platform_help: '📱 Platform Help',
      },
    };
    return labels[language]?.[currentIntent] || currentIntent;
  };

  const quickQuestions = [
    {
      mr: '🍅 आजचा टोमॅटो भाव किती?',
      hi: '🍅 आज टमाटर का भाव क्या है?',
      gu: '🍅 આજના ટામેટાના ભાવ કેટલા?',
      en: "🍅 Today's Tomato price?",
    },
    {
      mr: '🧅 कांद्याचे ताजे बाजारभाव',
      hi: '🧅 प्याज का ताजा मंडी भाव',
      gu: '🧅 ડુંગળીના તાજા બજાર ભાવ',
      en: "🧅 Live Onion mandi rate",
    },
    {
      mr: '🤝 पिके थेट कशी विकावी?',
      hi: '🤝 फसल सीधे कैसे बेचें?',
      gu: '🤝 પાક સીધો કેવી રીતે વેચવો?',
      en: '🤝 How to sell crops directly?',
    },
    {
      mr: '🥔 बटाट्याचे भाव काय आहेत?',
      hi: '🥔 आलू का भाव क्या है?',
      gu: '🥔 બટાકાના ભાવ શું છે?',
      en: "🥔 What is Potato price?",
    },
  ];

  if (!isOpen) return null;

  // MINIMIZED FLOATING PILL BAR (Very small docked strip on the bottom right)
  if (isMinimized) {
    return (
      <aside
        aria-label="Krishi Mitra Voice Assistant Minimized"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] pointer-events-auto transition-all duration-300 select-text"
      >
        <div className="bg-gradient-to-r from-[#17362C] via-[#102921] to-[#0B1713] text-white rounded-full shadow-2xl border-2 border-[#D9FF55]/50 px-4 py-2.5 flex items-center gap-3 backdrop-blur-md">
          {/* Avatar with mood status */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-[#D9FF55] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#17362C] rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#D9FF55]" />
              </div>
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#17362C] ${
                isSpeaking
                  ? 'bg-[#D9FF55] animate-pulse'
                  : isListening
                  ? 'bg-red-500 animate-ping'
                  : micActive
                  ? 'bg-emerald-400'
                  : 'bg-zinc-500'
              }`}
            />
          </div>

          {/* Label / Status */}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-tight">🌾 Krishi Mitra</span>
            <span className="text-[10px] text-emerald-300 font-medium">
              {isSpeaking
                ? '🔊 Speaking...'
                : isListening
                ? '🔴 Auto Voice: Listening...'
                : isProcessing
                ? '⏳ Thinking...'
                : micActive
                ? '🟢 Auto Voice: Active'
                : '⚪ Mic Muted'}
            </span>
          </div>

          {/* Mic toggle */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              micActive
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-white/10 text-zinc-400 hover:text-white'
            }`}
            title={micActive ? 'Mute Mic (Turn Off)' : 'Turn On Auto Voice'}
            aria-label={micActive ? 'Mute Mic' : 'Turn On Auto Voice'}
          >
            {micActive ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-zinc-400" />}
          </button>

          {/* Expand button */}
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            title="Expand Voice Assistant"
            aria-label="Expand Voice Assistant"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/30 text-white/80 hover:text-red-300 transition-all cursor-pointer"
            title="Close Assistant"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // DOCKED RIGHT-SIDE CARD (Non-blocking: user can still interact with the website)
  return (
    <aside
      aria-label="Krishi Mitra Voice Assistant"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] w-[360px] sm:w-[390px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-5rem)] pointer-events-auto transition-all duration-300 select-text flex flex-col"
    >
      <div className="w-full h-full bg-gradient-to-br from-[#17362C] via-[#112B23] to-[#0A1813] text-white rounded-3xl shadow-2xl flex flex-col border-2 border-[#D9FF55]/40 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#D9FF55]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Compact Header */}
        <div className="relative px-4 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-[#D9FF55] p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-[#17362C] rounded-[10px] flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#D9FF55]" />
                </div>
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#17362C] ${
                  isSpeaking
                    ? 'bg-[#D9FF55] animate-pulse'
                    : isListening
                    ? 'bg-red-500 animate-ping'
                    : micActive
                    ? 'bg-emerald-400'
                    : 'bg-zinc-400'
                }`}
              />
            </div>

            <div>
              <h2 className="text-sm font-bold font-editorial text-white flex items-center gap-1.5 leading-tight">
                <span>
                  {language === 'hi'
                    ? '🌾 कृषि मित्र'
                    : language === 'gu'
                    ? '🌾 કૃષિ મિત્ર'
                    : language === 'mr'
                    ? '🌾 कृषी मित्र'
                    : '🌾 Krishi Mitra'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D9FF55]/20 text-[#D9FF55] font-semibold border border-[#D9FF55]/30">
                  Live
                </span>
              </h2>
              <p className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1 leading-tight">
                {isSpeaking ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 bg-[#D9FF55] rounded-full animate-pulse" />
                    {language === 'mr' ? 'बोलत आहे...' : language === 'hi' ? 'बोल रहा हूँ...' : language === 'gu' ? 'બોલી રહ્યો છું...' : 'Speaking...'}
                  </>
                ) : isListening ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
                    {language === 'mr' ? 'ऐकत आहे (ऑटो व्हॉइस)...' : language === 'hi' ? 'सुन रहा हूँ (ऑटो वॉइस)...' : language === 'gu' ? 'સાંભળી રહ્યો (ઓટો વોઇસ)...' : 'Listening (Auto Voice)...'}
                  </>
                ) : isProcessing ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" />
                    {language === 'mr' ? 'माहिती शोधत आहे...' : language === 'hi' ? 'जानकारी खोज रहा हूँ...' : language === 'gu' ? 'માહિતી શોધી રહ્યો...' : 'Finding live data...'}
                  </>
                ) : micActive ? (
                  <>
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    {language === 'mr' ? 'ऑटो व्हॉइस चालू' : language === 'hi' ? 'ऑटो वॉइस सक्रिय' : language === 'gu' ? 'ઓટો વોઇસ ચાલુ' : 'Auto Voice Active'}
                  </>
                ) : (
                  <>
                    <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    {language === 'mr' ? 'माइक बंद आहे' : language === 'hi' ? 'माइक बंद है' : language === 'gu' ? 'માઇક બંધ છે' : 'Mic Muted'}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Auto Voice Tracker Master Toggle */}
            <button
              type="button"
              onClick={toggleMic}
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                micActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-white/10 text-zinc-400 hover:text-white border-white/15'
              }`}
              title={micActive ? 'Turn Mic OFF' : 'Turn Mic ON'}
            >
              {micActive ? <Mic className="w-3.5 h-3.5 text-[#D9FF55]" /> : <MicOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{micActive ? 'ON' : 'OFF'}</span>
            </button>

            {/* Minimize to dock pill */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Minimize to floating pill"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/80 hover:text-red-300 transition-all cursor-pointer"
              title="Close Voice Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Intent Badge */}
        {currentIntent && (
          <div className="relative px-4 py-1.5 border-b border-white/10 bg-white/5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 animate-fadeIn">
            {getIntentIcon()}
            <span>{getIntentLabel()}</span>
          </div>
        )}

        {/* Status / Error Banner */}
        {voiceError && (
          <div className="relative px-4 py-2 border-b border-amber-500/30 bg-amber-500/15 flex items-center justify-between text-xs text-amber-200 shrink-0">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="line-clamp-1">{voiceError}</span>
            </div>
            <button
              type="button"
              onClick={() => setVoiceError(null)}
              className="text-amber-400 hover:text-white text-xs underline ml-2 cursor-pointer"
            >
              OK
            </button>
          </div>
        )}

        {/* Conversation Message List */}
        <div className="relative flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {conversationHistory.length === 0 && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-[#D9FF55] flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-[#17362C]" />
              </div>

              <div>
                <p className="text-white font-bold text-xs">
                  {language === 'mr'
                    ? 'कृषी मित्र थेट वेबसाइटच्या डेटावरून उत्तरे देतो!'
                    : language === 'hi'
                    ? 'कृषि मित्र सीधे वेबसाइट डेटा से उत्तर देता है!'
                    : language === 'gu'
                    ? 'કૃષિ મિત્ર સીધા વેબસાઇટ ડેટા પરથી જવાબ આપે છે!'
                    : 'Krishi Mitra answers live with website catalog rates!'}
                </p>
                <p className="text-[11px] text-white/60 mt-0.5">
                  {micActive
                    ? language === 'mr'
                      ? '🎙️ ऑटो व्हॉइस चालू आहे: फक्त बोला, मी ऐकत आहे!'
                      : language === 'hi'
                      ? '🎙️ ऑटो वॉइस चालू है: सीधे बोलें, मैं सुन रहा हूँ!'
                      : language === 'gu'
                      ? '🎙️ ઓટો વોઇસ ચાલુ છે: સીધા બોલો, હું સાંભળી રહ્યો છું!'
                      : "🎙️ Auto Voice ON: Just speak naturally, I'm listening!"
                    : language === 'mr'
                    ? 'माइक बंद आहे. सुरू करण्यासाठी खालील माइक दाबा.'
                    : language === 'hi'
                    ? 'माइक बंद है। शुरू करने के लिए नीचे माइक दबाएं।'
                    : language === 'gu'
                    ? 'માઇક બંધ છે. શરૂ કરવા નીચે માઇક દબાવો.'
                    : 'Mic is muted. Click the mic below to speak.'}
                </p>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="pt-2 space-y-1.5 text-left">
                <span className="text-[10px] font-bold text-[#D9FF55] tracking-wider uppercase">
                  {language === 'mr'
                    ? 'किंवा खालील प्रश्नावर टॅप करा:'
                    : language === 'hi'
                    ? 'या नीचे सवाल पर टैप करें:'
                    : language === 'gu'
                    ? 'અથવા નીચેના પ્રશ્ન પર ટેપ કરો:'
                    : 'Or tap a question:'}
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {quickQuestions.map((q, idx) => {
                    const text = q[language as keyof typeof q] || q.en;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleUserInput(text)}
                        className="text-left px-3 py-2 rounded-xl bg-white/10 hover:bg-[#D9FF55]/20 hover:text-[#D9FF55] text-white text-xs transition-all border border-white/10 flex items-center justify-between cursor-pointer group"
                      >
                        <span className="line-clamp-1">{text}</span>
                        <span className="text-white/40 group-hover:text-[#D9FF55] text-[11px] font-bold">→</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {conversationHistory.map((turn) => (
            <div
              key={turn.id}
              className={`flex items-start gap-2 ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {turn.speaker === 'agent' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-[#D9FF55] flex items-center justify-center shadow-md shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#17362C]" />
                </div>
              )}
              <div
                className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                  turn.speaker === 'user'
                    ? 'bg-[#D9FF55] text-[#17362C] rounded-tr-xs font-semibold'
                    : 'bg-white/10 text-white border border-white/15 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{turn.text}</p>
              </div>
              {turn.speaker === 'user' && (
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shadow-md shrink-0 text-xs">
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Interim Transcript (Real-time live typing preview) */}
          {interimTranscript && (
            <div className="flex items-start gap-2 justify-end opacity-90">
              <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-tr-xs bg-[#D9FF55]/40 text-[#17362C] font-semibold text-xs border border-[#D9FF55] animate-pulse">
                <p className="italic">🎙️ {interimTranscript}...</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shadow-md shrink-0 text-xs">
                👤
              </div>
            </div>
          )}

          {/* Thinking / Searching Data Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-[#D9FF55] flex items-center justify-center shadow-md shrink-0">
                <Loader2 className="w-3.5 h-3.5 text-[#17362C] animate-spin" />
              </div>
              <div className="px-3.5 py-2 rounded-2xl rounded-tl-xs bg-white/10 text-[#D9FF55] border border-white/15 text-xs flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>
                  {language === 'mr'
                    ? 'वेबसाइटवरून ताजे दर शोधत आहे...'
                    : language === 'hi'
                    ? 'वेबसाइट से लाइव भाव निकाल रहा हूँ...'
                    : language === 'gu'
                    ? 'વેબસાઇટ પરથી તાજા ભાવ શોધી રહ્યો...'
                    : 'Fetching live catalog rates...'}
                </span>
              </div>
            </div>
          )}

          <div ref={conversationEndRef} />
        </div>

        {/* Action Controls & Continuous Voice Tracker */}
        <div className="relative px-4 py-3 border-t border-white/10 shrink-0 bg-gradient-to-t from-[#0A1813] to-transparent">
          {/* Speaking stop button */}
          {isSpeaking && (
            <div className="mb-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#D9FF55]/15 border border-[#D9FF55]/30">
              <div className="flex items-center gap-2 text-xs text-[#D9FF55] font-semibold">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>
                  {language === 'mr'
                    ? 'कृषी मित्र बोलत आहे...'
                    : language === 'hi'
                    ? 'कृषि मित्र बोल रहा है...'
                    : language === 'gu'
                    ? 'કૃષિ મિત્ર બોલી રહ્યો છે...'
                    : 'Speaking...'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => enhancedVoiceAgent.stopSpeaking()}
                className="px-2.5 py-1 rounded-lg bg-[#D9FF55] text-[#17362C] text-xs font-bold hover:bg-white transition-all cursor-pointer"
              >
                {language === 'mr' ? 'थांबवा' : language === 'hi' ? 'रोकें' : language === 'gu' ? 'રોકો' : 'Stop'}
              </button>
            </div>
          )}

          {/* Interactive Mic Center */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {/* Main mic button */}
              <button
                type="button"
                onClick={toggleMic}
                disabled={isProcessing}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer shrink-0 ${
                  !micActive
                    ? 'bg-zinc-700 text-zinc-400 hover:bg-zinc-600'
                    : isListening
                    ? 'bg-red-500 text-white ring-4 ring-red-500/40 animate-pulse scale-105'
                    : 'bg-gradient-to-tr from-emerald-500 to-[#D9FF55] text-[#17362C] hover:scale-105'
                }`}
                title={
                  !micActive
                    ? 'Turn On Auto Voice'
                    : 'Mic Active (Click to mute)'
                }
              >
                {!micActive ? (
                  <MicOff className="w-5 h-5" />
                ) : isListening ? (
                  <Radio className="w-5 h-5 animate-pulse" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>

              {/* Status and instruction */}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 leading-tight truncate">
                  {!micActive ? (
                    <span className="text-zinc-400">
                      {language === 'mr' ? 'माइक बंद आहे' : language === 'hi' ? 'माइक बंद है' : language === 'gu' ? 'માઇક બંધ છે' : 'Mic is Muted'}
                    </span>
                  ) : isListening ? (
                    <span className="text-red-300 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                      {language === 'mr' ? 'ऐकत आहे... बोला!' : language === 'hi' ? 'सुन रहा हूँ... बोलिए!' : language === 'gu' ? 'સાંભળી રહ્યો... બોલો!' : 'Listening... speak now!'}
                    </span>
                  ) : isSpeaking ? (
                    <span className="text-[#D9FF55]">
                      {language === 'mr' ? 'उत्तर देत आहे...' : language === 'hi' ? 'उत्तर दे रहा हूँ...' : language === 'gu' ? 'જવાબ આપી રહ્યો...' : 'Responding...'}
                    </span>
                  ) : (
                    <span className="text-emerald-300">
                      {language === 'mr' ? 'ऑटो व्हॉइस चालू' : language === 'hi' ? 'ऑटो वॉइस चालू' : language === 'gu' ? 'ઓટો વોઇસ ચાલુ' : 'Auto Voice Ready'}
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-white/60 truncate leading-tight">
                  {!micActive
                    ? language === 'mr'
                      ? 'सुरू करण्यासाठी माइक दाबा'
                      : language === 'hi'
                      ? 'चालू करने के लिए माइक दबाएं'
                      : language === 'gu'
                      ? 'ચાલુ કરવા માઇક દબાવો'
                      : 'Click mic to enable voice input'
                    : language === 'mr'
                    ? 'कोणतेही पीक भाव किंवा मदत विचारा'
                    : language === 'hi'
                    ? 'किसी भी फसल का भाव या मदद पूछें'
                    : language === 'gu'
                    ? 'કોઈપણ પાક ભાવ અથવા મદદ પૂછો'
                    : 'Ask any crop rate or selling advice'}
                </span>
              </div>
            </div>

            {/* Language indicator / quick chip */}
            <div className="shrink-0 text-right">
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white/10 text-white/80 uppercase tracking-wide">
                {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : language === 'gu' ? 'ગુજરાતી' : 'EN'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default EnhancedVoiceAgentModal;
