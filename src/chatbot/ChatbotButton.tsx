import React from 'react';
import { useChatbot } from './ChatbotContext';
import { useTranslation } from '../i18n/useTranslation';
import { Sparkles, X } from 'lucide-react';

export const ChatbotButton: React.FC = () => {
  const { isOpen, toggleChatbot, botName, hasUnread, isListening, isSpeaking } = useChatbot();
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
      {/* Floating Prompt Pill for First-time attention */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleChatbot}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white text-[#17362C] text-xs font-bold shadow-xl border border-[#17362C]/15 hover:bg-[#F6F1E4] transition-all cursor-pointer animate-fadeIn"
          aria-label={t('chatButtonLabel')}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF7043]" />
          <span>{botName}</span>
        </button>
      )}

      {/* Main 56x56 Circular Button */}
      <button
        type="button"
        onClick={toggleChatbot}
        aria-label={isOpen ? t('closeModal') : t('chatButtonLabel')}
        className={`w-14 h-14 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer relative ${
          isOpen
            ? 'bg-[#132B23] text-white rotate-90 border-2 border-white/20'
            : isListening
            ? 'bg-red-500 text-white animate-pulse shadow-red-500/50'
            : isSpeaking
            ? 'bg-[#FF7043] text-white animate-bounce'
            : hasUnread
            ? 'bg-[#17362C] text-[#D9FF55] border-2 border-[#D9FF55] ring-4 ring-[#D9FF55]/30'
            : 'bg-[#17362C] hover:bg-[#254E40] text-[#D9FF55] border border-[#D9FF55]/40 hover:scale-105'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <span className="text-2xl select-none">🌱</span>
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF7043] text-white text-[10px] font-black flex items-center justify-center border-2 border-[#17362C]">
                1
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};
