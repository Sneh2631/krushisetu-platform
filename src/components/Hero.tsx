import React from 'react';
import type { Language } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface HeroProps {
  language?: Language;
  onExploreMarkets: () => void;
  onStartFarmerJourney: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMarkets,
  onStartFarmerJourney,
}) => {
  const { t } = useTranslation();

  return (
    <section
      className="relative pt-6 pb-14 sm:pt-10 sm:pb-20 overflow-hidden bg-gradient-to-b from-[#F6F1E4] via-[#ECE6D5] to-[#F6F1E4] dark:from-[#0B1713] dark:via-[#0E1E18] dark:to-[#0B1713] border-b border-[#17362C]/10 dark:border-white/10 transition-colors duration-200"
    >
      {/* Background Subtle Agrarian Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-20 pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-[#D9FF55]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Accessible Editorial Content */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#17362C]/10 dark:bg-white/10 border border-[#17362C]/20 dark:border-white/15 text-[#17362C] dark:text-[#D9FF55] text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#3F754A] dark:bg-[#D9FF55] animate-pulse" />
              <span>{t('heroEyebrow')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black font-editorial tracking-tight text-[#132B23] dark:text-white leading-[1.1]">
              {t('heroHeadline')}
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#132B23]/80 dark:text-white/80 leading-relaxed font-normal">
              {t('heroSubtext')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onExploreMarkets}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#17362C] hover:bg-[#244E3E] dark:bg-[#D9FF55] dark:hover:bg-lime-300 text-[#D9FF55] dark:text-[#17362C] font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-98 group cursor-pointer min-h-[48px]"
              >
                <span>{t('heroCtaPrimary')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onStartFarmerJourney}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/15 text-[#17362C] dark:text-white font-bold text-sm border border-[#17362C]/15 dark:border-white/15 shadow-sm hover:shadow-md transition-all duration-200 active:scale-98 cursor-pointer min-h-[48px]"
              >
                <Sparkles className="w-4 h-4 text-[#FF7043]" />
                <span>{t('heroCtaSecondary')}</span>
              </button>
            </div>

            {/* Prototype Impact Metrics Row */}
            <div className="pt-4 border-t border-[#17362C]/10 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-[#17362C]/10 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#3F754A] dark:text-[#D9FF55] mb-1 font-bold text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>18–24%</span>
                </div>
                <p className="text-xs font-semibold text-[#132B23] dark:text-white leading-snug">
                  {t('impactMetric1')}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-[#17362C]/10 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#FF7043] mb-1 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>30% Faster</span>
                </div>
                <p className="text-xs font-semibold text-[#132B23] dark:text-white leading-snug">
                  {t('impactMetric2')}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm p-3.5 rounded-2xl border border-[#17362C]/10 dark:border-white/10 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#17362C] dark:text-emerald-400 mb-1 font-bold text-xs">
                  <Truck className="w-3.5 h-3.5" />
                  <span>12% Lower</span>
                </div>
                <p className="text-xs font-semibold text-[#132B23] dark:text-white leading-snug">
                  {t('impactMetric3')}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#132B23]/60 dark:text-white/60 italic">
              {t('prototypeNote')}
            </p>
          </div>

          {/* Right Column: Clear, High-Contrast 3-Step "How KrishiSetu Works" Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl bg-[#17362C] dark:bg-[#0A1612] p-6 sm:p-8 text-[#F6F1E4] shadow-2xl border-2 border-[#D9FF55]/30 space-y-6">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center font-black text-lg shadow-md">
                    🌱
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white font-editorial tracking-tight">
                      {t('howItWorksTitle', 'How KrishiSetu Works')}
                    </h3>
                    <p className="text-xs text-[#D9FF55] font-bold">
                      {t('howItWorksSub', '3 Simple Steps')}
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9FF55]" />
                  {t('secureGuaranteed', '100% Secure')}
                </span>
              </div>

              {/* 3 Clear Visual Steps */}
              <div className="space-y-4 relative">
                
                {/* Connecting subtle line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#D9FF55] via-[#3F754A] to-[#D9FF55] hidden sm:block -z-0 opacity-40" />

                {/* STEP 1: Farmer Lists Harvest */}
                <div className="relative z-10 p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition-all flex items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    🌾
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#3F754A] text-[#D9FF55] px-2 py-0.5 rounded">
                        Step 1
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {t('heroStep1Title', '1. Farmer Lists Harvest')}
                      </h4>
                    </div>
                    <p className="text-xs text-[#F6F1E4]/80 mt-1 leading-snug">
                      {t('heroStep1Desc')}
                    </p>
                  </div>
                </div>

                {/* STEP 2: Buyer Finds & Confirms Produce */}
                <div className="relative z-10 p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition-all flex items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF7043] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    🏢
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded">
                        Step 2
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {t('heroStep2Title', '2. Buyer Discovers & Offers')}
                      </h4>
                    </div>
                    <p className="text-xs text-[#F6F1E4]/80 mt-1 leading-snug">
                      {t('heroStep2Desc')}
                    </p>
                  </div>
                </div>

                {/* STEP 3: KrishiSetu Verification, Payment & Delivery */}
                <div className="relative z-10 p-4 rounded-2xl bg-white/10 border border-[#D9FF55]/30 hover:bg-white/15 transition-all flex items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-[#3F754A] text-[#D9FF55] border-2 border-[#D9FF55] flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    🛡️
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#D9FF55] text-[#17362C] px-2 py-0.5 rounded">
                        Step 3
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-[#D9FF55]">
                        {t('heroStep3Title', '3. Verification, Escrow Payout & Delivery')}
                      </h4>
                    </div>
                    <p className="text-xs text-[#F6F1E4]/80 mt-1 leading-snug">
                      {t('heroStep3Desc')}
                    </p>
                  </div>
                </div>

              </div>

              {/* Live Market Highlight Card */}
              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-[#D9FF55] text-[#17362C] shadow-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#17362C] text-[#D9FF55] flex items-center justify-center text-xl shrink-0">
                      🧅
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black">{t('liveMandiTicker', 'Live Mandi Ticker')}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                      </div>
                      <div className="text-sm font-black">
                        {t('liveMandiTickerSample', 'Red Onion · ₹2,920/Qtl')}
                      </div>
                      <div className="text-[11px] font-bold opacity-80">
                        {t('liveMandiTickerDemand', 'Lasalgaon APMC · 40T buyer demand live')}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onExploreMarkets}
                    className="px-3.5 py-2 rounded-xl bg-[#17362C] hover:bg-[#244E3E] text-[#D9FF55] text-xs font-black shadow shrink-0 cursor-pointer transition-colors"
                  >
                    {t('viewPrices', 'View Prices →')}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
