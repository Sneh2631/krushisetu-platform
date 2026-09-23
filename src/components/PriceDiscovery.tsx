import React, { useState } from 'react';
import type { Crop, MandiMarket, Language, CropCategory } from '../types';
import { PRICE_COMPARISON_DATA } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';
import { formatRatePerKg, convertRateToPerKg } from '../utils/quantity';
import {
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Info,
  CheckCircle2,
  HelpCircle,
  X,
} from 'lucide-react';
import { AudioSpeechButton } from './AudioSpeechButton';
import { PRODUCT_CATALOG, PRODUCT_CATEGORIES, getCropName, getCategoryName } from '../data/productCatalog';

interface PriceDiscoveryProps {
  language?: Language;
  selectedCrop: Crop;
  onSelectCrop: (crop: Crop) => void;
  selectedMarket: MandiMarket;
  onSelectMarket: (market: MandiMarket) => void;
  onSelectBestOffer?: () => void;
}

const MARKETS_LIST: MandiMarket[] = [
  'Gondal',
  'Rajkot',
  'Surat',
  'Ahmedabad',
  'Unjha',
  'Mahuva',
  'Deesa',
  'Dholka',
];

export const PriceDiscovery: React.FC<PriceDiscoveryProps> = ({
  selectedCrop,
  onSelectCrop,
  selectedMarket,
  onSelectMarket,
  onSelectBestOffer,
}) => {
  const { t, translateCrop, translateBuyerType, translateMandi, language } = useTranslation();
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CropCategory | 'All'>('All');

  const visibleCrops = PRODUCT_CATALOG.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  // Retrieve current comparison dataset
  const currentData =
    PRICE_COMPARISON_DATA[selectedCrop]?.[selectedMarket] ||
    PRICE_COMPARISON_DATA['Onion']['Gondal'];

  const bestChannel = currentData.marketDetails.find((m) => m.isHighestNet) || currentData.marketDetails[1];

  const speechContent = `${t('priceDiscoveryTitle')}. ${t('selectCrop')}: ${translateCrop(selectedCrop)}. ${t('highestNetBadge')}: ${bestChannel.channelName}. ${t('netFarmerRealization')}: ${formatRatePerKg(convertRateToPerKg(bestChannel.netRealization), language)}. ${t('bestValueReason')}`;

  return (
    <section id="price-discovery" className="py-10 sm:py-14 bg-gradient-to-b from-[#F6F1E4] via-white to-[#F6F1E4] border-b border-[#17362C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3F754A]/10 text-[#3F754A] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gujarat Market Intelligence Matrix</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-black font-editorial text-[#132B23] tracking-tight">
            {t('priceDiscoveryTitle')}
          </h2>

          <p className="text-xs sm:text-sm text-[#132B23]/70 leading-relaxed">
            {t('priceDiscoverySubtitle')}
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            <AudioSpeechButton textToRead={speechContent} label={t('voiceListen')} />
            <button
              type="button"
              onClick={() => setShowInfoTooltip(!showInfoTooltip)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#3F754A] hover:text-[#17362C] bg-white px-2.5 py-1 rounded-lg border border-[#17362C]/15 transition-colors cursor-pointer min-h-[36px]"
              aria-label={t('infoTooltipLabel')}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('infoTooltipLabel')}</span>
            </button>
          </div>
        </div>

        {/* Net Payout Explainer Dialog / Banner if opened */}
        {showInfoTooltip && (
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#17362C] to-[#254E40] text-[#F6F1E4] p-4 sm:p-5 rounded-2xl border border-[#D9FF55]/30 shadow-lg flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#D9FF55] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-1">
                <h4 className="font-bold text-[#D9FF55]">{t('infoTooltipLabel')}</h4>
                <p className="text-[#F6F1E4]/90 leading-relaxed font-medium">
                  {t('netPayoutExplainer')}
                </p>
                <p className="text-[11px] text-[#F6F1E4]/70 pt-1">
                  Formula: Gross Offer − (APMC Mandi Cess + Loading/Handling + Distance-based Freight) = Direct In-Bank Credit.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInfoTooltip(false)}
              className="text-[#F6F1E4]/70 hover:text-white p-1"
              aria-label="Close explainer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Crop Selection Bar with Category Filters */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#132B23]/70">
              {t('selectCrop')}
            </label>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[34px] ${
                  activeCategory === 'All'
                    ? 'bg-[#17362C] text-[#D9FF55] shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {t('category.All')}
              </button>
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 min-h-[34px] ${
                    activeCategory === cat.id
                      ? 'bg-[#17362C] text-[#D9FF55] shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{getCategoryName(cat.id, language)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {visibleCrops.map((cropItem) => {
              const isSelected = selectedCrop === cropItem.id;
              const localizedCropName = getCropName(cropItem, language);
              return (
                <button
                  key={cropItem.id}
                  onClick={() => onSelectCrop(cropItem.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer min-h-[48px] ${
                    isSelected
                      ? 'bg-[#17362C] text-[#D9FF55] border-[#17362C] shadow-lg ring-2 ring-[#D9FF55]/40'
                      : 'bg-white hover:bg-gray-50 text-[#132B23] border-[#17362C]/10 shadow-sm'
                  }`}
                >
                  <span className="text-xl shrink-0">{cropItem.icon}</span>
                  <div className="min-w-0">
                    <div className={`text-xs font-black truncate leading-tight ${isSelected ? 'text-[#D9FF55]' : 'text-[#17362C]'}`}>
                      {localizedCropName}
                    </div>
                    {language !== 'en' && (
                      <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {cropItem.nameEn}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mandi Market Selection Bar */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#132B23]/70 mb-2">
            {t('selectMarket')}
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {MARKETS_LIST.map((marketName) => (
              <button
                key={marketName}
                onClick={() => onSelectMarket(marketName)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[44px] ${
                  selectedMarket === marketName
                    ? 'bg-[#3F754A] text-white border-[#3F754A] shadow-md font-bold'
                    : 'bg-white hover:bg-gray-50 text-[#132B23] border-[#17362C]/10'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF7043]" />
                <span>{translateMandi(marketName)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Highlight Banner for Highest Net Realization Channel */}
        {bestChannel && (
          <div className="bg-gradient-to-r from-[#17362C] via-[#244E3E] to-[#17362C] text-[#F6F1E4] p-5 sm:p-7 rounded-3xl border-2 border-[#D9FF55]/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9FF55]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#D9FF55] text-[#17362C] text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow">
                    {t('highestNetBadge')}
                  </span>
                  <span className="text-xs font-semibold text-[#D9FF55]">
                    {translateCrop(selectedCrop)} · {translateMandi(selectedMarket)}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black font-editorial text-white">
                  {bestChannel.channelName}
                </h3>

                <p className="text-xs sm:text-sm text-[#F6F1E4]/90 font-medium">
                  {currentData.highestNetSummary}
                </p>

                <p className="text-xs text-[#D9FF55] font-semibold">
                  💡 {t('bestValueReason')}
                </p>
              </div>

              {/* Net Payout Counter Badge */}
              <div className="flex items-center justify-between sm:justify-start gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0">
                <div>
                  <span className="text-[11px] text-[#D9FF55] block font-bold uppercase tracking-wider">
                    {t('netFarmerRealization')}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-editorial text-white">
                    {formatRatePerKg(convertRateToPerKg(bestChannel.netRealization), language)}
                  </div>
                  <span className="text-[11px] text-emerald-300 font-bold block mt-0.5">
                    +₹{((bestChannel.netRealization - currentData.marketDetails[0].netRealization) / 100).toFixed(1)}/kg vs Local APMC
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onSelectBestOffer}
                  className="px-4 py-3 rounded-xl bg-[#D9FF55] hover:bg-[#c9ef45] text-[#17362C] font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0 min-h-[48px]"
                >
                  <span>{t('viewDetailsAction')}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COMPARISON CARDS (Mobile & Desktop Responsive Grid) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#17362C] uppercase tracking-wider">
              {t('priceDiscoveryTitle')}
            </h3>
            <span className="text-xs text-[#3F754A] font-bold">
              {currentData.marketDetails.length} Competing Channels
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {currentData.marketDetails.map((market, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-5 flex flex-col justify-between transition-all duration-200 relative ${
                  market.isHighestNet
                    ? 'bg-white border-3 border-[#3F754A] shadow-xl ring-4 ring-[#D9FF55]/40'
                    : 'bg-white border border-[#17362C]/10 shadow-sm hover:shadow-md'
                }`}
              >
                {market.isHighestNet && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#3F754A] text-[#D9FF55] text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t('highestNetBadge')}</span>
                  </div>
                )}

                {/* Channel Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#17362C]/10 text-[#17362C]">
                      {translateBuyerType(market.buyerType)}
                    </span>
                    <span className="text-[11px] font-semibold text-[#132B23]/70 flex items-center gap-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF7043]" /> {market.distanceKm} km
                    </span>
                  </div>

                  <h4 className="text-base font-black font-editorial text-[#132B23] mb-1">
                    {market.channelName}
                  </h4>
                  <p className="text-[11px] text-[#132B23]/60 mb-3">{market.location}</p>

                  {/* Gross Price */}
                  <div className="bg-[#F6F1E4]/70 p-3 rounded-2xl mb-3">
                    <span className="text-[11px] text-[#132B23]/70 block font-medium">
                      {t('grossMandiPrice')}
                    </span>
                    <span className="text-xl font-black font-editorial text-[#132B23]">
                      {formatRatePerKg(convertRateToPerKg(market.grossPrice), language)}
                    </span>
                  </div>

                  {/* Fee Deductions Breakdown */}
                  <div className="space-y-1.5 text-xs text-[#132B23]/80 border-t border-b border-[#17362C]/10 py-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#132B23]/60">{t('mandiCess')}:</span>
                      <span className={market.mandiCess > 0 ? 'text-rose-600 font-semibold' : 'text-emerald-700 font-semibold'}>
                        {market.mandiCess > 0 ? `-₹${(market.mandiCess / 100).toFixed(1)}/kg` : '₹0 (Exempt)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#132B23]/60">{t('handlingFee')}:</span>
                      <span className="text-rose-600 font-semibold">-₹{(market.handlingFee / 100).toFixed(1)}/kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#132B23]/60">{t('transportCost')}:</span>
                      <span className="text-rose-600 font-semibold">-₹{(market.transportCost / 100).toFixed(1)}/kg</span>
                    </div>
                  </div>
                </div>

                {/* Net Farmer Bank Credit */}
                <div>
                  <div className="p-3.5 rounded-2xl bg-[#17362C] text-[#F6F1E4] mb-3 shadow-inner">
                    <span className="text-[10px] text-[#D9FF55] uppercase tracking-wider font-bold block">
                      {t('netFarmerRealization')}
                    </span>
                    <div className="text-2xl font-black font-editorial text-white">
                      {formatRatePerKg(convertRateToPerKg(market.netRealization), language)}
                    </div>
                    <span className="text-[10px] text-[#F6F1E4]/70 block mt-0.5">
                      {t('paymentTerms')}: {market.paymentTerm}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#132B23]/80 mb-3">
                    <span>{t('tableColReliability')}:</span>
                    <span className="font-bold text-[#3F754A]">{market.reliability}/100</span>
                  </div>

                  <button
                    type="button"
                    onClick={onSelectBestOffer}
                    className={`w-full py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[48px] cursor-pointer ${
                      market.isHighestNet
                        ? 'bg-[#D9FF55] text-[#17362C] hover:bg-[#c7f438] shadow-md font-extrabold'
                        : 'bg-[#17362C]/10 hover:bg-[#17362C]/20 text-[#17362C]'
                    }`}
                  >
                    <span>{t('viewDetailsAction')}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Historical vs Digital Market Trajectory Graph */}
        <div className="bg-white p-6 rounded-3xl border border-[#17362C]/10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
              <h4 className="text-base font-black font-editorial text-[#132B23] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#3F754A]" />
                <span>{translateCrop(selectedCrop)} {t('sevenDayTrend')}</span>
              </h4>
              <p className="text-xs text-[#132B23]/60">
                Track how direct buyers consistently trade at a ₹2.5–₹4.5/kg premium over volatile open auctions.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-[#3F754A] font-semibold">
                <span className="w-3 h-3 rounded-full bg-[#3F754A]" /> {t('institutionalOffer')}
              </span>
              <span className="flex items-center gap-1 text-[#FF7043] font-semibold">
                <span className="w-3 h-3 rounded-full bg-[#FF7043]" /> {t('processorOffer')}
              </span>
              <span className="flex items-center gap-1 text-[#78909C] font-semibold">
                <span className="w-3 h-3 rounded-full bg-[#78909C]" /> {t('grossMandiPrice')}
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 pt-6 border-b border-[#17362C]/10 pb-2">
            {currentData.sevenDayTrend.map((trend, idx) => {
              const maxVal = Math.max(...currentData.sevenDayTrend.map((t) => t.institutional)) * 1.1;
              const mandiH = (trend.mandi / maxVal) * 100;
              const instH = (trend.institutional / maxVal) * 100;
              const procH = (trend.processor / maxVal) * 100;

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Mandi Bar */}
                    <div
                      style={{ height: `${mandiH}%` }}
                      className="w-1/3 bg-[#90A4AE] rounded-t-md transition-all group-hover:bg-[#78909C]"
                      title={`APMC Mandi: ₹${trend.mandi}`}
                    />
                    {/* Processor Bar */}
                    <div
                      style={{ height: `${procH}%` }}
                      className="w-1/3 bg-[#FF7043]/80 rounded-t-md transition-all group-hover:bg-[#FF7043]"
                      title={`Food Processor: ₹${trend.processor}`}
                    />
                    {/* Institutional Bar */}
                    <div
                      style={{ height: `${instH}%` }}
                      className="w-1/3 bg-[#3F754A] rounded-t-md transition-all group-hover:bg-[#17362C]"
                      title={`Institutional Buyer: ₹${trend.institutional}`}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-[#132B23]/70">
                    {trend.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
