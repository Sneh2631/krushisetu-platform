import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from './ChatbotContext';
import { useTranslation } from '../i18n/useTranslation';
import { ChatMessage } from './ChatMessage';
import { ChatSuggestions } from './ChatSuggestions';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Shield,
  AlertCircle,
  Radio,
  Sparkles,
  Key,
  CheckCircle2,
} from 'lucide-react';

export const ChatbotDrawer: React.FC = () => {
  const {
    isOpen,
    closeChatbot,
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
    botName,
    isGeminiConfigured,
    geminiKey,
    setGeminiKey,
    onTriggerAction,
  } = useChatbot();

  const { t, language } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(geminiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeChatbot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeChatbot]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleConfirmClear = () => {
    clearConversation();
    setShowClearConfirm(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-title"
    >
      <div
        className="w-full sm:max-w-md bg-[#F6F1E4] text-[#132B23] h-full shadow-2xl flex flex-col border-l border-[#17362C]/20 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-[#17362C] text-[#F6F1E4] px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between border-b border-[#D9FF55]/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3F754A] to-[#D9FF55] p-0.5 flex items-center justify-center shadow">
              <div className="w-full h-full bg-[#17362C] rounded-[14px] flex items-center justify-center">
                <span className="text-xl">🌱</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 id="chatbot-title" className="text-base font-black font-editorial text-white">
                  {botName}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#D9FF55] font-semibold">
                {t('chatOnlineStatus')} · {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'ગુજરાતી'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Gemini AI Status & Settings Button */}
            <button
              type="button"
              onClick={() => {
                setTempApiKey(geminiKey);
                setShowApiKeyModal(true);
              }}
              className={`p-2 rounded-xl border text-xs font-bold transition-all min-h-[38px] cursor-pointer flex items-center gap-1 ${
                isGeminiConfigured
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 hover:bg-emerald-500/30'
                  : 'bg-white/10 text-white/70 hover:text-white border-white/15'
              }`}
              title={isGeminiConfigured ? 'Gemini AI Connected (Click to change)' : 'Connect Gemini AI Key'}
              aria-label="Gemini AI Settings"
            >
              <Sparkles className={`w-4 h-4 ${isGeminiConfigured ? 'text-[#D9FF55]' : ''}`} />
            </button>

            {/* Auto read replies toggle */}
            <button
              type="button"
              onClick={() => setAutoReadReplies(!autoReadReplies)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                autoReadReplies
                  ? 'bg-[#D9FF55] text-[#17362C] border-[#D9FF55]'
                  : 'bg-white/10 text-white/70 hover:text-white border-white/15'
              }`}
              title={autoReadReplies ? t('chatAutoReadOn') : t('chatAutoReadOff')}
              aria-label={autoReadReplies ? t('chatAutoReadOn') : t('chatAutoReadOff')}
            >
              {autoReadReplies ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear conversation button */}
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15 transition-all min-h-[38px] cursor-pointer"
              title={t('chatClear')}
              aria-label={t('chatClear')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={closeChatbot}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all min-h-[38px] cursor-pointer"
              title={t('closeModal')}
              aria-label={t('closeModal')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Speaking / Listening Bar */}
        {(isListening || isSpeaking || voiceError) && (
          <div className="px-4 py-2 bg-[#132B23] text-[#F6F1E4] border-b border-white/10 flex items-center justify-between text-xs font-semibold shrink-0">
            <div className="flex items-center gap-2">
              {isListening ? (
                <>
                  <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                  <span className="text-red-300 font-bold">{t('voiceListening')}</span>
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#D9FF55] animate-bounce" />
                  <span className="text-[#D9FF55] font-bold">{t('voiceSpeaking')}</span>
                </>
              ) : voiceError ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-200 text-[11px]">{voiceError}</span>
                </>
              ) : null}
            </div>

            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition-all cursor-pointer"
              >
                {t('audioStop')}
              </button>
            )}

            {isListening && (
              <button
                type="button"
                onClick={stopVoiceInput}
                className="px-2.5 py-1 rounded bg-red-500/30 hover:bg-red-500/50 text-xs font-bold text-red-200 transition-all cursor-pointer"
              >
                {t('cancel')}
              </button>
            )}
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Privacy Note */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1 text-[11px] text-[#17362C]/70 bg-[#17362C]/5 px-3 py-1 rounded-full font-medium">
              <Shield className="w-3 h-3 text-[#3F754A]" />
              <span>{t('chatPrivacyNotice')}</span>
            </span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <ChatMessage
                message={msg}
                onSpeak={speakMessage}
                onTriggerAction={onTriggerAction}
              />
              {msg.suggestions && msg.suggestions.length > 0 && (
                <ChatSuggestions
                  suggestions={msg.suggestions}
                  onSelectSuggestion={handleSuggestionClick}
                />
              )}
            </div>
          ))}

          {/* Gemini AI Thinking Bubble */}
          {isGenerating && (
            <div className="flex items-start gap-2">
              <div className="bg-white border border-emerald-300 rounded-3xl rounded-tl-xs p-3.5 shadow-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span className="text-xs font-semibold text-emerald-900">
                  {language === 'gu'
                    ? 'કૃષિસેતુ AI વિચારી રહ્યું છે...'
                    : language === 'hi'
                    ? 'कृषिसेतु AI सोच रहा है...'
                    : 'KrushiSetu AI is thinking...'}
                </span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#17362C]/10 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            {/* Microphone Voice Input Button */}
            <button
              type="button"
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[#17362C]/10 text-[#17362C] hover:bg-[#17362C] hover:text-[#D9FF55]'
              }`}
              title={isListening ? t('chatStopMic') : t('chatMicPrompt')}
              aria-label={isListening ? t('chatStopMic') : t('chatMicPrompt')}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? t('voiceListening') : t('chatInputPlaceholder')}
              className="flex-1 bg-[#F6F1E4] border border-[#17362C]/20 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#132B23] focus:outline-none focus:border-[#3F754A] font-medium min-h-[48px]"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-12 h-12 rounded-2xl bg-[#17362C] hover:bg-[#254E40] disabled:opacity-40 text-[#D9FF55] flex items-center justify-center transition-all cursor-pointer shadow shrink-0"
              title={t('chatSend')}
              aria-label={t('chatSend')}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Clear Conversation Confirmation Modal */}
        {showClearConfirm && (
          <div
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            role="alertdialog"
          >
            <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-[#17362C]/20 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#17362C]">{t('chatClearConfirmTitle')}</h4>
              <p className="text-xs text-gray-600">{t('chatClearConfirmMessage')}</p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="py-2.5 px-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 min-h-[44px] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClear}
                  className="py-2.5 px-3 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 min-h-[44px] cursor-pointer shadow"
                >
                  {t('confirm')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gemini AI Key Settings Modal */}
        {showApiKeyModal && (
          <div
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#17362C]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#17362C]">Google Gemini AI</h4>
                    <p className="text-[10px] text-gray-500">Connect smart agricultural AI</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span>Gemini API Key</span>
                  {isGeminiConfigured && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  )}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F6F1E4] border border-gray-300 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Get your free Gemini API key from{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold underline"
                  >
                    Google AI Studio
                  </a>
                  . It powers crop disease analysis, pricing, and Gujarati voice responses.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempApiKey('');
                    setGeminiKey('');
                    setShowApiKeyModal(false);
                  }}
                  className="py-2.5 px-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 min-h-[44px] cursor-pointer"
                >
                  Remove Key
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGeminiKey(tempApiKey);
                    setShowApiKeyModal(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#17362C] text-[#D9FF55] text-xs font-bold hover:bg-[#234e40] min-h-[44px] cursor-pointer shadow"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
