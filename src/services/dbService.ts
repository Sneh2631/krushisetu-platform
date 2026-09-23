import type {
  ProduceListing,
  ListingStatus,
  BuyerOffer,
  Deal,
  DealStatus,
  TransportRequest,
  AppNotification,
  AdminAuditLog,
  QualityGrade,
  UserProfile,
  VerificationRequest,
  UserDocument,
  NewsItem,
  BuyerRequirement,
  ProfileChangeLog,
  UserRole,
  SupportQuery,
} from '../types';
import { apiClient } from './apiClient';

const PROFILES_STORAGE_KEY = 'krishisetu_db_profiles_v3';
const PROFILE_LOGS_STORAGE_KEY = 'krishisetu_db_profile_logs_v3';
const LISTINGS_STORAGE_KEY = 'krishisetu_db_listings_v3';
const OFFERS_STORAGE_KEY = 'krishisetu_db_offers_v3';
const DEALS_STORAGE_KEY = 'krishisetu_db_deals_v3';
const TRANSPORTS_STORAGE_KEY = 'krishisetu_db_transports_v3';
const NOTIFICATIONS_STORAGE_KEY = 'krishisetu_db_notifications_v3';
const AUDIT_LOGS_STORAGE_KEY = 'krishisetu_db_audit_logs_v3';
const VERIFICATIONS_STORAGE_KEY = 'krishisetu_db_verifications_v3';
const DOCUMENTS_STORAGE_KEY = 'krishisetu_db_documents_v3';
const NEWS_STORAGE_KEY = 'krishisetu_db_news_v3';
const BUYER_REQ_STORAGE_KEY = 'krishisetu_db_buyer_req_v3';
const SUPPORT_QUERIES_STORAGE_KEY = 'krishisetu_db_support_queries_v3';

// --------------------------------------------------------------------------
// Initial Seed Profiles (Maharashtra)
// --------------------------------------------------------------------------
const INITIAL_SEED_PROFILES: UserProfile[] = [
  {
    id: 'USER-FAR-9142',
    userId: 'USER-FAR-9142',
    name: 'Ramesh Patil (रमेश पाटील)',
    mobile: '9825143210',
    email: 'ramesh.farmer@krishisetu.in',
    role: 'farmer',
    accountType: 'farmer',
    state: 'Maharashtra',
    district: 'Nashik',
    taluka: 'Niphad',
    village: 'Lasalgaon Rural',
    pinCode: '422306',
    pickupAddress: 'Gat No. 42, Lasalgaon-Vinchur Road, Niphad, Nashik',
    preferredLanguage: 'mr',
    isVerified: true,
    verificationStatus: 'Verified',
    fpoName: 'Sahyadri Farmers Producer Co. Ltd.',
    crops: ['Onion', 'Grapes', 'Pomegranate', 'Soybean'],
    farmSize: '8.5 Acres',
    storageAvailable: true,
    transportNeeded: true,
    bankAccountName: 'Ramesh V Patil',
    bankAccountNumber: '39482910482',
    bankIfscCode: 'SBIN0004928',
    upiId: 'rameshpatil@sbi',
    identityDocType: '7/12 Land Record',
    identityDocNumber: 'GAT-42-LASALGAON',
    identityDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-25T12:00:00Z',
  },
  {
    id: 'USER-BUY-5021',
    userId: 'USER-BUY-5021',
    name: 'Vilas Shinde',
    mobile: '9724012345',
    email: 'vilas.procurement@sahyadri.com',
    role: 'buyer',
    accountType: 'buyer',
    state: 'Maharashtra',
    district: 'Nashik',
    taluka: 'Dindori',
    village: 'Mohadi Mega Food Park',
    pinCode: '422207',
    companyName: 'Sahyadri Farmers Post Harvest Care Ltd.',
    buyerType: 'Food Processor',
    gstNumber: '27AAACB1234F1Z8',
    panNumber: 'AAACB1234F',
    requiredCommodities: ['Onion', 'Grapes', 'Pomegranate', 'Soybean'],
    deliveryAddress: 'Plot 12-16, Mohadi Food Park, Dindori, Nashik',
    preferredLanguage: 'mr',
    isVerified: true,
    verificationStatus: 'Verified',
    createdAt: '2026-08-05T09:30:00Z',
    updatedAt: '2026-08-26T14:15:00Z',
  },
  {
    id: 'ADMIN-MH-01',
    userId: 'ADMIN-MH-01',
    name: 'Dr. Suresh Pawar (महाराष्ट्र कृषी अधिकारी)',
    mobile: '9274288006',
    email: 'admin.verify@krishisetu.maharashtra.gov.in',
    role: 'admin',
    accountType: 'admin',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Pune City',
    village: 'MSAMB Bhavan, Gultekdi Market Yard',
    pinCode: '411037',
    companyName: 'Maharashtra State Agricultural Marketing Board (MSAMB)',
    preferredLanguage: 'mr',
    isVerified: true,
    verificationStatus: 'Verified',
    createdAt: '2026-07-01T08:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z',
  },
];

// --------------------------------------------------------------------------
// Initial Seed News (Maharashtra)
// --------------------------------------------------------------------------
const INITIAL_SEED_NEWS: NewsItem[] = [
  {
    id: 'NEWS-2026-001',
    titleEn: 'Lasalgaon Mandi Onion MSP & Storage Subsidy 2026 Announced',
    titleMr: 'लासलगाव बाजार समिती कांदा साठवणूक अनुदान व हमीभाव जाहीर',
    titleHi: 'लासलगांव मंडी प्याज भंडारण सब्सिडी और समर्थन मूल्य 2026 घोषित',
    titleGu: 'લાસલગાવ માર્કેટ ડુંગળી સંગ્રહ સહાય અને ટેકાના ભાવ જાહેર',
    summaryEn: 'MSAMB announces ₹250/quintal storage subvention for Maharashtra farmers storing in certified WDRA warehouses.',
    summaryMr: 'महाराष्ट्र राज्य कृषी पणन मंडळाकडून प्रमाणित शीतगृहांमध्ये कांदा साठवणाऱ्या शेतकऱ्यांना प्रति क्विंटल ₹२५० पर्यंत अनुदान जाहीर.',
    summaryHi: 'महाराष्ट्र राज्य कृषि पणन बोर्ड द्वारा प्रमाणित कोल्ड स्टोरेज में प्याज रखने वाले किसानों को ₹250/क्विंटल भंडारण सब्सिडी।',
    summaryGu: 'મહારાષ્ટ્ર રાજ્ય કૃષિ બોર્ડ દ્વારા પ્રમાણિત કોલ્ડ સ્ટોરેજમાં ડુંગળી સંગ્રહ માટે પ્રતિ ક્વિન્ટલ ₹૨૫૦ સબસિડી જાહેર.',
    contentEn: 'Detailed guidance on WDRA warehouse receipts and digital escrow payments under Maharashtra State Agricultural Marketing Board guidelines.',
    contentMr: 'महाराष्ट्र राज्य कृषी पणन मंडळ (MSAMB) द्वारे लासलगाव, पिंपळगाव आणि नाशिक यार्डांमधील शेतकऱ्यांसाठी कांदा अनुदान पॅकेज जाहीर.',
    contentHi: 'महाराष्ट्र राज्य कृषि पणन बोर्ड द्वारा लासलगांव और नासिक के प्याज किसानों के लिए विशेष सहायता योजना।',
    contentGu: 'મહારાષ્ટ્ર રાજ્ય કૃષિ બજાર બોર્ડ (MSAMB) દ્વારા લાસલગાવ અને નાશિક યાર્ડના ખેડૂતો માટે ખાસ ડુંગળી સહાય પેકેજ.',
    category: 'MSP & Rates',
    categoryGu: 'ટેકાના ભાવ અને દરો',
    categoryHi: 'एमएसपी व दरें',
    categoryMr: 'हमीभाव (MSP) व दर',
    tag: 'Important',
    isPinned: true,
    authorName: 'MSAMB Krishi Niyamak Desk',
    publishedAt: '2026-08-28T06:00:00Z',
    createdAt: '2026-08-28T06:00:00Z',
  },
  {
    id: 'NEWS-2026-002',
    titleEn: 'Nashik Grape & Marathwada Soybean Processing Demand Surges 35%',
    titleMr: 'नाशिक द्राक्षे आणि मराठवाडा सोयाबीन प्रक्रिया उद्योगांकडून ३५% मागणी वाढ',
    titleHi: 'नासिक अंगूर और मराठवाड़ा सोयाबीन में खाद्य प्रसंस्करण मांग 35% बढ़ी',
    titleGu: 'નાશિક દ્રાક્ષ અને મરાઠવાડા સોયાબીનમાં પ્રોસેસિંગ માંગ ૩૫% વધી',
    summaryEn: 'Sahyadri, national food processors actively purchasing export-grade produce directly from farm gates.',
    summaryMr: 'सह्याद्री फार्म्स आणि अग्रगण्य प्रक्रिया कंपन्या थेट बांधावरून दर्जेदार सोयाबीन व द्राक्षांची खरेदी करत आहेत.',
    summaryHi: 'सह्याद्री फार्म्स व प्रमुख फूड प्रोसेसर्स सीधे फार्मगेट से सोयाबीन व अंगूर की खरीद कर रहे हैं।',
    summaryGu: 'સહ્યાદ્રી ફાર્મ્સ અને ફૂડ પ્રોસેસર્સ સીધા ખેતરેથી સોયાબીન અને દ્રાક્ષની ખરીદી કરી રહ્યા છે.',
    category: 'Market Advisory',
    categoryGu: 'બજાર માર્ગદર્શન',
    categoryHi: 'बाजार सलाह',
    categoryMr: 'बाजार सल्ला',
    tag: 'Trending',
    isPinned: false,
    authorName: 'KrushiSetu Market Intelligence',
    publishedAt: '2026-08-26T11:30:00Z',
    createdAt: '2026-08-26T11:30:00Z',
  },
  {
    id: 'NEWS-2026-003',
    titleEn: 'Solapur Bhagwa Pomegranate & Sangli Turmeric GI Tag Certification Drive',
    titleMr: 'सोलापूर भगवा डाळिंब व सांगली हळद जीआय (GI) टॅग प्रमाणीकरण मोहीम',
    titleHi: 'सोलापुर भगवा अनार और सांगली हल्दी जीआई टैग प्रमाणीकरण अभियान',
    titleGu: 'સોલાપુર ભગવા દાડમ અને સાંગલી હળદર જીઆઈ પ્રમાણીકરણ ડ્રાઇવ',
    summaryEn: 'Growers can now submit 7/12 land records to receive verified GI badges on KrushiSetu.',
    summaryMr: 'सोलापूर व सांगलीचे शेतकरी ७/१२ उतारा जोडून कृषीसेतूवर अधिकृत भौगोलिक मानांकन (GI) बॅज मिळवू शकतात.',
    summaryHi: 'सोलापुर व सांगली के किसान 7/12 भू-अभिलेख अपलोड कर प्रमाणित जीआई बैज प्राप्त कर सकते हैं।',
    summaryGu: 'સોલાપુર અને સાંગલીના ખેડૂતો ૭/૧૨ ઉતારા અપલોડ કરી વેરીફાઈડ જીઆઈ ટેગ મેળવી શકે છે.',
    category: 'Government Schemes',
    categoryGu: 'સરકારી યોજનાઓ',
    categoryHi: 'सरकारी योजनाएं',
    categoryMr: 'शासकीय योजना',
    tag: 'GI Tag',
    isPinned: false,
    authorName: 'Horticulture Dept. Maharashtra',
    publishedAt: '2026-08-20T09:00:00Z',
    createdAt: '2026-08-20T09:00:00Z',
  },
];

