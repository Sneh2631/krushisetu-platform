export type Language = 'en' | 'hi' | 'gu' | 'mr';
export type UserRole = 'farmer' | 'buyer' | 'admin';

export type CropCategory =
  | 'Oilseeds & Pulses'
  | 'Cash Crops & Spices'
  | 'Cereals & Grains'
  | 'Horticulture & Fruits'
  | 'Vegetables'
  | 'Fruits'
  | 'Spices'
  | 'Oilseeds'
  | 'Pulses'
  | 'Grains';

export type MaharashtraCrop =
  | 'Soybean'
  | 'Cotton'
  | 'Sugarcane'
  | 'Onion'
  | 'Grapes'
  | 'Pomegranate'
  | 'Tur'
  | 'Jowar'
  | 'Bajra'
  | 'Rice'
  | 'Wheat'
  | 'Turmeric';

export type LegacyCrop =
  | 'Potato'
  | 'Tomato'
  | 'GreenChillies'
  | 'BottleGourd'
  | 'BitterGourd'
  | 'Banana'
  | 'KesarMango'
  | 'Papaya'
  | 'Dates'
  | 'Cumin'
  | 'Fennel'
  | 'Coriander'
  | 'Mustard'
  | 'Fenugreek';

export type Crop = MaharashtraCrop | LegacyCrop | (string & {});

export type MaharashtraMandi =
  | 'Lasalgaon'
  | 'Pune'
  | 'Nashik'
  | 'Nagpur'
  | 'Kolhapur'
  | 'Solapur'
  | 'Latur'
  | 'Jalgaon'
  | 'Ahmednagar'
  | 'ChhatrapatiSambhajinagar'
  | 'Amravati'
  | 'Satara';

export type LegacyMandi = 'Gondal' | 'Rajkot' | 'Surat' | 'Ahmedabad' | 'Unjha' | 'Mahuva' | 'Deesa' | 'Dholka';

export type MandiMarket = MaharashtraMandi | LegacyMandi;
export type QualityGrade =
  | 'Grade A (Export / Super)'
  | 'Grade B (Premium Table)'
  | 'Grade C (Processing / Fair)'
  | 'Grade A (Super)'
  | 'Grade A'
  | 'Grade B'
  | 'Grade C';

export type ListingStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'More Information Required'
  | 'Verified'
  | 'Rejected'
  | 'Published'
  | 'Reserved'
  | 'Sold'
  | 'Completed'
  | 'Expired'
  | 'Active'
  | 'Under Offer'
  | 'Matched'
  | 'Dispatched';

export type OfferStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Countered' | 'Expired' | 'Withdrawn';

export type DealStatus =
  | 'Discussion Started'
  | 'Offer Accepted'
  | 'Pickup Scheduled'
  | 'Product Collected'
  | 'In Transit'
  | 'Delivered'
  | 'Payment Pending'
  | 'Completed'
  | 'Cancelled'
  | 'Disputed';

export type TransportStatus = 'Pending' | 'Assigned' | 'En Route' | 'Loaded' | 'In Transit' | 'Delivered' | 'Cancelled';

export interface ListingPhoto {
  id: string;
  url: string;
  isPrimary?: boolean;
  name?: string;
  sizeBytes?: number;
  uploadedAt: string;
}

export interface ListingVerificationRecord {
  id: string;
  listingId: string;
  adminId: string;
  adminName: string;
  previousStatus: ListingStatus;
  newStatus: ListingStatus;
  verifiedGrade?: QualityGrade;
  inspectionNotes?: string;
  correctionsRequested?: string;
  createdAt: string;
}

