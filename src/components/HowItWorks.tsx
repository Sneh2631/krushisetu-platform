import React from 'react';
import type { Language } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import {
  PackagePlus,
  ArrowRightLeft,
  Truck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AudioSpeechButton } from './AudioSpeechButton';

interface HowItWorksProps {
  language?: Language;
}

export const HowItWorks: React.FC<HowItWorksProps> = () => {
  const { t } = useTranslation();

  const steps = [
    {
      stepNum: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: PackagePlus,
      color: '#3F754A',
    },
    {
      stepNum: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: ArrowRightLeft,
      color: '#FF7043',
    },
    {
      stepNum: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: Truck,
      color: '#17362C',
    },
    {
      stepNum: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: ShieldCheck,
      color: '#3F754A',
    },
  ];

  const speechText = `${t('howItWorksTitle')}. ${t('step1Title')}: ${t('step1Desc')}. ${t('step2Title')}: ${t('step2Desc')}. ${t('step3Title')}: ${t('step3Desc')}. ${t('step4Title')}: ${t('step4Desc')}.`;

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-[#F6F1E4] border-b border-[#17362C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3F754A]/10 text-[#3F754A] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>End-to-End Operating Model</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-editorial text-[#132B23] tracking-tight">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#132B23]/70 leading-relaxed">
            {t('heroSubtext')}
          </p>
          <div className="pt-1">
            <AudioSpeechButton textToRead={speechText} label={t('voiceListen')} />
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-[#17362C]/10 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D9FF55]/10 rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#17362C] text-[#D9FF55] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black font-editorial text-[#17362C]/30 group-hover:text-[#3F754A] transition-colors">
                      {step.stepNum}
                    </span>
                  </div>

                  <h3 className="text-base font-black font-editorial text-[#132B23] mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#132B23]/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#17362C]/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F754A]">
                    Automated & Transparent
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
