import React, { useState } from 'react';
import type { Language } from '../types';
import { useTranslation } from '../i18n/useTranslation';
import {
  Truck,
  Leaf,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Calculator,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { AudioSpeechButton } from './AudioSpeechButton';

interface LogisticsOptimizerProps {
  language?: Language;
}

export const LogisticsOptimizer: React.FC<LogisticsOptimizerProps> = () => {
  const { t } = useTranslation();
  const [simulatedStop, setSimulatedStop] = useState<number>(2);
  const [isSimulating, setIsSimulating] = useState(false);
  const [farmerWeightTon, setFarmerWeightTon] = useState<number>(5);

  const soloFreightCost = farmerWeightTon * 1000 * 3.5;
  const pooledFreightCost = farmerWeightTon * 1000 * 1.5;
  const netSavings = soloFreightCost - pooledFreightCost;

  const handleSimulateRoute = () => {
    setIsSimulating(true);
    let current = 0;
    setSimulatedStop(0);
    const interval = setInterval(() => {
      current++;
      if (current >= 4) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setSimulatedStop(current);
      }
    }, 1000);
  };

  const speechText = `FPO Pooled Logistics. Share a truck with neighboring farmers to cut your transport cost by more than half. Instead of paying 3 rupees 50 paise per kg for a private truck, pay only 1 rupee 50 paise per kg in our shared route.`;

  return (
    <section id="logistics" className="py-10 sm:py-14 bg-[#17362C] text-[#F6F1E4] border-b border-[#D9FF55]/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9FF55]/20 text-[#D9FF55] text-xs font-bold uppercase tracking-wider border border-[#D9FF55]/30">
            <Truck className="w-3.5 h-3.5 text-[#D9FF55]" />
            <span>{t('sharedVillageTransportHeader')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-editorial text-white tracking-tight">
            {t('howSharedPickupWorks')}
          </h2>
          <p className="text-xs sm:text-sm text-[#F6F1E4]/80 leading-relaxed max-w-2xl mx-auto">
            {t('sharedPickupSubtitle')}
          </p>
          <div className="pt-1">
            <AudioSpeechButton textToRead={speechText} label={t('voiceListen')} className="bg-white/10 text-[#D9FF55] border-white/15" />
          </div>
        </div>

        {/* 3 Simple Steps for Non-Technical Farmers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#132B23] p-5 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#D9FF55]/20 text-[#D9FF55] flex items-center justify-center font-black text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-black text-white mb-1.5 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#D9FF55]" />
                {t('farmersPoolProduceTitle')}
              </h3>
              <p className="text-xs text-[#F6F1E4]/75 leading-relaxed">
                {t('farmersPoolProduceDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-bold text-[#D9FF55]">
              {t('noMinTruckPenalty')}
            </div>
          </div>

          <div className="bg-[#132B23] p-5 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#D9FF55]/20 text-[#D9FF55] flex items-center justify-center font-black text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-black text-white mb-1.5 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D9FF55]" />
                {t('oneTruckPickupTitle')}
              </h3>
              <p className="text-xs text-[#F6F1E4]/75 leading-relaxed">
                {t('oneTruckPickupDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-bold text-[#D9FF55]">
              {t('farmGateLoadingGps')}
            </div>
          </div>

          <div className="bg-[#244E3E] p-5 rounded-3xl border border-[#D9FF55]/40 relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center font-black text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-black text-white mb-1.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D9FF55]" />
                {t('payOnlyForWeightTitle')}
              </h3>
              <p className="text-xs text-[#F6F1E4]/90 leading-relaxed">
                {t('payOnlyForWeightDesc')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#D9FF55]/20 text-[11px] font-black text-[#D9FF55]">
              {t('keepExtraProfit')}
            </div>
          </div>
        </div>

        {/* Interactive "Calculate My Savings" + Live Village Route Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Simple Freight Calculator for Farmer */}
          <div className="lg:col-span-5 bg-[#132B23] p-6 rounded-3xl border border-white/10 space-y-5 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D9FF55]">
                <Calculator className="w-4 h-4" />
                <span>{t('instantFreightCalc')}</span>
              </div>
              <h3 className="text-lg font-black font-editorial text-white mt-1">
                {t('seeHowMuchYouSave')}
              </h3>
              <p className="text-xs text-[#F6F1E4]/70 mt-0.5">
                {t('calcSubtitle')}
              </p>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs text-white/80 font-semibold mb-1">
                    {t('yourCropWeightLabel')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={farmerWeightTon}
                      onChange={(e) => setFarmerWeightTon(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-[#17362C] border border-[#D9FF55]/40 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#D9FF55]"
                    />
                    <span className="text-xs font-bold text-white/60 shrink-0">{farmerWeightTon} {t('unitTonne')} ({farmerWeightTon * 10} {t('unitQuintal')})</span>
                  </div>
                </div>

                {/* Side by side cost comparison */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                    <span className="text-[10px] text-white/60 font-semibold uppercase block">{t('soloPrivateTruck')}</span>
                    <span className="text-lg font-black text-red-400 line-through">₹{soloFreightCost.toLocaleString()}</span>
                    <span className="text-[10px] text-white/50 block mt-0.5">₹3.50/kg</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#244E3E] border border-[#D9FF55]/50">
                    <span className="text-[10px] text-[#D9FF55] font-black uppercase block">{t('krushiSetuPooled')}</span>
                    <span className="text-xl font-black text-[#D9FF55]">₹{pooledFreightCost.toLocaleString()}</span>
                    <span className="text-[10px] text-white/80 block mt-0.5">₹1.50/kg (-57%)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#D9FF55]/15 border border-[#D9FF55]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#D9FF55] uppercase block">{t('directMoneySaved')}</span>
                    <span className="text-xs text-white/90">{t('extraProfitToPocket')}</span>
                  </div>
                  <span className="text-xl font-black font-editorial text-[#D9FF55]">
                    +₹{netSavings.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Registered ${farmerWeightTon} tonnes for today's shared village pickup pool! Our local FPO coordinator will confirm pickup time.`)}
              className="w-full py-3 px-4 rounded-xl bg-[#D9FF55] hover:bg-[#c9ef45] text-[#17362C] font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Truck className="w-4 h-4" />
              <span>{t('joinTodayPickupBtn')}</span>
            </button>
          </div>

          {/* Right: Visual Village Pickup Chain */}
          <div className="lg:col-span-7 bg-[#132B23] p-6 rounded-3xl border border-white/10 space-y-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-[#D9FF55]">{t('liveRouteCluster')} #MH-PUN-04</span>
                  <h3 className="text-lg font-black font-editorial text-white mt-0.5">
                    {t('todayConsolidatedRun')}
                  </h3>
                  <p className="text-xs text-white/70">
                    {t('sampleRouteDescription')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateRoute}
                    disabled={isSimulating}
                    className="px-3.5 py-2 rounded-xl bg-[#D9FF55] hover:bg-[#c9ef45] text-[#17362C] font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isSimulating ? t('truckMovingBtn') : t('simulateTruckBtn')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimulatedStop(0)}
                    className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                    title="Reset"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar of Truck Capacity */}
              <div className="mt-4 p-3 rounded-2xl bg-black/25 border border-white/10 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/80 font-semibold">{t('truckCapacityFilled')}</span>
                  <span className="text-[#D9FF55] font-black">26 MT / 30 MT (86% Consolidated)</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#3F754A] to-[#D9FF55] rounded-full transition-all duration-500 w-[86%]" />
                </div>
              </div>

              {/* Step by step village pickup nodes */}
              <div className="mt-4 space-y-2.5">
                {[
                  {
                    name: 'Farmer Balasaheb Patil (Baramati Farm)',
                    crop: 'Soybean 8 MT',
                    status: 'Loaded at 07:30 AM',
                    icon: '🚜',
                  },
                  {
                    name: 'Farmer Tukaram More (Daund Farm Gate)',
                    crop: 'Soybean 6 MT',
                    status: 'Loaded at 09:15 AM',
                    icon: '🌾',
                  },
                  {
                    name: 'Your Farm Lot (Shirur Village Collection Point)',
                    crop: `${farmerWeightTon} MT Produce Lot`,
                    status: 'Truck Arriving Next (GPS: 12 mins away)',
                    icon: '📍',
                  },
                  {
                    name: 'Sahyadri Agro Mega Food Park & Buyer Hub',
                    crop: 'Final Destination (Electronic Weighbridge)',
                    status: 'Direct Unloading & Immediate Escrow Release',
                    icon: '🏢',
                    isDestination: true,
                  },
                ].map((item, idx) => {
                  const isDone = idx < simulatedStop;
                  const isCurrent = idx === simulatedStop;
                  return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-[#244E3E] border-[#D9FF55] ring-2 ring-[#D9FF55]/30'
                        : isDone
                        ? 'bg-[#17362C] border-[#3F754A]/50 text-white/90'
                        : 'bg-black/20 border-white/10 text-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-black/40 flex items-center justify-center text-lg shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded bg-[#D9FF55] text-[#17362C] text-[9px] font-black uppercase">
                              {t('activeStatusBadge')}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-white/70 truncate">{item.crop} · {item.status}</div>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {isDone ? (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t('pickedUpStatus')}
                        </span>
                      ) : isCurrent ? (
                        <span className="text-[11px] font-black text-[#D9FF55] flex items-center gap-1 animate-pulse">
                          <Truck className="w-3.5 h-3.5" /> {t('enRouteStatus')}
                        </span>
                      ) : (
                        <span className="text-[11px] text-white/40">{t('upcomingStatus')}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>{t('cutsFuelEmissions')}</span>
              </span>
              <span className="text-[#D9FF55] font-bold">{t('transitInsurance100')}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