// --------------------------------------------------------------------------
// Initial Seed Produce Listings (Maharashtra)
// --------------------------------------------------------------------------
const INITIAL_SEED_LISTINGS: ProduceListing[] = [
  {
    id: 'LIST-2026-001',
    listingCode: 'KS-NAS-0101',
    farmerId: 'USER-FAR-9142',
    farmerName: 'Ramesh Patil (रमेश पाटील)',
    farmerMobile: '9825143210',
    category: 'Vegetables',
    crop: 'Onion',
    cropMr: 'कांदा (नाशिक लाल)',
    cropHi: 'प्याज (नासिक लाल)',
    cropGu: 'ડુંગળી (નાશિક લાલ)',
    variety: 'Nashik & Lasalgaon Red Super',
    quantity: 18,
    unit: 'tonne',
    minPurchaseQuantity: 2,
    grade: 'Grade A (Export / Super)',
    verifiedGrade: 'Grade A (Export / Super)',
    harvestDate: '2026-08-22',
    freshnessCondition: 'Sun-cured, dry neck, 55mm+ uniform bulb diameter',
    isOrganic: false,
    description: 'लासलगाव बाजाराजवळील उत्कृष्ट नाशिक लाल कांदा. साठवणूक क्षमता उत्तम.',
    expectedPrice: 2850,
    priceUnit: 'quintal',
    suggestedPriceMin: 2700,
    suggestedPriceMax: 3100,
    district: 'Nashik',
    taluka: 'Niphad',
    village: 'Lasalgaon Rural',
    pickupAddress: 'Gat No. 42, Lasalgaon-Vinchur Road, Niphad, Nashik',
    pickupReadyDate: '2026-08-28',
    pickupAvailableUntil: '2026-09-18',
    storageAvailable: true,
    transportNeeded: true,
    status: 'Published',
    verifiedBy: 'ADMIN-MH-01',
    verifiedAt: '2026-08-23T10:30:00Z',
    adminInspectionNotes: 'Physical inspection completed at Lasalgaon hub. Moisture 11%, zero rot, Grade A certified.',
    offersCount: 4,
    primaryImageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    photos: [
      {
        id: 'photo-1',
        url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
        isPrimary: true,
        uploadedAt: '2026-08-22T08:00:00Z',
      },
    ],
    createdAt: '2026-08-22T07:30:00Z',
    updatedAt: '2026-08-23T10:30:00Z',
  },
  {
    id: 'LIST-2026-002',
    listingCode: 'KS-LAT-0204',
    farmerId: 'USER-FAR-9142',
    farmerName: 'Ramesh Patil (रमेश पाटील)',
    farmerMobile: '9825143210',
    category: 'Oilseeds & Pulses',
    crop: 'Soybean',
    cropMr: 'सोयाबीन (लातूर पिवळे)',
    cropHi: 'सोयाबीन (लातूर पीला)',
    cropGu: 'સોયાબીન (લાતૂર પીળું)',
    variety: 'JS-335 / Phule Kalyani (Processing Grade)',
    quantity: 22,
    unit: 'tonne',
    minPurchaseQuantity: 5,
    grade: 'Grade A (Export / Super)',
    verifiedGrade: 'Grade A (Export / Super)',
    harvestDate: '2026-08-21',
    freshnessCondition: 'Sun-dried, high oil content > 19%, clean bold grain',
    isOrganic: false,
    description: 'लातूर एमआयडीसी प्रक्रिया केंद्रासाठी योग्य पिवळे दर्जेदार सोयाबीन.',
    expectedPrice: 4600,
    priceUnit: 'quintal',
    suggestedPriceMin: 4500,
    suggestedPriceMax: 4800,
    district: 'Latur',
    taluka: 'Ausa',
    village: 'Ausa Rural',
    pickupAddress: 'Warehouse Unit 4, MIDC Road, Ausa, Latur',
    pickupReadyDate: '2026-08-26',
    pickupAvailableUntil: '2026-09-30',
    storageAvailable: true,
    transportNeeded: true,
    status: 'Published',
    verifiedBy: 'ADMIN-MH-01',
    verifiedAt: '2026-08-22T14:20:00Z',
    adminInspectionNotes: 'Tested for oil content and low moisture. Passed Grade A processing standards.',
    offersCount: 3,
    primaryImageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80',
    photos: [
      {
        id: 'photo-2',
        url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80',
        isPrimary: true,
        uploadedAt: '2026-08-21T12:00:00Z',
      },
    ],
    createdAt: '2026-08-21T11:00:00Z',
    updatedAt: '2026-08-22T14:20:00Z',
  },
  {
    id: 'LIST-2026-003',
    listingCode: 'KS-SOL-0308',
    farmerId: 'USER-FAR-9142',
    farmerName: 'Ramesh Patil (रमेश पाटील)',
    farmerMobile: '9825143210',
    category: 'Fruits',
    crop: 'Pomegranate',
    cropMr: 'डाळिंब (सोलापूर भगवा GI)',
    cropHi: 'अनार (सोलापुर भगवा)',
    cropGu: 'દાડમ (સોલાપુર ભગવા)',
    variety: 'Solapur Bhagwa (GI Certified)',
    quantity: 8,
    unit: 'tonne',
    minPurchaseQuantity: 1,
    grade: 'Grade A (Export / Super)',
    verifiedGrade: 'Grade A (Export / Super)',
    harvestDate: '2026-08-23',
    freshnessCondition: 'Deep ruby red arils, brix 16°+, soft seed, export crate packed',
    isOrganic: true,
    description: 'सोलापूर सांगोला भागातील अस्सल भगवा डाळिंब. निर्यातक्षम प्रत.',
    expectedPrice: 11000,
    priceUnit: 'quintal',
    suggestedPriceMin: 10500,
    suggestedPriceMax: 12500,
    district: 'Solapur',
    taluka: 'Sangola',
    village: 'Sangola Orchards',
    pickupAddress: 'Farm Gat 18, Sangola-Pandharpur Road, Solapur',
    pickupReadyDate: '2026-08-27',
    pickupAvailableUntil: '2026-09-15',
    storageAvailable: true,
    transportNeeded: true,
    status: 'Published',
    verifiedBy: 'ADMIN-MH-01',
    verifiedAt: '2026-08-24T09:00:00Z',
    adminInspectionNotes: 'Verified Solapur Bhagwa GI tag number MH-GI-0082. Grade A export certified.',
    offersCount: 5,
    primaryImageUrl: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&auto=format&fit=crop&q=80',
    photos: [
      {
        id: 'photo-3',
        url: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&auto=format&fit=crop&q=80',
        isPrimary: true,
        uploadedAt: '2026-08-23T11:00:00Z',
      },
    ],
    createdAt: '2026-08-23T10:00:00Z',
    updatedAt: '2026-08-24T09:00:00Z',
  },
];

// --------------------------------------------------------------------------
// Initial Seed Offers & Deals (Maharashtra)
// --------------------------------------------------------------------------
const INITIAL_SEED_OFFERS: BuyerOffer[] = [
  {
    id: 'OFFER-2026-001',
    offerCode: 'OFF-NAS-101',
    listingId: 'LIST-2026-001',
    listingCode: 'KS-NAS-0101',
    crop: 'Onion',
    cropMr: 'कांदा',
    cropHi: 'प्याज',
    cropGu: 'ડુંગળી',
    variety: 'Nashik & Lasalgaon Red Super',
    buyerId: 'USER-BUY-5021',
    buyerName: 'Vilas Shinde',
    buyerCompany: 'Sahyadri Farmers Post Harvest Care Ltd.',
    buyerMobile: '9724012345',
    farmerId: 'USER-FAR-9142',
    farmerName: 'Ramesh Patil (रमेश पाटील)',
    farmerMobile: '9825143210',
    requiredQuantity: 12,
    unit: 'tonne',
    offeredPrice: 2950,
    priceUnit: 'quintal',
    preferredPickupDate: '2026-08-30',
    transportResponsibility: 'Buyer Organized',
    message: 'We will send our 16-tonne truck directly to your Lasalgaon farm gate. Immediate escrow payout upon gate pass.',
    status: 'Pending',
    createdAt: '2026-08-23T12:30:00Z',
  },
];

