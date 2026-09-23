import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { voiceAgentService, type ConversationTurn } from '../services/voiceAgentService';
import { voiceService } from '../services/voiceService';
import { X, Mic, MicOff, Volume2, Loader2, Phone, Sparkles, AlertCircle, Radio } from 'lucide-react';

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAgentModal: React.FC<VoiceAgentModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useTranslation();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [autoListenEnabled, setAutoListenEnabled] = useState(true);

  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Update voice agent config when language changes
  useEffect(() => {
    voiceAgentService.updateConfig({
      language,
      autoListen: autoListenEnabled,
      autoSpeak: true,
    });
  }, [language, autoListenEnabled]);

  // Subscribe to voice service state
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

  // Speak welcome message when modal opens
  useEffect(() => {
    if (isOpen && showWelcome) {
      setShowWelcome(false);
      const welcomeMsg = voiceAgentService.getWelcomeMessage();

      setTimeout(() => {
        voiceAgentService.speak(welcomeMsg);
      }, 800);
    }
  }, [isOpen, showWelcome, language]);

  // Auto-listen after agent finishes speaking (if auto-listen is enabled)
  useEffect(() => {
    if (isOpen && autoListenEnabled && !isSpeaking && !isListening && !isProcessing && conversationHistory.length > 0) {
      // Wait 1.5 seconds after agent finishes speaking, then auto-start listening
      const timer = setTimeout(() => {
        startListening();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoListenEnabled, isSpeaking, isListening, isProcessing, conversationHistory.length]);

  const startListening = () => {
    setVoiceError(null);
    setInterimTranscript('');

    const started = voiceAgentService.startListening(
      (interimText) => {
        setInterimTranscript(interimText);
      },
      (finalText) => {
        setIsListening(false);
        setInterimTranscript('');
        handleUserInput(finalText);
      },
      (errMsg) => {
        setIsListening(false);
        setInterimTranscript('');
        setVoiceError(errMsg);
      }
    );

    if (started) {
      setIsListening(true);
    } else {
      setVoiceError(
        language === 'gu'
          ? 'આ બ્રાઉઝર અવાજ દ્વારા પ્રશ્ન પૂછવાની સુવિધાને સપોર્ટ કરતું નથી'
          : language === 'hi'
          ? 'यह ब्राउज़र आवाज़ से प्रश्न पूछने की सुविधा का समर्थन नहीं करता'
          : language === 'mr'
          ? 'हा ब्राउझर आवाजाद्वारे प्रश्न विचारण्याचे समर्थन करत नाही'
          : 'Voice input is not supported in this browser'
      );
    }
  };

  const stopListening = () => {
    voiceAgentService.stopListening();
    setIsListening(false);
    setInterimTranscript('');
  };

  const handleUserInput = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to conversation history
    const userTurn: ConversationTurn = {
      id: `user-${Date.now()}`,
      speaker: 'user',
      text: text.trim(),
      timestamp: Date.now(),
      isFinal: true,
    };
    setConversationHistory((prev) => [...prev, userTurn]);

    // Process the message through voice agent service
    setIsProcessing(true);

    await voiceAgentService.processUserInput(
      text.trim(),
      (responseText) => {
        // Add agent response to conversation history
        const agentTurn: ConversationTurn = {
          id: `agent-${Date.now()}`,
          speaker: 'agent',
          text: responseText,
          timestamp: Date.now(),
          isFinal: true,
        };
        setConversationHistory((prev) => [...prev, agentTurn]);
        setIsProcessing(false);
      },
      (errorMsg) => {
        setVoiceError(errorMsg);
        setIsProcessing(false);
      }
    );
  };

  const handleClose = () => {
    stopListening();
    voiceAgentService.stopSpeaking();
    voiceAgentService.clearHistory();
    setConversationHistory([]);
    setShowWelcome(true);
    setVoiceError(null);
    setInterimTranscript('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-agent-title"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-gradient-to-br from-[#17362C] to-[#0B1713] text-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border-2 border-[#D9FF55]/30 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#D9FF55] rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Header */}
        <div className="relative px-6 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#D9FF55] p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#17362C] rounded-[14px] flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#D9FF55]" />
              </div>
            </div>
            <div>
              <h2 id="voice-agent-title" className="text-lg font-black font-editorial text-white flex items-center gap-2">
                <span>
                  {language === 'hi'
                    ? 'कृषि सहायक'
                    : language === 'gu'
                    ? 'કૃષિ સહાયક'
                    : language === 'mr'
                    ? 'कृषी सहाय्यक'
                    : 'KrishiSetu Voice Assistant'}
                </span>
                <Sparkles className="w-4 h-4 text-[#D9FF55] animate-pulse" />
              </h2>
              <p className="text-xs text-emerald-300 font-semibold">
                {language === 'hi'
                  ? 'बोलकर पूछें • 24/7 उपलब्ध'
                  : language === 'gu'
                  ? 'બોલીને પૂછો • 24/7 ઉપલબ્ધ'
                  : language === 'mr'
                  ? 'बोलून विचारा • 24/7 उपलब्ध'
                  : 'Speak & Ask • 24/7 Available'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-listen toggle */}
            <button
              type="button"
              onClick={() => setAutoListenEnabled(!autoListenEnabled)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                autoListenEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-white/10 text-white/70 hover:text-white border-white/15'
              }`}
              title={autoListenEnabled ? t('voiceAutoListenOn', 'Auto-listen ON') : t('voiceAutoListenOff', 'Auto-listen OFF')}
            >
              {autoListenEnabled ? <Radio className="w-4 h-4" /> : <Radio className="w-4 h-4 opacity-50" />}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
              title={t('closeModal', 'Close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Status Bar */}
        {(isListening || isSpeaking || voiceError) && (
          <div
            className={`relative px-6 py-3 border-b border-white/10 flex items-center justify-between text-sm font-semibold shrink-0 ${
              isListening ? 'bg-red-500/20' : isSpeaking ? 'bg-[#D9FF55]/20' : 'bg-amber-500/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {isListening ? (
                <>
                  <Radio className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-red-300 font-bold">
                    {language === 'hi'
                      ? 'सुन रहा हूँ...'
                      : language === 'gu'
                      ? 'સાંભળી રહ્યો છું...'
                      : language === 'mr'
                      ? 'ऐकत आहे...'
                      : 'Listening...'}
                  </span>
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 className="w-5 h-5 text-[#D9FF55] animate-bounce" />
                  <span className="text-[#D9FF55] font-bold">
                    {language === 'hi' ? 'बोल रहा हूँ...' : language === 'gu' ? 'બોલી રહ્યો છું...' : language === 'mr' ? 'बोलत आहे...' : 'Speaking...'}
                  </span>
                </>
              ) : voiceError ? (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-amber-200 text-xs">{voiceError}</span>
                </>
              ) : null}
            </div>

            {isSpeaking && (
              <button
                type="button"
                onClick={() => voiceAgentService.stopSpeaking()}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition-all cursor-pointer"
              >
                {language === 'hi' ? 'रोकें' : language === 'gu' ? 'રોકો' : language === 'mr' ? 'थांबवा' : 'Stop'}
              </button>
            )}

            {isListening && (
              <button
                type="button"
                onClick={stopListening}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition-all cursor-pointer"
              >
                {language === 'hi' ? 'रोकें' : language === 'gu' ? 'રોકો' : language === 'mr' ? 'थांबवा' : 'Stop'}
              </button>
            )}
          </div>
        )}

        {/* Conversation History */}
        <div className="relative flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {conversationHistory.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-[#D9FF55] flex items-center justify-center shadow-xl animate-pulse">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <p className="text-white/80 text-sm max-w-md mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'नीचे दिए गए माइक बटन को दबाकर बोलें। मैं आपकी बात सुनूंगा और जवाब दूंगा।'
                  : language === 'gu'
                  ? 'નીચે આપેલા માઇક બટન દબાવીને બોલો. હું તમારી વાત સાંભળીશ અને જવાબ આપીશ.'
                  : language === 'mr'
                  ? 'खाली दिलेल्या माइक बटणावर दाबून बोला. मी तुमचे ऐकेन आणि उत्तर देईन.'
                  : 'Press the microphone button below and speak. I will listen and respond.'}
              </p>
            </div>
          )}

          {conversationHistory.map((turn) => (
            <div key={turn.id} className={`flex items-start gap-3 ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
              {turn.speaker === 'agent' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-[#D9FF55] flex items-center justify-center shadow-lg shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-lg ${
                  turn.speaker === 'user'
                    ? 'bg-[#D9FF55] text-[#17362C] rounded-tr-sm'
                    : 'bg-white/10 text-white border border-white/20 rounded-tl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{turn.text}</p>
              </div>
              {turn.speaker === 'user' && (
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-lg">👤</span>
                </div>
              )}
            </div>
          ))}

          {/* Interim Transcript (Live Typing) */}
          {interimTranscript && (
            <div className="flex items-start gap-3 justify-end opacity-70">
              <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm bg-[#D9FF55]/50 text-[#17362C] shadow-lg border-2 border-[#D9FF55] animate-pulse">
                <p className="text-sm leading-relaxed">{interimTranscript}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-lg shrink-0">
                <span className="text-lg">👤</span>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center gap-3 justify-start">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-[#D9FF55] flex items-center justify-center shadow-lg shrink-0">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/10 text-white border border-white/20 shadow-lg">
                <p className="text-sm">
                  {language === 'hi' ? 'सोच रहा हूँ...' : language === 'gu' ? 'વિચારી રહ્યો છું...' : language === 'mr' ? 'विचार करत आहे...' : 'Thinking...'}
                </p>
              </div>
            </div>
          )}

          <div ref={conversationEndRef} />
        </div>

        {/* Big Microphone Button */}
        <div className="relative px-6 py-6 border-t border-white/10 shrink-0 bg-gradient-to-t from-[#0B1713] to-transparent">
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking || isProcessing}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-500/50'
                  : 'bg-gradient-to-tr from-emerald-500 to-[#D9FF55] text-white hover:scale-110'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>

            <p className="text-center text-xs text-white/70 font-semibold">
              {isListening
                ? language === 'hi'
                  ? 'बोलें... मैं सुन रहा हूँ'
                  : language === 'gu'
                  ? 'બોલો... હું સાંભળી રહ્યો છું'
                  : language === 'mr'
                  ? 'बोला... मी ऐकत आहे'
                  : 'Speak... I am listening'
                : language === 'hi'
                ? 'माइक दबाकर बोलें'
                : language === 'gu'
                ? 'માઇક દબાવીને બોલો'
                : language === 'mr'
                ? 'माइक दाबून बोला'
                : 'Press mic to speak'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
