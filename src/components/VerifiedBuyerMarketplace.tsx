import React, { useState } from 'react';
import type { BuyerProfile, Crop, CropCategory, Language } from '../types';
import { BUYER_PROFILES } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowUpRight,
  Search,
} from 'lucide-react';
import { AudioSpeechButton } from './AudioSpeechButton';
import { PRODUCT_CATEGORIES, getProductById, getCategoryName, getCropName } from '../data/productCatalog';

import {
  formatRatePerKg,
  convertRateToPerKg,
  formatQuantity,
  parseLegacyQuantity,
} from '../utils/quantity';

interface VerifiedBuyerMarketplaceProps {
  language?: Language;
  selectedCrop: Crop;
  onSelectBuyerForContract: (buyer: BuyerProfile) => void;
}

export const VerifiedBuyerMarketplace: React.FC<VerifiedBuyerMarketplaceProps> = ({
  selectedCrop: _selectedCrop,
  onSelectBuyerForContract,
}) => {
  const { t, translateBuyerType, translateCrop, language } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<CropCategory | 'All'>('All');
  const [buyerTypeFilter, setBuyerTypeFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter buyers based on crop, category, type, and search
  const filteredBuyers = BUYER_PROFILES.filter((buyer) => {
    const catalogItem = getProductById(buyer.requiredCrop);
    const matchesCategory =
      selectedCategory === 'All' || (catalogItem && catalogItem.category === selectedCategory);
    const matchesType = buyerTypeFilter === 'All' || buyer.buyerType === buyerTypeFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      buyer.company.toLowerCase().includes(q) ||
      buyer.name.toLowerCase().includes(q) ||
      buyer.district.toLowerCase().includes(q) ||
      buyer.requiredCrop.toLowerCase().includes(q) ||
      (catalogItem && catalogItem.nameGu.toLowerCase().includes(q)) ||
      (catalogItem && catalogItem.nameEn.toLowerCase().includes(q));

    return matchesCategory && matchesType && matchesSearch;
  });

  const speechText = `${t('marketplaceTitle')}. ${t('marketplaceSubtitle')}`;

  return (
    <section id="marketplace" className="py-10 sm:py-14 bg-gradient-to-b from-[#F6F1E4] via-white to-[#F6F1E4] border-b border-[#17362C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3F754A]/10 text-[#3F754A] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('gujaratVerifiedBuyerPool')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-editorial text-[#132B23] tracking-tight">
            {t('marketplaceTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[#132B23]/70 leading-relaxed">
            {t('marketplaceSubtitle')}
          </p>
          <div className="pt-1">
            <AudioSpeechButton textToRead={speechText} label={t('voiceListen')} />
          </div>
        </div>

        {/* Filter Controls Bar: Categories & Buyer Types */}
        <div className="bg-white p-4 rounded-3xl border border-[#17362C]/10 shadow-sm space-y-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-100 pb-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[36px] ${
                selectedCategory === 'All'
                  ? 'bg-[#17362C] text-[#D9FF55] shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('categoryAll')}
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
                  selectedCategory === cat.id
                    ? 'bg-[#17362C] text-[#D9FF55] shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{getCategoryName(cat.id, language)}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            {/* Buyer Type Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {['All', 'Food Processor', 'Institutional', 'Exporter', 'Retail Chain'].map((type) => (
                <button
                  key={type}
                  onClick={() => setBuyerTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[36px] ${
                    buyerTypeFilter === type
                      ? 'bg-[#3F754A] text-white shadow-sm font-extrabold'
                      : 'bg-[#F6F1E4] text-[#132B23] hover:bg-[#17362C]/10'
                  }`}
                >
                  {type === 'All' ? t('allBuyerTypes') : translateBuyerType(type)}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="w-full sm:w-80 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchBuyerCropPlaceholder')}
                className="w-full bg-[#F6F1E4] border border-[#17362C]/15 rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#132B23] focus:outline-none focus:border-[#3F754A] min-h-[38px]"
              />
            </div>
          </div>
        </div>

        {/* Buyers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuyers.map((buyer) => {
            const catalogItem = getProductById(buyer.requiredCrop);
            const icon = catalogItem?.icon || '🌱';

            return (
              <div
                key={buyer.id}
                className="bg-white rounded-3xl border border-[#17362C]/10 shadow-sm hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* Header with Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#3F754A]/10 text-[#3F754A]">
                          {translateBuyerType(buyer.buyerType)}
                        </span>
                        {buyer.escrowProtected && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> {t('escrowProtectedBadge')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black font-editorial text-[#132B23] group-hover:text-[#3F754A] transition-colors">
                        {buyer.company}
                      </h3>
                      <p className="text-xs text-[#132B23]/70">{buyer.name}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 block">{t('offeredRateLabel')}</span>
                      <span className="text-base font-black font-editorial text-[#17362C]">
                        {formatRatePerKg(convertRateToPerKg(buyer.offeredPrice), language)}
                      </span>
                    </div>
                  </div>

                  {/* Requirement Specifications */}
                  <div className="bg-[#F6F1E4]/70 p-3.5 rounded-2xl space-y-2 text-xs mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t('produceType')}:</span>
                      <div className="font-bold text-[#17362C] flex items-center gap-1.5">
                        <span>{icon}</span>
                        <span>{catalogItem ? getCropName(catalogItem, language) : translateCrop(buyer.requiredCrop)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('quantity')}:</span>
                      <span className="font-bold text-[#17362C]">
                        {formatQuantity(parseLegacyQuantity(buyer.requiredQuantity), language)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('qualityGrade')}:</span>
                      <span className="font-semibold text-emerald-800">{buyer.qualitySpec}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('deliveryLocationLabel')}</span>
                      <span className="font-semibold text-[#17362C]">{buyer.deliveryLocation}</span>
                    </div>
                  </div>
                </div>

              {/* Reliability & Action */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-gray-500 block">{t('reliabilityScore')}</span>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#FF7043]" />
                    <span className="text-xs font-black text-[#17362C]">
                      {buyer.reliabilityScore}/100
                    </span>
                    <span className="text-[10px] text-gray-400">({buyer.completedDeals} {t('dealsLabel')})</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBuyerForContract(buyer)}
                  className="py-2.5 px-4 rounded-xl bg-[#17362C] hover:bg-[#244e3e] text-[#D9FF55] font-extrabold text-xs flex items-center gap-1.5 transition-all shadow min-h-[44px] cursor-pointer"
                >
                  <span>{t('sendOffer')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
        </div>

      </div>
    </section>
  );
};