const INITIAL_SEED_DEALS: Deal[] = [
  {
    id: 'DEAL-2026-001',
    dealCode: 'DEAL-2026-001',
    offerId: 'OFFER-2026-000',
    listingId: 'LIST-2026-001',
    farmerId: 'USER-FAR-9142',
    farmerName: 'Ramesh Patil (रमेश पाटील)',
    farmerMobile: '9825143210',
    farmerVillage: 'Lasalgaon Rural',
    farmerDistrict: 'Nashik',
    buyerId: 'USER-BUY-5021',
    buyerName: 'Vilas Shinde',
    buyerCompany: 'Sahyadri Farmers Post Harvest Care Ltd.',
    buyerMobile: '9724012345',
    crop: 'Onion',
    cropMr: 'कांदा (नाशिक लाल)',
    cropHi: 'प्याज (नासिक लाल)',
    cropGu: 'ડુંગળી (નાશિક લાલ)',
    variety: 'Nashik Red Super',
    agreedQuantity: 12,
    unit: 'tonne',
    agreedPrice: 2950,
    agreedPricePerUnit: 2950,
    priceUnit: 'quintal',
    totalEstimatedValue: 354000,
    totalAmountINR: 354000,
    pickupAddress: 'Gat No. 42, Lasalgaon-Vinchur Road, Niphad, Nashik',
    deliveryDestination: 'Sahyadri Processing Hub, Dindori, Nashik',
    pickupDate: '2026-08-29',
    deliveryDate: '2026-08-30',
    transportResponsibility: 'Buyer Organized',
    escrowStatus: 'Funds Locked in Escrow',
    escrowReference: 'ESC-MSAMB-2026-84920',
    status: 'In Transit',
    notes: 'Escrow amount ₹3,54,000 deposited in MSAMB nodal account. Truck en route on NH-60.',
    createdAt: '2026-08-23T15:00:00Z',
    updatedAt: '2026-08-24T09:00:00Z',
  },
  {
    id: 'DEAL-2026-002',
    dealCode: 'DEAL-2026-002',
    offerId: 'OFFER-2026-002',
    listingId: 'LIST-2026-002',
    farmerId: 'USER-FAR-9143',
    farmerName: 'Balasaheb Jadhav (बाळासाहेब जाधव)',
    farmerMobile: '9822334455',
    farmerVillage: 'Malegaon Budruk',
    farmerDistrict: 'Pune',
    buyerId: 'USER-BUY-5022',
    buyerName: 'Amit Deshmukh',
    buyerCompany: 'ITC Limited Agri Business Division',
    buyerMobile: '9822119900',
    crop: 'Soybean',
    cropMr: 'सोयाबीन (JS-335)',
    cropHi: 'सोयाबीन (JS-335)',
    cropGu: 'સોયાબીન',
    variety: 'JS-335 Grade A',
    agreedQuantity: 15,
    unit: 'tonne',
    agreedPrice: 4850,
    agreedPricePerUnit: 4850,
    priceUnit: 'quintal',
    totalEstimatedValue: 727500,
    totalAmountINR: 727500,
    pickupAddress: 'Farm Gat No. 118, Baramati-Phaltan Road, Baramati, Pune',
    deliveryDestination: 'ITC Agri Hub, Ranjangaon MIDC Industrial Hub, Pune',
    pickupDate: '2026-08-28',
    deliveryDate: '2026-08-29',
    transportResponsibility: 'KrushiSetu Pooled Logistics',
    escrowStatus: 'Quality Passed - Disbursing',
    escrowReference: 'ESC-MSAMB-2026-99301',
    status: 'In Transit',
    notes: '50% payment disbursed upon weighment entry at Ranjangaon hub. Assay test in progress.',
    createdAt: '2026-08-22T10:00:00Z',
    updatedAt: '2026-08-24T11:00:00Z',
  },
  {
    id: 'DEAL-2026-003',
    dealCode: 'DEAL-2026-003',
    offerId: 'OFFER-2026-003',
    listingId: 'LIST-2026-003',
    farmerId: 'USER-FAR-9144',
    farmerName: 'Dnyaneshwar Shinde (ज्ञानेश्वर शिंदे)',
    farmerMobile: '9765432100',
    farmerVillage: 'Shirur Rural',
    farmerDistrict: 'Pune',
    buyerId: 'USER-BUY-5023',
    buyerName: 'Nitin Kadam',
    buyerCompany: 'Parle Agro Private Ltd.',
    buyerMobile: '9823001122',
    crop: 'Tomato',
    cropMr: 'टोमॅटो (अभिनव)',
    cropHi: 'टमाटर',
    cropGu: 'ટામેટા',
    variety: 'Abhinav Red Firm',
    agreedQuantity: 8,
    unit: 'tonne',
    agreedPrice: 2100,
    agreedPricePerUnit: 2100,
    priceUnit: 'quintal',
    totalEstimatedValue: 168000,
    totalAmountINR: 168000,
    pickupAddress: 'Gat No. 56, Shirur-Narayangaon Road, Shirur, Pune',
    deliveryDestination: 'Parle Agro Cold Processing Facility, Narhe, Pune',
    pickupDate: '2026-08-27',
    deliveryDate: '2026-08-28',
    transportResponsibility: 'Buyer Organized',
    escrowStatus: 'Completed & Credited',
    escrowReference: 'ESC-MSAMB-2026-77120',
    status: 'Completed',
    notes: '100% funds ₹1,68,000 credited to farmer via RTGS. Inspection passed Grade A.',
    createdAt: '2026-08-21T08:00:00Z',
    updatedAt: '2026-08-23T16:00:00Z',
  },
  {
    id: 'DEAL-2026-004',
    dealCode: 'DEAL-2026-004',
    offerId: 'OFFER-2026-004',
    listingId: 'LIST-2026-004',
    farmerId: 'USER-FAR-9145',
    farmerName: 'Tukaram More (तुकाराम मोरे)',
    farmerMobile: '9922114433',
    farmerVillage: 'Patas-Daund Road',
    farmerDistrict: 'Pune',
    buyerId: 'USER-BUY-5024',
    buyerName: 'Sunil Agrawal',
    buyerCompany: 'Haldiram Snacks Pvt Ltd.',
    buyerMobile: '9821004455',
    crop: 'Cotton',
    cropMr: 'कापूस (फुले अनमोल)',
    cropHi: 'कपास',
    cropGu: 'કપાસ',
    variety: 'Phule Anmol Long Staple',
    agreedQuantity: 10,
    unit: 'tonne',
    agreedPrice: 7100,
    agreedPricePerUnit: 7100,
    priceUnit: 'quintal',
    totalEstimatedValue: 710000,
    totalAmountINR: 710000,
    pickupAddress: 'Farm Gat No. 88, Daund Rural, Patas, Pune',
    deliveryDestination: 'Haldiram Agro Hub, Butibori Industrial Zone, Nagpur',
    pickupDate: '2026-08-30',
    deliveryDate: '2026-09-01',
    transportResponsibility: 'Buyer Organized',
    escrowStatus: 'Funds Locked in Escrow',
    escrowReference: 'ESC-MSAMB-2026-89104',
    status: 'Pickup Scheduled',
    notes: 'Advance escrow 20% (₹1,42,000) locked. Heavy 10T truck dispatched to farm gate.',
    createdAt: '2026-08-24T06:00:00Z',
    updatedAt: '2026-08-24T08:30:00Z',
  },
];

const INITIAL_SEED_TRANSPORTS: TransportRequest[] = [
  {
    id: 'TR-2026-001',
    dealId: 'DEAL-2026-001',
    dealCode: 'DEAL-2026-001',
    pickupAddress: 'Gat No. 42, Lasalgaon-Vinchur Road, Niphad, Nashik',
    deliveryAddress: 'Sahyadri Processing Hub, Dindori, Nashik',
    crop: 'Onion',
    productType: 'Vegetables',
    quantityTonne: 12,
    vehicleType: 'Heavy Truck (10T)',
    estimatedCost: 12500,
    driverName: 'Tukaram Jadhav',
    driverMobile: '9898123456',
    vehicleNumber: 'MH-15-EG-4412',
    trackingStatus: 'In Transit',
    currentMilestoneNotes: 'Vehicle crossed Pimpalgaon Toll Plaza at 11:45 AM. Reaching Dindori Hub in 40 mins (GPS Active).',
    createdAt: '2026-08-24T09:00:00Z',
    updatedAt: '2026-08-24T11:45:00Z',
  },
  {
    id: 'TR-2026-002',
    dealId: 'DEAL-2026-002',
    dealCode: 'DEAL-2026-002',
    pickupAddress: 'Gat No. 42, Lasalgaon-Vinchur Road, Niphad, Nashik',
    deliveryAddress: 'Baramati Agro Processing Hub, MIDC Baramati, Pune',
    crop: 'Soybean',
    productType: 'Oilseeds & Pulses',
    quantityTonne: 15,
    vehicleType: 'Heavy Truck (10T)',
    estimatedCost: 18500,
    driverName: 'Sandip Salunkhe',
    driverMobile: '9765432190',
    vehicleNumber: 'MH-12-RN-8821',
    trackingStatus: 'En Route',
    currentMilestoneNotes: 'Driver reached Lasalgaon town. Arriving at farmer farm-gate at 02:00 PM for electronic weighment.',
    createdAt: '2026-08-24T07:30:00Z',
    updatedAt: '2026-08-24T08:00:00Z',
  },
  {
    id: 'TR-2026-003',
    dealId: 'DEAL-2026-003',
    dealCode: 'DEAL-2026-003',
    pickupAddress: 'Gat No. 56, Shirur-Narayangaon Road, Shirur, Pune',
    deliveryAddress: 'Parle Agro Cold Processing Facility, Narhe, Pune',
    crop: 'Tomato',
    productType: 'Vegetables',
    quantityTonne: 8,
    vehicleType: 'Eicher (4T)',
    estimatedCost: 8200,
    driverName: 'Mahesh Ghadge',
    driverMobile: '9822334455',
    vehicleNumber: 'MH-14-BT-1904',
    trackingStatus: 'Delivered',
    currentMilestoneNotes: 'Unloaded successfully at Narhe Plant. Weighment slip verified (8.02 MT). Grade A certificate issued.',
    createdAt: '2026-08-21T09:00:00Z',
    updatedAt: '2026-08-23T15:30:00Z',
  },
  {
    id: 'TR-2026-004',
    dealId: 'DEAL-2026-004',
    dealCode: 'DEAL-2026-004',
    pickupAddress: 'Farm Gat No. 88, Daund Rural, Patas, Pune',
    deliveryAddress: 'Haldiram Agro Hub, Butibori Industrial Zone, Nagpur',
    crop: 'Cotton',
    productType: 'Cash Crops & Spices',
    quantityTonne: 10,
    vehicleType: 'Heavy Truck (10T)',
    estimatedCost: 24000,
    driverName: 'Ganesh Shirole',
    driverMobile: '9977881122',
    vehicleNumber: 'MH-31-CB-9080',
    trackingStatus: 'Assigned',
    currentMilestoneNotes: 'Transport assigned and transit cargo insurance policy #INS-MH-882 active. Pickup scheduled for Aug 30.',
    createdAt: '2026-08-24T06:30:00Z',
    updatedAt: '2026-08-24T08:30:00Z',
  },
];

