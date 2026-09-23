import React, { useState, useEffect } from 'react';
import type { ProduceListing, BuyerOffer, Deal, Crop, CropCategory, BuyerRequirement } from '../types';
import { useAuth } from '../auth/AuthContext';
import { dbService } from '../services/dbService';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Search,
  Package,
  Truck,
  X,
  ShieldCheck,
  Tag,
  Building,
  User,
  Newspaper,
  PlusCircle,
  AlertCircle,
  ArrowLeftRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRODUCT_CATALOG, getProductById } from '../data/productCatalog';
import { UserProfileModal } from './UserProfileModal';
import { VerificationStatusSection } from './VerificationStatusSection';
import { NewsSection } from './NewsSection';

interface BuyerDashboardProps {
  onOpenDealWorkspace?: (dealId: string) => void;
}

const MAHARASHTRA_DISTRICTS = [
  'All',
  'Pune',
  'Nashik',
  'Nagpur',
  'Kolhapur',
  'Solapur',
  'Latur',
  'Ahmednagar',
  'Jalgaon',
  'Amravati',
  'Satara',
  'Sangli',
  'Chhatrapati Sambhajinagar',
];

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  onOpenDealWorkspace,
}) => {
  const { user } = useAuth();
  const { t, translateCrop, translateStatus, translateGrade, translateDistrict } = useTranslation();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'my-offers' | 'deals' | 'requirements' | 'verification' | 'news'>('marketplace');
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [myOffers, setMyOffers] = useState<BuyerOffer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [buyerReqs, setBuyerReqs] = useState<BuyerRequirement[]>([]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Filters State
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Offer Submission Modal State
  const [selectedListingForOffer, setSelectedListingForOffer] = useState<ProduceListing | null>(null);
  const [offerQuantity, setOfferQuantity] = useState<number>(5);
  const [offeredPrice, setOfferedPrice] = useState<number>(3000);
  const [preferredPickupDate] = useState(() =>
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [transportResponsibility] = useState<'Buyer Organized' | 'Farmer Arranged' | 'KrushiSetu Pooled Logistics'>('Buyer Organized');
  const [offerMessage, setOfferMessage] = useState('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

  // Create Requirement Modal State
  const [isCreateReqOpen, setIsCreateReqOpen] = useState(false);
  const [reqCrop, setReqCrop] = useState<Crop>('Soybean');
  const [reqCategory, setReqCategory] = useState<CropCategory>('Oilseeds');
  const [reqQuantity, setReqQuantity] = useState<number>(50);
  const [reqUnit] = useState<'tonne' | 'quintal'>('tonne');
  const [reqTargetPrice, setReqTargetPrice] = useState<number>(4400);
  const [reqDistrict, setReqDistrict] = useState('Pune');
  const [reqNotes] = useState('');

  // Counter-offer Negotiation State for Buyer
  const [isRespondingToOffer, setIsRespondingToOffer] = useState(false);
  const [counterBackModalOffer, setCounterBackModalOffer] = useState<BuyerOffer | null>(null);
  const [counterBackPrice, setCounterBackPrice] = useState<number>(0);
  const [counterBackNotes, setCounterBackNotes] = useState<string>('');

  const loadBuyerData = async () => {
    try {
      const buyerId = user?.id || 'USER-BUY-5021';
      const [allListings, buyerOffers, buyerDeals, reqs] = await Promise.all([
        dbService.getListings({ verifiedOnly: true }),
        dbService.getOffers({ buyerId }),
        dbService.getDeals({ buyerId }),
        dbService.getBuyerRequirements({ buyerId }),
      ]);
      setListings(allListings);
      setMyOffers(buyerOffers);
      setDeals(buyerDeals);
      setBuyerReqs(reqs);
    } catch (err) {
      console.error('Error loading buyer data:', err);
    }
  };

  const handleAcceptCounterOffer = async (offer: BuyerOffer) => {
    setIsRespondingToOffer(true);
    try {
      const res = await dbService.respondToOffer(offer.id, 'accept', { responderRole: 'buyer' });
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D9FF55', '#3F754A', '#17362C'],
        });
      } catch (_) {}

      await loadBuyerData();
      const dealCode = res.deal?.dealCode || 'DEAL-2026';
      alert(`🎉 Counter-offer accepted! Deal #${dealCode} has been confirmed at ₹${offer.counterPrice || offer.offeredPrice}/${offer.priceUnit}. Contact details are now unlocked.`);
      if (res.deal?.id && onOpenDealWorkspace) {
        onOpenDealWorkspace(res.deal.id);
      }
    } catch (err: any) {
      alert('Error accepting counter offer: ' + (err.message || 'Unknown error'));
    } finally {
      setIsRespondingToOffer(false);
    }
  };

  const handleRejectCounterOffer = async (offer: BuyerOffer) => {
    if (!confirm('Are you sure you want to decline this counter-offer?')) return;
    setIsRespondingToOffer(true);
    try {
      await dbService.respondToOffer(offer.id, 'reject', { responderRole: 'buyer' });
      await loadBuyerData();
    } catch (err: any) {
      alert('Error rejecting counter offer: ' + (err.message || 'Unknown error'));
    } finally {
      setIsRespondingToOffer(false);
    }
  };

  const handleSendCounterBack = async () => {
    if (!counterBackModalOffer) return;
    if (counterBackPrice <= 0) {
      alert('Please enter a valid counter price.');
      return;
    }
    setIsRespondingToOffer(true);
    try {
      await dbService.respondToOffer(counterBackModalOffer.id, 'counter', {
        counterPrice: counterBackPrice,
        notes: counterBackNotes,
        responderRole: 'buyer',
      });
      alert(`Counter-offer of ₹${counterBackPrice}/${counterBackModalOffer.priceUnit} sent to farmer ${counterBackModalOffer.farmerName}!`);
      setCounterBackModalOffer(null);
      await loadBuyerData();
    } catch (err: any) {
      alert('Error sending counter offer: ' + (err.message || 'Unknown error'));
    } finally {
      setIsRespondingToOffer(false);
    }
  };

  useEffect(() => {
    loadBuyerData();
    const interval = setInterval(loadBuyerData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Filter listings
  const filteredListings = listings.filter((l) => {
    if (l.status !== 'Published' && l.status !== 'Verified') return false;
    if (selectedDistrict !== 'All' && l.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.listingCode.toLowerCase().includes(q) ||
      l.crop.toLowerCase().includes(q) ||
      (l.cropMr && l.cropMr.toLowerCase().includes(q)) ||
      (l.cropGu && l.cropGu.toLowerCase().includes(q)) ||
      l.variety.toLowerCase().includes(q) ||
      l.district.toLowerCase().includes(q) ||
      l.village.toLowerCase().includes(q)
    );
  });

  // Open Offer Modal
  const handleOpenOfferModal = (listing: ProduceListing) => {
    setSelectedListingForOffer(listing);
    setOfferQuantity(listing.minPurchaseQuantity || 2);
    setOfferedPrice(listing.expectedPrice);
    setOfferMessage(`Interested in purchasing ${translateCrop(listing.crop)}. Escrow payment ready.`);
  };

  // Submit Buyer Offer
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForOffer) return;
    setIsSubmittingOffer(true);
    try {
      const buyerId = user?.id || 'USER-BUY-5021';
      const buyerName = user?.name || 'Rohan Deshmukh';
      const buyerCompany = user?.company || user?.companyName || 'Chitale Agro & Dairy Foods Ltd';
      const buyerMobile = user?.mobile || '9724012345';

      await dbService.createOffer({
        listingId: selectedListingForOffer.id,
        listingCode: selectedListingForOffer.listingCode,
        crop: selectedListingForOffer.crop,
        cropGu: selectedListingForOffer.cropGu,
        variety: selectedListingForOffer.variety,
        buyerId,
        buyerName,
        buyerCompany,
        buyerMobile,
        farmerId: selectedListingForOffer.farmerId,
        farmerName: selectedListingForOffer.farmerName,
        farmerMobile: selectedListingForOffer.farmerMobile,
        requiredQuantity: Number(offerQuantity),
        unit: selectedListingForOffer.unit,
        offeredPrice: Number(offeredPrice),
        priceUnit: selectedListingForOffer.priceUnit,
        preferredPickupDate,
        transportResponsibility,
        message: offerMessage,
      });

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D9FF55', '#3F754A', '#17362C'],
        });
      } catch (_) {}

      alert(`${t('tabOffersLabel')} sent to ${selectedListingForOffer.farmerName}!`);
      setSelectedListingForOffer(null);
      await loadBuyerData();
    } catch (err: any) {
      alert('Error submitting offer: ' + err.message);
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  // Submit New Requirement
  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const buyerId = user?.id || 'USER-BUY-5021';
      const buyerName = user?.name || 'Rohan Deshmukh';
      const buyerMobile = user?.mobile || '9724012345';
      const companyName = user?.company || user?.companyName || 'Chitale Agro & Dairy Foods Ltd';

      await dbService.createBuyerRequirement({
        buyerId,
        buyerName,
        buyerMobile,
        companyName,
        category: reqCategory,
        crop: reqCrop,
        cropGu: getProductById(reqCrop)?.nameGu,
        requiredQuantity: reqQuantity,
        unit: reqUnit,
        targetPrice: reqTargetPrice,
        priceUnit: 'quintal',
        preferredGrade: 'Grade A (Super)',
        deliveryDistrict: reqDistrict,
        deliveryAddress: user?.deliveryAddress || `${reqDistrict}, Maharashtra`,
        deadlineDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0],
        notes: reqNotes,
        status: 'Active',
      });

      alert(t('lotCreatedSuccessTitle'));
      setIsCreateReqOpen(false);
      await loadBuyerData();
    } catch (err: any) {
      alert('Error creating requirement: ' + err.message);
    }
  };

  const isVerified = user?.verificationStatus === 'Verified' || user?.isVerified;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6" id="buyer-dashboard">
      
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#17362C] dark:bg-[#0B1E17] text-[#F6F1E4] shadow-2xl border border-[#D9FF55]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#D9FF55]/20 text-[#D9FF55] text-xs font-mono font-bold">
              {t('buyerProcurementTitle')}
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('verification')}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full cursor-pointer ${
                isVerified ? 'bg-[#D9FF55] text-[#17362C]' : 'bg-amber-400 text-[#17362C]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{user?.verificationStatus ? translateStatus(user.verificationStatus) : 'Verified Business'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-editorial text-white mt-2">
            {user?.company || user?.companyName || t('buyerCorporateName')}
          </h1>

          <p className="text-xs sm:text-sm text-[#F6F1E4]/75 mt-0.5">
            {t('loggedInAs')}: <span className="font-bold text-white">{user?.name || 'Rohan Deshmukh'}</span> · {t('buyerMahaGstNotice')}
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

          <button
            type="button"
            onClick={() => setIsCreateReqOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#D9FF55] text-xs font-black transition-all border border-[#D9FF55]/30 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ {t('navMarketplace')}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#17362C]/10 dark:border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'marketplace'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>1. {t('navMarketplace')} ({filteredListings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my-offers')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'my-offers'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>2. {t('tabOffersLabel')} ({myOffers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'deals'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>3. {t('tabDealsLabel')} ({deals.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requirements')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'requirements'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>4. {t('authRequiredCommodities')} ({buyerReqs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'verification'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>5. {t('tabVerificationLabel')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'news'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>6. {t('tabNewsLabel')}</span>
        </button>
      </div>

      {/* TAB 1: MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filters Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#132B23]/50 dark:text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`${t('filterCrop')}, ${t('variety')}, ${t('filterDistrict')}...`}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white"
                />
              </div>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white cursor-pointer"
              >
                {MAHARASHTRA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? t('allDistricts') : `${t('district')}: ${translateDistrict(d)}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((lot) => (
              <div
                key={lot.id}
                className="bg-white dark:bg-[#1E293B] rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#3F754A] transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-black/5">
                    <img
                      src={lot.primaryImageUrl || getProductById(lot.crop)?.image}
                      alt={translateCrop(lot.crop)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#17362C] text-[#D9FF55] text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg shadow">
                      {lot.listingCode}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#D9FF55] text-[#17362C] text-[10px] font-black px-2.5 py-1 rounded-lg shadow">
                      {translateGrade(lot.verifiedGrade || lot.grade)}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-base font-black text-[#132B23] dark:text-white">
                        {translateCrop(lot.crop)}
                      </h3>
                      <span className="text-sm font-black text-[#3F754A] dark:text-[#88d49e]">
                        ₹{lot.expectedPrice}/{lot.priceUnit}
                      </span>
                    </div>
                    <p className="text-xs text-[#132B23]/70 dark:text-white/70">{lot.variety}</p>
                    <p className="text-xs text-[#132B23]/60 dark:text-white/60 mt-1">
                      {t('quantity')}: <span className="font-bold text-[#132B23] dark:text-white">{lot.quantity} {lot.unit}</span> · {translateDistrict(lot.district)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenOfferModal(lot)}
                  className="w-full py-3 rounded-2xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] text-xs font-black shadow hover:bg-[#244E3E] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Tag className="w-4 h-4" />
                  <span>{t('sendOffer')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY OFFERS */}
      {activeTab === 'my-offers' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-4 animate-fade-in">
          <h3 className="text-base font-black text-[#132B23] dark:text-white">
            {t('tabOffersLabel')} ({myOffers.length})
          </h3>

          {myOffers.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#132B23]/60 dark:text-white/60">
              {t('noOffersReceivedYet')}
            </div>
          ) : (
            <div className="space-y-3">
              {myOffers.map((o) => (
                <div key={o.id} className="p-4 rounded-2xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black bg-[#17362C] text-[#D9FF55] px-2 py-0.5 rounded">
                          {o.listingCode}
                        </span>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          o.status === 'Accepted'
                            ? 'bg-emerald-600 text-white'
                            : o.status === 'Pending'
                            ? 'bg-[#FF7043] text-white'
                            : o.status === 'Countered'
                            ? 'bg-amber-400 text-black'
                            : 'bg-red-500 text-white'
                        }`}>
                          {translateStatus(o.status)}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[#132B23] dark:text-white mt-1">
                        {translateCrop(o.crop)} — {t('quantity')}: {o.requiredQuantity} {o.unit}
                      </h4>
                      <p className="text-xs text-[#132B23]/70 dark:text-white/70">
                        {t('farmerRecoGross')}: <span className="font-bold text-[#3F754A] dark:text-[#88d49e]">₹{o.offeredPrice}/Qtl</span> • {o.farmerName}
                      </p>

                      {/* Counter-Offer Details */}
                      {o.status === 'Countered' && o.counterPrice && o.counterPrice > 0 && (
                        <div className="mt-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-black text-amber-800 dark:text-amber-200">
                                {t('farmerCounterOfferAlert')}
                              </p>
                              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                <span className="font-bold">{t('proposedCounterRate', { price: o.counterPrice })}</span>
                                {o.offeredPrice !== o.counterPrice && (
                                  <span className="ml-1 text-[11px]">
                                    ({o.counterPrice > o.offeredPrice ? '+' : ''}
                                    {((o.counterPrice - o.offeredPrice) / o.offeredPrice * 100).toFixed(1)}%)
                                  </span>
                                )}
                              </p>
                              {o.counterNotes && (
                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 italic">
                                  "{o.counterNotes}"
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-[#132B23]/60 dark:text-white/60 block text-[11px]">{t('expectedPayout')}</span>
                      <span className="font-black text-[#3F754A] dark:text-[#88d49e] text-sm">
                        ₹{(o.requiredQuantity * (o.status === 'Countered' && o.counterPrice ? o.counterPrice : o.offeredPrice) * (o.unit === 'tonne' ? 10 : 1)).toLocaleString('en-IN')}
                      </span>
                      {o.status === 'Countered' && o.counterPrice && o.counterPrice !== o.offeredPrice && (
                        <p className="text-[10px] text-[#132B23]/50 dark:text-white/50 mt-0.5 line-through">
                          ₹{(o.requiredQuantity * o.offeredPrice * (o.unit === 'tonne' ? 10 : 1)).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons for Countered Offers */}
                  {o.status === 'Countered' && (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#17362C]/10 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => handleAcceptCounterOffer(o)}
                        disabled={isRespondingToOffer}
                        className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
                      >
                        ✓ {t('acceptCounterOfferBtn')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectCounterOffer(o)}
                        disabled={isRespondingToOffer}
                        className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-black shadow hover:bg-red-600 cursor-pointer disabled:opacity-50"
                      >
                        ✗ {t('declineCounterOfferBtn')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCounterBackModalOffer(o)}
                        disabled={isRespondingToOffer}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-black shadow hover:bg-amber-600 cursor-pointer disabled:opacity-50"
                      >
                        ↔ {t('counterBackBtn')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONFIRMED DEALS */}
      {activeTab === 'deals' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-4 animate-fade-in">
          <div className="border-b border-[#17362C]/10 dark:border-white/10 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                {t('tabDealsLabel')} ({deals.length})
              </h3>
              <p className="text-xs text-[#132B23]/70 dark:text-white/60">
                {t('escrowGuaranteed')}
              </p>
            </div>
          </div>

          {deals.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#132B23]/60 dark:text-white/60">
              {t('noLotsFound')}
            </div>
          ) : (
            <div className="space-y-4">
              {deals.map((d) => (
                <div key={d.id} className="p-5 rounded-3xl bg-[#17362C] dark:bg-[#0B1E17] text-[#F6F1E4] space-y-3 shadow-lg border border-[#D9FF55]/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black bg-[#D9FF55] text-[#17362C] px-2 py-0.5 rounded">
                          {d.dealCode}
                        </span>
                        <span className="text-xs bg-[#3F754A] text-white px-2 py-0.5 rounded-full font-bold">
                          {translateStatus(d.status)}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white mt-1">
                        {translateCrop(d.crop)} — {d.agreedQuantity} {d.unit} @ ₹{d.agreedPricePerUnit}/Qtl
                      </h4>
                      <p className="text-xs text-[#F6F1E4]/70">
                        {t('authRoleFarmer')}: <span className="font-bold text-[#D9FF55]">{d.farmerName}</span> (📞 {d.farmerMobile}) • {t('pickupStatus')}: {d.pickupDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <span className="text-white/60 block text-[11px]">{t('expectedPayout')}</span>
                        <span className="font-black text-[#D9FF55] text-base">
                          ₹{d.totalEstimatedValue.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenDealWorkspace && onOpenDealWorkspace(d.id)}
                        className="px-4 py-2.5 rounded-xl bg-[#D9FF55] text-[#17362C] text-xs font-black shadow hover:bg-lime-400 cursor-pointer"
                      >
                        {t('dealWorkspaceTitle')} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BUYER REQUIREMENTS */}
      {activeTab === 'requirements' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#17362C]/10 dark:border-white/10 pb-3">
            <div>
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                {t('authRequiredCommodities')}
              </h3>
              <p className="text-xs text-[#132B23]/70 dark:text-white/60">
                {t('landingBuyerSubtitle')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateReqOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] text-xs font-black shadow hover:bg-[#244E3E] cursor-pointer"
            >
              + {t('navMarketplace')}
            </button>
          </div>

          <div className="space-y-3">
            {buyerReqs.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#132B23]/60 dark:text-white/60">
                {t('noLotsFound')}
              </div>
            ) : (
              buyerReqs.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs font-bold bg-[#17362C] text-[#D9FF55] px-2 py-0.5 rounded">
                      {req.id}
                    </span>
                    <h4 className="text-sm font-black text-[#132B23] dark:text-white mt-1">
                      {translateCrop(req.crop)} — {t('quantity')}: {req.requiredQuantity} {req.unit}
                    </h4>
                    <p className="text-xs text-[#132B23]/70 dark:text-white/70">
                      {t('expectedPrice')}: ₹{req.targetPrice}/Qtl · {translateDistrict(req.deliveryDistrict)}
                    </p>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#3F754A] text-white">
                    {translateStatus(req.status)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: VERIFICATION STATUS */}
      {activeTab === 'verification' && (
        <VerificationStatusSection />
      )}

      {/* TAB 6: NEWS */}
      {activeTab === 'news' && (
        <NewsSection />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onOpenVerification={() => setActiveTab('verification')}
      />

      {/* Offer Submission Modal */}
      {selectedListingForOffer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#F6F1E4] dark:bg-[#1E293B] text-[#132B23] dark:text-white rounded-3xl p-6 max-w-xl w-full space-y-5 border border-[#17362C]/20 dark:border-white/10 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#17362C]/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#3F754A] dark:text-[#88d49e]" />
                <h3 className="text-base font-black text-[#132B23] dark:text-white">
                  {t('sendOffer')} — {translateCrop(selectedListingForOffer.crop)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedListingForOffer(null)}
                className="p-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-[#132B23] dark:text-white">{t('quantity')} ({selectedListingForOffer.unit})*</label>
                  <input
                    type="number"
                    required
                    value={offerQuantity}
                    onChange={(e) => setOfferQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 font-bold text-[#132B23] dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#132B23] dark:text-white">{t('expectedPrice')} (₹/{selectedListingForOffer.priceUnit})*</label>
                  <input
                    type="number"
                    required
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 font-bold text-[#132B23] dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingOffer}
                className="w-full py-3 rounded-2xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] font-black text-xs shadow-lg hover:bg-[#244E3E] cursor-pointer disabled:opacity-50"
              >
                {isSubmittingOffer ? '...' : t('confirmContractBtn')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Counter Back Modal */}
      {counterBackModalOffer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#F6F1E4] dark:bg-[#1E293B] text-[#132B23] dark:text-white rounded-3xl p-6 max-w-xl w-full space-y-5 border border-[#17362C]/20 dark:border-white/10 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#17362C]/10 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-black text-[#132B23] dark:text-white">
                  {t('counterBackModalTitle', { crop: translateCrop(counterBackModalOffer.crop) })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCounterBackModalOffer(null);
                  setCounterBackPrice(0);
                  setCounterBackNotes('');
                }}
                className="p-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-200">
                  {t('farmerCounterLabel', { price: counterBackModalOffer.counterPrice ?? 0 })}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  {t('yourOriginalOfferLabel', { price: counterBackModalOffer.offeredPrice ?? 0 })}
                </p>
                {counterBackModalOffer.counterNotes && (
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-2 italic">
                    {t('farmersNoteLabel')} "{counterBackModalOffer.counterNotes}"
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold text-[#132B23] dark:text-white text-xs block mb-2">
                  {t('yourCounterPriceLabel')}
                </label>
                <input
                  type="number"
                  required
                  value={counterBackPrice || ''}
                  onChange={(e) => setCounterBackPrice(parseFloat(e.target.value) || 0)}
                  placeholder={t('counterBetweenRangePlaceholder', { min: counterBackModalOffer.offeredPrice ?? 0, max: counterBackModalOffer.counterPrice ?? 0 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 font-bold text-[#132B23] dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-[#132B23] dark:text-white text-xs block mb-2">
                  {t('messageToFarmerOptional')}
                </label>
                <textarea
                  value={counterBackNotes}
                  onChange={(e) => setCounterBackNotes(e.target.value)}
                  placeholder={t('explainCounterPlaceholder')}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 font-bold text-[#132B23] dark:text-white text-xs resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCounterBackModalOffer(null);
                    setCounterBackPrice(0);
                    setCounterBackNotes('');
                  }}
                  className="flex-1 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-[#132B23] dark:text-white font-black text-xs shadow hover:bg-gray-300 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleSendCounterBack}
                  disabled={isRespondingToOffer || !counterBackPrice || counterBackPrice <= 0}
                  className="flex-1 py-3 rounded-2xl bg-amber-600 text-white font-black text-xs shadow-lg hover:bg-amber-700 cursor-pointer disabled:opacity-50"
                >
                  {isRespondingToOffer ? t('processing') : t('submitCounterBackBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Requirement Modal */}
      {isCreateReqOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#F6F1E4] dark:bg-[#1E293B] text-[#132B23] dark:text-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-[#17362C]/20 dark:border-white/10 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#17362C]/10 dark:border-white/10 pb-3">
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                {t('authRequiredCommodities')}
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateReqOpen(false)}
                className="p-1 cursor-pointer text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#132B23] dark:text-white block mb-1">{t('produceType')} *</label>
                <select
                  value={reqCrop}
                  onChange={(e) => {
                    const c = e.target.value as Crop;
                    setReqCrop(c);
                    const prod = getProductById(c);
                    if (prod) setReqCategory(prod.category as CropCategory);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 font-bold text-[#132B23] dark:text-white"
                >
                  {PRODUCT_CATALOG.map((p) => (
                    <option key={p.id} value={p.id}>
                      {translateCrop(p.id)} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#132B23] dark:text-white block mb-1">{t('quantity')} *</label>
                  <input
                    type="number"
                    required
                    value={reqQuantity}
                    onChange={(e) => setReqQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 font-bold text-[#132B23] dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#132B23] dark:text-white block mb-1">{t('expectedPrice')} (₹/qtl) *</label>
                  <input
                    type="number"
                    required
                    value={reqTargetPrice}
                    onChange={(e) => setReqTargetPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 font-bold text-[#132B23] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#132B23] dark:text-white block mb-1">{t('district')} *</label>
                <select
                  value={reqDistrict}
                  onChange={(e) => setReqDistrict(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 font-bold text-[#132B23] dark:text-white"
                >
                  {MAHARASHTRA_DISTRICTS.filter((d) => d !== 'All').map((d) => (
                    <option key={d} value={d}>
                      {translateDistrict(d)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] font-black text-xs shadow-lg hover:bg-[#244E3E] cursor-pointer mt-2"
              >
                {t('submitLotBtn')}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
