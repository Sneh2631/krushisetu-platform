import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================================================
// 1. ENUMS & CONSTANTS
// ============================================================================

export const USER_ROLES = ['farmer', 'buyer', 'admin'] as const;
export type UserRoleType = typeof USER_ROLES[number];

export const LISTING_STATUSES = [
  'Draft',
  'Submitted',
  'Under Review',
  'More Information Required',
  'Verified',
  'Rejected',
  'Published',
  'Reserved',
  'Sold',
  'Completed',
  'Expired',
] as const;
export type ListingStatusType = typeof LISTING_STATUSES[number];

export const DEAL_STATUSES = [
  'Discussion Started',
  'Offer Accepted',
  'Pickup Scheduled',
  'Product Collected',
  'In Transit',
  'Delivered',
  'Payment Pending',
  'Completed',
  'Cancelled',
  'Disputed',
] as const;
export type DealStatusType = typeof DEAL_STATUSES[number];

export const OFFER_STATUSES = ['Pending', 'Accepted', 'Rejected', 'Countered', 'Expired', 'Withdrawn'] as const;
export type OfferStatusType = typeof OFFER_STATUSES[number];

export const QUALITY_GRADES = [
  'Grade A (Export / Super)',
  'Grade B (Premium Table)',
  'Grade C (Processing / Fair)',
] as const;
export type QualityGradeType = typeof QUALITY_GRADES[number];

export const TRANSPORT_STATUSES = [
  'Pending',
  'Vehicle Assigned',
  'Driver En Route to Farm',
  'Loading at Farm',
  'In Transit to Buyer Facility',
  'Unloaded & Verified',
  'Completed',
  'Delayed',
  'Cancelled',
] as const;

// ============================================================================
// 2. USER & AUTH COLLECTIONS (Auth.js Compatible)
// ============================================================================

// 1. Users Collection
export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  passwordHash?: string;
  role: UserRoleType;
  image?: string;
  isVerified: boolean;
  preferredLanguage: 'gu' | 'en' | 'hi' | 'mr';
  district?: string;
  taluka?: string;
  village?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, index: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: USER_ROLES, default: 'farmer', required: true, index: true },
    image: { type: String },
    isVerified: { type: Boolean, default: false, index: true },
    preferredLanguage: { type: String, enum: ['gu', 'en', 'hi', 'mr'], default: 'mr' },
    district: { type: String, index: true },
    taluka: { type: String },
    village: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 2. Accounts Collection (OAuth / Identity providers for Auth.js)
export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    refresh_token: String,
    access_token: String,
    expires_at: Number,
    token_type: String,
    scope: String,
    id_token: String,
    session_state: String,
  },
  { timestamps: true }
);
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

// 3. Sessions Collection (Auth.js session tokens)
export interface ISession extends Document {
  sessionToken: string;
  userId: mongoose.Types.ObjectId;
  expires: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionToken: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true }
);

// 4. VerificationTokens Collection (OTP & Email Tokens)
export interface IVerificationToken extends Document {
  identifier: string; // Phone or Email
  token: string;      // Hashed OTP / Token
  expires: Date;
  attempts: number;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    identifier: { type: String, required: true, index: true },
    token: { type: String, required: true },
    expires: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });
// Auto-expire tokens using TTL index
VerificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

// ============================================================================
// 3. PROFILE COLLECTIONS
// ============================================================================

// 5. FarmerProfiles Collection
export interface IFarmerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  farmerCode: string;
  aadhaarMasked?: string;
  landHoldingAcres?: number;
  primaryCrops: string[];
  bankAccountVerified: boolean;
  fpoAffiliated?: boolean;
  fpoName?: string;
  pickupLocation: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    village: string;
    taluka: string;
    district: string;
    pinCode?: string;
  };
  totalLotsSold: number;
  ratingAverage: number;
  ratingCount: number;
}