const INITIAL_SEED_SUPPORT_QUERIES: SupportQuery[] = [
  {
    id: 'QRY-0001',
    queryNo: 'QRY-0001',
    userId: 'USER-FAR-9142',
    userName: 'Ramesh Patil (शेतकरी)',
    userRole: 'farmer',
    userMobile: '9825143210',
    dealCode: 'DEAL-2026-001',
    crop: 'Onion',
    category: 'Payment Delay',
    subject: 'Stage-2 (30% Dispatch) Escrow release pending after weighment slip upload',
    description: 'I loaded 12 MT Onion onto vehicle MH-15-EG-4412 and uploaded the electronic weighbridge slip (12,040 kg) this morning. The 30% dispatch disbursement is still showing pending. Please expedite.',
    priority: 'High',
    status: 'Under Investigation',
    adminResolutionNote: 'Weighbridge receipt verified by FPO nodal officer. 30% payment (₹1,06,200) queued for RTGS batch release.',
    createdAt: '2026-08-24T10:15:00Z',
  },
  {
    id: 'QRY-0002',
    queryNo: 'QRY-0002',
    userId: 'USER-BUY-5021',
    userName: 'Vikram Shinde (Sahyadri Farms)',
    userRole: 'buyer',
    userMobile: '9822019944',
    dealCode: 'DEAL-2026-001',
    crop: 'Onion',
    category: 'Logistics Delay',
    subject: 'Inward truck delayed due to highway bypass traffic at Pimpalgaon',
    description: 'Vehicle MH-15-EG-4412 was scheduled to arrive at our Dindori processing dock by 12:30 PM. Driver reports heavy traffic near toll plaza. Requesting revised ETA confirmation.',
    priority: 'Medium',
    status: 'Resolved',
    adminResolutionNote: 'Driver contacted; revised ETA confirmed 01:15 PM. Factory gate receiving bay #3 reserved.',
    resolvedAt: '2026-08-24T12:05:00Z',
    createdAt: '2026-08-24T11:40:00Z',
  },
  {
    id: 'QRY-0003',
    queryNo: 'QRY-0003',
    userId: 'USER-FAR-9145',
    userName: 'Tukaram More (शेतकरी)',
    userRole: 'farmer',
    userMobile: '9922114433',
    dealCode: 'DEAL-2026-004',
    crop: 'Cotton',
    category: 'Weighbridge Dispute',
    subject: 'Moisture assay reading variance at local collection point',
    description: 'Local ginning moisture meter tested 8.2% moisture while trader app reading showed 9.5%. Need government certified moisture meter recalibration or MSAMB officer inspection.',
    priority: 'Urgent',
    status: 'Open',
    createdAt: '2026-08-24T08:50:00Z',
  },
  {
    id: 'QRY-0004',
    queryNo: 'QRY-0004',
    userId: 'USER-BUY-5022',
    userName: 'Pravin Deshmukh (Baramati Agro)',
    userRole: 'buyer',
    userMobile: '9823055112',
    dealCode: 'DEAL-2026-002',
    crop: 'Soybean',
    category: 'General Inquiry',
    subject: 'Request for WDRA godown electronic warehouse receipt (e-NWR) copy',
    description: 'Need certified warehouse receipt copy for banking collateral before releasing remaining 50% escrow tranche upon arrival.',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2026-08-24T07:20:00Z',
  },
];

const INITIAL_SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-001',
    userId: 'USER-FAR-9142',
    type: 'new_offer',
    titleEn: 'New Buyer Offer Received!',
    titleMr: 'नवीन खरेदी ऑफर प्राप्त झाली!',
    titleHi: 'नई खरीद ऑफर प्राप्त हुई!',
    titleGu: 'નવી ખરીદ ઓફર મળી!',
    messageEn: 'Sahyadri Farms sent an offer of ₹2,950/quintal for 12 tonnes of your Onion lot.',
    messageMr: 'सह्याद्री फार्म्सने आपल्या कांदा लॉटसाठी ₹२,९५०/क्विंटल दराने १२ टन खरेदीची ऑफर दिली आहे.',
    messageHi: 'सह्याद्री फार्म्स ने आपके प्याज लॉट के लिए ₹2,950/क्विंटल पर 12 टन की ऑफर भेजी है।',
    messageGu: 'સહ્યાદ્રી ફાર્મ્સ તરફથી તમારા ડુંગળી લોટ માટે ₹૨,૯૫૦/ક્વિન્ટલની ૧૨ ટન માટે ઓફર મળી છે.',
    linkTarget: 'deals',
    read: false,
    isRead: false,
    createdAt: '2026-08-23T12:30:00Z',
  },
  {
    id: 'NOTIF-002',
    userId: 'USER-BUY-5021',
    type: 'offer_accepted',
    titleEn: 'Offer Accepted by Farmer!',
    titleMr: 'शेतकऱ्याने ऑफर स्वीकारली!',
    titleHi: 'किसान ने ऑफर स्वीकार कर ली!',
    titleGu: 'ઓફર સ્વીકારાઈ ગઈ!',
    messageEn: 'Farmer Ramesh Patil accepted your offer. Deal #DEAL-2026-001 is now active.',
    messageMr: 'शेतकरी रमेश पाटील यांनी आपली ऑफर स्वीकारली. सौदा #DEAL-2026-001 आता सक्रिय आहे.',
    messageHi: 'किसान रमेश पाटिल ने आपकी ऑफर स्वीकार कर ली। सौदा #DEAL-2026-001 सक्रिय है।',
    messageGu: 'ખેડૂત રમેશ પાટીલે તમારી ઓફર સ્વીકારી છે. સોદો #DEAL-2026-001 સક્રિય થયો છે.',
    linkTarget: 'deals',
    read: false,
    isRead: false,
    createdAt: '2026-08-23T15:00:00Z',
  },
  {
    id: 'NOTIF-003',
    userId: 'ADMIN-MH-01',
    type: 'system',
    titleEn: 'New Verification Request Submitted',
    titleMr: 'नवीन पडताळणी विनंती प्राप्त',
    titleHi: 'नया सत्यापन अनुरोध सबमिट हुआ',
    titleGu: 'નવું વેરિફિકેશન વિનંતી',
    messageEn: 'Farmer KYC document submitted for MSAMB verification queue review.',
    messageMr: 'शेतकरी ७/१२ व ओळखपत्र एमएसएएमबी पडताळणी कक्षात आले आहे.',
    messageHi: 'किसान भू-अभिलेख सत्यापन हेतु कतार में जोड़ा गया।',
    messageGu: 'ખેડૂત ૭/૧૨ દસ્તાવેજ વેરિફિકેશન માટે સબમિટ થયો છે.',
    linkTarget: 'admin-queue',
    read: false,
    isRead: false,
    createdAt: '2026-08-25T08:00:00Z',
  },
];

const INITIAL_SEED_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'LOG-001',
    adminId: 'ADMIN-MH-01',
    adminName: 'Dr. Suresh Pawar (MSAMB Officer)',
    action: 'Listing Grade A Verified & Published',
    targetType: 'listing',
    targetId: 'LIST-2026-001',
    targetCode: 'KS-NAS-0101',
    details: {
      crop: 'Onion',
      farmer: 'Ramesh Patil',
      verifiedGrade: 'Grade A (Export / Super)',
    },
    createdAt: '2026-08-23T10:30:00Z',
  },
];

