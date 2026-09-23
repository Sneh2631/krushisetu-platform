import React, { useState, useEffect } from 'react';
import type {
  ProduceListing,
  ListingStatus,
  QualityGrade,
  UserProfile,
  VerificationRequest,
  Deal,
  NewsItem,
  ProfileChangeLog,
  AppNotification,
  TransportRequest,
  SupportQuery,
} from '../types';
import { dbService } from '../services/dbService';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import {
  ShieldCheck,
  CheckCircle2,
  Search,
  Camera,
  History,
  Users,
  Newspaper,
  Bell,
  Sprout,
  X,
  Package,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cropService, type MongoCropItem } from '../services/cropService';

interface AdminVerificationDashboardProps {
  onListingUpdated?: () => void;
}

export const AdminVerificationDashboard: React.FC<AdminVerificationDashboardProps> = ({
  onListingUpdated,
}) => {
  const { user } = useAuth();
  const { t, language, translateCrop, translateStatus, translateDistrict } = useTranslation();

  // Active Main Tab - Orders as primary command center
  const [activeTab, setActiveTab] = useState<
    'orders' | 'kyc_queue' | 'listings_queue' | 'crop_requests' | 'users' | 'profile_logs' | 'news' | 'system_alerts'
  >('orders');

  // Data States
  const [listings, setListings] = useState<ProduceListing[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [profileLogs, setProfileLogs] = useState<ProfileChangeLog[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AppNotification[]>([]);
  const [pendingCrops, setPendingCrops] = useState<MongoCropItem[]>([]);
  const [transports, setTransports] = useState<TransportRequest[]>([]);
  const [supportQueries, setSupportQueries] = useState<SupportQuery[]>([]);

  // Orders & Queries Controls
  const [orderSearch, setOrderSearch] = useState('');
  const [queryFilter, setQueryFilter] = useState<'all' | 'Open' | 'Under Investigation' | 'Resolved'>('all');
  const [queryResolutionText, setQueryResolutionText] = useState<Record<string, string>>({});
  const [updatingDealId, setUpdatingDealId] = useState<string | null>(null);
  const [updatingQueryId, setUpdatingQueryId] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<MongoCropItem | null>(null);
  const [cropRejectionReason, setCropRejectionReason] = useState('');
  const [cropEditBenchmark, setCropEditBenchmark] = useState('');
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);

  // Selection States
  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);
  const [selectedKycReq, setSelectedKycReq] = useState<VerificationRequest | null>(null);

  // Listing Verification Form State
  const [verifiedGrade, setVerifiedGrade] = useState<QualityGrade>('Grade A (Export / Super)');
  const [adminNotes, setAdminNotes] = useState('');
  const [correctionsRequested, setCorrectionsRequested] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // KYC Verification Form State
  const [kycNotes, setKycNotes] = useState('');
  const [kycRequestedInfo, setKycRequestedInfo] = useState('');

  // News Publisher Form State
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsTitleMr, setNewsTitleMr] = useState('');
  const [newsTitleHi, setNewsTitleHi] = useState('');
  const [newsTitleGu, setNewsTitleGu] = useState('');
  const [newsSummaryEn, setNewsSummaryEn] = useState('');
  const [newsSummaryMr, setNewsSummaryMr] = useState('');
  const [newsCategory, setNewsCategory] = useState<'MSP & Rates' | 'Government Schemes' | 'Market Advisory' | 'Weather & Logistics' | 'Platform Updates'>('MSP & Rates');
  const [newsIsPinned, setNewsIsPinned] = useState(false);
  const [isPublishingNews, setIsPublishingNews] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  const loadAllAdminData = async () => {
    try {
      const [
        allListings,
        allProfiles,
        allKyc,
        allDeals,
        allProfLogs,
        allNews,
        allNotifs,
        pendingCropsData,
        allTransports,
        allQueries,
      ] = await Promise.all([
        dbService.getListings(),
        dbService.getAllProfiles(),
        dbService.getVerificationRequests(),
        dbService.getDeals({ role: 'admin' }),
        dbService.getProfileChangeLogs(),
        dbService.getNews(),
        dbService.getNotifications(user?.id, 'admin'),
        cropService.getCrops('pending').catch(() => []),
        dbService.getAllTransports().catch(() => []),
        dbService.getSupportQueries().catch(() => []),
      ]);

      setListings(allListings);
      setUsersList(allProfiles);
      setVerificationRequests(allKyc);
      setDeals(allDeals);
      setProfileLogs(allProfLogs);
      setNews(allNews);
      setAdminNotifications(allNotifs);
      setPendingCrops(pendingCropsData);
      setTransports(allTransports);
      setSupportQueries(allQueries);

      if (allListings.length > 0 && !selectedListing) {
        setSelectedListing(allListings[0]);
      }
      if (allKyc.length > 0 && !selectedKycReq) {
        setSelectedKycReq(allKyc[0]);
      }
      if (pendingCropsData.length > 0 && !selectedCrop) {
        setSelectedCrop(pendingCropsData[0]);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    loadAllAdminData();
    const interval = setInterval(loadAllAdminData, 6000);
    return () => clearInterval(interval);
  }, []);

  // Advance Logistics Checkpoint ("Where Order Reach")
  const handleAdvanceTransportCheckpoint = async (deal: Deal) => {
    setUpdatingDealId(deal.id);
    try {
      const existingTransport = transports.find((t) => t.dealId === deal.id || t.dealId === deal.dealCode);
      const currentStatus = existingTransport?.trackingStatus || 'Assigned';

      let nextStatus: TransportRequest['trackingStatus'] = 'Loaded';
      let milestoneNote = 'Farm-gate weighing completed. Consignment loaded onto vehicle.';

      if (currentStatus === 'Pending' || currentStatus === 'Assigned') {
        nextStatus = 'Loaded';
        milestoneNote = 'Farm-gate weighbridge slip verified. Vehicle loaded and sealed.';
      } else if (currentStatus === 'Loaded') {
        nextStatus = 'In Transit';
        milestoneNote = 'Vehicle dispatched onto National Highway. Live GPS telemetry streaming.';
      } else if (currentStatus === 'In Transit' || currentStatus === 'En Route') {
        nextStatus = 'Delivered';
        milestoneNote = 'Consignment arrived at buyer processing factory. Weighbridge inward completed.';
      } else {
        nextStatus = 'Delivered';
        milestoneNote = 'Quality assay verified and accepted. Unloading sign-off executed.';
      }

      await dbService.createOrUpdateTransport(deal.id, {
        dealId: deal.id,
        dealCode: deal.dealCode,
        crop: deal.crop,
        pickupAddress: deal.pickupAddress,
        deliveryAddress: deal.deliveryDestination,
        driverName: existingTransport?.driverName || 'Ramesh Shinde',
        driverPhone: existingTransport?.driverPhone || '+91 98220 12345',
        vehicleNumber: existingTransport?.vehicleNumber || 'MH-15-EG-4421',
        vehicleType: existingTransport?.vehicleType || 'Eicher (4T)',
        trackingStatus: nextStatus,
        currentMilestoneNotes: milestoneNote,
      });

      // Update deal status accordingly
      if (nextStatus === 'In Transit') {
        await dbService.updateDealStatus(deal.id, 'In Transit');
      } else if (nextStatus === 'Delivered') {
        await dbService.updateDealStatus(deal.id, 'Delivered');
      }

      await loadAllAdminData();
    } catch (err: any) {
      alert('Error updating logistics checkpoint: ' + (err?.message || 'Failed'));
    } finally {
      setUpdatingDealId(null);
    }
  };

  // Advance Escrow Payout ("How Much Payment Done")
  const handleAdvanceEscrowStatus = async (deal: Deal) => {
    setUpdatingDealId(deal.id);
    try {
      let nextEscrow: Deal['escrowStatus'] = 'Funds Deposited';
      let note = 'Advance tranche recorded in nodal escrow.';

      if (deal.escrowStatus === 'Awaiting Buyer Deposit') {
        nextEscrow = 'Funds Deposited';
        note = 'Buyer 20% advance locked in MSAMB nodal escrow.';
      } else if (deal.escrowStatus === 'Funds Deposited' || deal.escrowStatus === 'Funds Locked in Escrow') {
        nextEscrow = 'Quality Passed - Disbursing';
        note = 'Dispatch weighbridge confirmed. 50% milestone released to farmer bank account.';
      } else {
        nextEscrow = 'Completed & Credited';
        note = 'Final quality clearance accepted. 100% full RTGS settlement disbursed to farmer.';
        await dbService.updateDealStatus(deal.id, 'Completed');
      }

      await dbService.updateDealEscrowStatus(deal.id, nextEscrow, note);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Error updating escrow milestone: ' + (err?.message || 'Failed'));
    } finally {
      setUpdatingDealId(null);
    }
  };

  // Resolve Citizen Support Query / Grievance
  const handleResolveQuery = async (queryId: string, status: SupportQuery['status']) => {
    setUpdatingQueryId(queryId);
    try {
      const note = queryResolutionText[queryId] || 'Inquiry addressed and verified by MSAMB nodal arbitration desk.';
      await dbService.updateSupportQueryStatus(queryId, status, note);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Error updating citizen query: ' + (err?.message || 'Failed'));
    } finally {
      setUpdatingQueryId(null);
    }
  };

  // Process Crop Registration Review (Approval / Rejection)
  const handleApproveCrop = async (crop: MongoCropItem) => {
    setIsProcessingCrop(true);
    try {
      const cropIdentifier = crop._id || crop.cropId || '';
      const benchmark = cropEditBenchmark ? parseFloat(cropEditBenchmark) : crop.marketBenchmarkPrice;
      await cropService.reviewCrop(cropIdentifier, {
        status: 'approved',
        marketBenchmarkPrice: benchmark,
      });
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D9FF55', '#3F754A', '#17362C'],
        });
      } catch (_) {}
      await loadAllAdminData();
      setSelectedCrop(null);
      setCropEditBenchmark('');
      if (onListingUpdated) onListingUpdated();
      alert(`Crop '${crop.nameEn}' approved and added to directory!`);
    } catch (err: any) {
      alert('Error approving crop: ' + err.message);
    } finally {
      setIsProcessingCrop(false);
    }
  };

  const handleRejectCrop = async (crop: MongoCropItem) => {
    if (!cropRejectionReason.trim()) {
      alert('Please provide a reason for rejecting this crop.');
      return;
    }
    setIsProcessingCrop(true);
    try {
      const cropIdentifier = crop._id || crop.cropId || '';
      await cropService.reviewCrop(cropIdentifier, {
        status: 'rejected',
        rejectionReason: cropRejectionReason.trim(),
      });
      await loadAllAdminData();
      setSelectedCrop(null);
      setCropRejectionReason('');
      if (onListingUpdated) onListingUpdated();
      alert(`Crop '${crop.nameEn}' request rejected.`);
    } catch (err: any) {
      alert('Error rejecting crop: ' + err.message);
    } finally {
      setIsProcessingCrop(false);
    }
  };

  // 1. Process Produce Listing Verification
  const handleProcessListingVerification = async (newStatus: ListingStatus) => {
    if (!selectedListing) return;
    setIsProcessing(true);
    try {
      const adminId = user?.id || 'ADMIN-MAHA-01';
      const adminName = user?.name || 'Dr. Suresh Patil (MSAMB Nodal Officer)';

      await dbService.verifyListing(selectedListing.id, adminId, adminName, {
        status: newStatus,
        verifiedGrade,
        notes: adminNotes,
        correctionsRequested: newStatus === 'More Information Required' ? correctionsRequested : undefined,
      });

      if (newStatus === 'Verified' || newStatus === 'Published') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D9FF55', '#3F754A', '#17362C'],
          });
        } catch (_) {}
      }

      await loadAllAdminData();
      if (onListingUpdated) onListingUpdated();
      alert(`Produce Lot #${selectedListing.listingCode} updated to '${newStatus}'!`);
    } catch (err: any) {
      alert('Error updating listing: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Process User KYC Verification
  const handleProcessKycVerification = async (newStatus: 'Verified' | 'Rejected' | 'More Information Required') => {
    if (!selectedKycReq) return;
    setIsProcessing(true);
    try {
      const adminId = user?.id || 'ADMIN-MAHA-01';
      const adminName = user?.name || 'Dr. Suresh Patil (MSAMB Nodal Officer)';

      await dbService.reviewVerificationRequest(
        selectedKycReq.id,
        adminId,
        adminName,
        newStatus,
        kycNotes,
        newStatus === 'More Information Required' ? kycRequestedInfo : undefined
      );

      if (newStatus === 'Verified') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D9FF55', '#3F754A', '#17362C'],
          });
        } catch (_) {}
      }

      await loadAllAdminData();
      alert(`User ${selectedKycReq.userName} KYC verification updated to '${newStatus}'!`);
    } catch (err: any) {
      alert('Error reviewing KYC: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Publish News Article
  const handlePublishNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleEn.trim() && !newsTitleMr.trim()) {
      alert('Please enter at least an English or Marathi title.');
      return;
    }

    setIsPublishingNews(true);
    setNewsSuccess(false);

    try {
      await dbService.createNews({
        titleEn: newsTitleEn || newsTitleMr,
        titleMr: newsTitleMr || newsTitleEn,
        titleHi: newsTitleHi || newsTitleMr || newsTitleEn,
        titleGu: newsTitleGu || newsTitleMr || newsTitleEn,
        summaryEn: newsSummaryEn || newsSummaryMr,
        summaryMr: newsSummaryMr || newsSummaryEn,
        summaryHi: newsSummaryMr || newsSummaryEn,
        summaryGu: newsSummaryMr || newsSummaryEn,
        category: newsCategory,
        categoryGu: 'સમાચાર',
        isPinned: newsIsPinned,
        authorName: user?.name || 'MSAMB Market Intelligence Desk',
      });

      setNewsTitleEn('');
      setNewsTitleMr('');
      setNewsTitleHi('');
      setNewsTitleGu('');
      setNewsSummaryEn('');
      setNewsSummaryMr('');
      setNewsSuccess(true);
      setTimeout(() => setNewsSuccess(false), 4000);
      await loadAllAdminData();
    } catch (err: any) {
      alert('Error publishing news: ' + err.message);
    } finally {
      setIsPublishingNews(false);
    }
  };

  const pendingKycCount = verificationRequests.filter((k) => k.status === 'Pending').length;
  const pendingListingCount = listings.filter((l) => l.status === 'Submitted' || l.status === 'Under Review').length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8" id="admin-dashboard">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-[#17362C] dark:bg-[#0B1E17] text-[#F6F1E4] border border-[#D9FF55]/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center font-black text-2xl shadow-xl">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#D9FF55]">
                GOVERNMENT OF MAHARASHTRA · MSAMB
              </span>
              <span className="text-[10px] font-black bg-[#D9FF55]/20 text-[#D9FF55] px-2.5 py-0.5 rounded-full border border-[#D9FF55]/30">
                {t('adminOfficerBadge')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight text-white mt-1">
              {t('adminVerificationQueueTitle')}
            </h1>
            <p className="text-xs text-[#F6F1E4]/70 mt-0.5">
              {t('nodalOfficerLabel')} <span className="font-bold text-[#D9FF55]">{user?.name || 'GSAMB Nodal Administrator'}</span> · {t('phoneLabel')} <span className="font-mono text-white">{user?.mobile || 'Authorized Portal'}</span>
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-lg font-black font-mono text-[#D9FF55]">{deals.length}</div>
            <div className="text-[10px] text-white/70 font-bold">{t('adminStatLiveOrders')}</div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-lg font-black font-mono text-[#D9FF55]">
              {transports.filter((t) => t.trackingStatus === 'In Transit' || t.trackingStatus === 'Loaded').length}
            </div>
            <div className="text-[10px] text-white/70 font-bold">{t('adminStatInTransit')}</div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-lg font-black font-mono text-amber-300">
              {supportQueries.filter((q) => q.status === 'Open').length}
            </div>
            <div className="text-[10px] text-white/70 font-bold">{t('adminStatOpenQueries')}</div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-lg font-black font-mono text-white">{pendingKycCount}</div>
            <div className="text-[10px] text-white/70 font-bold">{t('tabVerificationLabel')}</div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center">
            <div className="text-lg font-black font-mono text-white">{pendingListingCount}</div>
            <div className="text-[10px] text-white/70 font-bold">{t('statMyListings')}</div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#17362C]/15 dark:border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow-lg scale-105'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t('adminTabOrders')}</span>
          <span className="w-5 h-5 rounded-full bg-[#D9FF55] text-[#17362C] text-[10px] font-black flex items-center justify-center">
            {deals.length}
          </span>
          {supportQueries.filter((q) => q.status === 'Open').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" title="Open Citizen Queries" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kyc_queue')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'kyc_queue'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow-lg scale-105'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t('adminTabKyc')}</span>
          {pendingKycCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-[#17362C] text-[10px] font-black flex items-center justify-center">
              {pendingKycCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('listings_queue')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'listings_queue'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow-lg scale-105'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>3. {t('statMyListings')}</span>
          {pendingListingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-400 text-[#17362C] text-[10px] font-black flex items-center justify-center">
              {pendingListingCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crop_requests')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'crop_requests'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow-lg scale-105'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>{t('adminTabCropApprovals')}</span>
          {pendingCrops.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#D9FF55] text-[#17362C] text-[10px] font-black flex items-center justify-center animate-pulse">
              {pendingCrops.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow-lg scale-105'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('adminTabUsers', { count: usersList.length })}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile_logs')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile_logs'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow-lg scale-105'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t('adminTabAuditTrail')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'news'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow-lg scale-105'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>7. {t('tabNewsLabel')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('system_alerts')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'system_alerts'
              ? 'bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] shadow-lg scale-105'
              : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border border-[#17362C]/15 dark:border-white/10 hover:bg-black/5'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{t('adminTabSystemAlerts')}</span>
        </button>
      </div>

      {/* TAB 1: KYC VERIFICATION QUEUE */}
      {activeTab === 'kyc_queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left Column: KYC Requests List */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#17362C]/10 dark:border-white/10 pb-3">
              <div className="text-xs font-black text-[#132B23] dark:text-white">
                {t('kycRequestsTitle', { count: verificationRequests.length })}
              </div>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {verificationRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => {
                    setSelectedKycReq(req);
                    setKycNotes(req.adminNotes || '');
                    setKycRequestedInfo(req.requestedInfoNotes || '');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedKycReq?.id === req.id
                      ? 'bg-[#17362C] dark:bg-[#0B1E17] text-[#F6F1E4] border-[#17362C] shadow-md'
                      : 'bg-[#F6F1E4] dark:bg-[#0F172A] text-[#132B23] dark:text-white border-[#17362C]/15 dark:border-white/10 hover:border-[#3F754A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{req.userName}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        req.status === 'Verified'
                          ? 'bg-[#D9FF55] text-[#17362C]'
                          : req.status === 'Rejected'
                          ? 'bg-red-500 text-white'
                          : 'bg-amber-400 text-[#17362C]'
                      }`}
                    >
                      {translateStatus(req.status)}
                    </span>
                  </div>

                  <div className="text-[11px] opacity-80 flex items-center justify-between">
                    <span>{req.documentType}</span>
                    <span className="font-mono">{req.mobile}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Review Selected KYC */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-5">
            {selectedKycReq ? (
              <>
                <div className="border-b border-[#17362C]/10 dark:border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#132B23] dark:text-white">
                      {selectedKycReq.userName} ({selectedKycReq.userRole.toUpperCase()})
                    </h3>
                    <p className="text-xs text-[#132B23]/70 dark:text-white/60 font-mono">
                      User ID: {selectedKycReq.userId} · Phone: {selectedKycReq.mobile}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      selectedKycReq.status === 'Verified'
                        ? 'bg-[#D9FF55] text-[#17362C]'
                        : selectedKycReq.status === 'Rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-amber-400 text-[#17362C]'
                    }`}
                  >
                    Status: {translateStatus(selectedKycReq.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F6F1E4] dark:bg-[#0F172A] text-xs">
                  <div>
                    <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">Document Type:</span>
                    <span className="font-black text-[#132B23] dark:text-white">{selectedKycReq.documentType}</span>
                  </div>

                  <div>
                    <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">Doc / GSTIN:</span>
                    <span className="font-mono font-black text-[#132B23] dark:text-white">{selectedKycReq.documentNumber || 'N/A'}</span>
                  </div>

                  {selectedKycReq.additionalNotes && (
                    <div className="col-span-2">
                      <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">Notes:</span>
                      <span className="text-[#132B23] dark:text-white">{selectedKycReq.additionalNotes}</span>
                    </div>
                  )}
                </div>

                {selectedKycReq.documentUrl && (
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-[#132B23] dark:text-white">
                      Submitted Document Preview:
                    </label>
                    <div className="rounded-2xl overflow-hidden border border-[#17362C]/15 dark:border-white/10 max-h-56 bg-black/5 flex items-center justify-center p-2">
                      <img
                        src={selectedKycReq.documentUrl}
                        alt="Document Preview"
                        className="max-h-52 object-contain rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {/* Admin Inspection Actions */}
                <div className="space-y-4 pt-2 border-t border-[#17362C]/10 dark:border-white/10">
                  <div>
                    <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                      Official Nodal Verification Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={kycNotes}
                      onChange={(e) => setKycNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white focus:outline-none"
                      placeholder="Verified against Maharashtra Revenue Satbara records..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleProcessKycVerification('Verified')}
                      className="flex-1 py-3 rounded-2xl bg-[#3F754A] text-[#D9FF55] font-black text-xs shadow-md hover:bg-[#2e5737] cursor-pointer disabled:opacity-50"
                    >
                      ✓ {t('adminApproveBtn')}
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleProcessKycVerification('Rejected')}
                      className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-black text-xs shadow-md hover:bg-red-700 cursor-pointer disabled:opacity-50"
                    >
                      ✕ {t('adminRejectBtn')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-xs text-[#132B23]/60 dark:text-white/60">
                Please select a verification request from the list.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCE LISTINGS VERIFICATION */}
      {activeTab === 'listings_queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Listings List */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] p-5 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-4">
            <div className="text-xs font-black text-[#132B23] dark:text-white border-b border-[#17362C]/10 dark:border-white/10 pb-3">
              Produce Lots ({listings.length})
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {listings.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    setSelectedListing(l);
                    setVerifiedGrade(l.verifiedGrade || l.grade);
                    setAdminNotes(l.adminInspectionNotes || '');
                    setCorrectionsRequested(l.correctionsRequested || '');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedListing?.id === l.id
                      ? 'bg-[#17362C] dark:bg-[#0B1E17] text-[#F6F1E4] border-[#17362C] shadow-md'
                      : 'bg-[#F6F1E4] dark:bg-[#0F172A] text-[#132B23] dark:text-white border-[#17362C]/15 dark:border-white/10 hover:border-[#3F754A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{translateCrop(l.crop)} (#{l.listingCode})</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        l.status === 'Published' || l.status === 'Verified'
                          ? 'bg-[#D9FF55] text-[#17362C]'
                          : l.status === 'Rejected'
                          ? 'bg-red-500 text-white'
                          : 'bg-amber-400 text-[#17362C]'
                      }`}
                    >
                      {translateStatus(l.status)}
                    </span>
                  </div>

                  <div className="text-[11px] opacity-80 flex items-center justify-between">
                    <span>{l.quantity} {l.unit} · {translateDistrict(l.district)}</span>
                    <span className="font-bold">₹{l.expectedPrice}/{l.priceUnit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Selected Listing */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-5">
            {selectedListing ? (
              <>
                <div className="border-b border-[#17362C]/10 dark:border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#132B23] dark:text-white">
                      #{selectedListing.listingCode} · {translateCrop(selectedListing.crop)}
                    </h3>
                    <p className="text-xs text-[#132B23]/70 dark:text-white/60">
                      Farmer: <span className="font-bold text-[#132B23] dark:text-white">{selectedListing.farmerName}</span> ({selectedListing.farmerMobile})
                    </p>
                  </div>

                  <span className="text-xs font-black bg-[#D9FF55] text-[#17362C] px-3 py-1 rounded-full">
                    {translateStatus(selectedListing.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F6F1E4] dark:bg-[#0F172A] text-xs">
                  <div>
                    <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">{t('quantity')}:</span>
                    <span className="font-black text-[#132B23] dark:text-white">{selectedListing.quantity} {selectedListing.unit}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">{t('expectedPrice')}:</span>
                    <span className="font-black text-[#132B23] dark:text-white">₹{selectedListing.expectedPrice}/{selectedListing.priceUnit}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">{t('authDistrict')}:</span>
                    <span className="text-[#132B23] dark:text-white">{selectedListing.village}, {translateDistrict(selectedListing.district)}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">{t('variety')}:</span>
                    <span className="text-[#132B23] dark:text-white">{selectedListing.variety}</span>
                  </div>
                </div>

                {/* Grade & Admin Decision */}
                <div className="space-y-4 pt-2 border-t border-[#17362C]/10 dark:border-white/10">
                  <div>
                    <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                      MSAMB / AGMARK Grade:
                    </label>
                    <select
                      value={verifiedGrade}
                      onChange={(e) => setVerifiedGrade(e.target.value as QualityGrade)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white"
                    >
                      <option value="Grade A (Export / Super)">Grade A (Export / Super)</option>
                      <option value="Grade B (Premium Table)">Grade B (Premium Table)</option>
                      <option value="Grade C (Processing / Fair)">Grade C (Processing / Fair)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                      Inspection Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white"
                      placeholder="Moisture test, AGMARK certification..."
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleProcessListingVerification('Published')}
                      className="flex-1 py-3 rounded-2xl bg-[#3F754A] text-[#D9FF55] font-black text-xs shadow-md hover:bg-[#2e5737] cursor-pointer disabled:opacity-50"
                    >
                      ✓ {t('adminApproveBtn')}
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleProcessListingVerification('Rejected')}
                      className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-black text-xs shadow-md hover:bg-red-700 cursor-pointer disabled:opacity-50"
                    >
                      ✕ {t('adminRejectBtn')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-xs text-[#132B23]/60 dark:text-white/60">
                Please select a produce lot from the queue.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: CROP APPROVAL QUEUE */}
      {activeTab === 'crop_requests' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9FF55] animate-ping" />
                <h3 className="text-base font-black text-[#132B23] dark:text-white">
                  New Crop Registration Queue ({pendingCrops.length})
                </h3>
              </div>
              <p className="text-xs text-[#132B23]/70 dark:text-white/60 mt-1">
                Review farmer-submitted custom crops. Approved crops are instantly indexed in MongoDB Atlas and available to all platform users.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 text-xs font-mono font-bold text-[#17362C] dark:text-[#D9FF55]">
              Atlas Collection: <span className="underline">crops</span>
            </div>
          </div>

          {pendingCrops.length === 0 ? (
            <div className="bg-white dark:bg-[#1E293B] p-12 rounded-3xl border border-[#17362C]/15 dark:border-white/10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#3F754A]/20 text-[#3F754A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#3F754A]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-[#132B23] dark:text-white">
                  All Crop Requests Reviewed!
                </h4>
                <p className="text-xs text-[#132B23]/70 dark:text-white/60 max-w-sm mx-auto">
                  There are no pending crop registration requests from farmers at this time.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Pending Crop List */}
              <div className="lg:col-span-5 space-y-3">
                {pendingCrops.map((crop) => {
                  const isSelected = selectedCrop?._id === crop._id;
                  return (
                    <div
                      key={crop._id}
                      onClick={() => {
                        setSelectedCrop(crop);
                        setCropEditBenchmark(crop.marketBenchmarkPrice ? String(crop.marketBenchmarkPrice) : '');
                        setCropRejectionReason('');
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#17362C] text-[#F6F1E4] border-[#D9FF55]/40 shadow-lg scale-[1.01]'
                          : 'bg-white dark:bg-[#1E293B] text-[#132B23] dark:text-white border-[#17362C]/15 dark:border-white/10 hover:border-[#17362C]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {crop.imageUrl ? (
                            <img
                              src={crop.imageUrl}
                              alt={crop.nameEn}
                              className="w-12 h-12 rounded-xl object-cover border border-white/20"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-[#D9FF55]/20 text-[#17362C] dark:text-[#D9FF55] flex items-center justify-center font-bold text-lg">
                              🌱
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-black flex items-center gap-2">
                              {crop.nameEn}
                              {crop.nameGu && (
                                <span className={`text-xs font-normal ${isSelected ? 'text-[#D9FF55]' : 'text-gray-500 dark:text-gray-400'}`}>
                                  ({crop.nameGu})
                                </span>
                              )}
                            </h4>
                            <div className="text-[11px] opacity-75 font-mono">
                              Category: {crop.categoryCode || 'General'} · Variety: {crop.variety || 'Local'}
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-500 border border-amber-400/30">
                          Pending
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-current/10 flex items-center justify-between text-[11px] opacity-80">
                        <span>Submitted by: <strong className="font-mono">{typeof crop.createdBy === 'object' ? (crop.createdBy?.name || crop.createdBy?.phone) : (crop.createdBy || 'Farmer')}</strong></span>
                        <span>₹{crop.marketBenchmarkPrice || 0} / {crop.defaultUnit || 'quintal'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Detailed Review & Action Panel */}
              <div className="lg:col-span-7">
                {selectedCrop ? (
                  <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-5 sticky top-24">
                    <div className="flex items-start justify-between gap-4 border-b border-[#17362C]/10 dark:border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#3F754A] dark:text-[#D9FF55]">
                            CROP ID: {selectedCrop.cropId || selectedCrop._id}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-[#132B23] dark:text-white mt-1">
                          {selectedCrop.nameEn} {selectedCrop.nameGu ? `(${selectedCrop.nameGu})` : ''}
                        </h3>
                        <p className="text-xs text-[#132B23]/70 dark:text-white/60">
                          Normalized Slug: <code className="font-mono bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">{selectedCrop.normalizedName}</code>
                        </p>
                      </div>

                      {selectedCrop.imageUrl && (
                        <img
                          src={selectedCrop.imageUrl}
                          alt={selectedCrop.nameEn}
                          className="w-16 h-16 rounded-2xl object-cover shadow-md border border-[#17362C]/20"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F6F1E4] dark:bg-[#0F172A] text-xs">
                      <div>
                        <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">Category:</span>
                        <span className="font-black text-[#132B23] dark:text-white">{selectedCrop.categoryCode || 'General'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">Variety:</span>
                        <span className="font-black text-[#132B23] dark:text-white">{selectedCrop.variety || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">Typical Season:</span>
                        <span className="font-black text-[#132B23] dark:text-white">{selectedCrop.typicalSeason || 'Year Round'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">Default Unit:</span>
                        <span className="font-black text-[#132B23] dark:text-white uppercase">{selectedCrop.defaultUnit || 'quintal'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">Primary Market:</span>
                        <span className="font-black text-[#132B23] dark:text-white">{selectedCrop.primaryMarket || 'Local APMC'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#132B23]/60 dark:text-white/60 block">Registered By:</span>
                        <span className="font-mono text-[#132B23] dark:text-white">
                          {typeof selectedCrop.createdBy === 'object'
                            ? selectedCrop.createdBy?.name || selectedCrop.createdBy?.phone
                            : selectedCrop.createdBy || 'Farmer'}
                        </span>
                      </div>
                    </div>

                    {selectedCrop.farmerNotes && (
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
                        <span className="font-black block mb-0.5">Farmer Notes:</span>
                        {selectedCrop.farmerNotes}
                      </div>
                    )}

                    {/* Admin Benchmark Adjust & Approval Controls */}
                    <div className="space-y-4 pt-2 border-t border-[#17362C]/10 dark:border-white/10">
                      <div>
                        <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                          Official APMC Benchmark Price (₹ / {selectedCrop.defaultUnit || 'quintal'}):
                        </label>
                        <input
                          type="number"
                          value={cropEditBenchmark}
                          onChange={(e) => setCropEditBenchmark(e.target.value)}
                          placeholder={String(selectedCrop.marketBenchmarkPrice || 2500)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white"
                        />
                        <p className="text-[10px] text-[#132B23]/60 dark:text-white/50 mt-1">
                          You may calibrate the official MSAMB reference price before approving.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                          Rejection Reason (Required if rejecting):
                        </label>
                        <textarea
                          rows={2}
                          value={cropRejectionReason}
                          onChange={(e) => setCropRejectionReason(e.target.value)}
                          placeholder="e.g. Duplicate of existing listing, invalid crop classification, or missing details..."
                          className="w-full px-3.5 py-2 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs text-[#132B23] dark:text-white placeholder:text-gray-400"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          disabled={isProcessingCrop}
                          onClick={() => handleApproveCrop(selectedCrop)}
                          className="flex-1 py-3.5 rounded-2xl bg-[#3F754A] text-[#D9FF55] font-black text-xs shadow-md hover:bg-[#2e5737] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Publish Crop</span>
                        </button>

                        <button
                          type="button"
                          disabled={isProcessingCrop}
                          onClick={() => handleRejectCrop(selectedCrop)}
                          className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-black text-xs shadow-md hover:bg-red-700 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject Request</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#1E293B] p-8 rounded-3xl border border-[#17362C]/15 dark:border-white/10 text-center text-xs text-[#132B23]/60 dark:text-white/60">
                    Select a crop request from the list to review details.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#17362C]/10 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                Registered Platform Users ({usersList.length})
              </h3>
              <p className="text-xs text-[#132B23]/70 dark:text-white/60">
                Maharashtra farmer and buyer accounts database.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#132B23]/50 dark:text-white/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#17362C]/15 dark:border-white/10 bg-[#F6F1E4] dark:bg-[#0F172A] text-[#132B23] dark:text-white">
                  <th className="p-3 font-black">User ID</th>
                  <th className="p-3 font-black">Name</th>
                  <th className="p-3 font-black">Role</th>
                  <th className="p-3 font-black">Mobile</th>
                  <th className="p-3 font-black">District & Taluka</th>
                  <th className="p-3 font-black">Bank / GSTIN</th>
                  <th className="p-3 font-black">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#17362C]/10 dark:divide-white/10">
                {usersList
                  .filter((u) => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      u.name.toLowerCase().includes(q) ||
                      u.mobile.includes(q) ||
                      u.district.toLowerCase().includes(q) ||
                      u.id.toLowerCase().includes(q)
                    );
                  })
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#132B23] dark:text-white">{u.id}</td>
                      <td className="p-3 font-black text-[#132B23] dark:text-white">{u.name}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            u.role === 'farmer'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.role === 'buyer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#132B23] dark:text-white">{u.mobile}</td>
                      <td className="p-3 text-[#132B23]/80 dark:text-white/80">{u.village}, {translateDistrict(u.district)}</td>
                      <td className="p-3 font-mono text-[11px] text-[#132B23]/70 dark:text-white/60">
                        {u.role === 'farmer'
                          ? u.bankAccountNumber ? `A/C: ••••${u.bankAccountNumber.slice(-4)} (${u.bankIfscCode || 'Bank'})` : 'No Bank Added'
                          : u.gstNumber || u.companyName || 'Corporate Buyer'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            u.isVerified || u.verificationStatus === 'Verified'
                              ? 'bg-[#D9FF55] text-[#17362C]'
                              : 'bg-amber-400 text-[#17362C]'
                          }`}
                        >
                          {translateStatus(u.verificationStatus || (u.isVerified ? 'Verified' : 'Pending'))}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE CHANGES AUDIT */}
      {activeTab === 'profile_logs' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-4 animate-fade-in">
          <div className="border-b border-[#17362C]/10 dark:border-white/10 pb-3">
            <h3 className="text-base font-black text-[#132B23] dark:text-white">
              Profile Audit Logs
            </h3>
            <p className="text-xs text-[#132B23]/70 dark:text-white/60">
              Immutable ledger of user account modifications and banking credentials.
            </p>
          </div>

          <div className="space-y-3">
            {profileLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#132B23]/60 dark:text-white/60">
                No profile modifications logged yet.
              </div>
            ) : (
              profileLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#132B23] dark:text-white">{log.userName} ({log.role.toUpperCase()})</span>
                    <span className="font-mono text-[10px] text-[#132B23]/60 dark:text-white/60">
                      {new Date(log.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#132B23]/80 dark:text-white/80">
                    Modified fields: <span className="font-bold text-[#3F754A] dark:text-[#88d49e]">{log.changedFields.join(', ')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 1: ORDERS COMMAND CENTER */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-6 animate-fade-in">
          {/* Orders Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#17362C]/10 dark:border-white/10">
            <div>
              <h2 className="text-xl font-black font-editorial text-[#132B23] dark:text-white">
                Live Orders & Fulfillment Command Center
              </h2>
              <p className="text-xs text-[#132B23]/70 dark:text-white/60">
                End-to-end telemetry: Track physical transport milestones ("Where Order Reach") and financial escrow ("How Much Payment Done").
              </p>
            </div>
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#132B23]/50 dark:text-white/50" />
              <input
                type="text"
                placeholder="Search orders, crop, farmer..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 text-[#132B23] dark:text-white placeholder:text-[#132B23]/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#D9FF55]"
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {deals
              .filter((deal) => {
                if (!orderSearch.trim()) return true;
                const q = orderSearch.toLowerCase();
                return (
                  deal.dealCode.toLowerCase().includes(q) ||
                  deal.crop.toLowerCase().includes(q) ||
                  deal.farmerName.toLowerCase().includes(q) ||
                  deal.buyerName.toLowerCase().includes(q)
                );
              })
              .map((deal) => {
              const transport = transports.find(t => t.dealId === deal.id || t.dealId === deal.dealCode);
              return (
                <div key={deal.id} className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-[#132B23] dark:text-white">{deal.dealCode}</h3>
                      <p className="text-sm text-[#132B23]/70 dark:text-white/60">{deal.crop} - {deal.agreedQuantity} {deal.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-[#132B23] dark:text-white">₹{deal.totalEstimatedValue || deal.totalAmountINR || 0}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-[#132B23] dark:text-white">Where Order Reach</h4>
                    <div className="space-y-2">
                      {[ 'Farm-Gate Loading', 'In Transit on Highway', 'Factory Gate Weighbridge Inward', 'Quality Passed & Unloaded' ].map((stage, index) => {
                        const isStageComplete =
                          (index === 0 && (transport?.trackingStatus === 'Loaded' || transport?.trackingStatus === 'In Transit' || transport?.trackingStatus === 'Delivered')) ||
                          (index === 1 && (transport?.trackingStatus === 'In Transit' || transport?.trackingStatus === 'Delivered')) ||
                          (index === 2 && transport?.trackingStatus === 'Delivered') ||
                          (index === 3 && transport?.trackingStatus === 'Delivered');

                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${isStageComplete ? 'bg-[#D9FF55]' : 'bg-[#17362C]/20 dark:bg-white/20'}`} />
                            <span className="text-xs text-[#132B23] dark:text-white">{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-[#132B23] dark:text-white">How Much Payment Done</h4>
                    <div className="space-y-2">
                      {[ '20% Advance Escrow', '50% Dispatch Weighment', 'Lab Quality Clearance', '100% Final Settlement' ].map((stage, index) => {
                        const isPayComplete =
                          (index === 0 && deal.escrowStatus !== 'Awaiting Buyer Deposit') ||
                          (index === 1 && (deal.escrowStatus === 'Funds Deposited' || deal.escrowStatus === 'Funds Locked in Escrow' || deal.escrowStatus === 'Quality Passed - Disbursing' || deal.escrowStatus === 'Completed & Credited')) ||
                          (index === 2 && (deal.escrowStatus === 'Quality Passed - Disbursing' || deal.escrowStatus === 'Completed & Credited')) ||
                          (index === 3 && deal.escrowStatus === 'Completed & Credited');

                        return (
                          <div key={index} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${isPayComplete ? 'bg-[#D9FF55]' : 'bg-[#17362C]/20 dark:bg-white/20'}`} />
                            <span className="text-xs text-[#132B23] dark:text-white">{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => handleAdvanceTransportCheckpoint(deal)}
                      disabled={updatingDealId === deal.id}
                      className="flex-1 py-2 rounded-2xl bg-[#3F754A] text-[#D9FF55] font-black text-xs shadow-md hover:bg-[#2e5737] cursor-pointer disabled:opacity-50"
                    >
                      Advance Logistics
                    </button>
                    <button
                      onClick={() => handleAdvanceEscrowStatus(deal)}
                      disabled={updatingDealId === deal.id}
                      className="flex-1 py-2 rounded-2xl bg-[#3F754A] text-[#D9FF55] font-black text-xs shadow-md hover:bg-[#2e5737] cursor-pointer disabled:opacity-50"
                    >
                      Advance Escrow
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Citizen Queries & Grievances Console */}
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm">
            <div className="border-b border-[#17362C]/10 dark:border-white/10 pb-4">
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                Citizen Queries & Grievances Console
              </h3>
              <p className="text-xs text-[#132B23]/70 dark:text-white/60">
                Manage and resolve support tickets from farmers and buyers
              </p>
            </div>
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setQueryFilter('all')}
                className={queryFilter === 'all' ? 'px-3 py-1.5 rounded-full bg-[#17362C] text-[#D9FF55] font-black' : 'px-3 py-1.5 rounded-full bg-[#F6F1E4] dark:bg-[#0F172A] text-[#132B23] dark:text-white hover:bg-[#17362C]/10'}
              >
                All
              </button>
              <button
                onClick={() => setQueryFilter('Open')}
                className={queryFilter === 'Open' ? 'px-3 py-1.5 rounded-full bg-[#17362C] text-[#D9FF55] font-black' : 'px-3 py-1.5 rounded-full bg-[#F6F1E4] dark:bg-[#0F172A] text-[#132B23] dark:text-white hover:bg-[#17362C]/10'}
              >
                Open
              </button>
              <button
                onClick={() => setQueryFilter('Under Investigation')}
                className={queryFilter === 'Under Investigation' ? 'px-3 py-1.5 rounded-full bg-[#17362C] text-[#D9FF55] font-black' : 'px-3 py-1.5 rounded-full bg-[#F6F1E4] dark:bg-[#0F172A] text-[#132B23] dark:text-white hover:bg-[#17362C]/10'}
              >
                Under Investigation
              </button>
              <button
                onClick={() => setQueryFilter('Resolved')}
                className={queryFilter === 'Resolved' ? 'px-3 py-1.5 rounded-full bg-[#17362C] text-[#D9FF55] font-black' : 'px-3 py-1.5 rounded-full bg-[#F6F1E4] dark:bg-[#0F172A] text-[#132B23] dark:text-white hover:bg-[#17362C]/10'}
              >
                Resolved
              </button>
            </div>

            {/* Queries List */}
            <div className="space-y-4">
              {supportQueries
                .filter((query) => {
                  if (queryFilter === 'all') return true;
                  return query.status === queryFilter;
                })
                .map((query) => {
                  const isUpdating = updatingQueryId === query.id;
                  const isResolved = query.status === 'Resolved';
                  const isInvestigating = query.status === 'Under Investigation';

                  const priorityColors = {
                    Urgent: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
                    High: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
                    Medium: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
                  };

                  const statusColors = {
                    Open: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300',
                    'Under Investigation': 'bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 border-sky-300',
                    Resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300',
                  };

                  return (
                    <div
                      key={query.id}
                      className="p-5 rounded-2xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#17362C]/10 dark:border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-[#132B23] dark:text-white font-mono">
                            {query.queryNo}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#17362C]/10 dark:bg-white/10 text-[#17362C] dark:text-[#D9FF55]">
                            {query.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColors[query.priority] || priorityColors.Medium}`}>
                            {query.priority} Priority
                          </span>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${statusColors[query.status] || statusColors.Open}`}>
                          {query.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#132B23]/80 dark:text-white/80">
                        <div>
                          <span className="font-bold">Citizen: </span>
                          <span>{query.userName}</span>
                          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-[#17362C]/10 dark:bg-white/10 font-bold uppercase">
                            {query.userRole}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold">Mobile: </span>
                          <span className="font-mono">{query.userMobile}</span>
                        </div>
                        {query.dealCode && (
                          <div>
                            <span className="font-bold">Deal Ref: </span>
                            <span className="font-mono text-emerald-700 dark:text-emerald-400">{query.dealCode}</span>
                          </div>
                        )}
                        {query.crop && (
                          <div>
                            <span className="font-bold">Crop: </span>
                            <span>{query.crop}</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-white/80 dark:bg-black/20 p-3 rounded-xl border border-[#17362C]/10 dark:border-white/5 space-y-1">
                        <h4 className="font-bold text-xs text-[#132B23] dark:text-white">
                          {query.subject}
                        </h4>
                        <p className="text-xs text-[#132B23]/70 dark:text-white/70 whitespace-pre-wrap">
                          {query.description}
                        </p>
                      </div>

                      {query.adminResolutionNote && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800/40 text-xs">
                          <span className="font-black text-emerald-900 dark:text-emerald-300">Resolution Note: </span>
                          <span className="text-emerald-800 dark:text-emerald-400">{query.adminResolutionNote}</span>
                          {query.resolvedAt && (
                            <div className="text-[10px] text-emerald-700 dark:text-emerald-500 mt-1">
                              Resolved: {new Date(query.resolvedAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      )}

                      {!isResolved && (
                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            placeholder="Type resolution or investigation note..."
                            value={queryResolutionText[query.id] || ''}
                            onChange={(e) =>
                              setQueryResolutionText((prev) => ({
                                ...prev,
                                [query.id]: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-[#132B23] dark:text-white placeholder:text-[#132B23]/40 dark:placeholder:text-white/40"
                          />
                          <div className="flex items-center gap-2">
                            {!isInvestigating && (
                              <button
                                onClick={() => handleResolveQuery(query.id, 'Under Investigation')}
                                disabled={isUpdating}
                                className="px-4 py-1.5 rounded-xl bg-[#F6F1E4] dark:bg-[#1E293B] hover:bg-[#17362C]/10 border border-[#17362C]/20 dark:border-white/20 text-[#132B23] dark:text-white font-bold text-xs cursor-pointer disabled:opacity-50"
                              >
                                Mark Under Investigation
                              </button>
                            )}
                            <button
                              onClick={() => handleResolveQuery(query.id, 'Resolved')}
                              disabled={isUpdating}
                              className="px-4 py-1.5 rounded-xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] font-black text-xs hover:bg-[#244E3E] cursor-pointer disabled:opacity-50 shadow-sm"
                            >
                              {isUpdating ? 'Saving...' : 'Resolve Query'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              {supportQueries.filter((query) => queryFilter === 'all' || query.status === queryFilter).length === 0 && (
                <div className="py-8 text-center text-xs text-[#132B23]/60 dark:text-white/50">
                  No citizen queries found in this category.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: NEWS PUBLISHING */}
      {activeTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* News Publisher Form */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-4">
            <div className="border-b border-[#17362C]/10 dark:border-white/10 pb-3">
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                Publish Official Advisory / News
              </h3>
            </div>

            {newsSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Advisory successfully published to farmers & buyers!</span>
              </div>
            )}

            <form onSubmit={handlePublishNews} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                  Category *
                </label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white"
                >
                  <option value="MSP & Rates">MSP & Mandi Rates</option>
                  <option value="Government Schemes">Government Schemes (Maharashtra)</option>
                  <option value="Market Advisory">Market Advisory</option>
                  <option value="Weather & Logistics">Weather & Logistics</option>
                  <option value="Platform Updates">Platform Updates</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newsTitleEn}
                  onChange={(e) => setNewsTitleEn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white"
                  placeholder="e.g. Maharashtra Onion Storage Subsidy Scheme 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                  Title (Marathi)
                </label>
                <input
                  type="text"
                  value={newsTitleMr}
                  onChange={(e) => setNewsTitleMr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white"
                  placeholder="उदा. महाराष्ट्र कांदा साठवणूक अनुदान योजना २०२६"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                  Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newsSummaryEn}
                  onChange={(e) => setNewsSummaryEn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/20 dark:border-white/10 text-xs font-bold text-[#132B23] dark:text-white"
                  placeholder="Official advisory notes for farmers..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinAdvisory"
                  checked={newsIsPinned}
                  onChange={(e) => setNewsIsPinned(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="pinAdvisory" className="text-xs font-bold text-[#132B23] dark:text-white cursor-pointer">
                  Pin to top of news feed
                </label>
              </div>

              <button
                type="submit"
                disabled={isPublishingNews}
                className="w-full py-3 rounded-2xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] font-black text-xs shadow-lg hover:bg-[#244E3E] cursor-pointer disabled:opacity-50"
              >
                {isPublishingNews ? 'Publishing...' : 'Publish Advisory'}
              </button>
            </form>
          </div>

          {/* Published Articles List */}
          <div className="lg:col-span-6 bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-4">
            <div className="border-b border-[#17362C]/10 dark:border-white/10 pb-3 flex items-center justify-between">
              <h3 className="text-base font-black text-[#132B23] dark:text-white">
                Live Published Advisories ({news.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {news.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#F6F1E4] dark:bg-[#0F172A] border border-[#17362C]/15 dark:border-white/10 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#132B23] dark:text-white">
                      {language === 'mr' ? (item.titleMr || item.titleEn) :
                       language === 'hi' ? (item.titleHi || item.titleEn) :
                       language === 'gu' ? (item.titleGu || item.titleEn) :
                       item.titleEn}
                    </span>
                    <span className="text-[10px] font-bold bg-[#17362C]/10 dark:bg-white/10 px-2 py-0.5 rounded text-[#17362C] dark:text-[#D9FF55]">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#132B23]/75 dark:text-white/75">
                    {language === 'mr' ? (item.summaryMr || item.summaryEn) :
                     language === 'hi' ? (item.summaryHi || item.summaryEn) :
                     language === 'gu' ? (item.summaryGu || item.summaryEn) :
                     item.summaryEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ADMIN ALERTS */}
      {activeTab === 'system_alerts' && (
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-sm space-y-4 animate-fade-in">
          <div className="border-b border-[#17362C]/10 dark:border-white/10 pb-3">
            <h3 className="text-base font-black text-[#132B23] dark:text-white">
              Official MSAMB System Notifications
            </h3>
          </div>

          <div className="space-y-3">
            {adminNotifications.map((n) => (
              <div key={n.id} className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-950 dark:text-amber-200">
                    {language === 'mr' ? (n.titleMr || n.titleEn) :
                     language === 'hi' ? (n.titleHi || n.titleEn) :
                     language === 'gu' ? (n.titleGu || n.titleEn) :
                     n.titleEn}
                  </span>
                  <span className="text-[10px] text-amber-800 dark:text-amber-400 font-bold">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-[11px] text-amber-900 dark:text-amber-300">
                  {language === 'mr' ? (n.messageMr || n.messageEn) :
                   language === 'hi' ? (n.messageHi || n.messageEn) :
                   language === 'gu' ? (n.messageGu || n.messageEn) :
                   n.messageEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
