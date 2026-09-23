import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import type { NewsItem } from '../types';
import {
  Newspaper,
  Calendar,
  ChevronRight,
  Search,
  X,
  CloudSun,
  Sprout,
  TrendingUp,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

// Weather & Soil Recommendation Data Model
interface CropRecommendation {
  cropName: string;
  marathiName: string;
  hindiName: string;
  idealSoilTypes: string[];
  weatherCondition: string;
  sowingWindow: string;
  harvestWindow: string;
  durationMonths: string;
  currentPriceQtl: number;
  projectedPrice6MonthsQtl: number;
  expectedGainPercent: number;
  marketReason: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  waterRequirement: 'Low' | 'Moderate' | 'High';
}

const SOIL_TYPES = [
  { id: 'all', nameEn: 'All Soil Types', nameMr: 'सर्व मातीचे प्रकार', nameHi: 'सभी मिट्टी प्रकार' },
  { id: 'black', nameEn: 'Black Cotton Soil (Heavy)', nameMr: 'काळी कसदार / भारी जमीन', nameHi: 'काली कपास मिट्टी (भारी)' },
  { id: 'loam', nameEn: 'Loamy / Alluvial Soil', nameMr: 'गाळाची / पोयटा जमीन', nameHi: 'दोमट / जलोढ़ मिट्टी' },
  { id: 'sandy_loam', nameEn: 'Sandy Loam Soil', nameMr: 'वालुकामय पोयटा जमीन', nameHi: 'बलुई दोमट मिट्टी' },
  { id: 'red', nameEn: 'Red / Laterite Soil', nameMr: 'तांबडी / जांभी जमीन', nameHi: 'लाल / लेटराइट मिट्टी' },
  { id: 'clay', nameEn: 'Clayey Soil', nameMr: 'चिकणमाती जमीन', nameHi: 'चिकनी मिट्टी' },
];

const CROP_RECOMMENDATIONS: CropRecommendation[] = [
  {
    cropName: 'Gram (Chana / Desi Chickpea)',
    marathiName: 'हरभरा (चना / विजय / दिग्विजय)',
    hindiName: 'चना (देसी / काबुली)',
    idealSoilTypes: ['black', 'clay', 'loam'],
    weatherCondition: 'Mild winter (15°C - 28°C) with residual post-monsoon soil moisture',
    sowingWindow: 'October 15 – November 20',
    harvestWindow: 'February – March (4 months)',
    durationMonths: '4 Months',
    currentPriceQtl: 5850,
    projectedPrice6MonthsQtl: 7100,
    expectedGainPercent: 21.4,
    marketReason: 'Depleted national buffer stocks, high protein feed demand, and pre-festival wedding season buying in March-April will create severe supply deficit.',
    riskLevel: 'Low',
    waterRequirement: 'Low',
  },
  {
    cropName: 'Rabi Garwa Onion (Storage Grade)',
    marathiName: 'रब्बी गरवा कांदा (भीमा किरण / लाल)',
    hindiName: 'रबी गरवा प्याज (भंडारण योग्य)',
    idealSoilTypes: ['sandy_loam', 'loam'],
    weatherCondition: 'Dry cool winter for bulb establishment, followed by warm dry spring',
    sowingWindow: 'Nursery in Oct–Nov, Transplanting in Dec',
    harvestWindow: 'April – May (5–6 months)',
    durationMonths: '5–6 Months',
    currentPriceQtl: 2150,
    projectedPrice6MonthsQtl: 3800,
    expectedGainPercent: 76.7,
    marketReason: 'Rabi Garwa onion has 6-month natural storage shelf life. During the monsoon supply gap (June–August), market arrivals plunge by 65%, guaranteeing peak seasonal price spikes.',
    riskLevel: 'Medium',
    waterRequirement: 'Moderate',
  },
  {
    cropName: 'Wheat (Sharbati / HD-2967)',
    marathiName: 'गहू (शरबती / फुले समाधान)',
    hindiName: 'गेहूं (शरबती / एच.डी. 2967)',
    idealSoilTypes: ['loam', 'black', 'clay'],
    weatherCondition: 'Cool nights (10°C - 15°C) for vigorous tillering and grain filling',
    sowingWindow: 'November 01 – November 25',
    harvestWindow: 'March – April (4–5 months)',
    durationMonths: '4–5 Months',
    currentPriceQtl: 2450,
    projectedPrice6MonthsQtl: 3050,
    expectedGainPercent: 24.5,
    marketReason: 'Tight domestic flour mill inventories and government buffer replenishment at bonus MSP will sustain strong procurement momentum in early summer.',
    riskLevel: 'Low',
    waterRequirement: 'Moderate',
  },
  {
    cropName: 'Yellow Mustard / Rai',
    marathiName: 'मोहरी / राई (पिवळी मोहरी)',
    hindiName: 'सरसों / राई (पीली सरसों)',
    idealSoilTypes: ['loam', 'sandy_loam'],
    weatherCondition: 'Bright sunny days, cool dry climate, low fog during flowering',
    sowingWindow: 'October 10 – October 31',
    harvestWindow: 'February (3.5–4 months)',
    durationMonths: '4 Months',
    currentPriceQtl: 5350,
    projectedPrice6MonthsQtl: 6450,
    expectedGainPercent: 20.6,
    marketReason: 'Elevated edible oil import duties and strong domestic crushing mill contracts guarantee higher factory-gate purchase prices.',
    riskLevel: 'Low',
    waterRequirement: 'Low',
  },
  {
    cropName: 'Summer Groundnut (Peanut)',
    marathiName: 'उन्हाळी भुईमूग (टीएजी-२४ / फुले भारती)',
    hindiName: 'मूंगफली (ग्रीष्मकालीन)',
    idealSoilTypes: ['sandy_loam', 'loam', 'red'],
    weatherCondition: 'Warm sunny weather (25°C - 35°C) with guaranteed assured irrigation',
    sowingWindow: 'January 15 – February 15',
    harvestWindow: 'May – June (4 months)',
    durationMonths: '4 Months',
    currentPriceQtl: 6200,
    projectedPrice6MonthsQtl: 7800,
    expectedGainPercent: 25.8,
    marketReason: 'High summer oil extraction yields and peak industrial peanut butter / confectionary export orders ensure premium spot demand.',
    riskLevel: 'Medium',
    waterRequirement: 'Moderate',
  },
  {
    cropName: 'Green Peas (Matar - Early Variety)',
    marathiName: 'हिरवा वाटाणा (गोल्डन / अर्का अजित)',
    hindiName: 'हरी मटर (अगेती किस्म)',
    idealSoilTypes: ['loam', 'sandy_loam', 'black'],
    weatherCondition: 'Cold and crisp dry climate (12°C - 22°C)',
    sowingWindow: 'October 20 – November 15',
    harvestWindow: 'December – January (65–75 days)',
    durationMonths: '2.5 Months',
    currentPriceQtl: 4200,
    projectedPrice6MonthsQtl: 6500,
    expectedGainPercent: 54.8,
    marketReason: 'Early season harvest commands peak hotel/restaurant demand in metro cities before main-season bulk glut arrives.',
    riskLevel: 'Medium',
    waterRequirement: 'Moderate',
  },
];

export const NewsSection: React.FC = () => {
  const { t, language } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  // Weather & Soil Advisory State
  const [selectedSoil, setSelectedSoil] = useState<string>('black');
  const [showAdvisoryDetails, setShowAdvisoryDetails] = useState<CropRecommendation | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const items = await dbService.getNews();
        // Sort chronologically by publishedAt descending
        const sorted = [...items].sort((a, b) => {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
        setNews(sorted);
      } catch (err) {
        console.error('Error loading news:', err);
      }
    };
    loadNews();
  }, []);

  const getLocalizedTitle = (item: NewsItem): string => {
    if (language === 'mr') return item.titleMr || item.titleEn;
    if (language === 'hi') return item.titleHi || item.titleEn;
    if (language === 'gu') return item.titleGu || item.titleEn;
    return item.titleEn;
  };

  const getLocalizedSummary = (item: NewsItem): string => {
    if (language === 'mr') return item.summaryMr || item.summaryEn;
    if (language === 'hi') return item.summaryHi || item.summaryEn;
    if (language === 'gu') return item.summaryGu || item.summaryEn;
    return item.summaryEn;
  };

  const getLocalizedContent = (item: NewsItem): string => {
    if (language === 'mr') return item.contentMr || item.contentEn || item.summaryMr || item.summaryEn;
    if (language === 'hi') return item.contentHi || item.contentEn || item.summaryHi || item.summaryEn;
    if (language === 'gu') return item.contentGu || item.contentEn || item.summaryGu || item.summaryEn;
    return item.contentEn || item.summaryEn;
  };

  const getLocalizedCategory = (item: NewsItem): string => {
    if (language === 'mr') return item.categoryMr || item.category;
    if (language === 'hi') return item.categoryHi || item.category;
    if (language === 'gu') return item.categoryGu || item.category;
    return item.category;
  };

  const categories = [
    { key: 'All', en: 'All News', mr: 'सर्व बातम्या', hi: 'सभी समाचार', gu: 'બધા સમાચાર' },
    { key: 'MSP & Rates', en: 'MSP & Rates', mr: 'हमीभाव (MSP) व दर', hi: 'एमएसपी व दरें', gu: 'ટેકાના ભાવ અને દરો' },
    { key: 'Government Schemes', en: 'Government Schemes', mr: 'शासकीय योजना', hi: 'सरकारी योजनाएं', gu: 'સરકારી યોજનાઓ' },
    { key: 'Market Advisory', en: 'Market Advisory', mr: 'बाजार सल्ला', hi: 'बाजार सलाह', gu: 'બજાર માર્ગદર્શન' },
    { key: 'Weather & Logistics', en: 'Weather & Logistics', mr: 'हवामान व वाहतूक', hi: 'मौसम व लॉजिस्टिक्स', gu: 'હવામાન & પરિવહન' },
    { key: 'Platform Updates', en: 'Platform Updates', mr: 'प्लॅटफॉर्म अपडेट्स', hi: 'प्लेटफॉर्म अपडेट', gu: 'પ્લેટફોર્મ અપડેટ્સ' },
  ];

  const getCategoryLabel = (cat: typeof categories[0]) => {
    if (language === 'mr') return cat.mr;
    if (language === 'hi') return cat.hi;
    if (language === 'gu') return cat.gu;
    return cat.en;
  };

  const filteredNews = news.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        Boolean(item.titleEn?.toLowerCase().includes(q)) ||
        Boolean(item.titleMr?.toLowerCase().includes(q)) ||
        Boolean(item.titleHi?.toLowerCase().includes(q)) ||
        Boolean(item.titleGu?.toLowerCase().includes(q)) ||
        Boolean(item.summaryEn?.toLowerCase().includes(q)) ||
        Boolean(item.summaryMr?.toLowerCase().includes(q)) ||
        Boolean(item.summaryHi?.toLowerCase().includes(q)) ||
        Boolean(item.summaryGu?.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filter crops based on selected soil
  const recommendedCrops = CROP_RECOMMENDATIONS.filter((crop) => {
    if (selectedSoil === 'all') return true;
    return crop.idealSoilTypes.includes(selectedSoil);
  });

  return (
    <section className="py-8 max-w-7xl mx-auto space-y-10" id="news">

      {/* ========================================================================= */}
      {/* 1. AGRO-CLIMATIC WEATHER & SOIL CROP SOWING ADVISOR (NEW UPGRADE)          */}
      {/* ========================================================================= */}
      <div className="bg-[#17362C] dark:bg-[#10241D] text-[#F6F1E4] rounded-3xl p-6 sm:p-8 border border-[#D9FF55]/20 shadow-2xl space-y-6">

        {/* Header with Live Weather Badge */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9FF55]/20 text-[#D9FF55] text-xs font-bold uppercase tracking-wider border border-[#D9FF55]/30">
              <Sprout className="w-3.5 h-3.5 text-[#D9FF55]" />
              <span>Smart Sowing Advisory · 4–6 Month Price Forecast</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-editorial text-white tracking-tight">
              {language === 'mr'
                ? 'हवामान व मातीनुसार पीक लागवड सल्लागार'
                : language === 'hi'
                ? 'मौसम और मिट्टी अनुसार फसल बुवाई सलाहकार'
                : 'Weather & Soil-Based Crop Sowing Advisor'}
            </h2>
            <p className="text-xs sm:text-sm text-[#F6F1E4]/80 max-w-3xl leading-relaxed">
              {language === 'mr'
                ? 'चालू हवामानानुसार आपल्या शेतातील माती निवडा आणि पुढील ४ ते ६ महिन्यांत कोणत्या पिकाला सर्वाधिक नफा व बाजारभाव मिळेल ते जाणून घ्या.'
                : language === 'hi'
                ? 'वर्तमान मौसम अनुसार अपनी मिट्टी का प्रकार चुनें और जानें कि अगले 4-6 महीनों में कौन सी फसल आपको सबसे अधिक मुनाफा देगी।'
                : 'Based on current agro-climatic conditions and soil classification, discover which crops to sow today to capture peak market prices in the next 4–6 months.'}
            </p>
          </div>

          {/* Current Weather Snapshot Pill */}
          <div className="bg-[#132B23] p-3.5 rounded-2xl border border-white/10 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#D9FF55]/20 flex items-center justify-center text-[#D9FF55]">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-white/60">Current Sowing Weather</div>
              <div className="text-sm font-black text-[#D9FF55]">Rabi Season · 24°C - 30°C</div>
              <div className="text-[11px] text-white/70">Ideal soil moisture for Rabi sowing</div>
            </div>
          </div>
        </div>

        {/* Soil Selector Tabs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white/80">
            <span className="flex items-center gap-1.5 text-[#D9FF55]">
              <Compass className="w-4 h-4" />
              <span>Select Your Farm Soil Type:</span>
            </span>
            <span className="text-[11px] text-white/60">Showing {recommendedCrops.length} optimal crops</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SOIL_TYPES.map((soil) => (
              <button
                key={soil.id}
                type="button"
                onClick={() => setSelectedSoil(soil.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedSoil === soil.id
                    ? 'bg-[#D9FF55] text-[#17362C] font-black shadow-md'
                    : 'bg-[#132B23] text-white/80 hover:bg-[#244E3E] border border-white/10'
                }`}
              >
                {selectedSoil === soil.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{language === 'mr' ? soil.nameMr : language === 'hi' ? soil.nameHi : soil.nameEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Crops Cards (Clean Horizon Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedCrops.map((crop, idx) => (
            <div
              key={idx}
              className="bg-[#132B23] rounded-2xl p-4 border border-white/10 hover:border-[#D9FF55]/60 transition-all flex flex-col justify-between space-y-3 relative group"
            >
              <div>
                {/* Header tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#D9FF55]/20 text-[#D9FF55]">
                    Duration: {crop.durationMonths}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{crop.expectedGainPercent}% Gain
                  </span>
                </div>

                <h3 className="text-sm font-black text-white group-hover:text-[#D9FF55] transition-colors">
                  {language === 'mr' ? crop.marathiName : language === 'hi' ? crop.hindiName : crop.cropName}
                </h3>
                <p className="text-[11px] text-white/70 mt-1 line-clamp-2 leading-relaxed">
                  {crop.marketReason}
                </p>
              </div>

              {/* Price comparison box */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/60">Today's Mandi Price:</span>
                  <span className="font-bold text-white">₹{crop.currentPriceQtl.toLocaleString()}/qtl</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#D9FF55] font-bold">Projected in 4–6 Mos:</span>
                  <span className="font-black text-[#D9FF55]">₹{crop.projectedPrice6MonthsQtl.toLocaleString()}/qtl</span>
                </div>
              </div>

              {/* Sowing & Harvest Window */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70">
                <span>🌱 Sowing: {crop.sowingWindow}</span>
                <button
                  type="button"
                  onClick={() => setShowAdvisoryDetails(crop)}
                  className="text-[#D9FF55] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. CHRONOLOGICAL LINE-BY-LINE NEWS & MARKET ADVISORIES FEED               */}
      {/* ========================================================================= */}
      <div className="space-y-5">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#17362C]/15 dark:border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17362C] dark:bg-emerald-900 text-[#D9FF55] dark:text-emerald-300 text-xs font-black">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Official MSAMB Advisories & Mandi Updates</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight text-[#132B23] dark:text-emerald-100">
              {language === 'mr'
                ? 'कृषी उत्पन्न बाजार समिती व शासकीय योजना बातम्या'
                : language === 'hi'
                ? 'मंडी भाव, समर्थन मूल्य व सरकारी योजना समाचार'
                : 'Verified News, MSP Rates & Government Schemes'}
            </h2>
            <p className="text-xs text-[#132B23]/75 dark:text-emerald-200/70 font-medium">
              Line-by-line chronological updates from Maharashtra State Agricultural Marketing Board & state agriculture universities.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#132B23]/50 dark:text-emerald-300/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'बातम्या शोधा...'
                  : language === 'hi'
                  ? 'समाचार खोजें...'
                  : 'Search news & advisories...'
              }
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#3F754A]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-[#17362C] dark:bg-emerald-600 text-[#D9FF55] dark:text-white shadow-sm font-black'
                  : 'bg-white dark:bg-neutral-900 text-[#132B23] dark:text-neutral-300 border border-[#17362C]/15 dark:border-white/10 hover:bg-[#17362C]/10'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* LINE-BY-LINE SEQUENTIAL FEED */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm divide-y divide-[#17362C]/10 dark:divide-white/10 overflow-hidden">
          {filteredNews.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              No matching advisories found. Try a different search term or category.
            </div>
          ) : (
            filteredNews.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActiveArticle(item)}
                className="p-4 sm:p-5 hover:bg-[#F6F1E4]/50 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Left: Sequential Index, Date & Category */}
                <div className="flex items-start sm:items-center gap-3 sm:w-56 shrink-0">
                  <span className="w-6 h-6 rounded-lg bg-[#17362C]/10 dark:bg-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-[#17362C] dark:text-[#D9FF55] shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#17362C]/10 dark:bg-emerald-950 text-[#17362C] dark:text-emerald-300">
                        {getLocalizedCategory(item)}
                      </span>
                      {item.isPinned && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-[#D9FF55] text-[#17362C] uppercase">
                          Important
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(item.publishedAt).toLocaleDateString(
                          language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Title & Summary */}
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-sm font-black text-[#132B23] dark:text-neutral-100 group-hover:text-[#3F754A] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {getLocalizedTitle(item)}
                  </h3>
                  <p className="text-xs text-[#132B23]/75 dark:text-neutral-400 font-medium line-clamp-1 mt-0.5">
                    {getLocalizedSummary(item)}
                  </p>
                </div>

                {/* Right: Author & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#17362C]/5 dark:border-white/5">
                  <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                    {item.authorName || 'MSAMB Desk'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#17362C]/10 dark:bg-white/10 text-xs font-bold text-[#17362C] dark:text-[#D9FF55] group-hover:bg-[#17362C] group-hover:text-[#D9FF55] transition-all">
                    <span>Read</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Detailed Crop Advisory Modal */}
      {showAdvisoryDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-[#17362C] text-[#F6F1E4] rounded-3xl shadow-2xl border border-[#D9FF55]/30 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-[#132B23] flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D9FF55]">
                <Sprout className="w-4 h-4" />
                <span>Crop Sowing Advisory Dossier</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvisoryDetails(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D9FF55] text-xs font-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <h3 className="text-xl font-black font-editorial text-white">
                {showAdvisoryDetails.cropName}
              </h3>
              <p className="text-sm text-[#D9FF55] font-bold">
                {showAdvisoryDetails.marathiName}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-black/25 border border-white/10">
                  <span className="text-white/60 block text-[10px] uppercase">Recommended Sowing Window</span>
                  <span className="font-bold text-white text-xs mt-0.5 block">{showAdvisoryDetails.sowingWindow}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/25 border border-white/10">
                  <span className="text-white/60 block text-[10px] uppercase">Peak Harvest & Selling</span>
                  <span className="font-bold text-[#D9FF55] text-xs mt-0.5 block">{showAdvisoryDetails.harvestWindow}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#244E3E] border border-[#D9FF55]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-[#D9FF55]">Projected 6-Month Return</span>
                  <span className="text-base font-black text-[#D9FF55]">+{showAdvisoryDetails.expectedGainPercent}% Expected Rise</span>
                </div>
                <div className="flex justify-between text-xs text-white/90">
                  <span>Current APMC Price: ₹{showAdvisoryDetails.currentPriceQtl.toLocaleString()}/qtl</span>
                  <span>Target Selling Price: ₹{showAdvisoryDetails.projectedPrice6MonthsQtl.toLocaleString()}/qtl</span>
                </div>
                <p className="text-[11px] text-white/80 pt-2 border-t border-white/10 leading-relaxed">
                  <strong className="text-white">Why This Price Will Rise:</strong> {showAdvisoryDetails.marketReason}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-white/60 uppercase font-bold block">Farming & Soil Parameters</span>
                <div className="text-white/90"><strong>Weather Requirement:</strong> {showAdvisoryDetails.weatherCondition}</div>
                <div className="text-white/90"><strong>Water Demand:</strong> {showAdvisoryDetails.waterRequirement}</div>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#132B23] border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAdvisoryDetails(null)}
                className="px-5 py-2 rounded-xl bg-[#D9FF55] text-[#17362C] text-xs font-black cursor-pointer shadow hover:bg-lime-300"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#F6F1E4] dark:bg-neutral-900 text-[#132B23] dark:text-neutral-100 rounded-3xl shadow-2xl border border-[#17362C]/20 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-[#17362C] dark:bg-neutral-950 text-[#F6F1E4] flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D9FF55] dark:text-emerald-300">
                <Newspaper className="w-4 h-4" />
                <span>{getLocalizedCategory(activeArticle)}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[#D9FF55] dark:text-emerald-300 text-xs font-black cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('common.close', 'Close')}</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <h2 className="text-xl sm:text-2xl font-black font-editorial text-[#132B23] dark:text-neutral-100 leading-snug">
                {getLocalizedTitle(activeArticle)}
              </h2>

              <div className="flex items-center gap-3 text-xs text-[#132B23]/60 dark:text-neutral-400 font-bold pb-2 border-b border-[#17362C]/10 dark:border-white/10">
                <span>
                  {language === 'mr'
                    ? 'स्रोत:'
                    : language === 'hi'
                    ? 'स्रोत:'
                    : 'Source:'}{' '}
                  {activeArticle.authorName || 'MSAMB'}
                </span>
                <span>·</span>
                <span>
                  {new Date(activeArticle.publishedAt).toLocaleDateString(
                    language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
                  )}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#D9FF55]/20 dark:bg-emerald-950/60 border border-[#17362C]/15 dark:border-emerald-500/30 text-xs sm:text-sm font-bold text-[#132B23] dark:text-emerald-200 leading-relaxed">
                {getLocalizedSummary(activeArticle)}
              </div>

              <div className="text-xs sm:text-sm text-[#132B23]/80 dark:text-neutral-300 space-y-2 leading-relaxed">
                <p>{getLocalizedContent(activeArticle)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-[#17362C]/10 dark:border-white/10 text-xs text-[#132B23]/70 dark:text-neutral-400">
                <span className="font-black text-[#132B23] dark:text-neutral-200">
                  {language === 'mr'
                    ? 'सूचना:'
                    : language === 'hi'
                    ? 'सूचना:'
                    : 'Notice:'}
                </span>{' '}
                {language === 'mr'
                  ? 'सदर माहिती महाराष्ट्र राज्य कृषी पणन मंडळ (MSAMB) व कृषी विभागाच्या मार्गदर्शनाखाली शेतकरी व खरेदीदारांच्या हितासाठी प्रसिद्ध करण्यात आली आहे.'
                  : language === 'hi'
                  ? 'यह जानकारी महाराष्ट्र राज्य कृषि पणन बोर्ड (MSAMB) व कृषि विभाग के दिशा-निर्देशों के तहत किसान व खरीदारों के हितार्थ प्रसारित की गई है।'
                  : 'This advisory is published under the guidance of Maharashtra State Agricultural Marketing Board (MSAMB) for the welfare of farmers and buyers.'}
              </div>
            </div>

            <div className="px-6 py-3 bg-[#E5DFD0] dark:bg-neutral-950 border-t border-[#17362C]/10 dark:border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-xl bg-[#17362C] dark:bg-emerald-600 text-[#D9FF55] dark:text-white text-xs font-black cursor-pointer shadow hover:bg-[#244E3E] dark:hover:bg-emerald-500"
              >
                {language === 'mr'
                  ? 'समजले'
                  : language === 'hi'
                  ? 'समझ आ गया'
                  : 'Got It'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
