import React, { useEffect, useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import {
  HelpCircle,
  X,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Languages,
  MessageSquare,
} from 'lucide-react';
import { AudioSpeechButton } from './AudioSpeechButton';
import type { Language } from '../types';

interface HelpAndGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToGrievance?: () => void;
}

export const HelpAndGuidanceModal: React.FC<HelpAndGuidanceModalProps> = ({
  isOpen,
  onClose,
  onNavigateToGrievance,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="bg-white text-[#132B23] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-[#17362C]/15 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#17362C] to-[#254E40] text-[#F6F1E4] p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center shadow-md">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 id="help-modal-title" className="text-lg sm:text-xl font-bold font-editorial">
                {t('helpModalTitle')}
              </h2>
              <p className="text-xs text-[#F6F1E4]/80">{t('helpModalSubtitle')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors min-h-[36px] cursor-pointer"
            aria-label={t('closeModal')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Toll-free support card */}
          <div className="bg-gradient-to-br from-[#3F754A]/15 to-[#D9FF55]/15 border border-[#3F754A]/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#17362C] text-[#D9FF55] flex items-center justify-center shrink-0 shadow-md">
                <PhoneCall className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#3F754A] uppercase tracking-wider block">
                  {t('helpCallCenterTitle')}
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#17362C] tracking-wide">
                  {t('helpCallCenterNumber')}
                </span>
                <p className="text-[11px] text-[#17362C]/75">{t('helpCallCenterTiming')}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <a
                href={`tel:${t('helpCallCenterNumber')}`}
                className="py-2.5 px-5 rounded-xl bg-[#17362C] text-[#D9FF55] font-extrabold text-xs flex items-center justify-center gap-2 shadow hover:bg-[#1f483b] transition-all min-h-[44px]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t('helpCallButton')}</span>
              </a>

              <AudioSpeechButton
                textToRead={`${t('helpModalTitle')}. ${t('helpCallCenterTitle')} ${t('helpCallCenterNumber')}. ${t('faq1Q')}. ${t('faq1A')}`}
                label={t('voiceListen')}
                className="w-full justify-center"
              />
            </div>
          </div>

          {/* Quick Language Switcher inside Help */}
          <div className="bg-[#17362C]/5 p-3 rounded-2xl border border-[#17362C]/10 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17362C]">
              <Languages className="w-4 h-4 text-[#3F754A]" />
              <span>{t('authPreferredLang')}</span>
            </div>

            <div className="flex gap-1.5">
              {(['en', 'hi', 'gu'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] cursor-pointer ${
                    language === lang
                      ? 'bg-[#17362C] text-[#D9FF55]'
                      : 'bg-white border border-[#17362C]/15 text-[#17362C]/80 hover:bg-gray-100'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ગુજરાતી'}
                </button>
              ))}
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div>
            <h3 className="text-sm font-bold text-[#17362C] mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#3F754A]" />
              <span>{t('helpFaqHeader')}</span>
            </h3>

            <div className="space-y-2.5">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-[#17362C]/15 rounded-xl overflow-hidden bg-[#F6F1E4]/30"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#17362C] hover:bg-white transition-colors min-h-[44px] cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#3F754A] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#17362C]/60 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs text-[#17362C]/85 leading-relaxed bg-white border-t border-[#17362C]/5">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grievance Desk Link */}
          <div className="pt-2 border-t border-[#17362C]/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onNavigateToGrievance) onNavigateToGrievance();
              }}
              className="text-xs font-bold text-[#3F754A] hover:text-[#17362C] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{t('helpGrievanceLink')}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#17362C] text-white text-xs font-bold hover:bg-[#1f483b] transition-all min-h-[40px] cursor-pointer"
          >
            {t('closeModal')}
          </button>
        </div>
      </div>
    </div>
  );
};
