import React, { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import type { Language } from '../../types';
import { ThemeToggle } from '../ThemeToggle';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Globe,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface RoleSelectionPageProps {
  onSelectRole?: (role: 'farmer' | 'buyer' | 'admin', mode?: 'login' | 'register') => void;
  onBackToHome?: () => void;
}

const LANGUAGE_CHOICES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({
  onSelectRole,
  onBackToHome,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleRoleClick = (role: 'farmer' | 'buyer' | 'admin', mode: 'login' | 'register' = 'login') => {
    window.location.hash = `#/${mode}/${role}`;
    if (onSelectRole) onSelectRole(role, mode);
  };

  const handleHomeClick = () => {
    window.location.hash = '#/';
    if (onBackToHome) onBackToHome();
  };

  const currentLangLabel =
    LANGUAGE_CHOICES.find((l) => l.code === language)?.label || 'English';

  return (
    <div className="min-h-screen bg-[#F6F1E4] text-[#132B23] dark:bg-[#0B1713] dark:text-[#EDF5F1] flex flex-col font-sans selection:bg-[#D9FF55] selection:text-[#17362C] transition-colors duration-200">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-3.5 bg-[#17362C] dark:bg-[#0A1612] text-[#F6F1E4] flex items-center justify-between border-b border-[#D9FF55]/20 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleHomeClick}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#D9FF55] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title={t('backToHomeBtn', '← Back to Home')}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('backToHomeBtn', 'Home')}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center font-black text-lg shadow-md">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black font-editorial tracking-tight text-white">
                  KrushiSetu
                </span>
                <span className="text-[10px] font-bold text-[#D9FF55] bg-[#D9FF55]/20 px-1.5 py-0.5 rounded-full">
                  {t('stateBadge', 'Maharashtra')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top-Right Controls */}
        <div className="flex items-center gap-2">
          {/* 4-Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 text-[#F6F1E4] border border-white/10 text-xs font-bold transition-colors cursor-pointer"
              aria-label="Language Selector"
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

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Role Selection Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center max-w-5xl mx-auto space-y-8 w-full">
        {/* Section Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17362C]/10 dark:bg-white/10 text-[#17362C] dark:text-[#D9FF55] text-xs font-black border border-[#17362C]/15 dark:border-white/15 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#3F754A] dark:text-[#D9FF55]" />
          <span>{t('landingBadge')}</span>
        </div>

        {/* Title */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-editorial tracking-tight text-[#132B23] dark:text-white">
            {t('roleSelectionTitle', 'Choose Your Portal')}
          </h1>
          <p className="text-xs sm:text-sm text-[#132B23]/75 dark:text-white/75 font-medium leading-relaxed">
            {t('roleSelectionSub', 'Select your role to access your dedicated KrushiSetu portal with secure login')}
          </p>
        </div>

        {/* 3 Prominent Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left pt-2">
          
          {/* Card 1: Seller / Farmer */}
          <div className="group rounded-3xl bg-white dark:bg-[#12261E] border-2 border-[#17362C]/15 dark:border-emerald-500/30 p-6 shadow-xl hover:shadow-2xl hover:border-[#3F754A] dark:hover:border-[#D9FF55] transition-all flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform">
                  🚜
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-black border border-emerald-300 dark:border-emerald-800">
                  {t('roleBadgeSeller', 'Seller / Farmer')}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#132B23] dark:text-white">
                  {t('roleCardSellerTitle', 'Seller / Farmer')}
                </h2>
                <p className="text-xs text-[#132B23]/75 dark:text-neutral-300 mt-1.5 leading-relaxed font-medium">
                  {t(
                    'roleCardSellerDesc',
                    'Direct sales to verified corporate processors, APMC mandi price discovery, farm-gate logistics pickup, and 100% digital escrow safety.'
                  )}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#17362C]/10 dark:border-white/10 text-xs font-bold text-[#132B23]/80 dark:text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Mobile OTP Login (No password needed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Farm-gate pickup & 100% bank escrow</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <button
                type="button"
                onClick={() => handleRoleClick('farmer', 'login')}
                className="w-full py-3 px-4 rounded-2xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] font-black text-xs shadow-md hover:bg-[#244E3E] dark:hover:bg-lime-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t('roleCardSellerLogin', 'Login as Seller / Farmer')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleRoleClick('farmer', 'register')}
                className="w-full py-2 px-3 text-center text-xs font-black text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer block"
              >
                {t('roleCardSellerRegister', 'New Farmer? Register with Mobile OTP')}
              </button>
            </div>
          </div>

          {/* Card 2: Buyer / Corporate Processor */}
          <div className="group rounded-3xl bg-white dark:bg-[#12261E] border-2 border-[#17362C]/15 dark:border-amber-500/30 p-6 shadow-xl hover:shadow-2xl hover:border-[#FF7043] dark:hover:border-amber-400 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform">
                  🏢
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-black border border-amber-300 dark:border-amber-800">
                  {t('roleBadgeBuyer', 'Buyer')}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#132B23] dark:text-white">
                  {t('roleCardBuyerTitle', 'Buyer / Corporate')}
                </h2>
                <p className="text-xs text-[#132B23]/75 dark:text-neutral-300 mt-1.5 leading-relaxed font-medium">
                  {t(
                    'roleCardBuyerDesc',
                    'Direct farmgate procurement of AGMARK graded crops from verified Maharashtra farmers with digital escrow and contract security.'
                  )}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#17362C]/10 dark:border-white/10 text-xs font-bold text-[#132B23]/80 dark:text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Mobile OTP Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Verified mandi lots & custom supply deals</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <button
                type="button"
                onClick={() => handleRoleClick('buyer', 'login')}
                className="w-full py-3 px-4 rounded-2xl bg-[#FF7043] hover:bg-[#e65c2e] text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t('roleCardBuyerLogin', 'Login as Buyer')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleRoleClick('buyer', 'register')}
                className="w-full py-2 px-3 text-center text-xs font-black text-[#FF7043] dark:text-amber-400 hover:underline cursor-pointer block"
              >
                {t('roleCardBuyerRegister', 'New Buyer? Register with Mobile OTP')}
              </button>
            </div>
          </div>

          {/* Card 3: MSAMB Nodal Officer / Admin */}
          <div className="group rounded-3xl bg-white dark:bg-[#12261E] border-2 border-[#17362C]/15 dark:border-red-500/30 p-6 shadow-xl hover:shadow-2xl hover:border-red-500 dark:hover:border-red-400 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition-transform">
                  🛡️
                </div>
                <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-[11px] font-black border border-red-300 dark:border-red-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>{t('roleBadgeAdmin', 'MSAMB Admin')}</span>
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-[#132B23] dark:text-white">
                  {t('roleCardAdminTitle', 'MSAMB Nodal Officer')}
                </h2>
                <p className="text-xs text-[#132B23]/75 dark:text-neutral-300 mt-1.5 leading-relaxed font-medium">
                  {t(
                    'roleCardAdminDesc',
                    'Restricted government portal for produce quality inspection, KYC verification, and market governance.'
                  )}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#17362C]/10 dark:border-white/10 text-xs font-bold text-[#132B23]/80 dark:text-neutral-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>Authorized MSAMB officers only</span>
                </div>
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-[11px]">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('roleCardAdminNotice', 'Public registration disabled.')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <button
                type="button"
                onClick={() => handleRoleClick('admin', 'login')}
                className="w-full py-3 px-4 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t('roleCardAdminLogin', 'Login as Admin')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="py-2 px-3 text-center text-[10px] text-[#132B23]/60 dark:text-neutral-400 font-mono">
                Official Nodal Credentials Required
              </div>
            </div>
          </div>

        </div>

        {/* Back Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleHomeClick}
            className="inline-flex items-center gap-2 text-xs font-black text-[#17362C] dark:text-[#D9FF55] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHomeBtn', '← Back to Public Website')}</span>
          </button>
        </div>
      </main>
    </div>
  );
};
