import React, { useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import type { Language } from '../types';
import { ThemeToggle } from './ThemeToggle';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { AudioSpeechButton } from './AudioSpeechButton';

interface PublicLandingProps {
  onStartAsFarmer?: () => void;
  onStartAsBuyer?: () => void;
  onOpenAdminLogin?: () => void;
  onOpenAuthPage?: (role: 'farmer' | 'buyer' | 'admin') => void;
  onOpenRoleSelection?: () => void;
}

const LANGUAGE_CHOICES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

export const PublicLanding: React.FC<PublicLandingProps> = ({
  onStartAsFarmer,
  onStartAsBuyer,
  onOpenAdminLogin,
  onOpenAuthPage,
  onOpenRoleSelection,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleFarmerClick = () => {
    window.location.hash = '#/login/farmer';
    if (onOpenAuthPage) {
      onOpenAuthPage('farmer');
    } else if (onStartAsFarmer) {
      onStartAsFarmer();
    }
  };

  const handleBuyerClick = () => {
    window.location.hash = '#/login/buyer';
    if (onOpenAuthPage) {
      onOpenAuthPage('buyer');
    } else if (onStartAsBuyer) {
      onStartAsBuyer();
    }
  };

  const handleAdminClick = () => {
    window.location.hash = '#/login/admin';
    if (onOpenAuthPage) {
      onOpenAuthPage('admin');
    } else if (onOpenAdminLogin) {
      onOpenAdminLogin();
    }
  };

  const handleRoleSelectionClick = () => {
    window.location.hash = '#/role-selection';
    if (onOpenRoleSelection) {
      onOpenRoleSelection();
    }
  };

  const currentLangLabel =
    LANGUAGE_CHOICES.find((l) => l.code === language)?.label || 'English';

  return (
    <div className="min-h-screen bg-[#F6F1E4] text-[#132B23] dark:bg-[#0B1713] dark:text-[#EDF5F1] flex flex-col font-sans selection:bg-[#D9FF55] selection:text-[#17362C] transition-colors duration-200">
      
      {/* Top Banner & Navigation */}
      <header className="px-4 sm:px-8 py-3.5 bg-[#17362C] dark:bg-[#0A1612] text-[#F6F1E4] flex items-center justify-between border-b border-[#D9FF55]/20 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center font-black text-xl shadow-lg">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl font-black font-editorial tracking-tight text-white">
                KrushiSetu
              </span>
              <span className="text-xs font-bold text-[#D9FF55] bg-[#D9FF55]/20 px-2 py-0.5 rounded-full">
                {t('stateMaharashtra', 'Maharashtra')}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#F6F1E4]/70">
              {t('mahaMarketplaceTagline', 'Direct marketplace for Maharashtra farmers & verified buyers')}
            </p>
          </div>
        </div>

        {/* Action Controls in Top-Right Header */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFarmerClick}
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D9FF55] hover:bg-[#cbf73c] text-[#17362C] text-xs font-black transition-all cursor-pointer shadow-sm"
          >
            <span>🚜 {t('farmerLoginBtn', 'Farmer Login')}</span>
          </button>

          <button
            type="button"
            onClick={handleBuyerClick}
            className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FF7043] hover:bg-[#e65c2e] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <span>🏢 {t('buyerLoginBtn', 'Buyer Login')}</span>
          </button>

          <button
            type="button"
            onClick={handleRoleSelectionClick}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D9FF55] border border-[#D9FF55]/30 text-xs font-black transition-all cursor-pointer shadow-sm"
            title={t('roleSelectionTitle', 'Choose Your Portal')}
          >
            <span>{t('roleSelectionTitle', 'Portals')}</span>
          </button>

          {/* 4-Language Selector in Top-Right Header */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 text-[#F6F1E4] border border-white/10 text-xs font-bold transition-colors cursor-pointer"
              aria-label="Language Selector"
              id="landing-language-selector"
            >
              <Globe className="w-3.5 h-3.5 text-[#D9FF55]" />
              <span>{currentLangLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#17362C] dark:bg-[#0C1A14] border border-[#D9FF55]/20 shadow-2xl py-1.5 z-50 text-xs font-bold animate-scale-up">
                {LANGUAGE_CHOICES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer ${
                      language === item.code ? 'text-[#D9FF55] font-black bg-white/5' : 'text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {language === item.code && <CheckCircle2 className="w-3.5 h-3.5 text-[#D9FF55]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle (Light / Dark Mode) near Language Selector */}
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section with the 3 Prominent Entry Choices */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-14 text-center max-w-6xl mx-auto space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17362C]/10 dark:bg-white/10 text-[#17362C] dark:text-[#D9FF55] text-xs sm:text-sm font-black border border-[#17362C]/15 dark:border-white/15 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#3F754A] dark:text-[#D9FF55]" />
          <span>{t('landingBadge')}</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-editorial text-[#132B23] dark:text-white tracking-tight leading-tight">
            {t('landingHeadline')}
          </h1>
          <p className="text-sm sm:text-lg text-[#132B23]/75 dark:text-white/75 max-w-2xl mx-auto font-medium">
            {t('landingSubtext')}
          </p>
        </div>

        {/* Audio Speech Helper Button */}
        <div className="pt-1">
          <AudioSpeechButton
            textToSpeak={t('landingAudioText')}
            label={t('listenVoiceGuide', 'Listen Voice Guidance')}
          />
        </div>

        {/* THE THREE PROMINENT ROLE ACTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl pt-4 text-left">
          
          {/* 1. Farmer / Seller Choice */}
          <div
            onClick={handleFarmerClick}
            className="p-6 rounded-3xl bg-[#17362C] dark:bg-[#12261E] hover:bg-[#244E3E] dark:hover:bg-[#1A382C] text-[#F6F1E4] shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 active:scale-98 border-2 border-[#D9FF55]/40 flex flex-col justify-between gap-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                🚜
              </div>
              <span className="px-3 py-1 rounded-full bg-[#D9FF55]/20 text-[#D9FF55] text-xs font-black">
                {t('landingFarmerBadge')}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="text-xl sm:text-2xl font-black text-[#D9FF55] flex items-center gap-2">
                <span>{t('landingFarmerTitle')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-xs text-[#F6F1E4]/80 font-medium">
                {t('landingFarmerSubtitle')}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-[#D9FF55] font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t('landingFarmerBullet1')}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 font-normal">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#D9FF55]" />
                <span>{t('landingFarmerBullet2')}</span>
              </div>
            </div>
          </div>

          {/* 2. Buyer Choice */}
          <div
            onClick={handleBuyerClick}
            className="p-6 rounded-3xl bg-white dark:bg-[#132B23] hover:bg-gray-50 dark:hover:bg-[#1A382C] text-[#132B23] dark:text-[#EDF5F1] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-98 border-2 border-[#FF7043]/40 flex flex-col justify-between gap-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-[#FF7043]/15 text-[#FF7043] flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                🏢
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FF7043]/15 text-[#FF7043] text-xs font-black">
                {t('landingBuyerBadge')}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="text-xl sm:text-2xl font-black text-[#132B23] dark:text-white flex items-center gap-2">
                <span>{t('landingBuyerTitle')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#FF7043]" />
              </div>
              <div className="text-xs text-[#132B23]/70 dark:text-white/70 font-medium">
                {t('landingBuyerSubtitle')}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-white/10 space-y-1.5 text-[11px] text-[#3F754A] dark:text-[#D9FF55] font-bold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{t('landingBuyerBullet1')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-white/70 font-normal">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#FF7043]" />
                <span>{t('landingBuyerBullet2')}</span>
              </div>
            </div>
          </div>

          {/* 3. Admin Choice */}
          <div
            onClick={handleAdminClick}
            className="p-6 rounded-3xl bg-[#17362C] dark:bg-[#12261E] hover:bg-[#1f4538] dark:hover:bg-[#1A382C] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-98 border-2 border-red-500/40 flex flex-col justify-between gap-5 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-black">
                {t('landingAdminBadge')}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{t('landingAdminTitle')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-red-400" />
              </div>
              <div className="text-xs text-gray-300 font-medium">
                {t('landingAdminSubtitle')}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-1.5 text-[11px] text-red-300 font-bold">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>{t('landingAdminBullet1')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 font-normal">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#D9FF55]" />
                <span>{t('landingAdminBullet2')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Value Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-5xl pt-4 text-left">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#17362C]/10 dark:border-white/10 space-y-1 shadow-xs">
            <div className="text-xl">💰</div>
            <div className="text-xs font-black text-[#132B23] dark:text-white">{t('pillarZeroCommissionTitle')}</div>
            <div className="text-[11px] text-[#132B23]/70 dark:text-white/70">{t('pillarZeroCommissionDesc')}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#17362C]/10 dark:border-white/10 space-y-1 shadow-xs">
            <div className="text-xl">🛡️</div>
            <div className="text-xs font-black text-[#132B23] dark:text-white">{t('pillarEscrowTitle')}</div>
            <div className="text-[11px] text-[#132B23]/70 dark:text-white/70">{t('pillarEscrowDesc')}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#17362C]/10 dark:border-white/10 space-y-1 shadow-xs">
            <div className="text-xl">🚚</div>
            <div className="text-xs font-black text-[#132B23] dark:text-white">{t('pillarTransportTitle')}</div>
            <div className="text-[11px] text-[#132B23]/70 dark:text-white/70">{t('pillarTransportDesc')}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-[#17362C]/10 dark:border-white/10 space-y-1 shadow-xs">
            <div className="text-xl">📜</div>
            <div className="text-xs font-black text-[#132B23] dark:text-white">{t('pillarTestingTitle')}</div>
            <div className="text-[11px] text-[#132B23]/70 dark:text-white/70">{t('pillarTestingDesc')}</div>
          </div>
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="py-6 px-4 bg-[#17362C] dark:bg-[#07110E] text-[#F6F1E4]/70 text-center text-xs border-t border-white/10 space-y-2 transition-colors">
        <div>
          {t('footerPlatformInfo')}
        </div>
        <div className="flex items-center justify-center gap-4 text-[11px] text-[#D9FF55]">
          <button type="button" onClick={handleAdminClick} className="hover:underline cursor-pointer">
            {t('officialAdminLogin')}
          </button>
          <span>•</span>
          <span>{t('footerHelpline')}</span>
        </div>
      </footer>

    </div>
  );
};


