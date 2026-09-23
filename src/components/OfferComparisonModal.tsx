import React from 'react';
import type { BuyerProfile, ProduceLot, Language } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import {
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AudioSpeechButton } from './AudioSpeechButton';

import {
  normalizeQuantityToKg,
  formatQuantity,
  formatRatePerKg,
} from '../utils/quantity';

interface OfferComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyer: BuyerProfile | null;
  lot: ProduceLot | null;
  language?: Language;
  onConfirmContract: (buyer: BuyerProfile, lot: ProduceLot) => void;
}

export const OfferComparisonModal: React.FC<OfferComparisonModalProps> = ({
  isOpen,
  onClose,
  buyer,
  lot,
  onConfirmContract,
}) => {
  const { t, translateCrop, language } = useTranslation();

  if (!isOpen || !buyer || !lot) return null;

  const lotQuantityKg = normalizeQuantityToKg(lot.quantity, lot.unit);
  const buyerGrossRatePerKg = buyer.offeredPrice / 100;
  const apmcMandiGrossRatePerKg = Math.round((buyer.offeredPrice - 380) / 10) / 10;

  // Buyer Direct Channel Calculations
  const buyerMandiCessPerKg = 0; // Exempt under direct contract
  const buyerHandlingCostPerKg = 0.2; // ₹0.20/kg
  const buyerPooledTransportPerKg = 0.85; // ₹0.85/kg
  const buyerNetRatePerKg = buyerGrossRatePerKg - buyerMandiCessPerKg - buyerHandlingCostPerKg - buyerPooledTransportPerKg;
  const buyerTotalPayoutRupees = Math.round(buyerNetRatePerKg * lotQuantityKg);

  // Traditional APMC Mandi Channel Calculations
  const apmcCessPerKg = Math.round(apmcMandiGrossRatePerKg * 0.015 * 10) / 10; // 1.5%
  const apmcHandlingPerKg = 0.48; // ₹0.48/kg
  const apmcIndividualTransportPerKg = 1.4; // ₹1.40/kg
  const apmcCommissionBrokerPerKg = Math.round(apmcMandiGrossRatePerKg * 0.03 * 10) / 10; // 3%
  const apmcNetRatePerKg = apmcMandiGrossRatePerKg - apmcCessPerKg - apmcHandlingPerKg - apmcIndividualTransportPerKg - apmcCommissionBrokerPerKg;
  const apmcTotalPayoutRupees = Math.round(apmcNetRatePerKg * lotQuantityKg);

  // Farmer Net Surplus
  const netSurplusPerKg = Math.round((buyerNetRatePerKg - apmcNetRatePerKg) * 10) / 10;
  const totalNetSurplusRupees = buyerTotalPayoutRupees - apmcTotalPayoutRupees;
  const surplusPercent = ((netSurplusPerKg / apmcNetRatePerKg) * 100).toFixed(1);

  const handleAcceptContract = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#D9FF55', '#3F754A', '#FF7043'],
      });
    } catch (_) {}
    onConfirmContract(buyer, lot);
    onClose();
  };

  const speechText = `${t('offerCompareTitle')}. ${buyer.company} ${t('grossPrice')}: ${formatRatePerKg(buyerGrossRatePerKg, language)}. ${t('netFarmerRealization')}: ${formatRatePerKg(buyerNetRatePerKg, language)}. ${t('extraFarmerSurplus') || 'Extra surplus'}: ₹${totalNetSurplusRupees.toLocaleString()}.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#F6F1E4] w-full max-w-2xl rounded-3xl border border-[#17362C]/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-[#17362C] text-[#F6F1E4] px-6 py-4 flex items-center justify-between border-b border-[#D9FF55]/20">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#D9FF55] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('offerCompareTitle')}</span>
            </div>
            <h3 className="text-lg font-black font-editorial text-white">
              {buyer.company} vs Traditional APMC Auction
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label={t('closeModal')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Lot & Buyer Brief */}
          <div className="bg-white p-4 rounded-2xl border border-[#17362C]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#132B23]/60 block font-semibold">Listing Batch:</span>
              <span className="font-bold text-[#132B23] text-sm">
                {formatQuantity(lotQuantityKg, language)} · {translateCrop(lot.crop)} ({lot.variety})
              </span>
              <span className="text-gray-500 block text-[11px]">ID: {lot.id}</span>
            </div>

            <div className="flex items-center gap-2">
              <AudioSpeechButton textToRead={speechText} label={t('voiceListen')} />
              <div className="text-left sm:text-right">
                <span className="text-[#132B23]/60 block font-semibold">Verified Corporate Buyer:</span>
                <span className="font-bold text-[#3F754A] text-sm">{buyer.company}</span>
                <span className="text-emerald-700 block text-[11px]">🛡️ 100% Escrow Protected</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Left: Direct Buyer Contract */}
            <div className="bg-white p-5 rounded-2xl border-2 border-[#3F754A] shadow-md space-y-3 relative">
              <span className="absolute -top-3 left-4 bg-[#3F754A] text-[#D9FF55] text-[10px] font-black uppercase px-3 py-0.5 rounded-full">
                {t('highestNetBadge')}
              </span>

              <h4 className="text-sm font-extrabold text-[#17362C] pt-1">
                Direct Buyer (KrushiSetu)
              </h4>

              <div className="space-y-2 text-xs divide-y divide-gray-100">
                <div className="flex justify-between pt-1">
                  <span className="text-gray-600">{t('grossPrice')}:</span>
                  <span className="font-bold text-[#17362C]">{formatRatePerKg(buyerGrossRatePerKg, language)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-600">{t('mandiCess')}:</span>
                  <span className="text-emerald-700 font-bold">₹0 (Exempt)</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-600">{t('handlingFee')}:</span>
                  <span className="text-red-600 font-semibold">-₹{buyerHandlingCostPerKg.toFixed(2)}/kg</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-600">{t('transportShare')}:</span>
                  <span className="text-red-600 font-semibold">-₹{buyerPooledTransportPerKg.toFixed(2)}/kg</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-600">Brokerage / Commission:</span>
                  <span className="text-emerald-700 font-bold">₹0 (Zero Middlemen)</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-[#17362C]/20 bg-[#17362C] text-[#F6F1E4] p-3 rounded-xl">
                <span className="text-[10px] text-[#D9FF55] font-bold uppercase tracking-wider block">
                  {t('finalFarmerPayout')}
                </span>
                <span className="text-2xl font-black text-white font-editorial">
                  {formatRatePerKg(buyerNetRatePerKg, language)}
                </span>
                <span className="text-xs font-bold text-emerald-300 block mt-0.5">
                  Total Bank Credit: ₹{Math.round(buyerTotalPayoutRupees).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Right: Traditional APMC Mandi Auction */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 opacity-80">
              <h4 className="text-sm font-bold text-gray-700">
                Traditional APMC Auction
              </h4>

              <div className="space-y-2 text-xs divide-y divide-gray-100">
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500">Mandi Auction Rate:</span>
                  <span className="font-bold text-gray-700">{formatRatePerKg(apmcMandiGrossRatePerKg, language)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">Mandi Cess (1.5%):</span>
                  <span className="text-red-600">-₹{apmcCessPerKg.toFixed(2)}/kg</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">Manual Handling:</span>
                  <span className="text-red-600">-₹{apmcHandlingPerKg.toFixed(2)}/kg</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">Single Freight:</span>
                  <span className="text-red-600">-₹{apmcIndividualTransportPerKg.toFixed(2)}/kg</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">Broker Commission (3%):</span>
                  <span className="text-red-600">-₹{apmcCommissionBrokerPerKg.toFixed(2)}/kg</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 bg-gray-100 p-3 rounded-xl">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                  Net Realization
                </span>
                <span className="text-xl font-bold text-gray-800 font-editorial">
                  {formatRatePerKg(apmcNetRatePerKg, language)}
                </span>
                <span className="text-xs text-gray-600 block mt-0.5">
                  Total: ₹{Math.round(apmcTotalPayoutRupees).toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          {/* Farmer Extra Surplus Highlight */}
          <div className="bg-gradient-to-r from-[#D9FF55]/30 to-[#3F754A]/20 p-4 rounded-2xl border border-[#3F754A]/30 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#17362C] block">
                🎉 Extra Farmer Net Profit on This Lot
              </span>
              <p className="text-xs text-[#17362C]/80">
                You receive <strong>+{surplusPercent}%</strong> more cash in your bank compared to local mandi brokers.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-[#17362C] font-editorial">
                +₹{totalNetSurplusRupees.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#3F754A] font-bold block">+{formatRatePerKg(netSurplusPerKg, language)} net</span>
            </div>
          </div>

          <p className="text-[11px] text-[#132B23]/70 italic">
            {t('escrowLockNotice')}
          </p>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 min-h-[44px] cursor-pointer"
          >
            {t('cancel')}
          </button>

          <button
            type="button"
            onClick={handleAcceptContract}
            className="py-3 px-6 rounded-xl bg-[#17362C] hover:bg-[#254E40] text-[#D9FF55] text-xs font-extrabold shadow-lg transition-all active:scale-95 flex items-center gap-2 min-h-[48px] cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('confirmContractBtn')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