const FarmerProfileSchema = new Schema<IFarmerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    farmerCode: { type: String, required: true, unique: true, index: true },
    aadhaarMasked: String,
    landHoldingAcres: { type: Number, default: 2.5 },
    primaryCrops: [{ type: String }],
    bankAccountVerified: { type: Boolean, default: false },
    fpoAffiliated: { type: Boolean, default: false },
    fpoName: String,
    pickupLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [72.15, 21.6],
      },
      address: { type: String, default: '' },
      village: { type: String, default: '' },
      taluka: { type: String, default: '' },
      district: { type: String, required: true, index: true },
      pinCode: String,
    },
    totalLotsSold: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
// Geospatial 2dsphere index for location-based nearby searches
FarmerProfileSchema.index({ 'pickupLocation.coordinates': '2dsphere' });

// 6. BuyerProfiles Collection
export interface IBuyerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  buyerCode: string;
  companyName: string;
  businessType: 'Institutional Processor' | 'Export House' | 'Wholesale Trader' | 'Retail Chain';
  gstin?: string;
  panNumber?: string;
  escrowLimitINR: number;
  verifiedBuyerBadge: boolean;
  headquartersDistrict: string;
  totalDealsCompleted: number;
  ratingAverage: number;
}

const BuyerProfileSchema = new Schema<IBuyerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    buyerCode: { type: String, required: true, unique: true, index: true },
    companyName: { type: String, required: true, index: true },
    businessType: {
      type: String,
      default: 'Institutional Processor',
    },
    gstin: String,
    panNumber: String,
    escrowLimitINR: { type: Number, default: 5000000 },
    verifiedBuyerBadge: { type: Boolean, default: true, index: true },
    headquartersDistrict: { type: String, default: 'Ahmedabad' },
    totalDealsCompleted: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 5.0 },
  },
  { timestamps: true }
);

// 7. VerificationDocuments Collection (Protected storage references)
export interface IVerificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  docType: '7_12_Utara' | 'Aadhaar_Card' | 'Kisan_Credit_Card' | 'Organic_Certificate' | 'APMC_Trader_License';
  documentNumber?: string;
  storageKey: string;
  secureUrl: string;
  verifiedStatus: 'Pending' | 'Approved' | 'Rejected';
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  notes?: string;
}

const VerificationDocumentSchema = new Schema<IVerificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    docType: {
      type: String,
      enum: ['7_12_Utara', 'Aadhaar_Card', 'Kisan_Credit_Card', 'Organic_Certificate', 'APMC_Trader_License'],
      required: true,
    },
    documentNumber: String,
    storageKey: { type: String, required: true },
    secureUrl: { type: String, required: true },
    verifiedStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', index: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    notes: String,
  },
  { timestamps: true }
);

// ============================================================================
// 4. CATALOG & PRODUCE LISTINGS COLLECTIONS
// ============================================================================

// 8. ProductCategories Collection
export interface IProductCategory extends Document {
  code: string;
  nameGu: string;
  nameEn: string;
  displayOrder: number;
  icon: string;
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    code: { type: String, required: true, unique: true, index: true },
    nameGu: { type: String, required: true },
    nameEn: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    icon: { type: String, default: '🌱' },
  },
  { timestamps: true }
);

