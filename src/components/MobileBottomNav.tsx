import React from 'react';
import { Home, TrendingUp, PlusCircle, PackageCheck, Mic } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

interface MobileBottomNavProps {
  onNavigateHome: () => void;
  onNavigatePrices: () => void;
  onOpenCreateLot: () => void;
  onNavigateOrders: () => void;
  onOpenHelp: () => void;
  onOpenVoiceAgent?: () => void;
  activeSection?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onNavigateHome,
  onNavigatePrices,
  onOpenCreateLot,
  onNavigateOrders,
  onOpenHelp: _onOpenHelp,
  onOpenVoiceAgent,
  activeSection = 'home',
}) => {
  const { t } = useTranslation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#17362C]/15 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {/* Home */}
        <button
          type="button"
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] cursor-pointer ${
            activeSection === 'home'
              ? 'text-[#17362C] font-extrabold bg-[#17362C]/5'
              : 'text-[#17362C]/65 font-semibold'
          }`}
          aria-label={t('bottomNavHome')}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none truncate max-w-full">{t('bottomNavHome')}</span>
        </button>

        {/* Prices */}
        <button
          type="button"
          onClick={onNavigatePrices}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] cursor-pointer ${
            activeSection === 'prices'
              ? 'text-[#17362C] font-extrabold bg-[#17362C]/5'
              : 'text-[#17362C]/65 font-semibold'
          }`}
          aria-label={t('bottomNavPrices')}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none truncate max-w-full">{t('bottomNavPrices')}</span>
        </button>

        {/* Sell (Prominent Action) */}
        <button
          type="button"
          onClick={onOpenCreateLot}
          className="flex flex-col items-center justify-center py-1 px-1 -mt-4 group cursor-pointer"
          aria-label={t('bottomNavSell')}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#17362C] to-[#3F754A] text-[#D9FF55] flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-105 transition-transform">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-extrabold text-[#17362C] mt-0.5">{t('bottomNavSell')}</span>
        </button>

        {/* Orders / Payments */}
        <button
          type="button"
          onClick={onNavigateOrders}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] cursor-pointer ${
            activeSection === 'orders'
              ? 'text-[#17362C] font-extrabold bg-[#17362C]/5'
              : 'text-[#17362C]/65 font-semibold'
          }`}
          aria-label={t('bottomNavOrders')}
        >
          <PackageCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none truncate max-w-full">{t('bottomNavOrders')}</span>
        </button>

        {/* Voice Agent */}
        <button
          type="button"
          onClick={onOpenVoiceAgent}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] cursor-pointer ${
            activeSection === 'voice'
              ? 'text-emerald-600 font-extrabold bg-emerald-50'
              : 'text-emerald-600 font-semibold'
          }`}
          aria-label={t('voiceAssistant', 'Voice')}
        >
          <Mic className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-none truncate max-w-full">{t('voiceAssistant', 'Voice')}</span>
        </button>
      </div>
    </nav>
  );
};
