import React, { useState, useEffect } from 'react';
import type { Deal, DealStatus, TransportRequest } from '../types';
import { dbService } from '../services/dbService';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Truck,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DealWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId?: string | null;
  onDealUpdated?: () => void;
}

const DEAL_STAGE_STEPS: { status: DealStatus; icon: string }[] = [
  { status: 'Offer Accepted', icon: '🤝' },
  { status: 'Pickup Scheduled', icon: '📅' },
  { status: 'Product Collected', icon: '📦' },
  { status: 'In Transit', icon: '🚚' },
  { status: 'Delivered', icon: '🏭' },
  { status: 'Completed', icon: '💰' },
];

export const DealWorkspaceModal: React.FC<DealWorkspaceModalProps> = ({
  isOpen,
  onClose,
  dealId,
  onDealUpdated,
}) => {
  const { user } = useAuth();
  const { t, translateStatus, translateCrop } = useTranslation();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [transport, setTransport] = useState<TransportRequest | null>(null);

  // Transport Form State
  const [isEditingTransport, setIsEditingTransport] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverMobile, setDriverMobile] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<'Pickup (1.5T)' | 'Eicher (4T)' | 'Heavy Truck (10T)' | 'Cold Van (3T)'>('Heavy Truck (10T)');
  const [estimatedCost, setEstimatedCost] = useState(12000);

  // Rating State
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  const loadDealData = async () => {
    if (!dealId) return;
    try {
      const d = await dbService.getDealById(dealId);
      setDeal(d);
      if (d) {
        const tr = await dbService.getTransportByDealId(d.id);
        setTransport(tr);
        if (tr) {
          setDriverName(tr.driverName || '');
          setDriverMobile(tr.driverMobile || '');
          setVehicleNumber(tr.vehicleNumber || '');
          setVehicleType(tr.vehicleType);
          setEstimatedCost(tr.estimatedCost || 12000);
        }
      }
    } catch (err) {
      console.error('Error loading deal:', err);
    }
  };

  useEffect(() => {
    if (isOpen && dealId) {
      loadDealData();
    }
  }, [isOpen, dealId]);

  if (!isOpen || !deal) return null;

  const isBuyer = user?.role === 'buyer' || user?.id === deal.buyerId;

  const handleUpdateStatus = async (newStatus: DealStatus) => {
    try {
      const updated = await dbService.updateDealStatus(deal.id, newStatus);
      setDeal(updated);
      if (newStatus === 'Completed') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#D9FF55', '#3F754A', '#FF7043'],
          });
        } catch (_) {}
      }
      if (onDealUpdated) onDealUpdated();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleSaveTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saved = await dbService.createOrUpdateTransport(deal.id, {
        dealId: deal.id,
        dealCode: deal.dealCode,
        pickupAddress: deal.pickupAddress,
        deliveryAddress: deal.deliveryDestination || 'Sanand GIDC Agro Processing Facility',
        productType: `${deal.cropGu} (${deal.variety})`,
        weightKg: deal.agreedQuantity * (deal.unit === 'tonne' ? 1000 : 100),
        vehicleType,
        pickupDate: deal.pickupDate,
        estimatedCost,
        driverName,
        driverMobile,
        vehicleNumber,
        trackingStatus: 'Assigned',
      });
      setTransport(saved);
      setIsEditingTransport(false);
      await handleUpdateStatus('Pickup Scheduled');
    } catch (err: any) {
      alert('Error saving transport: ' + err.message);
    }
  };

  const handleRateSubmit = async () => {
    try {
      await dbService.rateDeal(deal.id, ratingStars, ratingFeedback, isBuyer ? 'buyer' : 'farmer');
      setIsRatingSubmitted(true);
      alert(t('ratingSubmittedAlert'));
      if (onDealUpdated) onDealUpdated();
    } catch (err: any) {
      alert('Error submitting rating: ' + err.message);
    }
  };

  // Find active step index
  const currentStepIndex = DEAL_STAGE_STEPS.findIndex((s) => s.status === deal.status);
  const activeStepIdx = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-[#F6F1E4] text-[#132B23] rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#17362C]/20 max-h-[92vh] flex flex-col">

        {/* Top Header */}
        <div className="px-6 py-4 bg-[#17362C] text-[#F6F1E4] flex items-center justify-between border-b border-[#D9FF55]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9FF55]/20 text-[#D9FF55] flex items-center justify-center font-black">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-[#D9FF55] bg-white/10 px-2 py-0.5 rounded">
                  {deal.dealCode}
                </span>
                <span className="text-xs bg-[#3F754A] text-white px-2 py-0.5 rounded-full font-bold">
                  {translateStatus(deal.status)}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {t('sharedDealWorkspace')}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* Milestone Progress Bar */}
          <div className="bg-white p-5 rounded-3xl border border-[#17362C]/15 space-y-3">
            <div className="text-xs font-black text-[#132B23] uppercase tracking-wider">
              {t('dealMilestonesTitle')}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {DEAL_STAGE_STEPS.map((st, idx) => {
                const isPassed = idx <= activeStepIdx;
                const isCurrent = idx === activeStepIdx;
                return (
                  <div
                    key={st.status}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-[#17362C] text-[#D9FF55] border-[#17362C] shadow-md ring-2 ring-[#D9FF55]'
                        : isPassed
                        ? 'bg-[#3F754A]/20 text-[#3F754A] border-[#3F754A]/30'
                        : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}
                  >
                    <div className="text-base mb-1">{st.icon}</div>
                    <div className="text-[11px] font-black leading-tight">{translateStatus(st.status)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mutual Unlocked Contact Cards (Farmer & Buyer) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Farmer Information */}
            <div className="p-5 rounded-3xl bg-white border border-[#17362C]/15 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3F754A] bg-[#3F754A]/10 px-2.5 py-1 rounded-full">
                  {t('farmerContactBadge')}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('verifiedFarmerBadge')}</span>
                </span>
              </div>
              <div>
                <div className="text-base font-black text-[#132B23]">{deal.farmerName}</div>
                <div className="text-xs text-[#132B23]/70 flex items-center gap-1 mt-1 font-mono font-bold">
                  <PhoneCall className="w-3.5 h-3.5 text-[#3F754A]" />
                  <span>+91 {deal.farmerMobile}</span>
                </div>
                <div className="text-xs text-[#132B23]/70 flex items-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#3F754A] shrink-0 mt-0.5" />
                  <span>{deal.pickupAddress}</span>
                </div>
              </div>
              <a
                href={`tel:${deal.farmerMobile}`}
                className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#17362C] text-[#D9FF55] text-xs font-black hover:bg-[#244E3E] transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t('callFarmerBtn')}</span>
              </a>
            </div>

            {/* Buyer Information */}
            <div className="p-5 rounded-3xl bg-white border border-[#17362C]/15 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FF7043] bg-[#FF7043]/10 px-2.5 py-1 rounded-full">
                  {t('buyerContactBadge')}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('escrowProtectedBadge')}</span>
                </span>
              </div>
              <div>
                <div className="text-base font-black text-[#132B23]">{deal.buyerCompany}</div>
                <div className="text-xs text-[#132B23]/70 font-bold">{deal.buyerName}</div>
                <div className="text-xs text-[#132B23]/70 flex items-center gap-1 mt-1 font-mono font-bold">
                  <PhoneCall className="w-3.5 h-3.5 text-[#FF7043]" />
                  <span>+91 {deal.buyerMobile}</span>
                </div>
                <div className="text-xs text-[#132B23]/70 flex items-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF7043] shrink-0 mt-0.5" />
                  <span>{deal.deliveryDestination}</span>
                </div>
              </div>
              <a
                href={`tel:${deal.buyerMobile}`}
                className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#17362C] text-[#D9FF55] text-xs font-black hover:bg-[#244E3E] transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{t('callBuyerBtn')}</span>
              </a>
            </div>

          </div>

          {/* Deal Value and Payment Summary Card */}
          <div className="p-5 rounded-3xl bg-[#17362C] text-[#F6F1E4] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9FF55]">
                {t('dealValueSummaryTitle')}
              </span>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#D9FF55] text-[#17362C]">
                {translateStatus(deal.escrowStatus)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-white/60 block text-[11px]">{t('cropVarietyLabel')}</span>
                <span className="font-black text-white text-sm">{translateCrop(deal.crop || deal.cropGu || '')} — {deal.variety}</span>
              </div>
              <div>
                <span className="text-white/60 block text-[11px]">{t('agreedQuantityLabel')}</span>
                <span className="font-black text-white text-sm">{deal.agreedQuantity} {deal.unit}</span>
              </div>
              <div>
                <span className="text-white/60 block text-[11px]">{t('agreedPriceLabel')}</span>
                <span className="font-black text-[#D9FF55] text-sm">₹{deal.agreedPricePerUnit}/{deal.unit === 'tonne' ? 'tonne' : 'quintal'}</span>
              </div>
              <div>
                <span className="text-white/60 block text-[11px]">{t('totalDealAmountLabel')}</span>
                <span className="font-black text-[#D9FF55] text-base">₹{deal.totalEstimatedValue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Transport Coordination Section */}
          <div className="p-5 rounded-3xl bg-white border border-[#17362C]/15 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#3F754A]" />
                <h4 className="text-sm font-black text-[#132B23]">
                  {t('transportLogisticsTitle')}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingTransport(!isEditingTransport)}
                className="text-xs font-bold text-[#17362C] bg-[#F6F1E4] px-3 py-1 rounded-xl border border-[#17362C]/20 hover:bg-[#17362C]/10 cursor-pointer"
              >
                {isEditingTransport ? t('cancelBtn') : transport ? t('changeVehicleBtn') : t('assignVehicleBtn')}
              </button>
            </div>

            {isEditingTransport ? (
              <form onSubmit={handleSaveTransport} className="space-y-3 p-4 bg-[#F6F1E4]/60 rounded-2xl border border-[#17362C]/10 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-[#132B23]">{t('vehicleTypeLabel')}*</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#17362C]/20 text-xs font-bold outline-none"
                    >
                      <option value="Pickup (1.5T)">Pickup (1.5T)</option>
                      <option value="Eicher (4T)">Eicher (4T)</option>
                      <option value="Heavy Truck (10T)">Heavy Truck (10T)</option>
                      <option value="Cold Van (3T)">Cold Van (3T Refrigerated)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#132B23]">{t('driverNameLabel')}</label>
                    <input
                      type="text"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="e.g. Pravin Vaghela"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#17362C]/20 text-xs font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#132B23]">{t('driverMobileLabel')}</label>
                    <input
                      type="tel"
                      value={driverMobile}
                      onChange={(e) => setDriverMobile(e.target.value)}
                      placeholder="98790..."
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#17362C]/20 text-xs font-bold outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#132B23]">{t('vehicleNumberLabel')}</label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="GJ-04-AX-8912"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#17362C]/20 text-xs font-bold outline-none uppercase font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#132B23]">{t('estimatedFreightLabel')}</label>
                    <input
                      type="number"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#17362C]/20 text-xs font-bold outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#17362C] text-[#D9FF55] text-xs font-black cursor-pointer shadow-md hover:bg-[#244E3E]"
                >
                  {t('saveTransportBtn')}
                </button>
              </form>
            ) : transport ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F6F1E4]/50 p-4 rounded-2xl border border-[#17362C]/10">
                <div>
                  <span className="text-[#132B23]/60 block text-[11px] font-bold">{t('vehicleTypeLabel')}</span>
                  <span className="font-bold text-[#132B23]">{transport.vehicleType}</span>
                </div>
                <div>
                  <span className="text-[#132B23]/60 block text-[11px] font-bold">{t('vehicleNumberLabel')}</span>
                  <span className="font-mono font-bold text-[#132B23]">{transport.vehicleNumber || 'GJ-XX-XXXX'}</span>
                </div>
                <div>
                  <span className="text-[#132B23]/60 block text-[11px] font-bold">{t('driverContact')}</span>
                  <span className="font-bold text-[#132B23]">{transport.driverName || t('assigned')} ({transport.driverMobile || 'N/A'})</span>
                </div>
                <div>
                  <span className="text-[#132B23]/60 block text-[11px] font-bold">{t('transportCost')}</span>
                  <span className="font-bold text-[#3F754A]">₹{transport.estimatedCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-[#132B23]/60">
                {t('noTransportYet')}
              </div>
            )}
          </div>

          {/* Status Progression Buttons */}
          <div className="p-5 rounded-3xl bg-white border border-[#17362C]/15 space-y-3">
            <div className="text-xs font-black text-[#132B23] uppercase tracking-wider">
              {t('milestoneActionsTitle')}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {deal.status === 'Offer Accepted' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Pickup Scheduled')}
                  className="px-4 py-2.5 rounded-xl bg-[#17362C] text-[#D9FF55] text-xs font-black shadow hover:bg-[#244E3E] cursor-pointer"
                >
                  {t('schedulePickupBtn')}
                </button>
              )}
              {(deal.status === 'Pickup Scheduled' || deal.status === 'Offer Accepted') && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Product Collected')}
                  className="px-4 py-2.5 rounded-xl bg-[#3F754A] text-white text-xs font-black shadow hover:bg-[#2e5936] cursor-pointer"
                >
                  {t('productCollectedBtn')}
                </button>
              )}
              {deal.status === 'Product Collected' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('In Transit')}
                  className="px-4 py-2.5 rounded-xl bg-[#17362C] text-[#D9FF55] text-xs font-black shadow hover:bg-[#244E3E] cursor-pointer"
                >
                  {t('inTransitBtn')}
                </button>
              )}
              {deal.status === 'In Transit' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Delivered')}
                  className="px-4 py-2.5 rounded-xl bg-[#3F754A] text-white text-xs font-black shadow hover:bg-[#2e5936] cursor-pointer"
                >
                  {t('deliveredBtn')}
                </button>
              )}
              {deal.status === 'Delivered' && (
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('Completed')}
                  className="px-5 py-3 rounded-2xl bg-emerald-700 text-white text-xs font-black shadow-lg hover:bg-emerald-800 cursor-pointer animate-pulse"
                >
                  {t('completeAndReleaseEscrowBtn')}
                </button>
              )}
              {deal.status === 'Completed' && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('dealCompletedNotice')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating Section (Active after Completed) */}
          {deal.status === 'Completed' && !isRatingSubmitted && (
            <div className="p-5 rounded-3xl bg-[#D9FF55]/20 border border-[#17362C]/20 space-y-3 animate-fade-in">
              <div className="text-xs font-black text-[#132B23]">
                {isBuyer ? t('rateFarmerTitle') : t('rateBuyerTitle')}
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingStars(star)}
                    className="p-1 cursor-pointer text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= ratingStars ? 'fill-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                placeholder={t('ratingFeedbackPlaceholder')}
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#17362C]/20 text-xs outline-none"
              />
              <button
                type="button"
                onClick={handleRateSubmit}
                className="px-4 py-2 rounded-xl bg-[#17362C] text-[#D9FF55] text-xs font-black hover:bg-[#244E3E] cursor-pointer"
              >
                {t('submitRatingBtn')}
              </button>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#17362C]/15 flex items-center justify-between">
          <div className="text-xs text-[#132B23]/70 font-medium">
            {t('supportHelpline')}: <span className="font-bold text-[#17362C]">1800-233-0199</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#132B23] text-xs font-bold transition-all cursor-pointer"
          >
            {t('closeBtn')}
          </button>
        </div>

      </div>
    </div>
  );
};