// 9. Crops & Products Collection
export interface ICrop extends Document {
  cropId: string;
  nameEn: string;
  nameGu: string;
  nameHi?: string;
  nameMr?: string;
  normalizedName: string;
  categoryCode: string;
  variety?: string;
  typicalSeason?: string;
  defaultUnit: 'tonne' | 'quintal' | 'kg';
  marketBenchmarkPrice?: number;
  primaryMarket?: string;
  imageUrl?: string;
  farmerNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy?: mongoose.Types.ObjectId;
  reviewedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IProduct = ICrop;

const CropSchema = new Schema<ICrop>(
  {
    cropId: { type: String, required: true, unique: true, index: true },
    nameEn: { type: String, required: true, trim: true },
    nameGu: { type: String, required: true, trim: true },
    nameHi: { type: String, trim: true },
    nameMr: { type: String, trim: true },
    normalizedName: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    categoryCode: { type: String, required: true, index: true },
    variety: { type: String, default: '' },
    typicalSeason: { type: String, default: 'Year Round' },
    defaultUnit: { type: String, enum: ['tonne', 'quintal', 'kg'], default: 'quintal' },
    marketBenchmarkPrice: { type: Number, default: 2500 },
    primaryMarket: { type: String, default: 'General APMC' },
    imageUrl: { type: String, default: '' },
    farmerNotes: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved', index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

CropSchema.index({ status: 1, categoryCode: 1 });
CropSchema.index({ status: 1, normalizedName: 1 });

const ProductSchema = CropSchema;

// 10. ProduceListings Collection
export interface IProduceListing extends Document {
  listingCode: string;
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  farmerPhone: string; // Server masked for non-deal public view
  category: 'Vegetables' | 'Fruits' | 'Spices';
  crop: string;
  cropGu: string;
  variety: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'tonne';
  minPurchaseQuantity: number;
  grade: QualityGradeType;
  verifiedGrade?: QualityGradeType;
  harvestDate: Date;
  freshnessCondition?: string;
  isOrganic: boolean;
  organicCertUrl?: string;
  description?: string;
  voiceNoteUrl?: string;
  expectedPrice: number;
  priceUnit: 'kg' | 'quintal' | 'tonne';
  suggestedPriceMin?: number;
  suggestedPriceMax?: number;
  district: string;
  taluka?: string;
  village: string;
  pickupAddress: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  pickupReadyDate?: Date;
  pickupAvailableUntil?: Date;
  storageAvailable: boolean;
  transportNeeded: boolean;
  status: ListingStatusType;
  adminInspectionNotes?: string;
  correctionsRequested?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  offersCount: number;
  primaryImageUrl?: string;
  isPendingCropApproval?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProduceListingSchema = new Schema<IProduceListing>(
  {
    listingCode: { type: String, required: true, unique: true, index: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    category: { type: String, enum: ['Vegetables', 'Fruits', 'Spices'], required: true, index: true },
    crop: { type: String, required: true, index: true },
    cropGu: { type: String, required: true },
    variety: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0.1 },
    unit: { type: String, enum: ['kg', 'quintal', 'tonne'], default: 'quintal' },
    minPurchaseQuantity: { type: Number, default: 1 },
    grade: { type: String, enum: QUALITY_GRADES, required: true, index: true },
    verifiedGrade: { type: String, enum: QUALITY_GRADES, index: true },
    harvestDate: { type: Date, required: true, index: true },
    freshnessCondition: String,
    isOrganic: { type: Boolean, default: false, index: true },
    organicCertUrl: String,
    description: String,
    voiceNoteUrl: String,
    expectedPrice: { type: Number, required: true, index: true },
    priceUnit: { type: String, enum: ['kg', 'quintal', 'tonne'], default: 'quintal' },
    suggestedPriceMin: Number,
    suggestedPriceMax: Number,
    district: { type: String, required: true, index: true },
    taluka: String,
    village: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [72.15, 21.6],
      },
    },
    pickupReadyDate: Date,
    pickupAvailableUntil: Date,
    storageAvailable: { type: Boolean, default: false },
    transportNeeded: { type: Boolean, default: true },
    status: { type: String, enum: LISTING_STATUSES, default: 'Submitted', required: true, index: true },
    adminInspectionNotes: String,
    correctionsRequested: String,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    offersCount: { type: Number, default: 0 },
    primaryImageUrl: String,
    isPendingCropApproval: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Compound indexes for high-speed marketplace queries
ProduceListingSchema.index({ status: 1, crop: 1, district: 1 });
ProduceListingSchema.index({ status: 1, category: 1, expectedPrice: 1 });
ProduceListingSchema.index({ farmerId: 1, status: 1 });
ProduceListingSchema.index({ 'location.coordinates': '2dsphere' });

// 11. ListingImages Collection (Object storage references, NO Base64)
export interface IListingImage extends Document {
  listingId: mongoose.Types.ObjectId;
  uploaderId: mongoose.Types.ObjectId;
  storageProvider: 'cloudinary' | 's3' | 'local';
  storageKey: string;
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  isPrimary: boolean;
  width?: number;
  height?: number;
  uploadedAt: Date;
}

const ListingImageSchema = new Schema<IListingImage>(
  {
    listingId: { type: Schema.Types.ObjectId, ref: 'ProduceListing', required: true, index: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    storageProvider: { type: String, enum: ['cloudinary', 's3', 'local'], default: 'cloudinary' },
    storageKey: { type: String, required: true },
    url: { type: String, required: true },
    thumbnailUrl: String,
    fileName: { type: String, required: true },
    fileSizeBytes: { type: Number, required: true },
    mimeType: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    width: Number,
    height: Number,
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 12. ListingVerifications Collection (Officer Inspection Audit Records)
export interface IListingVerification extends Document {
  listingId: mongoose.Types.ObjectId;
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  previousStatus: ListingStatusType;
  newStatus: ListingStatusType;
  verifiedGrade?: QualityGradeType;
  inspectionNotes?: string;
  correctionsRequested?: string;
  createdAt: Date;
}

const ListingVerificationSchema = new Schema<IListingVerification>(
  {
    listingId: { type: Schema.Types.ObjectId, ref: 'ProduceListing', required: true, index: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    adminName: { type: String, required: true },
    previousStatus: { type: String, enum: LISTING_STATUSES, required: true },
    newStatus: { type: String, enum: LISTING_STATUSES, required: true },
    verifiedGrade: { type: String, enum: QUALITY_GRADES },
    inspectionNotes: String,
    correctionsRequested: String,
  },
  { timestamps: true }
);

// ============================================================================
// 5. OFFERS, DEALS & LOGISTICS COLLECTIONS
// ============================================================================

// 13. Offers Collection
export interface IOffer extends Document {
  offerCode: string;
  listingId: mongoose.Types.ObjectId;
  listingCode: string;
  crop: string;
  cropGu: string;
  variety: string;
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  farmerPhone: string;
  requiredQuantity: number;
  unit: 'kg' | 'quintal' | 'tonne';
  offeredPrice: number;
  priceUnit: 'kg' | 'quintal' | 'tonne';
  counterPrice?: number;
  counterNotes?: string;
  preferredPickupDate: Date;
  transportResponsibility: 'Buyer Organized' | 'Farmer Arranged' | 'KrushiSetu Pooled Logistics';
  status: OfferStatusType;
  message?: string;
  escrowReady: boolean;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    offerCode: { type: String, required: true, unique: true, index: true },
    listingId: { type: Schema.Types.ObjectId, ref: 'ProduceListing', required: true, index: true },
    listingCode: { type: String, required: true },
    crop: { type: String, required: true },
    cropGu: { type: String, required: true },
    variety: { type: String, required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    buyerName: { type: String, required: true },
    buyerCompany: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    requiredQuantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'quintal', 'tonne'], default: 'quintal' },
    offeredPrice: { type: Number, required: true },
    priceUnit: { type: String, enum: ['kg', 'quintal', 'tonne'], default: 'quintal' },
    counterPrice: Number,
    counterNotes: String,
    preferredPickupDate: { type: Date, required: true },
    transportResponsibility: {
      type: String,
      enum: ['Buyer Organized', 'Farmer Arranged', 'KrushiSetu Pooled Logistics'],
      default: 'Buyer Organized',
    },
    status: { type: String, enum: OFFER_STATUSES, default: 'Pending', required: true, index: true },
    message: String,
    escrowReady: { type: Boolean, default: true },
    validUntil: { type: Date, required: true },
  },
  { timestamps: true }
);
OfferSchema.index({ listingId: 1, buyerId: 1 });
OfferSchema.index({ farmerId: 1, status: 1 });

// 14. Deals Collection
export interface IDeal extends Document {
  dealCode: string;
  offerId: mongoose.Types.ObjectId;
  listingId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  farmerPhone: string; // Unlocked upon deal creation
  farmerVillage: string;
  farmerDistrict: string;
  pickupAddress: string;
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string; // Unlocked upon deal creation
  crop: string;
  cropGu: string;
  variety: string;
  agreedQuantity: number;
  unit: 'kg' | 'quintal' | 'tonne';
  agreedPrice: number;
  priceUnit: 'kg' | 'quintal' | 'tonne';
  totalAmountINR: number;
  escrowStatus: 'Payment Pending' | 'Funds Deposited' | 'Released to Farmer' | 'Refunded';
  escrowReference?: string;
  status: DealStatusType;
  pickupDate: Date;
  deliveryDate?: Date;
  transportResponsibility: 'Buyer Organized' | 'Farmer Arranged' | 'KrushiSetu Pooled Logistics';
  ratingGivenByBuyer?: number;
  ratingGivenByFarmer?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
  {
    dealCode: { type: String, required: true, unique: true, index: true },
    offerId: { type: Schema.Types.ObjectId, ref: 'Offer', required: true },
    listingId: { type: Schema.Types.ObjectId, ref: 'ProduceListing', required: true, index: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    farmerVillage: { type: String, required: true },
    farmerDistrict: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    buyerName: { type: String, required: true },
    buyerCompany: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    crop: { type: String, required: true },
    cropGu: { type: String, required: true },
    variety: { type: String, required: true },
    agreedQuantity: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'quintal', 'tonne'], default: 'quintal' },
    agreedPrice: { type: Number, required: true },
    priceUnit: { type: String, enum: ['kg', 'quintal', 'tonne'], default: 'quintal' },
    totalAmountINR: { type: Number, required: true },
    escrowStatus: {
      type: String,
      enum: ['Payment Pending', 'Funds Deposited', 'Released to Farmer', 'Refunded'],
      default: 'Funds Deposited',
      index: true,
    },
    escrowReference: String,
    status: { type: String, enum: DEAL_STATUSES, default: 'Offer Accepted', required: true, index: true },
    pickupDate: { type: Date, required: true, index: true },
    deliveryDate: Date,
    transportResponsibility: {
      type: String,
      enum: ['Buyer Organized', 'Farmer Arranged', 'KrushiSetu Pooled Logistics'],
      default: 'Buyer Organized',
    },
    ratingGivenByBuyer: Number,
    ratingGivenByFarmer: Number,
    notes: String,
  },
  { timestamps: true }
);
DealSchema.index({ farmerId: 1, status: 1 });
DealSchema.index({ buyerId: 1, status: 1 });

// 15. TransportRequests Collection
export interface ITransportRequest extends Document {
  dealId: mongoose.Types.ObjectId;
  pickupLocation: {
    address: string;
    village: string;
    district: string;
  };
  dropLocation: {
    companyName: string;
    address: string;
    district: string;
  };
  crop: string;
  quantityTonne: number;
  scheduledPickupTime: Date;
  status: typeof TRANSPORT_STATUSES[number];
  assignedTransporter?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  vehicleType: 'Pickup (1.5T)' | 'Eicher (4T)' | 'Heavy Truck (10T)' | 'Cold Van (3T)';
  estimatedFreightINR: number;
  currentMilestoneNotes?: string;
}

const TransportRequestSchema = new Schema<ITransportRequest>(
  {
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal', required: true, unique: true, index: true },
    pickupLocation: {
      address: { type: String, required: true },
      village: { type: String, required: true },
      district: { type: String, required: true },
    },
    dropLocation: {
      companyName: { type: String, required: true },
      address: { type: String, required: true },
      district: { type: String, required: true },
    },
    crop: { type: String, required: true },
    quantityTonne: { type: Number, required: true },
    scheduledPickupTime: { type: Date, required: true, index: true },
    status: { type: String, enum: TRANSPORT_STATUSES, default: 'Pending', required: true, index: true },
    assignedTransporter: String,
    driverName: String,
    driverPhone: String,
    vehicleNumber: String,
    vehicleType: {
      type: String,
      enum: ['Pickup (1.5T)', 'Eicher (4T)', 'Heavy Truck (10T)', 'Cold Van (3T)'],
      default: 'Heavy Truck (10T)',
    },
    estimatedFreightINR: { type: Number, default: 8000 },
    currentMilestoneNotes: String,
  },
  { timestamps: true }
);

// 16. Notifications Collection
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'listing_approved' | 'listing_rejected' | 'new_offer' | 'offer_accepted' | 'counter_offer' | 'pickup_scheduled' | 'payment_released' | 'info_requested' | 'general';
  titleGu: string;
  titleEn: string;
  messageGu: string;
  messageEn: string;
  linkTarget?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'listing_approved',
        'listing_rejected',
        'new_offer',
        'offer_accepted',
        'counter_offer',
        'pickup_scheduled',
        'payment_released',
        'info_requested',
        'general',
      ],
      required: true,
    },
    titleGu: { type: String, required: true },
    titleEn: { type: String, required: true },
    messageGu: { type: String, required: true },
    messageEn: { type: String, required: true },
    linkTarget: String,
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// 17. StatusHistory Collection (Audit trail for any entity lifecycle transitions)
export interface IStatusHistory extends Document {
  entityType: 'listing' | 'deal' | 'offer' | 'transport' | 'user';
  entityId: mongoose.Types.ObjectId;
  previousStatus: string;
  newStatus: string;
  changedBy: mongoose.Types.ObjectId;
  changedByRole: UserRoleType;
  reason?: string;
  createdAt: Date;
}

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    entityType: { type: String, enum: ['listing', 'deal', 'offer', 'transport', 'user'], required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changedByRole: { type: String, enum: USER_ROLES, required: true },
    reason: String,
  },
  { timestamps: true }
);

// 18. Reviews Collection (Farmer & Buyer ratings)
export interface IReview extends Document {
  dealId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  reviewerRole: 'farmer' | 'buyer';
  targetUserId: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  feedback?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal', required: true, index: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewerRole: { type: String, enum: ['farmer', 'buyer'], required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: String,
  },
  { timestamps: true }
);
ReviewSchema.index({ dealId: 1, reviewerId: 1 }, { unique: true });

// 19. AuditLogs Collection (Government/Admin compliance logs)
export interface IAuditLog extends Document {
  action: string;
  targetType: 'listing' | 'user' | 'deal' | 'payout' | 'document';
  targetId: string;
  targetCode: string;
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    targetType: { type: String, enum: ['listing', 'user', 'deal', 'payout', 'document'], required: true, index: true },
    targetId: { type: String, required: true, index: true },
    targetCode: { type: String, required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    adminName: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    ipAddress: String,
  },
  { timestamps: true }
);
AuditLogSchema.index({ createdAt: -1 });

// 20. News Collection (Public announcements & advisories)
export interface INews extends Document {
  titleGu: string;
  titleEn: string;
  summaryGu: string;
  summaryEn: string;
  contentGu: string;
  contentEn: string;
  category: 'MSP & Rates' | 'Government Schemes' | 'Market Advisory' | 'Weather & Logistics' | 'Platform Updates';
  publishedBy: string;
  isPinned: boolean;
  tags: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    titleGu: { type: String, required: true },
    titleEn: { type: String, required: true },
    summaryGu: { type: String, required: true },
    summaryEn: { type: String, required: true },
    contentGu: { type: String, required: true },
    contentEn: { type: String, required: true },
    category: {
      type: String,
      enum: ['MSP & Rates', 'Government Schemes', 'Market Advisory', 'Weather & Logistics', 'Platform Updates'],
      default: 'Market Advisory',
      index: true,
    },
    publishedBy: { type: String, default: 'GSAMB Directorate' },
    isPinned: { type: Boolean, default: false, index: true },
    tags: [{ type: String }],
    imageUrl: String,
  },
  { timestamps: true }
);

