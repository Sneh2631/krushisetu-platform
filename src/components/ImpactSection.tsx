import React from 'react';
import type { Language } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  Fuel,
  Users,
} from 'lucide-react';

interface ImpactSectionProps {
  language?: Language;
}

export const ImpactSection: React.FC<ImpactSectionProps> = () => {
  const { t } = useTranslation();

  const metrics = [
    {
      stat: '18%–24%',
      title: t('impact1'),
      desc: t('impact1Desc'),
      icon: TrendingUp,
      badge: 'Direct Farmer Income',
    },
    {
      stat: '57.1%',
      title: t('impact2'),
      desc: t('impact2Desc'),
      icon: Fuel,
      badge: 'Logistics Optimization',
    },
    {
      stat: '12%',
      title: t('impact3'),
      desc: t('impact3Desc'),
      icon: Clock,
      badge: 'Loss Prevention',
    },
    {
      stat: '100%',
      title: t('impact4'),
      desc: t('impact4Desc'),
      icon: ShieldCheck,
      badge: 'Payment Assurance',
    },
  ];

  return (
    <section id="impact" className="py-12 sm:py-16 bg-[#17362C] text-[#F6F1E4] border-b border-[#D9FF55]/15 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3F754A]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9FF55]/20 text-[#D9FF55] text-xs font-bold uppercase tracking-wider border border-[#D9FF55]/30">
            <Users className="w-3.5 h-3.5" />
            <span>Socio-Economic & Agrarian Transformation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-editorial text-white tracking-tight">
            {t('impactTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#F6F1E4]/80 leading-relaxed">
            Quantifiable value delivery across smallholders, FPOs, and corporate food processors in Gujarat.
          </p>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-[#132B23] p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between hover:border-[#D9FF55]/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D9FF55]/10 text-[#D9FF55] px-2.5 py-0.5 rounded-full">
                      {m.badge}
                    </span>
                    <div className="p-2 rounded-xl bg-white/5 text-[#D9FF55] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black font-editorial text-[#D9FF55] mb-2">
                    {m.stat}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 leading-snug">
                    {m.title}
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
