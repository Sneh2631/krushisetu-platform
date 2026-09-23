import React, { useState, useEffect } from 'react';
import type { ProduceListing, BuyerOffer, Deal } from '../types';
import { useAuth } from '../auth/AuthContext';
import { dbService } from '../services/dbService';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Package,
  TrendingUp,
  PlusCircle,
  Truck,
  ShieldCheck,
  Wallet,
  Calendar,
  HelpCircle,
  Tag,
  X,
  User,
  Newspaper,
  CheckCircle2,
  Clock,
  ArrowRight,
  Lock,
  Building2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AudioSpeechButton } from './AudioSpeechButton';
import { getProductById } from '../data/productCatalog';
import { UserProfileModal } from './UserProfileModal';
import { VerificationStatusSection } from './VerificationStatusSection';
import { NewsSection } from './NewsSection';

interface FarmerDashboardProps {
  onOpenCreateLotModal: () => void;
  onNavigateToPriceDiscovery: () => void;
  onOpenHelp: () => void;
  onOpenDealWorkspace?: (dealId: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onOpenCreateLotModal,
  onNavigateToPriceDiscovery,
  onOpenHelp,
  onOpenDealWorkspace,
}) => {
  const { user } = useAuth();
  const { t, translateCrop, translateStatus, translateGrade } = useTranslation();

  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'offers' | 'deals' | 'verification' | 'news'>('overview');
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [offers, setOffers] = useState<BuyerOffer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedOfferForAction, setSelectedOfferForAction] = useState<BuyerOffer | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(3100);
  const [counterNotes, setCounterNotes] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const loadFarmerData = async () => {
    try {
      const farmerId = user?.id || 'USER-FAR-9142';
      const [userListings, userOffers, userDeals] = await Promise.all([
        dbService.getListings({ farmerId }),
        dbService.getOffers({ farmerId }),
        dbService.getDeals({ farmerId }),
      ]);
      setListings(userListings);
      setOffers(userOffers);
      setDeals(userDeals);
    } catch (err) {
      console.error('Error loading farmer dashboard data:', err);
    }
  };

  useEffect(() => {
    loadFarmerData();
    const interval = setInterval(loadFarmerData, 4000);
    return () => clearInterval(interval);
  }, [user]);

  // Metrics
  const pendingOffers = offers.filter((o) => o.status === 'Pending');
  const activeListings = listings.filter((l) => l.status === 'Published' || l.status === 'Verified');
  const inReviewListings = listings.filter((l) => l.status === 'Submitted' || l.status === 'Under Review');
  const activeDeals = deals.filter((d) => d.status !== 'Completed' && d.status !== 'Cancelled');
  const totalEscrowExpected = deals.reduce((acc, d) => acc + (d.totalEstimatedValue || 0), 0);

  // Handle Offer Response
  const handleOfferResponse = async (action: 'accept' | 'reject' | 'counter') => {
    if (!selectedOfferForAction) return;
    setIsResponding(true);
    try {
      const res = await dbService.respondToOffer(selectedOfferForAction.id, action, {
        counterPrice,
        notes: counterNotes,
      });

      if (action === 'accept') {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#D9FF55', '#3F754A', '#FF7043'],
          });
        } catch (_) {}
        alert(
          `${t('offerAcceptedSuccess').replace('#{dealCode}', '#' + (res.deal?.dealCode || 'DEAL-MH-2026'))}`
        );
      } else if (action === 'counter') {
        alert(
          `${t('counterOfferSuccess').replace('{price}', String(counterPrice))}`
        );
      } else {
        alert(t('offerRejectedSuccess'));
      }

      setSelectedOfferForAction(null);
      await loadFarmerData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsResponding(false);
    }
  };

  const isVerified = user?.verificationStatus === 'Verified' || user?.isVerified;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6" id="farmer-dashboard">
      
      {/* ------------------------------------------------------------- */}
      {/* WELCOME BANNER WITH VOICE & PROFILE CONTROLS */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-[#17362C] dark:bg-[#0B1E17] p-6 sm:p-8 text-[#F6F1E4] shadow-2xl border border-[#D9FF55]/20">
        
        {/* Background Subtle Gradient Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9FF55]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#3F754A]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#D9FF55]/20 text-[#D9FF55] text-xs font-mono font-bold tracking-wider">
                {t('farmerPortalBadge')}
              </span>
              
              <button
                type="button"
                onClick={() => setActiveTab('verification')}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition-all ${
                  isVerified
                    ? 'bg-[#D9FF55] text-[#17362C]'
                    : 'bg-amber-400 text-[#17362C]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{user?.verificationStatus ? translateStatus(user.verificationStatus) : 'KYC Pending'}</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-editorial text-white">
              {t('farmerGreeting')} {user?.name || 'Ramesh Patil'}! 🌾
            </h2>

            <p className="text-xs sm:text-sm text-[#F6F1E4]/75">
              {t('district')}: <span className="font-bold text-white">{user?.village || 'Baramati'}, {user?.district || 'Pune'}</span> • {t('authFarmSize')}: {user?.farmSize || '8.5 Acres'} • FPO: {user?.fpoName || 'Baramati Agro FPO'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#D9FF55] text-[#17362C] text-xs font-black shadow hover:bg-[#cbf73c] transition-all cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{t('farmerMyProfileBtn')}</span>
            </button>

            <AudioSpeechButton
              textToSpeak={t('farmerVoiceHelpText')}
              label={t('farmerVoiceHelpLabel')}
            />

            <button
              type="button"
              onClick={onOpenHelp}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#D9FF55] text-xs font-black transition-all border border-[#D9FF55]/30 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t('farmerHelpBtn')}</span>
            </button>
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* THE 4 PRIMARY LARGE ACTIONS */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-2">
        <div className="text-xs font-black text-[#132B23] dark:text-[#D9FF55] uppercase tracking-wider">
          {t('mainActionsTitle')}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Sell Produce */}
          <button
            type="button"
            onClick={onOpenCreateLotModal}
            className="p-5 rounded-3xl bg-[#17362C] hover:bg-[#244E3E] text-[#F6F1E4] text-left shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 active:scale-95 border-2 border-[#D9FF55]/40 flex flex-col justify-between min-h-[140px] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                🌾
              </div>
              <PlusCircle className="w-5 h-5 text-[#D9FF55]" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-[#D9FF55]">
                {t('actionSellProduce')}
              </div>
              <div className="text-xs text-[#F6F1E4]/80 font-medium">
                {t('actionSellProduceSub')}
              </div>
            </div>
          </button>

          {/* 2. Check Market Prices */}
          <button
            type="button"
            onClick={onNavigateToPriceDiscovery}
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-[#28384E] text-[#132B23] dark:text-white text-left shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 active:scale-95 border border-[#17362C]/20 dark:border-white/10 flex flex-col justify-between min-h-[140px] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#3F754A]/20 dark:bg-[#3F754A]/40 text-[#3F754A] dark:text-[#88d49e] flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                📊
              </div>
              <TrendingUp className="w-5 h-5 text-[#3F754A] dark:text-[#88d49e]" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-[#132B23] dark:text-white">
                {t('actionCheckPrices')}
              </div>
              <div className="text-xs text-[#132B23]/70 dark:text-white/60 font-medium">
                {t('actionCheckPricesSub')}
              </div>
            </div>
          </button>

          {/* 3. Buyer Demand */}
          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-[#28384E] text-[#132B23] dark:text-white text-left shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 active:scale-95 border border-[#17362C]/20 dark:border-white/10 flex flex-col justify-between min-h-[140px] cursor-pointer relative group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#FF7043]/20 dark:bg-[#FF7043]/40 text-[#FF7043] flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                💬
              </div>
              {pendingOffers.length > 0 && (
                <span className="w-6 h-6 rounded-full bg-[#FF7043] text-white text-xs font-black flex items-center justify-center animate-bounce shadow">
                  {pendingOffers.length}
                </span>
              )}
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-[#132B23] dark:text-white">
                {t('actionBuyerDemand')}
              </div>
              <div className="text-xs text-[#132B23]/70 dark:text-white/60 font-medium">
                {t('actionBuyerDemandSub')} ({pendingOffers.length} {t('latestOffers')})
              </div>
            </div>
          </button>

          {/* 4. My Deals */}
          <button
            type="button"
            onClick={() => setActiveTab('deals')}
            className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-[#28384E] text-[#132B23] dark:text-white text-left shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 active:scale-95 border border-[#17362C]/20 dark:border-white/10 flex flex-col justify-between min-h-[140px] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#D9FF55]/40 text-[#17362C] dark:text-[#D9FF55] flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                🤝
              </div>
              <Truck className="w-5 h-5 text-[#17362C] dark:text-[#D9FF55]" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-[#132B23] dark:text-white">
                {t('actionMyDeals')}
              </div>
              <div className="text-xs text-[#132B23]/70 dark:text-white/60 font-medium">
                {t('actionMyDealsSub')} ({deals.length})
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* QUICK STATUS SUMMARY WIDGETS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Active Listings Status */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#17362C]/15 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#132B23]/70 dark:text-white/70 font-bold">
            <span>{t('statMyListings')}</span>
            <Package className="w-4 h-4 text-[#3F754A] dark:text-[#88d49e]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#132B23] dark:text-white">{listings.length}</span>
            <span className="text-xs text-[#3F754A] dark:text-[#88d49e] font-bold">
              ({activeListings.length} {t('statLiveListingsSuffix')} • {inReviewListings.length} {t('statInReviewSuffix')})
            </span>
          </div>
        </div>

        {/* Upcoming Pickup Schedule */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#17362C]/15 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#132B23]/70 dark:text-white/70 font-bold">
            <span>{t('statUpcomingPickup')}</span>
            <Calendar className="w-4 h-4 text-[#FF7043]" />
          </div>
          <div className="text-sm font-black text-[#132B23] dark:text-white truncate">
            {activeDeals.length > 0
              ? `${translateCrop(activeDeals[0].crop)} — ${activeDeals[0].pickupDate}`
              : t('statNoPickup')}
          </div>
          <div className="text-[11px] text-[#132B23]/60 dark:text-white/50">
            {activeDeals.length > 0 ? `${t('statVehicleLabel')}: MH-12-AX-8912 (10T)` : t('tile4Desc')}
          </div>
        </div>

        {/* Expected Escrow Payments */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#17362C]/15 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#132B23]/70 dark:text-white/70 font-bold">
            <span>{t('statExpectedEscrow')}</span>
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{totalEscrowExpected.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
            {t('statEscrowLocked')}
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* TABS & DETAILS SECTION */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        
        <div className="flex items-center gap-2 border-b border-[#17362C]/10 dark:border-white/10 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C]'
                : 'bg-white dark:bg-[#1E293B] text-[#132B23]/70 dark:text-white/70 hover:bg-[#17362C]/5'
            }`}
          >
            {t('tabOverviewLabel')}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'listings'
                ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C]'
                : 'bg-white dark:bg-[#1E293B] text-[#132B23]/70 dark:text-white/70 hover:bg-[#17362C]/5'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t('tabListingsLabel')} ({listings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'offers'
                ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C]'
                : 'bg-white dark:bg-[#1E293B] text-[#132B23]/70 dark:text-white/70 hover:bg-[#17362C]/5'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{t('tabOffersLabel')} ({offers.length})</span>
            {pendingOffers.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#FF7043] animate-ping" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'deals'
                ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C]'
                : 'bg-white dark:bg-[#1E293B] text-[#132B23]/70 dark:text-white/70 hover:bg-[#17362C]/5'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t('tabDealsLabel')} ({deals.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'verification'
                ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C]'
                : 'bg-white dark:bg-[#1E293B] text-[#132B23]/70 dark:text-white/70 hover:bg-[#17362C]/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('tabVerificationLabel')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'news'
                ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C]'
                : 'bg-white dark:bg-[#1E293B] text-[#132B23]/70 dark:text-white/70 hover:bg-[#17362C]/5'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>{t('tabNewsLabel')}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & RECENT ACTIVITY */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            
            {/* Recent Listings Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#17362C]/15 dark:border-white/10 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#132B23] dark:text-white">
                  {t('recentListingsTitle')}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('listings')}
                  className="text-xs font-bold text-[#3F754A] dark:text-[#88d49e] hover:underline cursor-pointer"
                >
                  {t('viewAllBtn')}
                </button>
              </div>

              <div className="space-y-3">
                {listings.slice(0, 3).map((l) => {
                  const statusColor =
                    l.status === 'Published' || l.status === 'Verified'
                      ? 'bg-[#3F754A] text-[#D9FF55]'
                      : l.status === 'Submitted' || l.status === 'Under Review'
                      ? 'bg-[#FF7043] text-white animate-pulse'
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

                  return (
                    <div key={l.id} className="p-3.5 rounded-2xl bg-[#F6F1E4]/50 dark:bg-[#0F172A] border border-[#17362C]/10 dark:border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={l.primaryImageUrl || getProductById(l.crop)?.image}
                          alt={translateCrop(l.crop)}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <div className="text-xs font-black text-[#132B23] dark:text-white">
                            {translateCrop(l.crop)} — {l.quantity} {l.unit}
                          </div>
                          <div className="text-[11px] text-[#132B23]/60 dark:text-white/60">
                            {t('lotIdLabel')}: {l.listingCode} • {translateGrade(l.grade)}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${statusColor}`}>
                        {translateStatus(l.status)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Incoming Buyer Offers Alert Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#17362C]/15 dark:border-white/10 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#132B23] dark:text-white">
                    {t('pendingOffersTitle')}
                  </h3>
                  {pendingOffers.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FF7043] text-white text-[10px] font-black">
                      {pendingOffers.length} {t('latestOffers')}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('offers')}
                  className="text-xs font-bold text-[#3F754A] dark:text-[#88d49e] hover:underline cursor-pointer"
                >
                  {t('viewOffersBtn')} →
                </button>
              </div>

              <div className="space-y-3">
                {offers.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#132B23]/60 dark:text-white/60">
                    {t('noOffersReceivedYet')}
                  </div>
                ) : (
                  offers.slice(0, 3).map((o) => (
                    <div key={o.id} className="p-3.5 rounded-2xl bg-[#D9FF55]/15 dark:bg-[#D9FF55]/10 border border-[#17362C]/10 dark:border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-black text-[#132B23] dark:text-white">
                          {o.buyerCompany} ({o.buyerName})
                        </div>
                        <div className="text-[11px] text-[#3F754A] dark:text-[#88d49e] font-bold mt-0.5">
                          {t('farmerRecoGross')}: ₹{o.offeredPrice}/Qtl • {o.requiredQuantity} {o.unit} {translateCrop(o.crop)}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOfferForAction(o);
                          setCounterPrice(o.counterPrice || (o.offeredPrice + 100));
                          setCounterNotes(o.counterNotes || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] text-xs font-black hover:bg-[#244E3E] cursor-pointer"
                      >
                        {t('viewDetailsAction')}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#17362C]/15 dark:border-white/10 p-6 space-y-4 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                {t('tabListingsLabel')} ({listings.length})
              </h3>
              <button
                type="button"
                onClick={onOpenCreateLotModal}
                className="px-4 py-2 rounded-xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] text-xs font-black shadow hover:bg-[#244E3E] cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ {t('actionSellProduce')}</span>
              </button>
            </div>

            <div className="divide-y divide-[#17362C]/10 dark:divide-white/10">
              {listings.map((l) => (
                <div key={l.id} className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={l.primaryImageUrl || getProductById(l.crop)?.image}
                      alt={translateCrop(l.crop)}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-[#17362C]/15 dark:border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black bg-[#17362C] text-[#D9FF55] px-2 py-0.5 rounded">
                          {l.listingCode}
                        </span>
                        <span className="text-xs font-black text-[#3F754A] dark:text-[#88d49e]">
                          {translateStatus(l.status)}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[#132B23] dark:text-white mt-1">
                        {translateCrop(l.crop)} — {l.variety}
                      </h4>
                      <p className="text-xs text-[#132B23]/70 dark:text-white/70">
                        {t('quantity')}: {l.quantity} {l.unit} • {t('expectedPrice')}: ₹{l.expectedPrice}/{l.priceUnit} • {l.village}, {l.district}
                      </p>
                      {l.adminInspectionNotes && (
                        <div className="text-[11px] text-[#3F754A] dark:text-[#88d49e] font-bold mt-1 bg-[#3F754A]/10 px-2 py-0.5 rounded-md inline-block">
                          MSAMB Note: {l.adminInspectionNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right text-xs pr-2">
                      <span className="text-[#132B23]/60 dark:text-white/60 block text-[11px] font-bold">{t('tabOffersLabel')}</span>
                      <span className="font-black text-[#132B23] dark:text-white">{l.offersCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BUYER OFFERS & NEGOTIATION */}
        {activeTab === 'offers' && (
          <div className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#17362C]/15 dark:border-white/10 p-6 space-y-4 shadow-sm animate-fade-in">
            <h3 className="text-base font-black text-[#132B23] dark:text-white">
              {t('tabOffersLabel')} ({offers.length})
            </h3>

            {offers.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#132B23]/60 dark:text-white/60">
                {t('noOffersReceivedYet')}
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((o) => (
                  <div key={o.id} className="p-5 rounded-2xl bg-[#F6F1E4]/60 dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#132B23] dark:text-white bg-white dark:bg-[#1E293B] px-2 py-0.5 rounded-md border border-[#17362C]/15 dark:border-white/10">
                            {o.buyerCompany}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            o.status === 'Accepted'
                              ? 'bg-[#3F754A] text-white'
                              : o.status === 'Pending'
                              ? 'bg-[#FF7043] text-white'
                              : o.status === 'Countered'
                              ? 'bg-amber-400 text-black'
                              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {translateStatus(o.status)}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-[#132B23] dark:text-white mt-1">
                          {t('produceType')}: {translateCrop(o.crop)} • {t('quantity')}: {o.requiredQuantity} {o.unit}
                        </h4>
                        <p className="text-xs text-[#132B23]/70 dark:text-white/70">
                          {t('farmerRecoGross')}: <span className="font-black text-[#3F754A] dark:text-[#88d49e] text-sm">₹{o.offeredPrice}/Qtl</span> • {t('pickupStatus')}: {o.preferredPickupDate || 'Immediate'}
                        </p>

                        {/* Negotiated Counter Details */}
                        {o.status === 'Countered' && o.counterPrice && o.counterPrice > 0 && (
                          <div className="mt-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 text-xs">
                            <span className="font-bold text-amber-800 dark:text-amber-300">
                              {t('proposedCounterLabel', { price: o.counterPrice })}
                            </span>
                            {o.counterNotes && (
                              <p className="text-amber-700 dark:text-amber-300/80 italic mt-0.5 text-[11px]">
                                "{o.counterNotes}"
                              </p>
                            )}
                          </div>
                        )}

                        {o.message && (
                          <p className="text-xs text-[#132B23]/80 dark:text-white/80 italic mt-1 bg-white dark:bg-[#1E293B] p-2 rounded-xl border border-[#17362C]/10 dark:border-white/10">
                            "{o.message}"
                          </p>
                        )}
                      </div>

                      {(o.status === 'Pending' || o.status === 'Countered') && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOfferForAction(o);
                              setCounterPrice(o.counterPrice || (o.offeredPrice + 100));
                              setCounterNotes(o.counterNotes || '');
                            }}
                            className="px-4 py-2.5 rounded-xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] text-xs font-black shadow hover:bg-[#244E3E] cursor-pointer"
                          >
                            {o.status === 'Countered' ? t('modifyCounterAcceptBtn') : `${t('acceptOfferBtn')} / ${t('counterOfferBtn')}`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MY DEALS & REAL-TIME PAYMENT TRACKER */}
        {activeTab === 'deals' && (
          <div className="rounded-3xl bg-white dark:bg-[#1E293B] border border-[#17362C]/15 dark:border-white/10 p-6 space-y-5 shadow-sm animate-fade-in">
            <div className="border-b border-[#17362C]/10 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-[#132B23] dark:text-white">
                    {t('tabDealsLabel')} & {t('escrowTrackingTitle')} ({deals.length})
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                    {t('guaranteedEscrowBadge')}
                  </span>
                </div>
                <p className="text-xs text-[#132B23]/70 dark:text-white/60 mt-0.5">
                  {t('dealsTrackingSub')}
                </p>
              </div>

              <div className="text-left sm:text-right bg-[#17362C]/5 dark:bg-white/5 p-2.5 rounded-2xl border border-[#17362C]/10 dark:border-white/10">
                <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 block">{t('totalActivePayouts')}</span>
                <span className="text-base font-black text-[#17362C] dark:text-[#D9FF55]">
                  ₹{deals.reduce((acc, d) => acc + (d.totalEstimatedValue || 0), 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {deals.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#132B23]/60 dark:text-white/60">
                {t('noLotsFound')}
              </div>
            ) : (
              <div className="space-y-6">
                {deals.map((d) => {
                  const totalVal = d.totalEstimatedValue || 100000;
                  const advanceVal = Math.round(totalVal * 0.2);
                  const dispatchVal = Math.round(totalVal * 0.3);
                  const finalVal = totalVal - advanceVal - dispatchVal;

                  // Milestone status logic based on order status
                  const isCompleted = d.status === 'Completed';
                  const isDelivered = d.status === 'Delivered' || isCompleted;
                  const isDispatched = d.status === 'In Transit' || isDelivered;
                  const isConfirmed = d.status === 'Offer Accepted' || isDispatched;

                  return (
                    <div
                      key={d.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#17362C] dark:bg-[#0B1E17] text-[#F6F1E4] space-y-5 shadow-xl border border-[#D9FF55]/20"
                    >
                      {/* Deal Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-black text-[#17362C] bg-[#D9FF55] px-2.5 py-0.5 rounded-lg">
                              {d.dealCode}
                            </span>
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
                              {translateStatus(d.status)}
                            </span>
                            <span className="text-[11px] bg-white/10 text-white/80 px-2 py-0.5 rounded-md font-mono">
                              Ref: {d.escrowReference || `ESC-MH-${d.id.slice(-4)}`}
                            </span>
                          </div>

                          <h4 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                            <span>{translateCrop(d.crop)}</span>
                            {d.variety && (
                              <span className="text-xs font-normal px-2 py-0.5 rounded-md bg-white/10 text-[#D9FF55]">
                                {d.variety}
                              </span>
                            )}
                            <span className="text-white/60 font-medium text-sm">
                              — {d.agreedQuantity} {d.unit} @ ₹{d.agreedPricePerUnit}/Qtl
                            </span>
                          </h4>

                          <p className="text-xs text-[#F6F1E4]/75">
                            <strong>{t('buyerLabel')}:</strong> {d.buyerCompany} ({d.buyerName} · 📞 {d.buyerMobile}) • <strong>{t('pickupLabel')}:</strong> {d.pickupDate}
                          </p>
                        </div>

                        {/* Payout Metric & CTA */}
                        <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                          <div className="text-left sm:text-right">
                            <span className="text-white/60 block text-[11px] font-semibold">{t('expectedPayout')}</span>
                            <span className="font-black text-[#D9FF55] text-xl font-editorial">
                              ₹{totalVal.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onOpenDealWorkspace && onOpenDealWorkspace(d.id)}
                            className="px-4 py-2 rounded-xl bg-[#D9FF55] hover:bg-[#c9ef45] text-[#17362C] text-xs font-black shadow transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{t('dealWorkspaceTitle')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 4-Step Payment & Escrow Progress Tracker */}
                      <div className="bg-[#132B23] p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#D9FF55] flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-[#D9FF55]" />
                            <span>{t('transparentEscrowTimeline')}</span>
                          </span>
                          <span className="text-[11px] text-white/70">
                            {t('bankAccountLabel')}: <strong className="text-white">State Bank of India (•••• 4291)</strong>
                          </span>
                        </div>

                        {/* Progress Steps Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          {/* Step 1: Advance Escrow */}
                          <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                            isConfirmed ? 'bg-[#17362C] border-emerald-400/40 text-white' : 'bg-black/20 border-white/10 text-white/50'
                          }`}>
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] uppercase font-mono font-bold text-white/60">Step 1 (20%)</span>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              </div>
                              <div className="text-xs font-bold text-white">{t('step1AdvanceTitle')}</div>
                              <div className="text-sm font-black text-emerald-400 mt-0.5">₹{advanceVal.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="text-[10px] text-emerald-300 font-semibold mt-2 pt-2 border-t border-white/10">
                              {t('lockedInNodalEscrow')}
                            </div>
                          </div>

                          {/* Step 2: Weighment & Loading */}
                          <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                            isDispatched
                              ? 'bg-[#17362C] border-emerald-400/40 text-white'
                              : isConfirmed
                              ? 'bg-[#244E3E] border-[#D9FF55] text-white ring-1 ring-[#D9FF55]/40'
                              : 'bg-black/20 border-white/10 text-white/50'
                          }`}>
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] uppercase font-mono font-bold text-white/60">Step 2 (30%)</span>
                                {isDispatched ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#D9FF55] animate-spin" />
                                )}
                              </div>
                              <div className="text-xs font-bold text-white">{t('step2DispatchTitle')}</div>
                              <div className="text-sm font-black text-[#D9FF55] mt-0.5">₹{dispatchVal.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="text-[10px] text-white/80 font-semibold mt-2 pt-2 border-t border-white/10">
                              {isDispatched ? t('weighmentSlipApproved') : t('readyForPickup')}
                            </div>
                          </div>

                          {/* Step 3: Quality Check */}
                          <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                            isDelivered
                              ? 'bg-[#17362C] border-emerald-400/40 text-white'
                              : isDispatched
                              ? 'bg-[#244E3E] border-[#D9FF55] text-white ring-1 ring-[#D9FF55]/40'
                              : 'bg-black/20 border-white/10 text-white/50'
                          }`}>
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] uppercase font-mono font-bold text-white/60">Step 3 (Hub)</span>
                                {isDelivered ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Clock className="w-4 h-4 text-white/40" />
                                )}
                              </div>
                              <div className="text-xs font-bold text-white">{t('step3QualityTitle')}</div>
                              <div className="text-sm font-black text-white/90 mt-0.5">{t('gradeAVerified')}</div>
                            </div>
                            <div className="text-[10px] text-white/80 font-semibold mt-2 pt-2 border-t border-white/10">
                              {isDelivered ? t('moisturePassed') : t('inTransitToHub')}
                            </div>
                          </div>

                          {/* Step 4: Final Settlement */}
                          <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                            isCompleted
                              ? 'bg-emerald-950/60 border-emerald-400 text-white'
                              : 'bg-black/20 border-white/10 text-white/50'
                          }`}>
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] uppercase font-mono font-bold text-white/60">Step 4 (100%)</span>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Building2 className="w-4 h-4 text-white/40" />
                                )}
                              </div>
                              <div className="text-xs font-bold text-white">{t('step4SettlementTitle')}</div>
                              <div className="text-sm font-black text-[#D9FF55] mt-0.5">₹{finalVal.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="text-[10px] font-semibold mt-2 pt-2 border-t border-white/10 text-emerald-300">
                              {isCompleted ? t('clearedViaRtgs') : t('releaseOnGateScan')}
                            </div>
                          </div>
                        </div>

                        {/* Route & Delivery Live Location */}
                        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-white/70">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[#D9FF55]" />
                            <span>
                              <strong>{t('liveTransit')}</strong> {d.pickupAddress || 'Farm Gate'} ➔ {d.deliveryDestination || `${d.buyerCompany} Hub, Pune`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                            <Lock className="w-3.5 h-3.5" />
                            <span>{t('zeroDefaultEscrowGuarantee')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: VERIFICATION STATUS (KYC) */}
        {activeTab === 'verification' && (
          <VerificationStatusSection />
        )}

        {/* TAB 6: KRISHISETU NEWS */}
        {activeTab === 'news' && (
          <NewsSection />
        )}

      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onOpenVerification={() => setActiveTab('verification')}
      />

      {/* OFFER ACTION / NEGOTIATION MODAL */}
      {selectedOfferForAction && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F6F1E4] dark:bg-[#1E293B] text-[#132B23] dark:text-white rounded-3xl p-6 max-w-lg w-full space-y-5 border border-[#17362C]/20 dark:border-white/10 shadow-2xl animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-[#17362C]/10 dark:border-white/10 pb-3">
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                {t('tabOffersLabel')} — {selectedOfferForAction.buyerCompany}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOfferForAction(null)}
                className="p-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 space-y-2 text-xs">
              <div className="font-bold text-[#132B23] dark:text-white">{selectedOfferForAction.buyerCompany} ({selectedOfferForAction.buyerName})</div>
              <div>{t('produceType')}: <span className="font-bold">{translateCrop(selectedOfferForAction.crop)}</span></div>
              <div>{t('quantity')}: <span className="font-bold">{selectedOfferForAction.requiredQuantity} {selectedOfferForAction.unit}</span></div>
              <div>{t('farmerRecoGross')}: <span className="font-bold text-[#3F754A] dark:text-[#88d49e] text-sm">₹{selectedOfferForAction.offeredPrice}/Qtl</span></div>
            </div>

            {/* Negotiation Counter Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#132B23] dark:text-white">
                {t('counterOfferBtn')} (₹/Qtl)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-black outline-none text-[#132B23] dark:text-white"
                  placeholder="₹"
                />
                <button
                  type="button"
                  disabled={isResponding}
                  onClick={() => handleOfferResponse('counter')}
                  className="px-4 py-2.5 rounded-xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] text-xs font-bold hover:bg-[#244E3E] cursor-pointer disabled:opacity-50"
                >
                  {t('counterOfferBtn')}
                </button>
              </div>
              <div>
                <input
                  type="text"
                  value={counterNotes}
                  onChange={(e) => setCounterNotes(e.target.value)}
                  placeholder={t('counterReasonPlaceholder')}
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-normal outline-none text-[#132B23] dark:text-white mt-1"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#17362C]/10 dark:border-white/10 flex items-center gap-3">
              <button
                type="button"
                disabled={isResponding}
                onClick={() => handleOfferResponse('accept')}
                className="flex-1 py-3 rounded-2xl bg-[#3F754A] text-white text-xs font-black hover:bg-[#2e5936] shadow-lg cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                ✓ {t('acceptOfferBtn')}
              </button>

              <button
                type="button"
                disabled={isResponding}
                onClick={() => handleOfferResponse('reject')}
                className="py-3 px-4 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs font-bold hover:bg-red-200 cursor-pointer disabled:opacity-50"
              >
                {t('rejectOfferBtn')}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