// 21. ProfileChangeLog Collection (Audit of profile edits)
export interface IProfileChangeLog extends Document {
  userId: string;
  role: UserRoleType;
  changedFields: string[];
  previousValues: Record<string, unknown>;
  newValues: Record<string, unknown>;
  changedBy: string;
  reason?: string;
  createdAt: Date;
}

const ProfileChangeLogSchema = new Schema<IProfileChangeLog>(
  {
    userId: { type: String, required: true, index: true },
    role: { type: String, enum: USER_ROLES, required: true },
    changedFields: [{ type: String, required: true }],
    previousValues: { type: Schema.Types.Mixed, default: {} },
    newValues: { type: Schema.Types.Mixed, default: {} },
    changedBy: { type: String, required: true },
    reason: String,
  },
  { timestamps: true }
);

// 22. BuyerRequirement Collection (Procurement demand postings)
export interface IBuyerRequirement extends Document {
  buyerId: string;
  buyerName: string;
  buyerMobile: string;
  companyName: string;
  category: string;
  crop: string;
  cropGu?: string;
  requiredQuantity: number;
  unit: string;
  targetPrice: number;
  priceUnit: string;
  preferredGrade?: string;
  deliveryDistrict: string;
  deliveryAddress?: string;
  deadlineDate: string;
  notes?: string;
  status: 'Active' | 'Fulfilled' | 'Expired' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BuyerRequirementSchema = new Schema<IBuyerRequirement>(
  {
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    buyerMobile: { type: String, required: true },
    companyName: { type: String, required: true },
    category: { type: String, required: true },
    crop: { type: String, required: true, index: true },
    cropGu: String,
    requiredQuantity: { type: Number, required: true },
    unit: { type: String, default: 'tonne' },
    targetPrice: { type: Number, required: true },
    priceUnit: { type: String, default: 'quintal' },
    preferredGrade: String,
    deliveryDistrict: { type: String, required: true, index: true },
    deliveryAddress: String,
    deadlineDate: { type: String, required: true },
    notes: String,
    status: { type: String, enum: ['Active', 'Fulfilled', 'Expired', 'Cancelled'], default: 'Active', index: true },
  },
  { timestamps: true }
);

// ============================================================================
// 6. MODEL REGISTRATIONS & EXPORTS
// ============================================================================

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);
export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
export const VerificationToken: Model<IVerificationToken> = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);

