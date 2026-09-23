import React, { useState } from 'react';
import type { StorageFacility, Crop, Language } from '../types';
import { STORAGE_FACILITIES } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';
import {
  ShieldCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { AudioSpeechButton } from './AudioSpeechButton';

interface StorageAdvisorProps {
  language?: Language;
  selectedCrop: Crop;
}

export const StorageAdvisor: React.FC<StorageAdvisorProps> = ({
  selectedCrop,
}) => {
  const { t, translateCrop } = useTranslation();
  const [lotQuantityTon, setLotQuantityTon] = useState<number>(10);
  const [holdDays, setHoldDays] = useState<number>(3);
  const [selectedStorageId, setSelectedStorageId] = useState<string>('STORE-GJ-01');

  const selectedFacility: StorageFacility =
    STORAGE_FACILITIES.find((s) => s.id === selectedStorageId) || STORAGE_FACILITIES[0];

  // Calculation Logic (Per Ton = 1000 kg):
  const expectedGrossGainPerTon = holdDays * 1100;
  const storageCostPerTon = holdDays * (selectedFacility.ratePerQtlPerDay * 10);
  const netGainPerTon = expectedGrossGainPerTon - storageCostPerTon;
  const totalNetGainRupees = Math.round(netGainPerTon * lotQuantityTon);

  const speechText = `${t('storageTitle')}. ${t('storageSubtitle')}. Estimated net benefit of holding ${lotQuantityTon} tonnes for ${holdDays} days is ₹${totalNetGainRupees.toLocaleString()}.`;

  return (
    <section id="storage" className="py-10 sm:py-14 bg-gradient-to-b from-[#F6F1E4] via-white to-[#F6F1E4] border-b border-[#17362C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3F754A]/10 text-[#3F754A] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('wdraColdChainBadge')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-editorial text-[#132B23] tracking-tight">
            {t('storageTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#132B23]/70 leading-relaxed">
            {t('storageSubtitle')}
          </p>
          <div className="pt-1">
            <AudioSpeechButton textToRead={speechText} label={t('voiceListen')} />
          </div>
        </div>

        {/* Sell Today vs Store Calculator Box */}
        <div className="bg-[#17362C] text-[#F6F1E4] p-6 sm:p-8 rounded-3xl shadow-2xl border border-[#D9FF55]/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Input Controls */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9FF55] block">
                {t('dynamicDecisionCalc')}
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-editorial text-white">
                {t('sellTodayVsHold')}
              </h3>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-[#F6F1E4]/80 font-semibold mb-1">
                    {t('yourLotSizeLabel', { unit: t('unitTonne') })}
                  </label>
                  <input
                    type="number"
                    value={lotQuantityTon}
                    onChange={(e) => setLotQuantityTon(Number(e.target.value))}
                    min={1}
                    className="w-full bg-[#132B23] border border-[#D9FF55]/40 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#D9FF55] min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#F6F1E4]/80 font-semibold mb-1">
                    {t('holdingDurationLabel')}
                  </label>
                  <select
                    value={holdDays}
                    onChange={(e) => setHoldDays(Number(e.target.value))}
                    className="w-full bg-[#132B23] border border-[#D9FF55]/40 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#D9FF55] min-h-[44px]"
                  >
                    <option value={2}>{t('option2Days')}</option>
                    <option value={3}>{t('option3Days')}</option>
                    <option value={5}>{t('option5Days')}</option>
                    <option value={7}>{t('option7Days')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#F6F1E4]/80 font-semibold mb-1">
                  {t('selectWdraFacility')}
                </label>
                <select
                  value={selectedStorageId}
                  onChange={(e) => setSelectedStorageId(e.target.value)}
                  className="w-full bg-[#132B23] border border-[#D9FF55]/40 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-[#D9FF55] min-h-[44px]"
                >
                  {STORAGE_FACILITIES.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name} (₹{(facility.ratePerQtlPerDay * 10).toFixed(0)}/tonne/day) · {facility.district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Profit Output */}
            <div className="lg:col-span-6 bg-[#132B23]/90 backdrop-blur-md p-6 rounded-3xl border border-[#D9FF55]/40 flex flex-col justify-between space-y-4 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9FF55]">
                  {t('valueGained')}
                </span>
                <div className="text-3xl sm:text-4xl font-black font-editorial text-[#D9FF55]">
                  +₹{totalNetGainRupees.toLocaleString()}
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  {t('storageFeePaidDesc', {
                    fee: (storageCostPerTon * lotQuantityTon).toLocaleString(),
                    qty: `${lotQuantityTon} ${t('unitTonne')}`,
                    crop: translateCrop(selectedCrop),
                  })}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[#88D998] font-bold">{t('wdraInsuredCoverage')}</span>
                <button
                  type="button"
                  onClick={() => alert(`Storage space pre-booked at ${selectedFacility.name} for ${lotQuantityTon} ${t('unitTonne')} of ${translateCrop(selectedCrop)}!`)}
                  className="px-4 py-2.5 rounded-xl bg-[#D9FF55] text-[#17362C] font-extrabold text-xs shadow hover:bg-[#c9ef45] transition-all min-h-[44px] cursor-pointer"
                >
                  {t('bookStorageBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STORAGE_FACILITIES.map((fac) => (
            <div
              key={fac.id}
              onClick={() => setSelectedStorageId(fac.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedStorageId === fac.id
                  ? 'bg-white border-2 border-[#17362C] shadow-lg ring-2 ring-[#D9FF55]'
                  : 'bg-white/80 border-gray-200 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#3F754A]/10 text-[#3F754A] px-2 py-0.5 rounded-md">
                    {fac.type}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-[#FF7043]" /> {fac.distanceKm} km
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#132B23] mb-1">{fac.name}</h4>
                <p className="text-xs text-gray-500 mb-3">{fac.district} Cluster</p>

                <div className="space-y-1.5 text-xs text-gray-700 bg-[#F6F1E4]/60 p-3 rounded-xl mb-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('storageRateLabel')}</span>
                    <span className="font-bold text-[#17362C]">₹{(fac.ratePerQtlPerDay * 10).toFixed(0)}/tonne/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('availableCapacity')}:</span>
                    <span className="font-semibold text-emerald-700">{fac.availableCapacityMt} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('storageTempLabel')}</span>
                    <span className="font-mono text-gray-600">{fac.temperatureRange}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-bold text-[#3F754A] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('wdraCertifiedInsured')}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};