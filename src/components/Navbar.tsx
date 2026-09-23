import React, { useState } from 'react';
import type { Language, UserRole } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../auth/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { ThemeToggle } from './ThemeToggle';
import {
  Globe,
  ChevronDown,
  LogOut,
  CheckCircle2,
  PlusCircle,
  Menu,
  User,
} from 'lucide-react';

interface NavbarProps {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  userRole: UserRole;
  onOpenCreateLotModal: () => void;
  onOpenDemoTour?: () => void;
  onOpenHelp?: () => void;
  onToggleSidebar?: () => void;
  onNavigateSection?: (section: string) => void;
  onOpenProfile?: () => void;
}

const LANGUAGE_CHOICES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  onOpenCreateLotModal,
  onToggleSidebar,
  onNavigateSection,
  onOpenProfile,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const { user, logout } = useAuth();

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const currentLangLabel =
    LANGUAGE_CHOICES.find((l) => l.code === language)?.label || 'English';

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#17362C]/95 dark:bg-[#0A1612]/95 backdrop-blur-md border-b border-[#D9FF55]/15 text-[#F6F1E4] shadow-md transition-all">
        {/* Compact Top Header Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Left: Mobile Hamburger & Mini Brand Indicator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 text-[#D9FF55] border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#D9FF55] cursor-pointer transition-colors"
              aria-label="Open Navigation Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile/Tablet mini brand display */}
            <div className="flex items-center gap-2 lg:hidden">
              <span className="text-base font-black font-editorial text-white">
                KrushiSetu
              </span>
              <span className="text-[9px] bg-[#D9FF55]/20 text-[#D9FF55] px-1.5 py-0.5 rounded font-mono font-bold">
                {t('stateMaharashtra', 'Maharashtra')}
              </span>
            </div>
          </div>

          {/* Center/Right: Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            
            {/* List Harvest Action Button (for farmer) */}
            {userRole === 'farmer' && (
              <button
                type="button"
                onClick={onOpenCreateLotModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#D9FF55] text-[#17362C] font-extrabold text-xs shadow-md hover:bg-[#cbf73c] hover:shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">{t('listHarvestAction', 'Sell Produce')}</span>
              </button>
            )}

            {/* Notification Center */}
            <NotificationCenter onNavigateSection={onNavigateSection} />

            {/* Role & Identity Badge (No in-session role switching allowed) */}
            <div
              onClick={onOpenProfile}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                userRole === 'farmer'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/80'
                  : userRole === 'buyer'
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-950/80'
                  : 'bg-red-950/60 border-red-500/40 text-red-300 hover:bg-red-950/80'
              }`}
              title={user?.name || 'User Profile'}
            >
              <span className="text-sm">{userRole === 'farmer' ? '🚜' : userRole === 'buyer' ? '🏢' : '🛡️'}</span>
              <span className="font-extrabold hidden sm:inline">
                {userRole === 'farmer'
                  ? t('roleBadgeSeller', 'Seller')
                  : userRole === 'buyer'
                  ? t('roleBadgeBuyer', 'Buyer')
                  : t('roleBadgeAdmin', 'MSAMB Admin')}
              </span>
              <span className="opacity-60 hidden md:inline">•</span>
              <span className="truncate max-w-[110px] text-white font-medium hidden xs:inline">
                {user?.name?.split(' ')[0] || (userRole === 'farmer' ? 'Farmer' : userRole === 'buyer' ? 'Buyer' : 'Officer')}
              </span>
            </div>

            {/* My Profile Button */}
            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 text-[#D9FF55] border border-white/10 text-xs font-bold transition-colors cursor-pointer"
                title={t('myProfileNav', 'My Profile')}
              >
                <User className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">{user?.name?.split(' ')[0] || t('myProfileNav', 'Profile')}</span>
              </button>
            )}

            {/* 4-Language Selector Dropdown in Top-Right Header */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 text-[#F6F1E4] border border-white/10 text-xs font-bold transition-colors cursor-pointer"
                aria-label="Language Selector"
                id="navbar-language-selector"
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

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 dark:bg-white/5 dark:hover:bg-red-500/20 text-white/90 hover:text-red-400 border border-white/10 text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title={t('logoutBtn', 'Logout')}
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">{t('logoutBtn', 'Logout')}</span>
            </button>

          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F6F1E4] dark:bg-[#132B23] text-[#132B23] dark:text-[#EDF5F1] rounded-3xl p-6 max-w-sm w-full space-y-4 border border-[#17362C]/20 dark:border-[#D9FF55]/20 shadow-2xl animate-scale-up text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                {t('logoutConfirmTitle', 'Confirm Logout')}
              </h3>
              <p className="text-xs text-[#132B23]/70 dark:text-white/70 mt-1">
                {t('logoutConfirmMessage', 'Are you sure you want to log out from KrushiSetu?')}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-200 dark:bg-white/10 text-xs font-bold text-[#132B23] dark:text-white hover:bg-gray-300 dark:hover:bg-white/15 transition-all cursor-pointer"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-xs font-black text-white hover:bg-red-700 shadow-md transition-all cursor-pointer"
              >
                {t('confirmLogout', 'Yes, Logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
