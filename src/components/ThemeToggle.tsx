import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from '../i18n/useTranslation';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === 'dark';
  const label = isDark ? t('themeSwitchToLight') : t('themeSwitchToDark');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D9FF55] ${
        isDark
          ? 'bg-white/10 hover:bg-white/15 text-[#D9FF55] border-[#D9FF55]/30 hover:border-[#D9FF55]/60 shadow-[0_0_12px_rgba(217,255,85,0.2)]'
          : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40'
      } ${className}`}
      title={label}
      aria-label={label}
    >
      <div className="relative w-4 h-4">
        <Sun
          className={`w-4 h-4 transition-all duration-500 transform absolute inset-0 ${
            isDark
              ? 'opacity-100 rotate-0 scale-100 text-[#D9FF55]'
              : 'opacity-0 -rotate-90 scale-50'
          }`}
        />
        <Moon
          className={`w-4 h-4 transition-all duration-500 transform absolute inset-0 ${
            isDark
              ? 'opacity-0 rotate-90 scale-50'
              : 'opacity-100 rotate-0 scale-100 text-[#F6F1E4]'
          }`}
        />
      </div>
      <span className="sr-only">{label}</span>
    </button>
  );
};