export interface ProduceListing {
  id: string;
  listingCode: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  farmerPhone?: string;
  category: CropCategory;
  crop: Crop;
  cropGu?: string;
  cropHi?: string;
  cropMr?: string;
  variety: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'tonne' | 'Ton' | 'Kg';
  minPurchaseQuantity: number;
  grade: QualityGrade;
  verifiedGrade?: QualityGrade;
  harvestDate: string;
  freshnessCondition?: string;
  isOrganic?: boolean;
  organicCertUrl?: string;
  description?: string;
  voiceNoteUrl?: string;
  expectedPrice: number; // in INR
  priceUnit: 'kg' | 'quintal' | 'tonne';
  suggestedPriceMin?: number;
  suggestedPriceMax?: number;
  district: string;
  taluka?: string;
  village: string;
  pickupAddress: string;
  pickupReadyDate?: string;
  pickupAvailableUntil?: string;
  availableUntil?: string;
  storageAvailable: boolean;
  transportNeeded: boolean;
  status: ListingStatus;
  adminInspectionNotes?: string;
  correctionsRequested?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  offersCount: number;
  primaryImageUrl?: string;
  imageUrl?: string;
  photos: ListingPhoto[];
  verificationHistory?: ListingVerificationRecord[];
  verifiedByFPO?: boolean;
  isPendingCropApproval?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility interface for legacy views
export interface ProduceLot {
  id: string;
  farmerName: string;
  farmerPhone: string;
  crop: Crop;
  variety: string;
  quantity: number;
  unit: 'Kg' | 'Ton' | 'kg' | 'tonne' | 'tonnes';
  grade: QualityGrade;
  harvestDate: string;
  district: string;
  village: string;
  expectedPrice: number;
  availableUntil: string;
  storageAvailable: boolean;
  transportNeeded: boolean;
  status: ListingStatus;
  offersCount: number;
  createdAt: string;
  imageUrl?: string;
  verifiedByFPO?: boolean;
}

export interface BuyerOffer {
  id: string;
  offerCode?: string;
  listingId: string;
  listingCode?: string;
  crop: Crop;
  cropGu?: string;
  cropHi?: string;
  cropMr?: string;
  variety?: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerMobile: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  requiredQuantity: number;
  unit: 'kg' | 'quintal' | 'tonne' | 'Ton' | 'Kg';
  offeredPrice: number; // in INR per unit/quintal
  priceUnit: 'kg' | 'quintal' | 'tonne';
  preferredPickupDate?: string;
  transportResponsibility: 'Buyer Organized' | 'Farmer Arranged' | 'KrushiSetu Pooled Logistics';
  message?: string;
  status: OfferStatus;
  counterPrice?: number;
  counterQuantity?: number;
  counterNotes?: string;
  escrowReady?: boolean;
  validUntil?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Deal {
  id: string;
  dealCode: string;
  offerId?: string;
  listingId: string;
  farmerId: string;
  farmerName: string;
  farmerMobile: string;
  farmerVillage?: string;
  farmerDistrict?: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerMobile: string;
  crop: Crop;
  cropGu?: string;
  cropHi?: string;
  cropMr?: string;
  variety: string;
  agreedQuantity: number;
  unit: 'kg' | 'quintal' | 'tonne' | 'Ton' | 'Kg';
  agreedPrice?: number;
  agreedPricePerUnit?: number;
  priceUnit?: 'kg' | 'quintal' | 'tonne';
  totalEstimatedValue: number;
  totalAmountINR?: number;
  pickupAddress: string;
  deliveryDestination?: string;
  pickupDate: string;
  deliveryDate?: string;
  transportResponsibility: 'Buyer Organized' | 'Farmer Arranged' | 'KrushiSetu Pooled Logistics';
  escrowStatus: 'Funds Locked in Escrow' | 'Quality Passed - Disbursing' | 'Completed & Credited' | 'Awaiting Buyer Deposit' | 'Funds Deposited' | 'Released to Farmer' | 'Refunded';
  escrowReference?: string;
  status: DealStatus;
  notes?: string;
  transportId?: string;
  ratingGivenByBuyer?: number;
  ratingGivenByFarmer?: number;
  farmerRating?: number;
  buyerRating?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportRequest {
  id: string;
  dealId: string;
  dealCode?: string;
  pickupLocation?: {
    address: string;
    village: string;
    district: string;
  };
  dropLocation?: {
    companyName: string;
    address: string;
    district: string;
  };
  pickupAddress?: string;
  deliveryAddress?: string;
  crop?: string;
  productType?: string;
  quantityTonne?: number;
  weightKg?: number;
  scheduledPickupTime?: string;
  vehicleType: 'Pickup (1.5T)' | 'Eicher (4T)' | 'Heavy Truck (10T)' | 'Cold Van (3T)';
  pickupDate?: string;
  estimatedCost: number;
  estimatedFreightCostINR?: number;
  assignedTransporter?: string;
  driverName?: string;
  driverMobile?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  status?: string;
  trackingStatus?: TransportStatus;
  currentMilestoneNotes?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string; // 'all' or specific user ID
  recipientRole?: UserRole | 'all';
  isAdminOnly?: boolean;
  type:
    | 'verification'
    | 'listing_approved'
    | 'listing_rejected'
    | 'info_requested'
    | 'buyer_interest'
    | 'new_offer'
    | 'offer_received'
    | 'counter_offer'
    | 'offer_accepted'
    | 'offer_rejected'
    | 'pickup_scheduled'
    | 'delivery_updated'
    | 'payment_escrow'
    | 'payment_released'
    | 'system';
  titleEn: string;
  titleGu?: string;
  titleHi?: string;
  titleMr?: string;
  messageEn: string;
  messageGu?: string;
  messageHi?: string;
  messageMr?: string;
  linkTarget?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'listing' | 'profile' | 'deal' | 'offer' | 'dispute' | 'user' | 'payout' | 'document';
  targetId: string;
  targetCode?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  fullName: string;
  mobile: string;
  village: string;
  taluka: string;
  district: string;
  pinCode: string;
  pickupAddress: string;
  farmSize?: string;
  crops?: Crop[];
  storageAvailable?: boolean;
  transportNeeded?: boolean;
  isVerified: boolean;
  identityDocType?: string;
  identityDocUrl?: string;
  rating: number;
  totalDealsCompleted: number;
  createdAt: string;
}

export interface BuyerProfile {
  id: string;
  userId?: string;
  name: string;
  mobile?: string;
  company: string;
  buyerType: 'Institutional' | 'Food Processor' | 'Exporter' | 'Retail Chain' | 'Agri Aggregator';
  district: string;
  deliveryLocation: string;
  gstNumber?: string;
  verified: boolean;
  reliabilityScore: number; // 0 - 100
  completedDeals: number;
  paymentDays: number; // e.g. 1 day, 2 days
  requiredCrop: Crop;
  requiredQuantity: string;
  offeredPrice: number; // ₹/quintal
  qualitySpec: string;
  escrowProtected: boolean;
  badge: 'Top Tier' | 'Verified Corporate' | 'MSAMB Partner' | 'FPO Preferred';
}

export interface MarketPriceDetail {
  channelName: string;
  buyerType: 'APMC Mandi' | 'Food Processor' | 'Institutional Buyer' | 'Digital e-NAM / Direct' | 'Exporter';
  location: string;
  grossPrice: number; // ₹/qtl
  mandiCess: number; // ₹/qtl
  handlingFee: number; // ₹/qtl
  transportCost: number; // ₹/qtl
  storageCost: number; // ₹/qtl
  netRealization: number; // ₹/qtl
  distanceKm: number;
  paymentTerm: string;
  reliability: number;
  isHighestNet: boolean;
  advantageNote?: string;
}

export interface PriceComparisonData {
  crop: Crop;
  baseMandi: MandiMarket;
  marketDetails: MarketPriceDetail[];
  sevenDayTrend: { day: string; mandi: number; institutional: number; processor: number }[];
  highestNetSummary: string;
  optimalRecommendation: string;
}

export interface PriceForecast {
  crop: Crop;
  district: string;
  period: '3 Days' | '7 Days' | '14 Days' | '30 Days';
  currentPrice: number;
  predictedPrice: number;
  priceChangePercent: number;
  trendDirection: 'up' | 'down' | 'neutral';
  expectedDemand: 'Very High' | 'High' | 'Moderate' | 'Low';
  arrivalPressure: 'Low Arrivals (Supply Tight)' | 'Moderate Arrivals' | 'High Arrivals (Peak Season)';
  confidenceScore: number; // e.g. 94.2%
  recommendedWindow: string; // e.g. "Hold 3-4 days (28 Aug - 31 Aug)"
  bestDestination: string; // e.g. "Pune Institutional Buyer"
  explanation: string;
  historicalSupplyPoints: { label: string; price: number; arrivalTons: number }[];
}

export interface LogisticsStop {
  id: string;
  name: string;
  type: 'Farm' | 'FPO Aggregation Hub' | 'Warehouse' | 'Buyer Facility';
  location: string;
  loadWeightKg: number;
  coordinates: { x: number; y: number };
  status: 'Pending' | 'Loaded' | 'In-Transit' | 'Delivered';
}

export interface LogisticsPlan {
  planId: string;
  stops: LogisticsStop[];
  totalDistanceBeforeKm: number;
  totalDistanceOptimizedKm: number;
  regularCostPerKg: number;
  optimizedCostPerKg: number;
  savingsPercentage: number;
  totalFarmerSavingsRs: number;
  co2SavedKg: number;
  vehicleType: string;
  estimatedTransitHours: number;
  routeSequence: string[];
}

export interface StorageFacility {
  id: string;
  name: string;
  type: 'Cold Storage' | 'Warehouse (WDRA Accr.)' | 'Silo Facility' | 'FPO Rural Godown';
  district: string;
  distanceKm: number;
  totalCapacityMt: number;
  availableCapacityMt: number;
  ratePerQtlPerDay: number; // ₹
  supportedCrops: Crop[];
  temperatureRange: string;
  insuranceCovered: boolean;
  estimatedGain3Days: {
    priceRiseGainRs: number;
    storageCostRs: number;
    netBenefitRs: number;
  };
}

export interface PaymentMilestone {
  step: number;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  referenceId?: string;
}

export interface PaymentTransaction {
  id: string;
  lotId: string;
  crop: Crop;
  buyerName: string;
  buyerCompany: string;
  quantityQtl: number;
  unitPriceRs: number;
  totalAmountRs: number;
  escrowStatus: 'Funds Deposited in Escrow' | 'Quality Passed - Disbursing' | 'Completed & Credited' | 'Awaiting Buyer Deposit';
  bankReference: string;
  timeline: PaymentMilestone[];
}

export interface GrievanceTicket {
  id: string;
  grievanceNo: string;
  transactionId: string;
  category: 'Payment Delay' | 'Quality Grade Dispute' | 'Weighment Mismatch' | 'Logistics Delay' | 'Contract Default';
  description: string;
  preferredLanguage: Language;
  evidenceFile?: string;
  status: 'Submitted' | 'Under Investigation' | 'FPO Conciliation' | 'Resolved';
  resolutionNote?: string;
  createdAt: string;
  slaDays: number;
}

export interface SupportQuery {
  id: string;
  queryNo: string;
  userId: string;
  userName: string;
  userRole: 'farmer' | 'buyer';
  userMobile: string;
  dealCode?: string;
  crop?: string;
  category: 'Payment Delay' | 'Weighbridge Dispute' | 'Logistics Delay' | 'Quality Assay Dispute' | 'General Inquiry';
  subject: string;
  description: string;
  priority: 'High' | 'Medium' | 'Urgent';
  status: 'Open' | 'Under Investigation' | 'Resolved';
  adminResolutionNote?: string;
  resolvedAt?: string;
  updatedAt?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  email?: string;
  role: UserRole;
  accountType: 'farmer' | 'fpo' | 'buyer' | 'admin';
  state: string;
  district: string;
  taluka?: string;
  village: string;
  pinCode?: string;
  pickupAddress?: string;
  preferredLanguage: Language;
  isVerified: boolean;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected' | 'More Information Required';
  rejectionReason?: string;
  // Farmer specific
  fpoName?: string;
  crops?: string[];
  farmSize?: string;
  storageAvailable?: boolean;
  transportNeeded?: boolean;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  upiId?: string;
  identityDocType?: string;
  identityDocUrl?: string;
  identityDocNumber?: string;
  // Buyer specific
  companyName?: string;
  buyerType?: string;
  gstNumber?: string;
  panNumber?: string;
  requiredCommodities?: string[];
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  mobile: string;
  documentType: string;
  documentNumber?: string;
  documentUrl: string;
  additionalNotes?: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'More Information Required';
  adminId?: string;
  adminName?: string;
  adminNotes?: string;
  requestedInfoNotes?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDocument {
  id: string;
  userId: string;
  documentType: string;
  title: string;
  fileUrl: string;
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  titleEn: string;
  titleGu?: string;
  titleHi?: string;
  titleMr?: string;
  summaryEn: string;
  summaryGu?: string;
  summaryHi?: string;
  summaryMr?: string;
  contentEn?: string;
  contentGu?: string;
  contentHi?: string;
  contentMr?: string;
  category: 'MSP & Rates' | 'Government Schemes' | 'Market Advisory' | 'Weather & Logistics' | 'Platform Updates';
  categoryGu?: string;
  categoryHi?: string;
  categoryMr?: string;
  tag?: string;
  isPinned?: boolean;
  authorName?: string;
  imageUrl?: string;
  publishedAt: string;
  createdAt: string;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerMobile: string;
  companyName?: string;
  category: CropCategory;
  crop: Crop;
  cropGu?: string;
  cropMr?: string;
  cropHi?: string;
  requiredQuantity: number;
  unit: 'kg' | 'quintal' | 'tonne' | 'Ton';
  targetPrice?: number;
  priceUnit?: 'kg' | 'quintal' | 'tonne';
  preferredGrade?: QualityGrade;
  deliveryDistrict: string;
  deliveryAddress?: string;
  deadlineDate?: string;
  notes?: string;
  status: 'Active' | 'Fulfilled' | 'Expired' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ProfileChangeLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  changedFields: string[];
  details: Record<string, any>;
  updatedAt: string;
}

