import React, { useState } from 'react';
import type { Crop, Language, PriceForecast } from '../types';
import { PRICE_FORECASTS } from '../data/mockData';
import { useTranslation } from '../i18n/useTranslation';
import {
  Brain,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Scale,
  Package,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { AudioSpeechButton } from './AudioSpeechButton';
import { convertRateToPerKg, formatRatePerKg } from '../utils/quantity';

interface PriceForecastEngineProps {
  language?: Language;
  selectedCrop: Crop;
  onSelectCrop: (crop: Crop) => void;
  onNavigateToMarketplace: () => void;
}

// Maharashtra primary agricultural hubs & key markets
const DISTRICTS_LIST = [
  'Pune',
  'Nashik',
  'Ahmednagar',
  'Solapur',
  'Kolhapur',
  'Chhatrapati Sambhajinagar',
  'Nagpur',
  'Latur',
  'Jalgaon',
  'Rajkot',
];

const PERIODS_LIST: ('3 Days' | '7 Days' | '14 Days' | '30 Days')[] = [
  '3 Days',
  '7 Days',
  '14 Days',
  '30 Days',
];

type MarketScenario = 'current' | 'glut' | 'shortage';

export const PriceForecastEngine: React.FC<PriceForecastEngineProps> = ({
  selectedCrop,
  onSelectCrop,
  onNavigateToMarketplace,
}) => {
  const { t, translateCrop, language } = useTranslation();
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [selectedPeriod, setSelectedPeriod] = useState<'3 Days' | '7 Days' | '14 Days' | '30 Days'>('7 Days');
  const [marketScenario, setMarketScenario] = useState<MarketScenario>('current');

  // Baseline forecast reference
  const cropForecasts = PRICE_FORECASTS[selectedCrop] || PRICE_FORECASTS['Onion'];
  const baseForecast: PriceForecast =
    cropForecasts[selectedDistrict] ||
    Object.values(cropForecasts)[0] || {
      crop: selectedCrop,
      district: selectedDistrict,
      period: selectedPeriod,
      currentPrice: 2800,
      predictedPrice: 3080,
      priceChangePercent: 10.0,
      trendDirection: 'up',
      expectedDemand: 'High',
      arrivalPressure: 'Low Arrivals (Supply Tight)',
      confidenceScore: 93.5,
      recommendedWindow: 'Hold 3-4 days for peak realization',
      bestDestination: `${selectedDistrict} Corporate Processing Hub`,
      explanation: `Projected APMC arrivals in ${selectedDistrict} are declining by 15%, creating a supply deficit and driving processor bids upward.`,
      historicalSupplyPoints: [
        { label: 'Day -4', price: 2650, arrivalTons: 3800 },
        { label: 'Day -2', price: 2720, arrivalTons: 3500 },
        { label: 'Today', price: 2800, arrivalTons: 3200 },
        { label: 'Proj +3d', price: 2950, arrivalTons: 2800 },
        { label: 'Proj +7d', price: 3080, arrivalTons: 2500 },
      ],
    };

  // Base deterministic supply and demand figures (in Quintals)
  const baseSupplyQtl = 3200; // Daily arrivals in APMC
  const baseDemandQtl = 4320; // Active procurement bids

  // Dynamic scenario modulation based on Law of Demand and Supply
  let effectiveSupplyQtl = baseSupplyQtl;
  let effectiveDemandQtl = baseDemandQtl;

  if (marketScenario === 'glut') {
    // Market Glut: Supply surges by +65%, Demand remains steady or drops
    effectiveSupplyQtl = Math.round(baseSupplyQtl * 1.65);
    effectiveDemandQtl = Math.round(baseDemandQtl * 0.85);
  } else if (marketScenario === 'shortage') {
    // Acute Shortage: Weather damage or seasonal dip, arrivals fall -40%, Demand surges
    effectiveSupplyQtl = Math.round(baseSupplyQtl * 0.6);
    effectiveDemandQtl = Math.round(baseDemandQtl * 1.3);
  }

  // Equilibrium Ratio: Demand / Supply
  const equilibriumRatio = Number((effectiveDemandQtl / effectiveSupplyQtl).toFixed(2));

  // Economic Price Determination using Law of Demand and Supply:
  // Price Change % is functionally tied to (Demand / Supply - 1.0)
  // When Ratio > 1.0, Demand > Supply => Price increases
  // When Ratio < 1.0, Supply > Demand => Price decreases
  let lawPriceChangePercent = Number(((equilibriumRatio - 1) * 28).toFixed(1));

  // Apply time horizon multiplier (longer periods allow larger equilibrium shifts)
  const periodMultiplier =
    selectedPeriod === '3 Days' ? 0.5 : selectedPeriod === '7 Days' ? 1.0 : selectedPeriod === '14 Days' ? 1.5 : 2.1;
  lawPriceChangePercent = Number((lawPriceChangePercent * periodMultiplier).toFixed(1));

  const baselinePrice = baseForecast.currentPrice || 2800;
  const predictedPrice = Math.round(baselinePrice * (1 + lawPriceChangePercent / 100));

  const currentPriceKg = convertRateToPerKg(baselinePrice);
  const predictedPriceKg = convertRateToPerKg(predictedPrice);

  const isPriceRising = lawPriceChangePercent >= 0;

  const speechText = `AI Price Forecast for ${translateCrop(selectedCrop)} in ${selectedDistrict}. Under the Law of Demand and Supply, with buyer demand at ${effectiveDemandQtl} quintals and mandi arrivals at ${effectiveSupplyQtl} quintals, the market equilibrium ratio is ${equilibriumRatio}. The predicted price is ${formatRatePerKg(predictedPriceKg, language)}, which is a ${isPriceRising ? 'gain of' : 'drop of'} ${Math.abs(lawPriceChangePercent)} percent.`;

  return (
    <section id="forecast" className="py-10 sm:py-14 bg-[#17362C] text-[#F6F1E4] border-b border-[#D9FF55]/15 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#3F754A]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D9FF55]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9FF55]/20 text-[#D9FF55] text-xs font-bold uppercase tracking-wider border border-[#D9FF55]/30">
            <Scale className="w-3.5 h-3.5 text-[#D9FF55]" />
            <span>Economic Equilibrium Engine · Law of Demand & Supply</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-editorial text-white tracking-tight">
            AI Price Forecasting & Market Equilibrium
          </h2>
          <p className="text-xs sm:text-sm text-[#F6F1E4]/80 leading-relaxed max-w-2xl mx-auto">
            Agricultural commodity prices are determined by the fundamental <strong>Law of Demand & Supply</strong>: comparing daily APMC yard arrival volumes against active buyer procurement orders.
          </p>
          <div className="pt-1">
            <AudioSpeechButton textToRead={speechText} label={t('voiceListen')} className="bg-white/10 text-[#D9FF55] border-white/15" />
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#132B23]/90 p-4 rounded-3xl border border-white/10 shadow-lg">
          {/* Crop Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D9FF55] mb-1.5">
              {t('selectCrop')}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => onSelectCrop(e.target.value as Crop)}
              className="w-full bg-[#17362C] border border-[#D9FF55]/30 text-white rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#D9FF55] min-h-[44px]"
            >
              <optgroup label="🌾 Commercial & Field Crops" className="bg-[#132B23] font-bold text-[#D9FF55]">
                <option value="Soybean">🌱 सोयाबीन (Soybean)</option>
                <option value="Cotton">⚪ कापूस (Cotton)</option>
                <option value="Wheat">🌾 गहू (Wheat)</option>
                <option value="Turmeric">🟡 हळद (Turmeric)</option>
                <option value="Maize">🌽 मका (Maize)</option>
              </optgroup>
              <optgroup label="🥦 Vegetables" className="bg-[#132B23] font-bold text-[#D9FF55]">
                <option value="Onion">🧅 कांदा (Onion)</option>
                <option value="Tomato">🍅 टोमॅटो (Tomato)</option>
                <option value="Potato">🥔 बटाटा (Potato)</option>
                <option value="GreenChillies">🌶️ मिरची (Green Chillies)</option>
              </optgroup>
              <optgroup label="🍎 Horticulture & Cash Fruits" className="bg-[#132B23] font-bold text-[#D9FF55]">
                <option value="Grapes">🍇 द्राक्षे (Nashik Grapes)</option>
                <option value="Pomegranate">🍎 डाळिंब (Pomegranate)</option>
                <option value="Banana">🍌 केळी (Banana)</option>
                <option value="KesarMango">🥭 आंबा (Mango)</option>
              </optgroup>
            </select>
          </div>

          {/* District Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D9FF55] mb-1.5">
              Select Market Hub / Mandi
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#17362C] border border-[#D9FF55]/30 text-white rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#D9FF55] min-h-[44px]"
            >
              {DISTRICTS_LIST.map((dist) => (
                <option key={dist} value={dist}>
                  📍 {dist} Market Division
                </option>
              ))}
            </select>
          </div>

          {/* Period Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#D9FF55] mb-1.5">
              {t('selectPeriod')}
            </label>
            <div className="grid grid-cols-4 gap-1">
              {PERIODS_LIST.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] cursor-pointer ${
                    selectedPeriod === p
                      ? 'bg-[#D9FF55] text-[#17362C] shadow-sm font-extrabold'
                      : 'bg-[#17362C] text-[#F6F1E4]/70 hover:text-white border border-white/10'
                  }`}
                >
                  {p === '3 Days' ? t('horizon3Days') : p === '7 Days' ? t('horizon7Days') : p === '14 Days' ? t('horizon14Days') : t('horizon30Days')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive "Law of Demand & Supply" Scenario Selector */}
        <div className="bg-[#132B23] p-4 rounded-3xl border border-[#D9FF55]/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D9FF55]" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Simulate Market Conditions (Law of Demand & Supply)
              </span>
            </div>
            <span className="text-[11px] text-white/60">
              Select a scenario to test how arrivals vs. buyer orders shift the clearing price:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setMarketScenario('current')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                marketScenario === 'current'
                  ? 'bg-[#244E3E] border-[#D9FF55] ring-2 ring-[#D9FF55]/40 text-white'
                  : 'bg-black/20 border-white/10 text-white/70 hover:bg-black/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">Current Moderate Deficit</span>
                <span className="text-[10px] bg-[#D9FF55] text-[#17362C] font-black px-1.5 py-0.2 rounded">
                  D/S 1.35x
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-snug">
                Normal arrivals, steady institutional orders. Favorable price trajectory.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMarketScenario('shortage')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                marketScenario === 'shortage'
                  ? 'bg-[#244E3E] border-[#D9FF55] ring-2 ring-[#D9FF55]/40 text-white'
                  : 'bg-black/20 border-white/10 text-white/70 hover:bg-black/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-300">Acute Supply Shortage</span>
                <span className="text-[10px] bg-emerald-400 text-[#17362C] font-black px-1.5 py-0.2 rounded">
                  D/S 2.17x
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-snug">
                Arrivals drop -40%. Food processors aggressively bid higher to secure stock.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMarketScenario('glut')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                marketScenario === 'glut'
                  ? 'bg-[#244E3E] border-[#D9FF55] ring-2 ring-[#D9FF55]/40 text-white'
                  : 'bg-black/20 border-white/10 text-white/70 hover:bg-black/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-300">Peak Harvest Glut</span>
                <span className="text-[10px] bg-amber-400 text-[#17362C] font-black px-1.5 py-0.2 rounded">
                  D/S 0.69x
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-snug">
                Heavy crop influx (+65%) floods mandi yards. Oversupply depresses spot prices.
              </p>
            </button>
          </div>
        </div>

        {/* Live Supply vs Demand Equilibrium Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left: Interactive Economic Mechanism & Predicted Price Card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#244E3E] to-[#17362C] p-6 sm:p-8 rounded-3xl border border-[#D9FF55]/30 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="bg-[#D9FF55] text-[#17362C] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {translateCrop(selectedCrop)} · {selectedDistrict} APMC
                  </span>
                  <span className="text-xs text-emerald-300 font-bold">
                    {selectedPeriod} Horizon
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full text-xs font-mono border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D9FF55]" />
                  <span>{baseForecast.confidenceScore}% Model Confidence</span>
                </div>
              </div>

              {/* Price Jump Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="bg-[#132B23]/70 p-4 rounded-2xl border border-white/10">
                  <span className="text-xs text-[#F6F1E4]/70 block font-medium">Today's Baseline Clearing Rate</span>
                  <div className="text-2xl sm:text-3xl font-black font-editorial text-white">
                    {formatRatePerKg(currentPriceKg, language)}
                  </div>
                  <span className="text-[11px] text-white/50 block mt-1">₹{baselinePrice} / Quintal</span>
                </div>

                <div className={`p-4 rounded-2xl border shadow-inner ${isPriceRising ? 'bg-[#17362C] border-[#D9FF55]/50' : 'bg-red-950/40 border-red-500/40'}`}>
                  <span className={`text-xs block font-bold ${isPriceRising ? 'text-[#D9FF55]' : 'text-red-300'}`}>
                    Equilibrium Projected Rate ({selectedPeriod})
                  </span>
                  <div className={`text-2xl sm:text-3xl font-black font-editorial flex items-center gap-2 ${isPriceRising ? 'text-[#D9FF55]' : 'text-red-400'}`}>
                    <span>{formatRatePerKg(predictedPriceKg, language)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 ${isPriceRising ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isPriceRising ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPriceRising ? `+${lawPriceChangePercent}%` : `${lawPriceChangePercent}%`}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/50 block mt-1">₹{predictedPrice} / Quintal</span>
                </div>
              </div>

              {/* Explicit Law of Demand & Supply Economic Rationale */}
              <div className="bg-[#132B23]/90 p-4 rounded-2xl border border-[#D9FF55]/20 space-y-2">
                <h4 className="text-xs font-bold text-[#D9FF55] uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Economic Law of Supply & Demand Explained</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#F6F1E4]/90 leading-relaxed font-medium">
                  {equilibriumRatio > 1.05 ? (
                    <>
                      <strong>Demand exceeds Supply (Ratio {equilibriumRatio}x):</strong> Active institutional buyer orders ({effectiveDemandQtl.toLocaleString()} Qtl) exceed daily APMC market arrivals ({effectiveSupplyQtl.toLocaleString()} Qtl) by {Math.round((equilibriumRatio - 1) * 100)}%. Competing processors will bid prices up by <span className="text-[#D9FF55] font-bold">+{lawPriceChangePercent}%</span> over the next {selectedPeriod}.
                    </>
                  ) : equilibriumRatio < 0.95 ? (
                    <>
                      <strong>Supply exceeds Demand (Ratio {equilibriumRatio}x):</strong> Market arrivals ({effectiveSupplyQtl.toLocaleString()} Qtl) outstrip active buyer procurement ({effectiveDemandQtl.toLocaleString()} Qtl) by {Math.round((1 - equilibriumRatio) * 100)}%. Oversupply exerts downward pressure of <span className="text-red-400 font-bold">{lawPriceChangePercent}%</span>. We recommend holding in cold storage rather than panic selling.
                    </>
                  ) : (
                    <>
                      <strong>Market in Equilibrium (Ratio {equilibriumRatio}x):</strong> Daily arrivals ({effectiveSupplyQtl.toLocaleString()} Qtl) match buyer procurement needs ({effectiveDemandQtl.toLocaleString()} Qtl). Prices remain stable with low volatility.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Action Window & Direct Offer Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#D9FF55]/20 text-[#D9FF55]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#F6F1E4]/70 block font-semibold">Recommended Farmer Strategy</span>
                  <span className="text-xs sm:text-sm font-bold text-[#D9FF55]">
                    {equilibriumRatio >= 1.05
                      ? 'Hold for 3-5 days to capture peak seller premium'
                      : equilibriumRatio <= 0.9
                      ? 'Utilize WDRA cold storage to avoid peak glut discount'
                      : 'Lock forward contract at current benchmark rate'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToMarketplace}
                className="px-5 py-3 rounded-2xl bg-[#D9FF55] hover:bg-[#c9ef45] text-[#17362C] font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 min-h-[48px]"
              >
                <span>{t('sendOffer')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right: Detailed Supply vs Demand Meters & Market Balance */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">

            {/* Visual Demand vs Supply Balance Card */}
            <div className="bg-[#132B23]/90 p-5 rounded-3xl border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9FF55] flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>Market Balance Gauge</span>
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  equilibriumRatio > 1.05
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                    : equilibriumRatio < 0.95
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-white/20 text-white'
                }`}>
                  {equilibriumRatio > 1.05
                    ? "Seller's Market (Advantage Farmer)"
                    : equilibriumRatio < 0.95
                    ? "Buyer's Market (Mandi Glut)"
                    : 'Balanced Equilibrium'}
                </span>
              </div>

              {/* Supply Bar (Mandi Arrivals) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/80 font-semibold flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    <span>Market Supply (Mandi Influx)</span>
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    {effectiveSupplyQtl.toLocaleString()} Quintals
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (effectiveSupplyQtl / 6000) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-white/50 flex justify-between">
                  <span>Tracked across 14 APMC yard gates</span>
                  <span>{effectiveSupplyQtl > baseSupplyQtl ? '📈 High Arrivals (+65%)' : '📉 Tight Influx (-40%)'}</span>
                </div>
              </div>

              {/* Demand Bar (Buyer Procurement Intent) */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/80 font-semibold flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-[#D9FF55]" />
                    <span>Market Demand (Verified Buyer Orders)</span>
                  </span>
                  <span className="font-mono font-bold text-[#D9FF55]">
                    {effectiveDemandQtl.toLocaleString()} Quintals
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#3F754A] to-[#D9FF55] rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (effectiveDemandQtl / 6000) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-white/50 flex justify-between">
                  <span>38 Institutional buyers & food processors</span>
                  <span>{effectiveDemandQtl > baseDemandQtl ? '🔥 Aggressive Bidding' : 'Stable Buying'}</span>
                </div>
              </div>

              {/* Equilibrium Factor */}
              <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/70">Demand ÷ Supply Multiplier:</span>
                <span className="font-mono text-sm font-black text-[#D9FF55]">
                  {equilibriumRatio}x {equilibriumRatio > 1.0 ? '▲ Bullish' : equilibriumRatio < 1.0 ? '▼ Bearish' : '■ Flat'}
                </span>
              </div>
            </div>

            {/* Top Recommended Direct Route Destination */}
            <div className="bg-[#132B23]/90 p-5 rounded-3xl border border-white/10 shadow-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9FF55]">
                {t('bestDestination')}
              </span>
              <h4 className="text-base font-bold text-white">
                {baseForecast.bestDestination}
              </h4>
              <p className="text-xs text-[#F6F1E4]/70">
                Direct factory gate dispatch with guaranteed escrow clearance within 24 hours of electronic weighbridge verification.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