const INITIAL_SEED_VERIFICATIONS: VerificationRequest[] = [
  {
    id: 'VERIF-2026-001',
    userId: 'USER-FAR-9142',
    userName: 'Ramesh Patil (रमेश पाटील)',
    userRole: 'farmer',
    mobile: '9825143210',
    documentType: '7/12 Land Record',
    documentNumber: 'GAT-42-LASALGAON',
    documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    additionalNotes: 'Land holding 8.5 acres under Niphad taluka, Nashik.',
    status: 'Verified',
    adminId: 'ADMIN-MH-01',
    adminName: 'Dr. Suresh Pawar',
    adminNotes: 'MSAMB land records verified via Maharashtra Mahabhulekh revenue portal match.',
    reviewedAt: '2026-08-20T10:00:00Z',
    createdAt: '2026-08-19T14:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
];

const INITIAL_SEED_DOCUMENTS: UserDocument[] = [
  {
    id: 'DOC-2026-001',
    userId: 'USER-FAR-9142',
    documentType: '7/12 Land Extract',
    title: 'Lasalgaon Farmland 7/12 Record',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    fileName: 'ramesh_patil_7_12_record.pdf',
    fileSizeBytes: 245000,
    mimeType: 'application/pdf',
    isVerified: true,
    verifiedBy: 'ADMIN-MH-01',
    verifiedAt: '2026-08-20T10:00:00Z',
    createdAt: '2026-08-19T14:00:00Z',
  },
];

const INITIAL_SEED_BUYER_REQS: BuyerRequirement[] = [
  {
    id: 'BREQ-2026-001',
    buyerId: 'USER-BUY-5021',
    buyerName: 'Vilas Shinde',
    buyerMobile: '9724012345',
    companyName: 'Sahyadri Farmers Post Harvest Care Ltd.',
    category: 'Vegetables',
    crop: 'Onion',
    cropMr: 'कांदा (नाशिक लाल)',
    cropHi: 'प्याज (नासिक लाल)',
    cropGu: 'ડુંગળી (નાશિક લાલ)',
    requiredQuantity: 150,
    unit: 'tonne',
    targetPrice: 2950,
    priceUnit: 'quintal',
    preferredGrade: 'Grade A (Export / Super)',
    deliveryDistrict: 'Nashik',
    deliveryAddress: 'Mohadi Mega Food Park, Dindori, Nashik',
    deadlineDate: '2026-09-30',
    notes: 'Require export quality Nashik red onions 55mm+. Direct farmgate pickup arranged.',
    status: 'Active',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
];

// Helper Functions for Local Storage
function readStorage<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (_) {
    return defaultData;
  }
}

function writeStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

export class DatabaseService {
  // =========================================================================
  // 1. User Profiles & Admin Oversight
  // =========================================================================
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const res = await apiClient.get<any>(`/profiles/${userId}`);
      if (res.success && res.data?.profile) {
        return res.data.profile;
      }
    } catch {
      // Fallback to local storage
    }
    const profiles = readStorage<UserProfile[]>(PROFILES_STORAGE_KEY, INITIAL_SEED_PROFILES);
    return profiles.find((p) => p.id === userId || p.userId === userId || p.mobile === userId) || null;
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    return readStorage<UserProfile[]>(PROFILES_STORAGE_KEY, INITIAL_SEED_PROFILES);
  }

  async saveProfile(profileData: Partial<UserProfile> & { id: string; name: string; mobile: string; role: UserRole }): Promise<UserProfile> {
    const profiles = readStorage<UserProfile[]>(PROFILES_STORAGE_KEY, INITIAL_SEED_PROFILES);
    const existingIndex = profiles.findIndex((p) => p.id === profileData.id || p.userId === profileData.id || p.mobile === profileData.mobile);

    let updatedProfile: UserProfile;
    if (existingIndex >= 0) {
      const prev = profiles[existingIndex];
      updatedProfile = {
        ...prev,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      profiles[existingIndex] = updatedProfile;

      // Track profile change log for Admin
      const changedKeys = Object.keys(profileData).filter((k) => (profileData as any)[k] !== (prev as any)[k]);
      if (changedKeys.length > 0) {
        this.logProfileChange({
          userId: updatedProfile.id,
          userName: updatedProfile.name,
          role: updatedProfile.role,
          changedFields: changedKeys,
          details: { updatedFields: changedKeys, timestamp: new Date().toISOString() },
        });
      }
    } else {
      updatedProfile = {
        id: profileData.id,
        userId: profileData.id,
        name: profileData.name,
        mobile: profileData.mobile,
        email: profileData.email,
        role: profileData.role,
        accountType: profileData.accountType || profileData.role,
        state: profileData.state || 'Gujarat',
        district: profileData.district || 'Bhavnagar',
        taluka: profileData.taluka,
        village: profileData.village || 'Gujarat Rural',
        pinCode: profileData.pinCode,
        pickupAddress: profileData.pickupAddress,
        preferredLanguage: profileData.preferredLanguage || 'gu',
        isVerified: profileData.isVerified || false,
        verificationStatus: profileData.verificationStatus || 'Pending',
        fpoName: profileData.fpoName,
        crops: profileData.crops || [],
        farmSize: profileData.farmSize,
        storageAvailable: profileData.storageAvailable ?? true,
        transportNeeded: profileData.transportNeeded ?? true,
        bankAccountName: profileData.bankAccountName,
        bankAccountNumber: profileData.bankAccountNumber,
        bankIfscCode: profileData.bankIfscCode,
        upiId: profileData.upiId,
        identityDocType: profileData.identityDocType,
        identityDocUrl: profileData.identityDocUrl,
        identityDocNumber: profileData.identityDocNumber,
        companyName: profileData.companyName,
        buyerType: profileData.buyerType,
        gstNumber: profileData.gstNumber,
        panNumber: profileData.panNumber,
        requiredCommodities: profileData.requiredCommodities || [],
        deliveryAddress: profileData.deliveryAddress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      profiles.unshift(updatedProfile);
    }

    writeStorage(PROFILES_STORAGE_KEY, profiles);

    // Sync to MongoDB Atlas API
    try {
      apiClient.put('/profiles/' + updatedProfile.id, updatedProfile).catch(() => {});
    } catch (_) {}

    return updatedProfile;
  }

  async getProfileChangeLogs(): Promise<ProfileChangeLog[]> {
    return readStorage<ProfileChangeLog[]>(PROFILE_LOGS_STORAGE_KEY, []);
  }

  async logProfileChange(logData: Omit<ProfileChangeLog, 'id' | 'updatedAt'>): Promise<ProfileChangeLog> {
    const logs = readStorage<ProfileChangeLog[]>(PROFILE_LOGS_STORAGE_KEY, []);
    const newLog: ProfileChangeLog = {
      ...logData,
      id: `PLOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      updatedAt: new Date().toISOString(),
    };
    writeStorage(PROFILE_LOGS_STORAGE_KEY, [newLog, ...logs]);
    return newLog;
  }

  // =========================================================================
  // 2. Verification Workflow & Document Submissions
  // =========================================================================
  async getVerificationRequests(userId?: string): Promise<VerificationRequest[]> {
    const reqs = readStorage<VerificationRequest[]>(VERIFICATIONS_STORAGE_KEY, INITIAL_SEED_VERIFICATIONS);
    if (!userId) return reqs;
    return reqs.filter((r) => r.userId === userId);
  }

  async submitVerificationRequest(
    data: Omit<VerificationRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<VerificationRequest> {
    const reqs = readStorage<VerificationRequest[]>(VERIFICATIONS_STORAGE_KEY, INITIAL_SEED_VERIFICATIONS);
    const newReq: VerificationRequest = {
      ...data,
      id: `VERIF-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeStorage(VERIFICATIONS_STORAGE_KEY, [newReq, ...reqs]);

    // Update user profile verification status to Pending
    const profile = await this.getProfile(data.userId);
    if (profile) {
      await this.saveProfile({
        ...profile,
        verificationStatus: 'Pending',
        identityDocType: data.documentType,
        identityDocNumber: data.documentNumber,
        identityDocUrl: data.documentUrl,
      });
    }

    // Notify Admin
    this.createNotification({
      userId: 'ADMIN_ALL',
      type: 'verification',
      titleGu: 'નવી કેવાયસી ચકાસણી વિનંતી',
      titleEn: 'New KYC Verification Request',
      messageGu: `${data.userName} (${data.userRole}) દ્વારા ${data.documentType} વેરિફિકેશન માટે સબમિટ કરાયું છે.`,
      messageEn: `${data.userName} (${data.userRole}) submitted ${data.documentType} for admin verification.`,
      linkTarget: 'admin-queue',
      recipientRole: 'admin',
      isAdminOnly: true,
    });

    return newReq;
  }

  async reviewVerificationRequest(
    requestId: string,
    adminId: string,
    adminName: string,
    status: 'Verified' | 'Rejected' | 'More Information Required',
    notes?: string,
    requestedInfoNotes?: string
  ): Promise<VerificationRequest | null> {
    const reqs = readStorage<VerificationRequest[]>(VERIFICATIONS_STORAGE_KEY, INITIAL_SEED_VERIFICATIONS);
    const index = reqs.findIndex((r) => r.id === requestId);
    if (index === -1) return null;

    const target = reqs[index];
    const updated: VerificationRequest = {
      ...target,
      status,
      adminId,
      adminName,
      adminNotes: notes,
      requestedInfoNotes,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    reqs[index] = updated;
    writeStorage(VERIFICATIONS_STORAGE_KEY, reqs);

    // Update user profile status
    const profile = await this.getProfile(target.userId);
    if (profile) {
      await this.saveProfile({
        ...profile,
        isVerified: status === 'Verified',
        verificationStatus: status,
        rejectionReason: status === 'Rejected' ? notes : undefined,
      });
    }

    // Send private user notification
    this.createNotification({
      userId: target.userId,
      type: status === 'Verified' ? 'listing_approved' : status === 'Rejected' ? 'listing_rejected' : 'info_requested',
      titleGu:
        status === 'Verified'
          ? 'વેરિફિકેશન મંજૂર થયું!'
          : status === 'Rejected'
          ? 'વેરિફિકેશન અસ્વીકાર થયું'
          : 'વધારાની માહિતી જરૂરી છે',
      titleEn:
        status === 'Verified'
          ? 'Account Verification Approved!'
          : status === 'Rejected'
          ? 'Verification Application Rejected'
          : 'Additional Verification Info Required',
      messageGu:
        status === 'Verified'
          ? `અભિનંદન! તમારું પ્રોફાઇલ અધિકૃત રીતે વેરિફાઈડ થઈ ગયું છે. (${notes || 'સરકારી કચેરી માન્ય'})`
          : status === 'Rejected'
          ? `તમારું વેરિફિકેશન નકારવામાં આવ્યું: ${notes || 'વિગતો અસંગત છે'}`
          : `કૃપા કરીને નીચેની માહિતી ફરીથી મોકલો: ${requestedInfoNotes || notes}`,
      messageEn:
        status === 'Verified'
          ? `Your profile is verified by ${adminName}.`
          : status === 'Rejected'
          ? `Verification was rejected: ${notes}`
          : `Please provide more details: ${requestedInfoNotes || notes}`,
      linkTarget: 'verification',
      recipientRole: target.userRole,
      isAdminOnly: false,
    });

    return updated;
  }

  // =========================================================================
  // 3. User Documents
  // =========================================================================
  async getDocuments(userId?: string): Promise<UserDocument[]> {
    const docs = readStorage<UserDocument[]>(DOCUMENTS_STORAGE_KEY, INITIAL_SEED_DOCUMENTS);
    if (!userId) return docs;
    return docs.filter((d) => d.userId === userId);
  }

  async uploadDocument(docData: Omit<UserDocument, 'id' | 'createdAt' | 'isVerified'>): Promise<UserDocument> {
    const docs = readStorage<UserDocument[]>(DOCUMENTS_STORAGE_KEY, INITIAL_SEED_DOCUMENTS);
    const newDoc: UserDocument = {
      ...docData,
      id: `DOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    writeStorage(DOCUMENTS_STORAGE_KEY, [newDoc, ...docs]);
    return newDoc;
  }

  // =========================================================================
  // 4. Produce Listings
  // =========================================================================
  async getListings(filters?: { farmerId?: string; crop?: string; category?: string; verifiedOnly?: boolean }): Promise<ProduceListing[]> {
    try {
      const res = await apiClient.get<any>('/listings/marketplace', filters);
      if (res.success && res.data?.listings && Array.isArray(res.data.listings)) {
        const atlasListings: ProduceListing[] = res.data.listings.map((l: any) => ({
          ...l,
          id: l.id || l._id?.toString(),
          farmerId: l.farmerId?._id?.toString() || l.farmerId?.toString() || l.farmerId,
        }));
        if (atlasListings.length > 0) {
          const localListings = readStorage<ProduceListing[]>(LISTINGS_STORAGE_KEY, []);
          const pendingOrDrafts = localListings.filter((ll) => ll.status === 'Draft' || ll.isPendingCropApproval);
          const combined = [
            ...pendingOrDrafts.filter((p) => !atlasListings.some((a) => a.id === p.id)),
            ...atlasListings,
          ];
          return combined.filter((l) => {
            if (filters?.farmerId && l.farmerId !== filters.farmerId) return false;
            if (filters?.crop && l.crop !== filters.crop) return false;
            if (filters?.category && l.category !== filters.category) return false;
            if (filters?.verifiedOnly && l.status !== 'Published' && l.status !== 'Verified') return false;
            return true;
          });
        }
      }
    } catch {
      // Fallback
    }

    const listings = readStorage<ProduceListing[]>(LISTINGS_STORAGE_KEY, INITIAL_SEED_LISTINGS);
    return listings.filter((l) => {
      if (filters?.farmerId && l.farmerId !== filters.farmerId) return false;
      if (filters?.crop && l.crop !== filters.crop) return false;
      if (filters?.category && l.category !== filters.category) return false;
      if (filters?.verifiedOnly && l.status !== 'Published' && l.status !== 'Verified') return false;
      return true;
    });
  }

  async getListingById(id: string): Promise<ProduceListing | null> {
    const listings = readStorage<ProduceListing[]>(LISTINGS_STORAGE_KEY, INITIAL_SEED_LISTINGS);
    return listings.find((l) => l.id === id || l.listingCode === id) || null;
  }

  async createListing(data: Omit<ProduceListing, 'id' | 'listingCode' | 'createdAt' | 'updatedAt' | 'offersCount' | 'photos'> & { photos?: { id: string; url: string; isPrimary?: boolean }[] }): Promise<ProduceListing> {
    const listings = readStorage<ProduceListing[]>(LISTINGS_STORAGE_KEY, INITIAL_SEED_LISTINGS);
    const count = listings.length + 1;
    const cropPrefix = data.crop.slice(0, 3).toUpperCase();
    const listingCode = `KS-${cropPrefix}-${String(count).padStart(4, '0')}`;

    const newListing: ProduceListing = {
      ...data,
      id: `LIST-2026-${String(count).padStart(3, '0')}`,
      listingCode,
      offersCount: 0,
      photos: (data.photos || []).map((p) => ({
        ...p,
        uploadedAt: new Date().toISOString(),
      })),
      primaryImageUrl: data.primaryImageUrl || (data.photos && data.photos[0]?.url) || 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    writeStorage(LISTINGS_STORAGE_KEY, [newListing, ...listings]);

    // Push to MongoDB Atlas via Express API
    try {
      apiClient.post('/listings', {
        crop: data.crop,
        cropGu: (data as any).cropGu || data.crop,
        variety: data.variety,
        category: (['Vegetables', 'Fruits', 'Spices'].includes(data.category) ? data.category : 'Vegetables') as any,
        quantity: data.quantity,
        unit: data.unit,
        minPurchaseQuantity: data.minPurchaseQuantity || 1,
        grade: data.grade,
        harvestDate: data.harvestDate || new Date().toISOString().split('T')[0],
        expectedPrice: data.expectedPrice,
        priceUnit: data.priceUnit || 'quintal',
        district: data.district,
        taluka: data.taluka || '',
        village: data.village,
        pickupAddress: data.pickupAddress,
        description: data.description,
        isOrganic: data.isOrganic,
        storageAvailable: data.storageAvailable,
        transportNeeded: data.transportNeeded,
        isDraft: data.status === 'Draft',
        isPendingCropApproval: data.isPendingCropApproval,
      }).catch((err) => {
        console.warn('Listing created locally; Atlas sync deferred:', err);
      });
    } catch (_) {}

    // Admin Notification
    this.createNotification({
      userId: 'ADMIN_ALL',
      type: 'system',
      titleGu: 'નવો પાક લોટ સબમિટ થયો',
      titleEn: 'New Produce Lot Submitted',
      messageGu: `ખેડૂત ${data.farmerName} એ ${data.quantity} ${data.unit} ${data.crop} ચકાસણી માટે મૂક્યો છે.`,
      messageEn: `Farmer ${data.farmerName} submitted ${data.quantity} ${data.unit} of ${data.crop} for verification.`,
      linkTarget: 'admin-queue',
      recipientRole: 'admin',
      isAdminOnly: true,
    });

    return newListing;
  }

  async verifyListing(
    listingId: string,
    adminId: string,
    adminName: string,
    decision: { status: ListingStatus; verifiedGrade?: QualityGrade; notes?: string; correctionsRequested?: string }
  ): Promise<ProduceListing | null> {
    const listings = readStorage<ProduceListing[]>(LISTINGS_STORAGE_KEY, INITIAL_SEED_LISTINGS);
    const index = listings.findIndex((l) => l.id === listingId);
    if (index === -1) return null;

    const target = listings[index];
    const updated: ProduceListing = {
      ...target,
      status: decision.status,
      verifiedGrade: decision.verifiedGrade || target.grade,
      verifiedBy: adminId,
      verifiedAt: new Date().toISOString(),
      adminInspectionNotes: decision.notes,
      correctionsRequested: decision.correctionsRequested,
      updatedAt: new Date().toISOString(),
    };
    listings[index] = updated;
    writeStorage(LISTINGS_STORAGE_KEY, listings);

    // Notify Farmer
    this.createNotification({
      userId: target.farmerId,
      type: decision.status === 'Verified' || decision.status === 'Published' ? 'listing_approved' : 'listing_rejected',
      titleGu:
        decision.status === 'Verified' || decision.status === 'Published'
          ? 'પાક લોટ વેરિફાઈડ થયો!'
          : 'પાક લોટ અંગે સૂચના',
      titleEn:
        decision.status === 'Verified' || decision.status === 'Published'
          ? 'Produce Lot Verified!'
          : 'Produce Lot Update',
      messageGu: `તમારો લોટ #${target.listingCode} (${target.crop}) ${decision.status} તરીકે અપડેટ થયો છે.`,
      messageEn: `Your lot #${target.listingCode} (${target.crop}) was updated to ${decision.status}.`,
      linkTarget: 'listings',
      recipientRole: 'farmer',
      isAdminOnly: false,
    });

    this.logAdminAction('Listing Inspection & Grading', 'listing', target.id, target.listingCode, adminId, adminName, {
      status: decision.status,
      verifiedGrade: decision.verifiedGrade,
      notes: decision.notes,
    });

    return updated;
  }

  // =========================================================================
  // 5. Offers & Private Counterparty Deals
  // =========================================================================
  async getOffers(filters?: { farmerId?: string; buyerId?: string; listingId?: string }): Promise<BuyerOffer[]> {
    const offers = readStorage<BuyerOffer[]>(OFFERS_STORAGE_KEY, INITIAL_SEED_OFFERS);
    return offers.filter((o) => {
      if (filters?.farmerId && o.farmerId !== filters.farmerId) return false;
      if (filters?.buyerId && o.buyerId !== filters.buyerId) return false;
      if (filters?.listingId && o.listingId !== filters.listingId) return false;
      return true;
    });
  }

  async submitOffer(offerData: Omit<BuyerOffer, 'id' | 'status' | 'createdAt'>): Promise<BuyerOffer> {
    const offers = readStorage<BuyerOffer[]>(OFFERS_STORAGE_KEY, INITIAL_SEED_OFFERS);
    const newOffer: BuyerOffer = {
      ...offerData,
      id: `OFFER-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    writeStorage(OFFERS_STORAGE_KEY, [newOffer, ...offers]);

    // Send Notification strictly to Farmer
    this.createNotification({
      userId: offerData.farmerId,
      type: 'new_offer',
      titleGu: 'તમારા પાક માટે નવી ઓફર!',
      titleEn: 'New Offer on Your Produce!',
      messageGu: `${offerData.buyerName} (${offerData.buyerCompany}) એ ₹${offerData.offeredPrice}/ક્વિન્ટલ ભાવે ${offerData.requiredQuantity} ${offerData.unit} માટે ઓફર મૂકી છે.`,
      messageEn: `${offerData.buyerName} made an offer of ₹${offerData.offeredPrice}/${offerData.priceUnit} for ${offerData.requiredQuantity} ${offerData.unit}.`,
      linkTarget: 'deals',
      recipientRole: 'farmer',
      isAdminOnly: false,
    });

    return newOffer;
  }

  async createOffer(offerData: Omit<BuyerOffer, 'id' | 'status' | 'createdAt'>): Promise<BuyerOffer> {
    return this.submitOffer(offerData);
  }

  async respondToOffer(
    offerId: string,
    action: 'accept' | 'reject' | 'counter',
    counterDetails?: { counterPrice?: number; counterQuantity?: number; notes?: string; responderRole?: 'farmer' | 'buyer' }
  ): Promise<{ offer: BuyerOffer; deal?: Deal }> {
    const offers = readStorage<BuyerOffer[]>(OFFERS_STORAGE_KEY, INITIAL_SEED_OFFERS);
    const offerIndex = offers.findIndex((o) => o.id === offerId);
    if (offerIndex === -1) throw new Error('Offer not found');

    const offer = offers[offerIndex];
    let deal: Deal | undefined;

    if (action === 'accept') {
      offer.status = 'Accepted';
      deal = await this.createDealFromOffer(offer);

      // If counterPrice was set, notify the farmer that buyer accepted their counter-offer
      if (offer.counterPrice && offer.counterPrice > 0) {
        this.createNotification({
          userId: offer.farmerId,
          type: 'offer_accepted',
          titleGu: 'કાઉન્ટર ઓફર સ્વીકારાઈ!',
          titleEn: 'Counter Offer Accepted!',
          messageGu: `ખરીદદાર ${offer.buyerName} એ તમારી ₹${offer.counterPrice}/${offer.priceUnit} ની કાઉન્ટર ઓફર સ્વીકારી છે.`,
          messageEn: `Buyer ${offer.buyerName} accepted your counter offer of ₹${offer.counterPrice}/${offer.priceUnit}. Deal #${deal.dealCode} confirmed.`,
          linkTarget: 'deals',
          recipientRole: 'farmer',
          isAdminOnly: false,
        });
      }
    } else if (action === 'counter') {
      offer.status = 'Countered';
      if (counterDetails?.counterPrice) {
        offer.counterPrice = counterDetails.counterPrice;
      }
      if (counterDetails?.counterQuantity) {
        offer.counterQuantity = counterDetails.counterQuantity;
      }
      if (counterDetails?.notes) {
        offer.counterNotes = counterDetails.notes;
      }

      const isFarmerResponding = counterDetails?.responderRole !== 'buyer';

      if (isFarmerResponding) {
        // Notify Buyer of farmer's counter offer
        this.createNotification({
          userId: offer.buyerId,
          type: 'counter_offer',
          titleGu: 'ખેડૂત તરફથી કાઉન્ટર ઓફર!',
          titleEn: 'Counter Offer from Farmer!',
          messageGu: `ખેડૂત ${offer.farmerName} એ ₹${offer.counterPrice}/ક્વિન્ટલનો કાઉન્ટર ભાવ મોકલ્યો છે.`,
          messageEn: `Farmer ${offer.farmerName} countered with ₹${offer.counterPrice}/${offer.priceUnit}.`,
          linkTarget: 'deals',
          recipientRole: 'buyer',
          isAdminOnly: false,
        });
      } else {
        // Notify Farmer of buyer's counter-counter offer
        this.createNotification({
          userId: offer.farmerId,
          type: 'counter_offer',
          titleGu: 'ખરીદદાર તરફથી કાઉન્ટર ઓફર!',
          titleEn: 'Counter Offer from Buyer!',
          messageGu: `ખરીદદાર ${offer.buyerName} એ ₹${offer.counterPrice}/ક્વિન્ટલનો નવો ભાવ મોકલ્યો છે.`,
          messageEn: `Buyer ${offer.buyerName} proposed revised price ₹${offer.counterPrice}/${offer.priceUnit}.`,
          linkTarget: 'offers',
          recipientRole: 'farmer',
          isAdminOnly: false,
        });
      }
    } else {
      offer.status = 'Rejected';
      const isBuyerRejecting = counterDetails?.responderRole === 'buyer';
      this.createNotification({
        userId: isBuyerRejecting ? offer.farmerId : offer.buyerId,
        type: 'offer_rejected',
        titleGu: 'ઓફર નકારવામાં આવી',
        titleEn: 'Offer Declined',
        messageGu: `ઓફર #${offer.listingCode || offer.id} નકારવામાં આવી છે.`,
        messageEn: `Offer #${offer.listingCode || offer.id} was declined.`,
        linkTarget: 'offers',
        recipientRole: isBuyerRejecting ? 'farmer' : 'buyer',
        isAdminOnly: false,
      });
    }

    offer.updatedAt = new Date().toISOString();
    offers[offerIndex] = offer;
    writeStorage(OFFERS_STORAGE_KEY, offers);

    // Sync to backend if accessible
    apiClient.post(`/offers/${offerId}/respond`, {
      action,
      counterPrice: counterDetails?.counterPrice || offer.counterPrice,
      counterNotes: counterDetails?.notes || offer.counterNotes,
    }).catch(() => {});

    return { offer, deal };
  }

  private async createDealFromOffer(offer: BuyerOffer): Promise<Deal> {
    const deals = readStorage<Deal[]>(DEALS_STORAGE_KEY, INITIAL_SEED_DEALS);
    const listing = await this.getListingById(offer.listingId);
    const dealCount = deals.length + 1;
    const dealCode = `DEAL-2026-${String(dealCount).padStart(3, '0')}`;

    // Critical Bug Fix: If offer has a negotiated counterPrice, use counterPrice as the final agreed price!
    const effectivePrice = (offer.counterPrice && offer.counterPrice > 0) ? offer.counterPrice : offer.offeredPrice;
    const effectiveQuantity = (offer.counterQuantity && offer.counterQuantity > 0) ? offer.counterQuantity : offer.requiredQuantity;

    const totalVal = Math.round(
      effectiveQuantity *
        (offer.unit === 'tonne' || offer.unit === 'Ton' ? 10 : 1) *
        effectivePrice
    );

    const newDeal: Deal = {
      id: `DEAL-${Date.now()}`,
      dealCode,
      offerId: offer.id,
      listingId: offer.listingId,
      farmerId: offer.farmerId,
      farmerName: offer.farmerName,
      farmerMobile: offer.farmerMobile,
      farmerVillage: listing?.village || 'Mahuva',
      farmerDistrict: listing?.district || 'Bhavnagar',
      buyerId: offer.buyerId,
      buyerName: offer.buyerName,
      buyerCompany: offer.buyerCompany,
      buyerMobile: offer.buyerMobile,
      crop: offer.crop,
      cropGu: offer.cropGu || offer.crop,
      variety: offer.variety || 'Standard Grade A',
      agreedQuantity: effectiveQuantity,
      unit: offer.unit,
      agreedPrice: effectivePrice,
      agreedPricePerUnit: effectivePrice,
      priceUnit: offer.priceUnit,
      totalEstimatedValue: totalVal,
      totalAmountINR: totalVal,
      pickupAddress: listing?.pickupAddress || `${listing?.village}, ${listing?.district}`,
      deliveryDestination: 'Buyer Processing Facility, Gujarat',
      pickupDate: offer.preferredPickupDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      transportResponsibility: offer.transportResponsibility,
      escrowStatus: 'Funds Locked in Escrow',
      escrowReference: `ESC-GSAMB-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Offer Accepted',
      notes: `Deal created via mutual agreement on KrishiSetu. Agreed Rate ₹${effectivePrice}/${offer.priceUnit}. Total value ₹${totalVal.toLocaleString('en-IN')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    writeStorage(DEALS_STORAGE_KEY, [newDeal, ...deals]);

    // Send Notifications to both Farmer and Buyer
    this.createNotification({
      userId: offer.farmerId,
      type: 'offer_accepted',
      titleGu: 'સોદો કન્ફર્મ થયો!',
      titleEn: 'Deal Confirmed!',
      messageGu: `સોદા નંબર #${dealCode} જનરેટ થયો છે. ખરીદદાર ${offer.buyerName} નો સંપર્ક અનલૉક થયો છે.`,
      messageEn: `Deal #${dealCode} is confirmed with buyer ${offer.buyerName}.`,
      linkTarget: 'deals',
      recipientRole: 'farmer',
      isAdminOnly: false,
    });

    this.createNotification({
      userId: offer.buyerId,
      type: 'offer_accepted',
      titleGu: 'સોદો કન્ફર્મ થયો!',
      titleEn: 'Deal Confirmed!',
      messageGu: `સોદા નંબર #${dealCode} બન્યો છે. ખેડૂત ${offer.farmerName} નો ફોન નંબર અનલૉક થયો છે.`,
      messageEn: `Deal #${dealCode} is confirmed with farmer ${offer.farmerName}.`,
      linkTarget: 'deals',
      recipientRole: 'buyer',
      isAdminOnly: false,
    });

    return newDeal;
  }

  // Deal isolation: Counterparty-restricted access
  async getDeals(params?: { farmerId?: string; buyerId?: string; role?: UserRole; userId?: string }): Promise<Deal[]> {
    const deals = readStorage<Deal[]>(DEALS_STORAGE_KEY, INITIAL_SEED_DEALS);

    // If admin, can view all
    if (params?.role === 'admin') {
      return deals;
    }

    // If farmer, only view deals where farmerId matches
    if (params?.farmerId) {
      return deals.filter((d) => d.farmerId === params.farmerId);
    }

    // If buyer, only view deals where buyerId matches
    if (params?.buyerId) {
      return deals.filter((d) => d.buyerId === params.buyerId);
    }

    if (params?.userId) {
      return deals.filter((d) => d.farmerId === params.userId || d.buyerId === params.userId);
    }

    return deals;
  }

  async getDealById(id: string, requesterUserId?: string, requesterRole?: UserRole): Promise<Deal | null> {
    const deals = readStorage<Deal[]>(DEALS_STORAGE_KEY, INITIAL_SEED_DEALS);
    const deal = deals.find((d) => d.id === id || d.dealCode === id) || null;
    if (!deal) return null;

    // Security Check: If not admin and not counterparty, reject access
    if (requesterRole !== 'admin' && requesterUserId) {
      if (deal.farmerId !== requesterUserId && deal.buyerId !== requesterUserId) {
        return null;
      }
    }

    return deal;
  }

  async updateDealStatus(dealId: string, newStatus: DealStatus, notes?: string): Promise<Deal | null> {
    const deals = readStorage<Deal[]>(DEALS_STORAGE_KEY, INITIAL_SEED_DEALS);
    let target: Deal | null = null;

    const updated = deals.map((d) => {
      if (d.id === dealId || d.dealCode === dealId) {
        target = {
          ...d,
          status: newStatus,
          notes: notes ? `${d.notes || ''} [${newStatus}: ${notes}]` : d.notes,
          escrowStatus: newStatus === 'Completed' ? 'Released to Farmer' : d.escrowStatus,
          deliveryDate: newStatus === 'Completed' ? new Date().toISOString() : d.deliveryDate,
          updatedAt: new Date().toISOString(),
        };
        return target;
      }
      return d;
    });

    writeStorage(DEALS_STORAGE_KEY, updated);

    if (target) {
      const tDeal = target as Deal;
      this.createNotification({
        userId: tDeal.farmerId,
        type: newStatus === 'Completed' ? 'payment_released' : 'pickup_scheduled',
        titleGu: `સોદા સ્થિતિ: ${newStatus}`,
        titleEn: `Deal Status Update: ${newStatus}`,
        messageGu: `સોદો ${tDeal.dealCode} અપડેટ થયો: ${newStatus}`,
        messageEn: `Deal ${tDeal.dealCode} status updated to: ${newStatus}`,
        linkTarget: 'deals',
        recipientRole: 'farmer',
      });

      this.createNotification({
        userId: tDeal.buyerId,
        type: newStatus === 'Completed' ? 'payment_released' : 'pickup_scheduled',
        titleGu: `સોદા સ્થિતિ: ${newStatus}`,
        titleEn: `Deal Status Update: ${newStatus}`,
        messageGu: `સોદો ${tDeal.dealCode} અપડેટ થયો: ${newStatus}`,
        messageEn: `Deal ${tDeal.dealCode} status updated to: ${newStatus}`,
        linkTarget: 'deals',
        recipientRole: 'buyer',
      });
    }

    return target;
  }

  // =========================================================================
  // 6. Transport Logistics
  // =========================================================================
  async getAllTransports(): Promise<TransportRequest[]> {
    return readStorage<TransportRequest[]>(TRANSPORTS_STORAGE_KEY, INITIAL_SEED_TRANSPORTS);
  }

  async getTransportByDealId(dealId: string): Promise<TransportRequest | null> {
    const transports = readStorage<TransportRequest[]>(TRANSPORTS_STORAGE_KEY, INITIAL_SEED_TRANSPORTS);
    return transports.find((t) => t.dealId === dealId) || null;
  }

  async updateDealEscrowStatus(dealId: string, escrowStatus: Deal['escrowStatus'], notes?: string): Promise<Deal | null> {
    const deals = readStorage<Deal[]>(DEALS_STORAGE_KEY, INITIAL_SEED_DEALS);
    let target: Deal | null = null;
    const updated = deals.map((d) => {
      if (d.id === dealId || d.dealCode === dealId) {
        target = {
          ...d,
          escrowStatus,
          notes: notes ? `${d.notes || ''} [Escrow: ${notes}]` : d.notes,
          updatedAt: new Date().toISOString(),
        };
        return target;
      }
      return d;
    });
    writeStorage(DEALS_STORAGE_KEY, updated);
    return target;
  }

  async createOrUpdateTransport(dealId: string, data: Partial<TransportRequest> & { dealId: string }): Promise<TransportRequest> {
    const transports = readStorage<TransportRequest[]>(TRANSPORTS_STORAGE_KEY, INITIAL_SEED_TRANSPORTS);
    const existingIndex = transports.findIndex((t) => t.dealId === dealId);
    if (existingIndex >= 0) {
      const updatedItem: TransportRequest = {
        ...transports[existingIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      transports[existingIndex] = updatedItem;
      writeStorage(TRANSPORTS_STORAGE_KEY, transports);
      return updatedItem;
    } else {
      const newItem: TransportRequest = {
        id: `TR-${Date.now()}`,
        status: 'Assigned',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data,
      } as TransportRequest;
      writeStorage(TRANSPORTS_STORAGE_KEY, [newItem, ...transports]);
      return newItem;
    }
  }

  async rateDeal(dealId: string, rating: number, feedback: string, role: string): Promise<void> {
    const deals = readStorage<Deal[]>(DEALS_STORAGE_KEY, INITIAL_SEED_DEALS);
    const updated = deals.map((d) => {
      if (d.id === dealId) {
        return {
          ...d,
          farmerRating: role === 'buyer' ? rating : d.farmerRating,
          buyerRating: role === 'farmer' ? rating : d.buyerRating,
          notes: d.notes ? `${d.notes}\n[${role.toUpperCase()} Rating ${rating}/5]: ${feedback}` : `[${role.toUpperCase()} Rating ${rating}/5]: ${feedback}`,
          updatedAt: new Date().toISOString(),
        };
      }
      return d;
    });
    writeStorage(DEALS_STORAGE_KEY, updated);
  }

  // =========================================================================
  // 7. Buyer Requirements (Demand Postings)
  // =========================================================================
  async getBuyerRequirements(filters?: { buyerId?: string; crop?: string; category?: string }): Promise<BuyerRequirement[]> {
    const reqs = readStorage<BuyerRequirement[]>(BUYER_REQ_STORAGE_KEY, INITIAL_SEED_BUYER_REQS);
    return reqs.filter((r) => {
      if (filters?.buyerId && r.buyerId !== filters.buyerId) return false;
      if (filters?.crop && r.crop !== filters.crop) return false;
      if (filters?.category && r.category !== filters.category) return false;
      return true;
    });
  }

  async createBuyerRequirement(reqData: Omit<BuyerRequirement, 'id' | 'createdAt' | 'updatedAt'>): Promise<BuyerRequirement> {
    const reqs = readStorage<BuyerRequirement[]>(BUYER_REQ_STORAGE_KEY, INITIAL_SEED_BUYER_REQS);
    const newReq: BuyerRequirement = {
      ...reqData,
      id: `BREQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeStorage(BUYER_REQ_STORAGE_KEY, [newReq, ...reqs]);
    return newReq;
  }

  // =========================================================================
  // 8. Public News & Announcements
  // =========================================================================
  async getNews(): Promise<NewsItem[]> {
    try {
      const res = await apiClient.get<any>('/news');
      if (res.success && res.data?.news && Array.isArray(res.data.news)) {
        return res.data.news.map((n: any) => ({
          ...n,
          id: n.id || n._id?.toString(),
        }));
      }
    } catch {}
    return readStorage<NewsItem[]>(NEWS_STORAGE_KEY, INITIAL_SEED_NEWS);
  }

  async createNews(newsData: Omit<NewsItem, 'id' | 'createdAt' | 'publishedAt'>): Promise<NewsItem> {
    const news = readStorage<NewsItem[]>(NEWS_STORAGE_KEY, INITIAL_SEED_NEWS);
    const newArticle: NewsItem = {
      ...newsData,
      id: `NEWS-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    writeStorage(NEWS_STORAGE_KEY, [newArticle, ...news]);

    try {
      apiClient.post('/news', newArticle).catch(() => {});
    } catch (_) {}

    return newArticle;
  }

  async deleteNews(id: string): Promise<boolean> {
    const news = readStorage<NewsItem[]>(NEWS_STORAGE_KEY, INITIAL_SEED_NEWS);
    const filtered = news.filter((n) => n.id !== id);
    writeStorage(NEWS_STORAGE_KEY, filtered);
    return true;
  }

  // =========================================================================
  // 9. Support Queries & Grievances
  // =========================================================================
  async getSupportQueries(filters?: { status?: string; category?: string; userRole?: string }): Promise<SupportQuery[]> {
    const queries = readStorage<SupportQuery[]>(SUPPORT_QUERIES_STORAGE_KEY, INITIAL_SEED_SUPPORT_QUERIES);
    return queries.filter((q) => {
      if (filters?.status && q.status !== filters.status) return false;
      if (filters?.category && q.category !== filters.category) return false;
      if (filters?.userRole && q.userRole !== filters.userRole) return false;
      return true;
    });
  }

  async createSupportQuery(queryData: Omit<SupportQuery, 'id' | 'createdAt' | 'queryNo'>): Promise<SupportQuery> {
    const queries = readStorage<SupportQuery[]>(SUPPORT_QUERIES_STORAGE_KEY, INITIAL_SEED_SUPPORT_QUERIES);
    const queryCount = queries.length + 1;
    const queryNo = `QRY-${String(queryCount).padStart(4, '0')}`;
    const newQuery: SupportQuery = {
      ...queryData,
      id: `QRY-${Date.now()}`,
      queryNo,
      createdAt: new Date().toISOString(),
    };
    writeStorage(SUPPORT_QUERIES_STORAGE_KEY, [newQuery, ...queries]);
    return newQuery;
  }

  async updateSupportQueryStatus(queryId: string, status: SupportQuery['status'], adminResolutionNote?: string): Promise<SupportQuery | null> {
    const queries = readStorage<SupportQuery[]>(SUPPORT_QUERIES_STORAGE_KEY, INITIAL_SEED_SUPPORT_QUERIES);
    let target: SupportQuery | null = null;

    const updated = queries.map((q) => {
      if (q.id === queryId) {
        target = {
          ...q,
          status,
          adminResolutionNote: adminResolutionNote || q.adminResolutionNote,
          resolvedAt: status === 'Resolved' ? new Date().toISOString() : q.resolvedAt,
          updatedAt: new Date().toISOString(),
        };
        return target;
      }
      return q;
    });

    writeStorage(SUPPORT_QUERIES_STORAGE_KEY, updated);
    return target;
  }

  // =========================================================================
  // 10. Isolated Notifications
  // =========================================================================
  async getNotifications(userId?: string, userRole?: UserRole): Promise<AppNotification[]> {
    const notifs = readStorage<AppNotification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_SEED_NOTIFICATIONS);

    if (userRole === 'admin') {
      return notifs.filter((n) => n.userId === 'ADMIN_ALL' || n.userId === userId || n.recipientRole === 'admin');
    }

    if (!userId) return [];

    // Farmers and buyers only get their own non-admin notifications
    return notifs.filter(
      (n) => (n.userId === userId || n.userId === 'ALL_USERS') && !n.isAdminOnly
    );
  }

  async markNotificationRead(id: string): Promise<void> {
    const notifs = readStorage<AppNotification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_SEED_NOTIFICATIONS);
    const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true, read: true } : n));
    writeStorage(NOTIFICATIONS_STORAGE_KEY, updated);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    return this.markNotificationRead(id);
  }

  async markAllNotificationsAsRead(userId?: string): Promise<void> {
    const notifs = readStorage<AppNotification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_SEED_NOTIFICATIONS);
    const updated = notifs.map((n) => {
      if (!userId || n.userId === userId || n.userId === 'ADMIN_ALL') {
        return { ...n, isRead: true, read: true };
      }
      return n;
    });
    writeStorage(NOTIFICATIONS_STORAGE_KEY, updated);
  }

  async createNotification(
    notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead' | 'read'> & {
      recipientRole?: 'farmer' | 'buyer' | 'admin' | 'all';
      isAdminOnly?: boolean;
      read?: boolean;
    }
  ): Promise<AppNotification> {
    const notifs = readStorage<AppNotification[]>(NOTIFICATIONS_STORAGE_KEY, INITIAL_SEED_NOTIFICATIONS);
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: notif.userId,
      type: notif.type,
      titleGu: notif.titleGu,
      titleEn: notif.titleEn,
      messageGu: notif.messageGu,
      messageEn: notif.messageEn,
      linkTarget: notif.linkTarget,
      isRead: false,
      read: false,
      recipientRole: notif.recipientRole || 'all',
      isAdminOnly: notif.isAdminOnly || false,
      createdAt: new Date().toISOString(),
    } as AppNotification;

    writeStorage(NOTIFICATIONS_STORAGE_KEY, [newNotif, ...notifs]);
    return newNotif;
  }

  // =========================================================================
  // 10. Admin Audit Logs
  // =========================================================================
  async getAuditLogs(): Promise<AdminAuditLog[]> {
    return readStorage<AdminAuditLog[]>(AUDIT_LOGS_STORAGE_KEY, INITIAL_SEED_AUDIT_LOGS);
  }

  async logAdminAction(
    action: string,
    targetType: 'listing' | 'profile' | 'deal' | 'offer' | 'dispute' | 'user' | 'payout' | 'document',
    targetId: string,
    targetCode: string,
    adminId: string,
    adminName: string,
    details?: Record<string, unknown>
  ): Promise<AdminAuditLog> {
    const logs = readStorage<AdminAuditLog[]>(AUDIT_LOGS_STORAGE_KEY, INITIAL_SEED_AUDIT_LOGS);
    const newLog: AdminAuditLog = {
      id: `AUDIT-${Date.now()}`,
      action,
      targetType,
      targetId,
      targetCode,
      adminId,
      adminName,
      details,
      createdAt: new Date().toISOString(),
    };
    writeStorage(AUDIT_LOGS_STORAGE_KEY, [newLog, ...logs]);
    return newLog;
  }
}

export const dbService = new DatabaseService();
