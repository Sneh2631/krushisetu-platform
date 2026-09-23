import React from 'react';
import type { Language } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  language?: Language;
}

export const Footer: React.FC<FooterProps> = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#132B23] text-[#F6F1E4] border-t border-white/10 pt-12 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3F754A] to-[#D9FF55] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#17362C] rounded-[14px] flex items-center justify-center">
                  <span className="text-xl">🌱</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black font-editorial text-white">
                  {t('brandName')}
                </h3>
                <p className="text-xs text-[#D9FF55] font-medium">
                  {t('brandTagline')}
                </p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Dedicated agricultural digital infrastructure empowering Gujarat smallholders and FPOs with transparent net realization, predictive timing, verified corporate demand, pooled logistics, and automated escrow.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-[#D9FF55] bg-white/5 p-2 rounded-xl border border-white/10 inline-flex">
              <ShieldCheck className="w-4 h-4 text-[#D9FF55]" />
              <span>Smart India Hackathon 2026 Submission</span>
            </div>
          </div>

          {/* Solution Pillars */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#D9FF55] uppercase tracking-wider">
              Core Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li><a href="#price-discovery" className="hover:text-white transition-colors">{t('navLiveMarkets')}</a></li>
              <li><a href="#forecast" className="hover:text-white transition-colors">{t('navForecast')}</a></li>
              <li><a href="#marketplace" className="hover:text-white transition-colors">{t('navMarketplace')}</a></li>
              <li><a href="#logistics" className="hover:text-white transition-colors">{t('navLogistics')}</a></li>
              <li><a href="#storage" className="hover:text-white transition-colors">{t('navStorage')}</a></li>
              <li><a href="#payments" className="hover:text-white transition-colors">{t('navPayments')}</a></li>
              <li><a href="#grievance" className="hover:text-white transition-colors">{t('navGrievance')}</a></li>
            </ul>
          </div>

          {/* Hackathon Alignment */}
          <div className="md:col-span-4 space-y-3 bg-[#17362C]/60 p-5 rounded-2xl border border-white/10">
            <h4 className="text-xs font-bold text-[#D9FF55] uppercase tracking-wider">
              SIH 2026 Problem Statement
            </h4>
            <p className="text-xs text-white/80 font-medium">
              <strong>ID 26132:</strong> Strengthening market linkages and price discovery for farmers
            </p>
            <p className="text-[11px] text-white/60">
              <strong>Organization:</strong> Government of Gujarat<br />
              <strong>Theme:</strong> Agriculture, FoodTech & Rural Development<br />
              <strong>Target Audience:</strong> Smallholder Farmers, FPOs, Agri-Processors & Institutional Buyers
            </p>
          </div>

        </div>

        {/* Bottom Attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© 2026 KrushiSetu. {t('govtNotice')}</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-[#FF7043] fill-current" />
            <span>for Indian Farmers & Rural Prosperity</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
