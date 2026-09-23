import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import type { Language, UserRole } from '../../types';
import { ThemeToggle } from '../ThemeToggle';
import {
  ShieldAlert,
  ArrowRight,
  LogOut,
  Globe,
  ChevronDown,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface UnauthorizedAccessViewProps {
  targetRole: UserRole;
  onNavigateToMyDashboard?: () => void;
}

const LANGUAGE_CHOICES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

export const UnauthorizedAccessView: React.FC<UnauthorizedAccessViewProps> = ({
  targetRole,
  onNavigateToMyDashboard,
}) => {
  const { user, userRole, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const currentLangLabel =
    LANGUAGE_CHOICES.find((l) => l.code === language)?.label || 'English';

  const getRoleLabel = (role: UserRole | null | undefined): string => {
    if (role === 'farmer') return t('roleBadgeSeller', 'Seller / Farmer');
    if (role === 'buyer') return t('roleBadgeBuyer', 'Buyer');
    if (role === 'admin') return t('roleBadgeAdmin', 'MSAMB Admin');
    return t('roleBadgeGuest', 'Guest');
  };

  const handleReturnToMyDashboard = () => {
    if (onNavigateToMyDashboard) {
      onNavigateToMyDashboard();
    } else {
      if (userRole === 'farmer') {
        window.location.hash = '#/seller';
      } else if (userRole === 'buyer') {
        window.location.hash = '#/buyer';
      } else if (userRole === 'admin') {
        window.location.hash = '#/admin';
      } else {
        window.location.hash = '#/role-selection';
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-[#F6F1E4] text-[#132B23] dark:bg-[#0B1713] dark:text-[#EDF5F1] flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-3.5 bg-[#17362C] dark:bg-[#0A1612] text-[#F6F1E4] flex items-center justify-between border-b border-[#D9FF55]/20 sticky top-0 z-30 shadow-md">
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

          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-lg w-full bg-white dark:bg-[#12261E] rounded-3xl border-2 border-red-500/20 dark:border-red-500/30 p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>{t('unauthorizedTitle', 'Unauthorized Portal Access')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-editorial text-[#132B23] dark:text-white">
              {t('errorUnauthorizedAccess', 'Access Denied')
                .replace('{currentRole}', getRoleLabel(userRole))
                .replace('{targetRole}', getRoleLabel(targetRole))}
            </h1>
            <p className="text-xs sm:text-sm text-[#132B23]/75 dark:text-neutral-300 font-medium leading-relaxed">
              {t('unauthorizedMessage', 'This section is restricted to {targetRole} accounts. Your active logged-in role is {currentRole}.')
                .replace('{currentRole}', getRoleLabel(userRole))
                .replace('{targetRole}', getRoleLabel(targetRole))}
            </p>
          </div>

          {/* Current Session Info */}
          {user && (
            <div className="p-3.5 rounded-2xl bg-[#F6F1E4] dark:bg-black/20 border border-[#17362C]/10 dark:border-white/10 text-left text-xs space-y-1">
              <div className="text-[10px] uppercase font-black tracking-wider text-[#17362C]/60 dark:text-white/60">
                Active Session
              </div>
              <div className="font-bold text-[#132B23] dark:text-white flex items-center justify-between">
                <span>{user.name} ({user.mobile})</span>
                <span className="px-2 py-0.5 rounded-full bg-[#17362C]/10 dark:bg-white/10 text-[11px] font-black">
                  {getRoleLabel(userRole)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleReturnToMyDashboard}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#17362C] hover:bg-[#244E3E] dark:bg-[#D9FF55] dark:hover:bg-lime-300 text-[#D9FF55] dark:text-[#17362C] font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{t('returnToMyDashboard', 'Return to My Dashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-100 dark:bg-white/5 dark:hover:bg-white/10 text-red-600 dark:text-red-400 font-black text-xs border border-red-300 dark:border-red-900 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logoutToSwitchRole', 'Logout & Switch Role')}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
