import React, { useState } from 'react';
import type { Language, PaymentTransaction } from '../types';
import { SAMPLE_PAYMENT_TRANSACTION } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AudioSpeechButton } from './AudioSpeechButton';
import {
  formatQuantity,
  quintalsToKilograms,
  formatRatePerKg,
  convertRateToPerKg,
} from '../utils/quantity';

interface PaymentEscrowTrackerProps {
  language?: Language;
}

export const PaymentEscrowTracker: React.FC<PaymentEscrowTrackerProps> = () => {
  const { t, translateCrop, language } = useTranslation();
  const [transaction, setTransaction] = useState<PaymentTransaction>(SAMPLE_PAYMENT_TRANSACTION);

  const handleSimulatePayout = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D9FF55', '#3F754A'],
      });
    } catch (_) {}

    const updatedTimeline = transaction.timeline.map((step) =>
      step.step === 6
        ? { ...step, status: 'completed' as const, date: t('instantImpsCompleted') }
        : step
    );

    setTransaction({
      ...transaction,
      escrowStatus: 'Completed & Credited',
      timeline: updatedTimeline,
    });
  };

  const speechText = `${t('paymentTitle')}. ${t('paymentSubtitle')}. ${t('escrowGuaranteed')}. Total escrow pool: ₹${transaction.totalAmountRs.toLocaleString()}.`;

  return (
    <section id="payments" className="py-10 sm:py-14 bg-[#17362C] text-[#F6F1E4] border-b border-[#D9FF55]/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9FF55]/20 text-[#D9FF55] text-xs font-bold uppercase tracking-wider border border-[#D9FF55]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D9FF55]" />
            <span>{t('automatedEscrowGatewayHeader')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-editorial text-white tracking-tight">
            {t('paymentTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#F6F1E4]/80 leading-relaxed">
            {t('paymentSubtitle')}
          </p>
          <div className="pt-1">
            <AudioSpeechButton textToRead={speechText} label={t('voiceListen')} className="bg-white/10 text-[#D9FF55] border-white/15" />
          </div>
        </div>

        {/* Main Escrow Container */}
        <div className="bg-[#132B23] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">

          {/* Transaction Summary Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#17362C] border border-[#D9FF55]/30">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-white/10 text-[#D9FF55] px-2.5 py-0.5 rounded-full">
                  {transaction.id}
                </span>
                <span className="text-xs font-semibold text-white/70">
                  {t('refNumberLabel')}: {transaction.bankReference}
                </span>
              </div>
              <h3 className="text-lg font-black font-editorial text-white mt-1">
                {formatQuantity(quintalsToKilograms(transaction.quantityQtl), language)} {translateCrop(transaction.crop)} Contract · {transaction.buyerCompany}
              </h3>
              <p className="text-xs text-emerald-300 font-medium">
                {t('ratePerKgLabel')}: {formatRatePerKg(convertRateToPerKg(transaction.unitPriceRs), language)} · {t('beneficiaryLabel')}: Ramesh Patel
              </p>
            </div>

            <div className="text-left md:text-right shrink-0">
              <span className="text-[11px] text-white/60 block font-semibold">{t('totalEscrowDeposited')}</span>
              <div className="text-2xl sm:text-3xl font-black font-editorial text-[#D9FF55]">
                ₹{transaction.totalAmountRs.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block mt-0.5">
                ● {transaction.escrowStatus}
              </span>
            </div>
          </div>

          {/* 6-Step Milestone Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D9FF55]">
              {t('automated6MilestoneAuditTrail')}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transaction.timeline.map((step) => (
                <div
                  key={step.step}
                  className={`p-4 rounded-2xl border transition-all ${
                    step.status === 'completed'
                      ? 'bg-[#17362C] border-emerald-500/40 text-white'
                      : step.status === 'current'
                      ? 'bg-[#244E3E] border-[#D9FF55] shadow-lg ring-2 ring-[#D9FF55]/30 text-white'
                      : 'bg-[#132B23]/60 border-white/5 text-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold bg-black/40 px-2 py-0.5 rounded-full text-[#D9FF55]">
                      Milestone 0{step.step}
                    </span>
                    <span className="text-xs font-bold flex items-center gap-1">
                      {step.status === 'completed' ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle className="w-3.5 h-3.5" /> {t('milestoneApproved')}
                        </span>
                      ) : step.status === 'current' ? (
                        <span className="text-[#D9FF55] flex items-center gap-0.5">
                          <Clock className="w-3.5 h-3.5 animate-spin" /> {t('milestoneVerifying')}
                        </span>
                      ) : (
                        t('milestonePending')
                      )}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-white mb-1">
                    {step.step === 1 ? t('milestone1') : step.step === 2 ? t('milestone2') : step.step === 3 ? t('milestone3') : step.step === 4 ? t('milestone4') : step.step === 5 ? t('milestone5') : t('milestone6')}
                  </h5>
                  <p className="text-[10px] text-white/70">{step.description}</p>
                  <span className="text-[10px] font-mono text-[#D9FF55]/80 block mt-2">{step.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action to simulate release */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/70">
              🔒 {t('escrowGuaranteed')}
            </span>
            <button
              type="button"
              onClick={handleSimulatePayout}
              className="py-3 px-6 rounded-xl bg-[#D9FF55] hover:bg-[#c9ef45] text-[#17362C] font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer min-h-[48px]"
            >
              {t('simulateInstantPayoutBtn')}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
