import React from 'react';
import type { ChatMessage as ChatMessageType } from './ChatbotContext';
import type { ChatbotAction } from './chatbotKnowledge';
import { Volume2, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

interface ChatMessageProps {
  message: ChatMessageType;
  onSpeak: (text: string) => void;
  onTriggerAction?: (action: ChatbotAction) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSpeak,
  onTriggerAction,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col ${
        message.sender === 'user' ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`max-w-[88%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
          message.sender === 'user'
            ? 'bg-[#17362C] text-[#F6F1E4] rounded-tr-xs'
            : 'bg-white text-[#132B23] border border-[#17362C]/10 rounded-tl-xs space-y-3'
        }`}
      >
        {/* Main message text */}
        {message.isAiGenerated && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 w-fit">
            <span>✨</span>
            <span>Gemini AI</span>
          </div>
        )}
        <p className="font-medium whitespace-pre-line">{message.text}</p>

        {/* Step-by-step guidance list */}
        {message.steps && message.steps.length > 0 && (
          <div className="space-y-1.5 bg-[#F6F1E4] p-3 rounded-2xl border border-[#17362C]/10 mt-2">
            {message.steps.map((step, idx) => (
              <div
                key={idx}
                className="text-xs text-[#132B23] font-medium flex items-start gap-1.5"
              >
                <span className="text-[#3F754A] font-bold shrink-0">•</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Guided action button */}
        {message.action && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onTriggerAction && onTriggerAction(message.action!)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#17362C] hover:bg-[#254E40] text-[#D9FF55] text-xs font-black shadow flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer min-h-[44px]"
            >
              <span>{message.action.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Read aloud & Timestamp for bot message */}
        {message.sender === 'bot' && (
          <div className="pt-1 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                const full = message.steps
                  ? `${message.text}. ${message.steps.join('. ')}`
                  : message.text;
                onSpeak(full);
              }}
              className="inline-flex items-center gap-1 text-[#3F754A] hover:underline font-bold cursor-pointer py-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('voiceListen')}</span>
            </button>
            <span className="text-[10px] text-gray-400">{message.timestamp}</span>
          </div>
        )}
      </div>
    </div>
  );
};