export const FarmerProfile: Model<IFarmerProfile> = mongoose.models.FarmerProfile || mongoose.model<IFarmerProfile>('FarmerProfile', FarmerProfileSchema);
export const BuyerProfile: Model<IBuyerProfile> = mongoose.models.BuyerProfile || mongoose.model<IBuyerProfile>('BuyerProfile', BuyerProfileSchema);
export const VerificationDocument: Model<IVerificationDocument> = mongoose.models.VerificationDocument || mongoose.model<IVerificationDocument>('VerificationDocument', VerificationDocumentSchema);

export const ProductCategory: Model<IProductCategory> = mongoose.models.ProductCategory || mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema);
export const Crop: Model<ICrop> = mongoose.models.Crop || mongoose.model<ICrop>('Crop', CropSchema);
export const Product: Model<ICrop> = mongoose.models.Product || mongoose.model<ICrop>('Product', ProductSchema);
export const ProduceListing: Model<IProduceListing> = mongoose.models.ProduceListing || mongoose.model<IProduceListing>('ProduceListing', ProduceListingSchema);
export const ListingImage: Model<IListingImage> = mongoose.models.ListingImage || mongoose.model<IListingImage>('ListingImage', ListingImageSchema);
export const ListingVerification: Model<IListingVerification> = mongoose.models.ListingVerification || mongoose.model<IListingVerification>('ListingVerification', ListingVerificationSchema);

export const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);
export const Deal: Model<IDeal> = mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);
export const TransportRequest: Model<ITransportRequest> = mongoose.models.TransportRequest || mongoose.model<ITransportRequest>('TransportRequest', TransportRequestSchema);
export const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export const StatusHistory: Model<IStatusHistory> = mongoose.models.StatusHistory || mongoose.model<IStatusHistory>('StatusHistory', StatusHistorySchema);
export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
export const ProfileChangeLog: Model<IProfileChangeLog> = mongoose.models.ProfileChangeLog || mongoose.model<IProfileChangeLog>('ProfileChangeLog', ProfileChangeLogSchema);
export const BuyerRequirement: Model<IBuyerRequirement> = mongoose.models.BuyerRequirement || mongoose.model<IBuyerRequirement>('BuyerRequirement', BuyerRequirementSchema);
