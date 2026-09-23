import fs from 'fs';
import path from 'path';

// Load base TRANSLATIONS
import { TRANSLATIONS } from '../src/i18n/translations';

const en: Record<string, string> = { ...TRANSLATIONS.en };
const hi: Record<string, string> = { ...TRANSLATIONS.hi };
const gu: Record<string, string> = { ...TRANSLATIONS.gu };
const mr: Record<string, string> = {};

// 1. Update Maharashtra context in existing EN, HI, GU
en.mahaGovt = 'Government of Maharashtra · Smart India Hackathon 2026';
en.authBenefit2Desc = 'Contract directly with pre-screened corporate food processors and agri-exporters across Maharashtra.';
en.authBenefit3Desc = 'Guaranteed milestone disbursements via Maharashtra State clearing pool directly into your bank account.';
en.authSuccessFarmer = '— Ramesh Patil, Sahyadri FPO Lead (Nashik)';
en.authVillagePlaceholder = 'e.g. Baramati / Lasalgaon / Rahuri';
en.authOrgPlaceholder = 'e.g. Sahyadri Agro Processing Ltd';
en.adminPortalTitle = 'Government of Maharashtra · Admin Verification Portal';
en.heroEyebrow = 'MARKET INTELLIGENCE FOR MAHARASHTRA';
en.heroSubtext = 'KrushiSetu helps Maharashtra farmers compare prices across APMC mandis, predict demand, find verified corporate buyers and coordinate every step from farm gate to payment.';
en.prototypeNote = '*Prototype estimates based on Maharashtra APMC & FPO pilot simulations.';
en.heroBadge1 = 'Lasalgaon APMC · ₹28.5/kg';
en.heroBadge2 = 'Pune Buyer Demand · High';
en.farmerRecoReason = 'Reason: Marathwada arrivals rising next week; selling now to direct processor yields ₹2.4/kg higher net return.';
en.dashboardSubtitle = 'Real-time overview of active produce lots, buyer offers, and escrow payouts across Maharashtra';
en.priceDiscoverySubtitle = 'Compare Maharashtra APMC Mandi rates against Food Processors, Institutional Buyers, and Digital Channels with true net payout calculations.';
en.forecastSubtitle = 'Deterministic supply-arrival analytics, arrival pressure modeling, and optimal harvest sale window recommendations across Maharashtra districts.';
en.guidedLotSubtitle = 'Simple 6-step guided form to receive high-value bids from verified buyers across Maharashtra.';
en.district = 'District (Maharashtra)';
en.lotCreatedSuccessDesc = 'Your produce lot has been broadcast to verified buyers across Maharashtra. You will receive bid notifications within 2 hours.';
en.marketplaceSubtitle = 'Direct digital linkages with pre-vetted corporate food processors, retail chains, and exporters across Maharashtra with 100% escrow protection.';
en.storageSubtitle = 'Find WDRA-accredited cold storages in Maharashtra and evaluate whether storing for 3–5 days beats selling during harvest gluts.';
en.escrowGuaranteed = '100% Escrow Secured by Maharashtra State Clearing Pool';
en.slaNotice = 'Guaranteed resolution within 48 hours under Maharashtra Agricultural Marketing Rules.';
en.impactTitle = 'Transforming Maharashtra Agriculture: Pilot Impact';
en.helpCallCenterTiming = 'Available 24x7 in Marathi, Hindi, English & Gujarati';
en.faq1A = 'All buyers must deposit 100% funds into the Maharashtra State Escrow clearing pool before transport pickup. Funds are automatically transferred to your bank upon delivery confirmation.';
en.buyerDashboardSubtitle = 'Direct farm-level sourcing across Maharashtra FPOs with verified lot grading, escrow protection, and dispatch tracking';
en.footerTagline = 'KrushiSetu · Bridging Farmers to Profitable Markets Across Maharashtra';
en.govtNotice = 'Developed for Smart India Hackathon 2026 · Government of Maharashtra · Open-source prototype for demonstration purposes.';
en.voiceUnavailableGu = 'Selected regional voice not available on this device';

hi.mahaGovt = 'महाराष्ट्र शासन · स्मार्ट इंडिया हैकथॉन 2026';
hi.authBenefit2Desc = 'महाराष्ट्र भर की प्रमाणित कंपनियों, प्रसंस्करणकर्ताओं और निर्यातकों के साथ सीधे अनुबंध करें।';
hi.authBenefit3Desc = 'महाराष्ट्र राज्य समाशोधन पूल के माध्यम से सीधे आपके बैंक खाते में 100% सुरक्षित भुगतान।';
hi.authSuccessFarmer = '— रमेश पाटिल, सह्याद्री एफपीओ प्रमुख (नासिक)';
hi.authVillagePlaceholder = 'जैसे बारामती / लासलगांव / राहुरी';
hi.authOrgPlaceholder = 'जैसे सह्याद्री एग्रो फूड्स प्रा. लि.';
hi.adminPortalTitle = 'महाराष्ट्र शासन · एडमिन सत्यापन पोर्टल';
hi.heroEyebrow = 'महाराष्ट्र के लिए उन्नत बाजार बुद्धिमत्ता';
hi.heroSubtext = 'कृषिसेतु महाराष्ट्र के किसानों को एपीएमसी मंडियों के भावों की तुलना करने, मांग का पूर्वानुमान लगाने, सत्यापित खरीदार खोजने और खेत से भुगतान तक सहायता करता है।';
hi.prototypeNote = '*महाराष्ट्र एपीएमसी और एफपीओ पायलट सिमुलेशन पर आधारित प्रोटोटाइप अनुमान।';
hi.heroBadge1 = 'लासलगांव मंडी · ₹28.5/किग्रा';
hi.heroBadge2 = 'पुणे खरीदार मांग · उच्च';
hi.farmerRecoReason = 'कारण: मराठवाड़ा में आवक अगले सप्ताह बढ़ने की संभावना; अभी सीधे प्रोसेसर को बेचने पर ₹2.4/किग्रा अधिक शुद्ध लाभ।';
hi.dashboardSubtitle = 'महाराष्ट्र भर में सक्रिय फसलों, खरीदारों की बोलियों और एस्क्रो भुगतानों का सीधा विवरण';
hi.priceDiscoverySubtitle = 'परिवहन और मंडी खर्च घटाकर महाराष्ट्र की एपीएमसी मंडियों, फूड प्रोसेसर्स और डिजिटल चैनलों के शुद्ध भावों की तुलना करें।';
hi.forecastSubtitle = 'महाराष्ट्र के जिलों में सटीक आपूर्ति-आवक विश्लेषण और फसल बिक्री के सर्वोत्तम समय का पूर्वानुमान।';
hi.guidedLotSubtitle = 'महाराष्ट्र भर के सत्यापित खरीदारों से सर्वोत्तम बोलियां प्राप्त करने के लिए आसान 6-चरणीय फॉर्म।';
hi.district = 'जिला (महाराष्ट्र)';
hi.lotCreatedSuccessDesc = 'आपकी फसल का विवरण महाराष्ट्र भर के सत्यापित खरीदारों को भेज दिया गया है। 2 घंटे में बोलियां प्राप्त होंगी।';
hi.marketplaceSubtitle = 'महाराष्ट्र की प्रमाणित खाद्य कंपनियों, सुपरमार्केट्स और निर्यातकों से सीधे 100% सुरक्षित एस्क्रो अनुबंध।';
hi.storageSubtitle = 'महाराष्ट्र के वेयरहाउस और कोल्ड स्टोरेज खोजें और तय करें कि 3-5 दिन का भंडारण अधिक लाभकारी है या नहीं।';
hi.escrowGuaranteed = 'महाराष्ट्र राज्य समाशोधन पूल द्वारा 100% सुरक्षित एस्क्रो भुगतान';
hi.slaNotice = 'महाराष्ट्र कृषि विपणन नियमों के अंतर्गत 48 घंटों में अनिवार्य समाधान।';
hi.impactTitle = 'महाराष्ट्र कृषि में क्रांतिकारी बदलाव: पायलट परिणाम';
hi.helpCallCenterTiming = 'मराठी, हिंदी, अंग्रेजी और गुजराती में 24x7 उपलब्ध';
hi.faq1A = 'परिवहन से पूर्व खरीदार को 100% राशि महाराष्ट्र राज्य एस्क्रो पूल में जमा करनी होती है। माल पहुँचते ही राशि सीधे आपके खाते में आती है।';
hi.buyerDashboardSubtitle = 'सत्यापित ग्रेडिंग, सुरक्षित एस्क्रो और ट्रैकिंग के साथ महाराष्ट्र भर के एफपीओ से सीधे खरीद';
hi.footerTagline = 'कृषिसेतु · महाराष्ट्र के किसानों को लाभकारी बाजारों से जोड़ने वाला सेतु';
hi.govtNotice = 'स्मार्ट इंडिया हैकथॉन 2026 के लिए विकसित · महाराष्ट्र शासन · प्रदर्शन हेतु प्रोटोटाइप।';
hi.voiceUnavailableGu = 'इस उपकरण पर क्षेत्रीय आवाज उपलब्ध नहीं है';

gu.mahaGovt = 'મહારાષ્ટ્ર સરકાર · સ્માર્ટ ઇન્ડિયા હેકાથોન ૨૦૨૬';
gu.authBenefit2Desc = 'મહારાષ્ટ્રભરની જાણીતી કંપનીઓ, પ્રોસેસર્સ અને નિકાસકારો સાથે સીધા વેચાણ કરાર કરો.';
gu.authBenefit3Desc = 'મહારાષ્ટ્ર રાજ્ય ક્લિયરિંગ પૂલ દ્વારા સીધા તમારા બેંક ખાતામાં ૧૦૦% સુરક્ષિત પેમેન્ટ મેળવો.';
gu.authSuccessFarmer = '— રમેશ પાટીલ, સહ્યાદ્રી એફપીઓ પ્રમુખ (નાશિક)';
gu.authVillagePlaceholder = 'દા.ત. બારામતી / લાસલગાવ / રાહુરી';
gu.authOrgPlaceholder = 'દા.ત. સહ્યાદ્રી એગ્રો ફૂડ્સ લી.';
gu.adminPortalTitle = 'મહારાષ્ટ્ર સરકાર · એડમિન વેરિફિકેશન પોર્ટલ';
gu.heroEyebrow = 'મહારાષ્ટ્ર માટે માર્કેટ ઇન્ટેલિજન્સ';
gu.heroSubtext = 'કૃષિસેતુ મહારાષ્ટ્રના ખેડૂતોને APMC યાર્ડના ભાવોની સરખામણી કરવા, માંગનું અનુમાન લગાવવા અને સુરક્ષિત ખરીદદારો સાથે સોદા કરવામાં મદદ કરે છે.';
gu.prototypeNote = '*મહારાષ્ટ્ર APMC અને FPO પાયલોટ સિમ્યુલેશન પર આધારિત અંદાજો.';
gu.heroBadge1 = 'લાસલગાવ APMC · ₹૨૮.૫/કિગ્રા';
gu.heroBadge2 = 'પુણે ખરીદદાર માંગ · વધુ';
gu.farmerRecoReason = 'કારણ: મરાઠવાડામાં આવક વધવાની શક્યતા; પ્રોસેસરને સીધું વેચવાથી ₹૨.૪/કિગ્રા વધુ ચોખ્ખો નફો મળશે.';
gu.dashboardSubtitle = 'મહારાષ્ટ્રમાં સક્રિય પાક લોટ, ખરીદ ઓફર્સ અને એસ્ક્રો ચુકવણીઓની રીઅલ-ટાઇમ વિગતો';
gu.priceDiscoverySubtitle = 'પરિવહન ખર્ચ બાદ કરીને મહારાષ્ટ્રની APMC મંડીઓ અને ફૂડ પ્રોસેસર્સના ચોખ્ખા ભાવોની સરખામણી કરો.';
gu.forecastSubtitle = 'મહારાષ્ટ્રના જિલ્લાઓમાં પાક આવક વિશ્લેષણ અને પાક વેચાણના શ્રેષ્ઠ સમયની ભલામણ.';
gu.guidedLotSubtitle = 'મહારાષ્ટ્રભરના વેરિફાઈડ ખરીદદારો પાસેથી શ્રેષ્ઠ બોલી મેળવવા માટે સરળ ૬-પગલાંનું ફોર્મ.';
gu.district = 'જિલ્લો (મહારાષ્ટ્ર)';
gu.lotCreatedSuccessDesc = 'તમારો પાક લોટ મહારાષ્ટ્રના વેરિફાઈડ ખરીદદારોને મોકલવામાં આવ્યો છે. ૨ કલાકમાં ઑફર્સ મળશે.';
gu.marketplaceSubtitle = 'મહારાષ્ટ્રની અગ્રણી કંપનીઓ અને નિકાસકારો સાથે ૧૦૦% એસ્ક્રો સુરક્ષા સાથે સીધું જોડાણ.';
gu.storageSubtitle = 'મહારાષ્ટ્રમાં WDRA માન્ય કોલ્ડ સ્ટોરેજ શોધો અને ૩-૫ દિવસ સંગ્રહ ફાયદાકારક છે કે નહીં તે જાણો.';
gu.escrowGuaranteed = 'મહારાષ્ટ્ર રાજ્ય ક્લિયરિંગ પૂલ દ્વારા ૧૦૦% સુરક્ષિત એસ્ક્રો';
gu.slaNotice = 'મહારાષ્ટ્ર કૃષિ માર્કેટિંગ નિયમો હેઠળ ૪૮ કલાકમાં નિરાકરણ.';
gu.impactTitle = 'મહારાષ્ટ્ર કૃષિ ક્ષેત્રે બદલાવ: પાયલોટ પરિણામો';
gu.helpCallCenterTiming = 'મરાઠી, હિન્દી, અંગ્રેજી અને ગુજરાતીમાં ૨૪x૭ ઉપલબ્ધ';
gu.faq1A = 'વાહન રવાના થાય તે પહેલાં ખરીદદારે ૧૦૦% રકમ મહારાષ્ટ્ર રાજ્ય એસ્ક્રો પૂલમાં જમા કરાવવી પડે છે.';
gu.buyerDashboardSubtitle = 'મહારાષ્ટ્રના FPOs પાસેથી સીધી ખરીદી, વેરિફાઈડ ગ્રેડિંગ અને એસ્ક્રો સુરક્ષા';
gu.footerTagline = 'કૃષિસેતુ · મહારાષ્ટ્રના ખેડૂતોને સીધા નફાકારક બજારો સાથે જોડતું પ્લેટફોર્મ';
gu.govtNotice = 'સ્માર્ટ ઇન્ડિયા હેકાથોન ૨૦૨૬ · મહારાષ્ટ્ર સરકાર · પ્રદર્શન હેતુ પ્રોટોટાઇપ.';
gu.voiceUnavailableGu = 'આ ઉપકરણ પર પ્રાદેશિક અવાજ ઉપલબ્ધ નથી';

// 2. New Keys across all languages
const newKeysEn: Record<string, string> = {
  // Theme & Language
  themeToggle: 'Toggle Dark / Light Theme',
  themeSwitchToDark: 'Switch to Dark Mode',
  themeSwitchToLight: 'Switch to Light Mode',
  langEnglish: 'English',
  langGujarati: 'ગુજરાતી',
  langHindi: 'हिंदी',
  langMarathi: 'मराठी',
  stateBadge: 'Maharashtra',
  navSellProduce: 'Sell Produce',
  roleFarmer: 'Farmer',
  roleBuyer: 'Buyer',
  roleAdmin: 'Admin',
  myProfile: 'My Profile',
  logoutConfirmTitle: 'Confirm Logout',
  logoutConfirmMsg: 'Are you sure you want to log out of KrushiSetu?',
  logoutCancel: 'Cancel',
  logoutConfirm: 'Yes, Logout',

  // Public Landing
  publicHeroHeadline: 'Direct Farm-to-Buyer —',
  publicHeroHighlight: 'Fair Price, Escrow Protection!',
  publicHeroSubtext: 'Eliminate middlemen and commissions. Guaranteed buyers and 100% escrow payments for Nashik onions, Solapur pomegranates, Sangli turmeric, Latur soybean and Maharashtra crops.',
  publicHeroBadge: 'Maharashtra State Agri Marketplace · Zero Middlemen Network',
  publicListenGuidance: 'Listen Voice Guidance',
  publicAudioGuidanceText: 'Welcome to KrushiSetu Maharashtra. If you are a farmer, select Farmer Login. If you are an institutional buyer, select Buyer Login. For administration, select Admin Login.',
  publicFarmerCardTitle: 'I am a Farmer / Seller',
  publicFarmerCardSubtitle: 'Sell produce, compare mandi prices & close deals',
  publicFarmerCardBenefit1: 'Easy Mobile Login & 4 Regional Languages',
  publicFarmerCardBenefit2: 'Direct Farm-gate Pickup & Bank Escrow Credit',
  publicFarmerBadge: 'Farmers / Sellers',
  publicBuyerCardTitle: 'I am a Buyer / Merchant',
  publicBuyerCardSubtitle: 'Direct procurement from verified farmers and FPOs',
  publicBuyerCardBenefit1: '100% State-Inspected Quality Grading',
  publicBuyerCardBenefit2: 'Post Bulk Demands & Customized Supply Deals',
  publicBuyerBadge: 'Buyers / Traders',
  publicAdminCardTitle: 'Official Admin Portal',
  publicAdminCardSubtitle: 'State Nodal Officer & MSAMB Verification',
  publicAdminBadge: 'MSAMB / Admin',
  publicDirectSubtitle: 'Direct transparent marketplace connecting Maharashtra farmers with verified institutional buyers',
  publicFarmerLoginBtn: 'Farmer Login',
  publicBuyerLoginBtn: 'Buyer Login',
  publicAdminLoginBtn: 'Admin Login',

  // Dashboard & Alerts
  farmerGreeting: 'Namaste, {name}! 🌾',
  farmerPortalBadge: 'Maharashtra Farmer Portal (MSAMB Verified)',
  buyerPortalBadge: 'Verified Institutional Buyer Portal',
  adminPortalBadge: 'MSAMB Verification Officer',
  alertOfferAccepted: 'Congratulations! Offer accepted. Deal #{dealCode} created successfully.',
  alertCounterSent: 'Counter offer ₹{price} sent successfully to the buyer.',
  alertOfferRejected: 'Offer has been rejected.',
  alertRequirementPosted: 'Your bulk buying requirement was published successfully!',
  alertListingStatusUpdated: 'Produce listing #{code} updated to {status}.',
  alertKycStatusUpdated: 'User {name} verification status updated to {status}.',
  draftSaved: 'Draft saved ✓',
  submitListingSuccess: 'Produce submitted successfully for MSAMB verification!',
  stepIndicator: 'Step {step} / 6 — Step-by-Step Produce Listing',
  statusVerified: '✓ Verified & Approved',
  statusRejected: '✗ Verification Rejected',
  statusPending: '⏳ Verification Under Review',
  verifiedAccountDesc: 'Your account is verified under Maharashtra agricultural guidelines.',
  rejectedAccountDesc: 'Your verification documents require correction.',
  pendingAccountDesc: 'Your verification request is currently under review by an MSAMB admin.',
  verifiedBadgeBenefit: 'Verified badge grants your produce top buyer priority and 100% escrow protection.',
  unverifiedBadgeBenefit: 'Submit your 7/12 Land Record, Aadhaar Card, or GST to get verified.',
  offlineBanner: 'Offline Mode: You are currently offline. Showing cached agricultural data.',
  installAppTitle: 'KrushiSetu App (Maharashtra)',
  installAppDesc: 'Install the app on your mobile device for offline mandi access.',
  installAppBtn: 'Install App',
  installLaterBtn: 'Later',
  searchNewsPlaceholder: 'Search agricultural news, MSP & advisories...',
  allNewsTab: 'All News',
  mspRatesTab: 'MSP & Rates',
  schemesTab: 'Govt Schemes',
  advisoryTab: 'Market Advisory',
  notificationsTitle: 'Notifications',
  newBadge: 'new',
  markAllRead: 'Mark all as read',
  noNotifications: 'No new notifications',

  // Maharashtra Crops
  'crops.Soybean': 'Soybean',
  'crops.Cotton': 'Cotton',
  'crops.Sugarcane': 'Sugarcane',
  'crops.Onion': 'Onion',
  'crops.Grapes': 'Grapes',
  'crops.Pomegranate': 'Pomegranate',
  'crops.Tur': 'Tur (Pigeon Pea)',
  'crops.Jowar': 'Jowar (Sorghum)',
  'crops.Bajra': 'Bajra (Pearl Millet)',
  'crops.Rice': 'Rice (Paddy)',
  'crops.Wheat': 'Wheat',
  'crops.Turmeric': 'Turmeric',

  // Maharashtra Mandis
  'mandi.Lasalgaon': 'Lasalgaon APMC (Nashik)',
  'mandi.Pune': 'Pune APMC (Gultekdi)',
  'mandi.Nashik': 'Nashik APMC',
  'mandi.Nagpur': 'Nagpur APMC (Kalamna)',
  'mandi.Kolhapur': 'Kolhapur APMC (Shahupuri)',
  'mandi.Solapur': 'Solapur APMC (Siddheshwar)',
  'mandi.Latur': 'Latur APMC (Dal Hub)',
  'mandi.Jalgaon': 'Jalgaon APMC',
  'mandi.Ahmednagar': 'Ahmednagar APMC',
  'mandi.ChhatrapatiSambhajinagar': 'Chhatrapati Sambhajinagar APMC',
  'mandi.Amravati': 'Amravati APMC',
  'mandi.Satara': 'Satara APMC',

  // Maharashtra Districts
  'districts.Pune': 'Pune',
  'districts.Nashik': 'Nashik',
  'districts.Nagpur': 'Nagpur',
  'districts.Kolhapur': 'Kolhapur',
  'districts.Satara': 'Satara',
  'districts.Solapur': 'Solapur',
  'districts.Jalgaon': 'Jalgaon',
  'districts.Ahmednagar': 'Ahmednagar',
  'districts.Latur': 'Latur',
  'districts.Amravati': 'Amravati',
  'districts.ChhatrapatiSambhajinagar': 'Chhatrapati Sambhajinagar',

  // Categories
  'categories.OilseedsPulses': 'Oilseeds & Pulses',
  'categories.CashCropsSpices': 'Cash Crops & Spices',
  'categories.CerealsGrains': 'Cereals & Grains',
  'categories.HorticultureFruits': 'Horticulture & Fruits',
  'categories.Vegetables': 'Vegetables',
  'categories.Fruits': 'Fruits',
  'categories.Spices': 'Spices',
};

const newKeysHi: Record<string, string> = {
  themeToggle: 'थीम बदलें (डार्क / लाइट)',
  themeSwitchToDark: 'डार्क मोड चालू करें',
  themeSwitchToLight: 'लाइट मोड चालू करें',
  langEnglish: 'English',
  langGujarati: 'ગુજરાતી',
  langHindi: 'हिंदी',
  langMarathi: 'मराठी',
  stateBadge: 'महाराष्ट्र',
  navSellProduce: 'फसल बेचें',
  roleFarmer: 'किसान',
  roleBuyer: 'खरीदार',
  roleAdmin: 'एडमिन',
  myProfile: 'मेरी प्रोफाइल',
  logoutConfirmTitle: 'लॉगआउट की पुष्टि करें',
  logoutConfirmMsg: 'क्या आप वाकई कृषिसेतु से लॉग आउट करना चाहते हैं?',
  logoutCancel: 'रद्द करें',
  logoutConfirm: 'हाँ, लॉग आउट',

  publicHeroHeadline: 'खेत से सीधे खरीदार तक —',
  publicHeroHighlight: 'सही दाम, एस्क्रो से पूरा भुगतान!',
  publicHeroSubtext: 'बिचौलियों और आढ़तियों की कटौती समाप्त। नासिक के प्याज, सोलापुर के अनार, सांगली की हल्दी, लातूर के सोयाबीन और महाराष्ट्र की फसलों के लिए 100% सुरक्षित भुगतान।',
  publicHeroBadge: 'महाराष्ट्र राज्य पारदर्शी कृषि बाजार · शून्य बिचौलिया नेटवर्क',
  publicListenGuidance: 'ऑडियो मार्गदर्शन सुनें',
  publicAudioGuidanceText: 'कृषिसेतु महाराष्ट्र में आपका स्वागत है। यदि आप किसान हैं तो किसान लॉगिन चुनें, संस्थागत खरीदार हैं तो खरीदार लॉगिन चुनें, या प्रशासनिक अधिकारी हैं तो एडमिन लॉगिन चुनें।',
  publicFarmerCardTitle: 'मैं किसान / विक्रेता हूँ',
  publicFarmerCardSubtitle: 'फसल बेचें, मंडी भाव जांचें और सुरक्षित सौदे करें',
  publicFarmerCardBenefit1: '4 भाषाओं में आसान मोबाइल लॉगिन व पंजीकरण',
  publicFarmerCardBenefit2: 'खेत से सीधी ढुलाई और बैंक खाते में एस्क्रो भुगतान',
  publicFarmerBadge: 'किसान / विक्रेता',
  publicBuyerCardTitle: 'मैं खरीदार / व्यापारी हूँ',
  publicBuyerCardSubtitle: 'प्रमाणित किसानों और एफपीओ से सीधी थोक खरीद',
  publicBuyerCardBenefit1: '100% सरकारी प्रमाणित गुणवत्ता जांच व ग्रेडिंग',
  publicBuyerCardBenefit2: 'थोक मांग दर्ज करें और कस्टम व्यापार अनुबंध बनाएं',
  publicBuyerBadge: 'खरीदार / व्यापारी',
  publicAdminCardTitle: 'अधिकृत एडमिन पोर्टल',
  publicAdminCardSubtitle: 'महाराष्ट्र राज्य कृषि पणन मंडल (MSAMB) सत्यापन',
  publicAdminBadge: 'पणन अधिकारी / एडमिन',
  publicDirectSubtitle: 'महाराष्ट्र के किसानों और सत्यापित संस्थागत खरीदारों का सीधा पारदर्शी डिजिटल मंच',
  publicFarmerLoginBtn: 'किसान लॉगिन',
  publicBuyerLoginBtn: 'खरीदार लॉगिन',
  publicAdminLoginBtn: 'एडमिन लॉगिन',

  farmerGreeting: 'नमस्ते, {name}! 🌾',
  farmerPortalBadge: 'महाराष्ट्र किसान पोर्टल (MSAMB सत्यापित)',
  buyerPortalBadge: 'सत्यापित संस्थागत खरीदार पोर्टल',
  adminPortalBadge: 'महाराष्ट्र पणन सत्यापन अधिकारी',
  alertOfferAccepted: 'बधाई हो! ऑफर स्वीकार कर ली गई। सौदा #{dealCode} सफलतापूर्वक बना।',
  alertCounterSent: 'काउंटर ऑफर ₹{price} खरीदार को सफलतापूर्वक भेजी गई।',
  alertOfferRejected: 'ऑफर अस्वीकार कर दी गई।',
  alertRequirementPosted: 'आपकी थोक खरीद मांग सफलतापूर्वक पोस्ट की गई!',
  alertListingStatusUpdated: 'फसल लिस्टिंग #{code} का स्टेटस {status} में बदला गया।',
  alertKycStatusUpdated: 'उपयोगकर्ता {name} का सत्यापन {status} में बदला गया।',
  draftSaved: 'ड्राफ्ट सहेजा गया ✓',
  submitListingSuccess: 'फसल सत्यापन के लिए सफलतापूर्वक सबमिट कर दी गई है!',
  stepIndicator: 'चरण {step} / 6 — फसल लिस्टिंग फॉर्म',
  statusVerified: '✓ सत्यापित व स्वीकृत',
  statusRejected: '✗ सत्यापन अस्वीकृत',
  statusPending: '⏳ सत्यापन समीक्षाधीन',
  verifiedAccountDesc: 'आपका खाता महाराष्ट्र कृषि दिशानिर्देशों के तहत सत्यापित है।',
  rejectedAccountDesc: 'आपके सत्यापन दस्तावेजों में सुधार की आवश्यकता है।',
  pendingAccountDesc: 'आपका सत्यापन अनुरोध वर्तमान में MSAMB अधिकारी की समीक्षा में है।',
  verifiedBadgeBenefit: 'सत्यापित बैज से आपकी फसल को खरीदारों की प्राथमिकता और 100% एस्क्रो सुरक्षा मिलती है।',
  unverifiedBadgeBenefit: '7/12 भू-अभिलेख, आधार कार्ड या जीएसटी सबमिट करके सत्यापन प्राप्त करें।',
  offlineBanner: 'ऑफलाइन मोड: आप इंटरनेट से जुड़े नहीं हैं। सहेजा गया डेटा दिखाया जा रहा है।',
  installAppTitle: 'कृषिसेतु ऐप (महाराष्ट्र)',
  installAppDesc: 'ऑफलाइन मंडी भाव देखने के लिए अपने फोन में ऐप इंस्टॉल करें।',
  installAppBtn: 'ऐप इंस्टॉल करें',
  installLaterBtn: 'बाद में',
  searchNewsPlaceholder: 'कृषि समाचार, एमएसपी और सलाह खोजें...',
  allNewsTab: 'सभी समाचार',
  mspRatesTab: 'एमएसपी व दरें',
  schemesTab: 'सरकारी योजनाएं',
  advisoryTab: 'बाजार सलाह',
  notificationsTitle: 'सूचनाएं',
  newBadge: 'नई',
  markAllRead: 'सभी को पढ़ा हुआ चिन्हित करें',
  noNotifications: 'कोई नई सूचना नहीं',

  'crops.Soybean': 'सोयाबीन',
  'crops.Cotton': 'कपास',
  'crops.Sugarcane': 'गन्ना',
  'crops.Onion': 'प्याज',
  'crops.Grapes': 'अंगूर',
  'crops.Pomegranate': 'अनार',
  'crops.Tur': 'तूर (अरहर)',
  'crops.Jowar': 'ज्वार',
  'crops.Bajra': 'बाजरा',
  'crops.Rice': 'चावल (धान)',
  'crops.Wheat': 'गेहूं',
  'crops.Turmeric': 'हल्दी',

  'mandi.Lasalgaon': 'लासलगांव मंडी (नासिक)',
  'mandi.Pune': 'पुणे मंडी (गुलटेकड़ी)',
  'mandi.Nashik': 'नासिक मंडी',
  'mandi.Nagpur': 'नागपुर मंडी (कलामना)',
  'mandi.Kolhapur': 'कोल्हापुर मंडी (शाहूपुरी)',
  'mandi.Solapur': 'सोलापुर मंडी (सिद्धेश्वर)',
  'mandi.Latur': 'लातूर मंडी (दाल केंद्र)',
  'mandi.Jalgaon': 'जलगांव मंडी',
  'mandi.Ahmednagar': 'अहमदनगर मंडी',
  'mandi.ChhatrapatiSambhajinagar': 'छत्रपति संभाजीनगर मंडी',
  'mandi.Amravati': 'अमरावती मंडी',
  'mandi.Satara': 'सतारा मंडी',

  'districts.Pune': 'पुणे',
  'districts.Nashik': 'नासिक',
  'districts.Nagpur': 'नागपुर',
  'districts.Kolhapur': 'कोल्हापुर',
  'districts.Satara': 'सतारा',
  'districts.Solapur': 'सोलापुर',
  'districts.Jalgaon': 'जलगांव',
  'districts.Ahmednagar': 'अहमदनगर',
  'districts.Latur': 'लातूर',
  'districts.Amravati': 'अमरावती',
  'districts.ChhatrapatiSambhajinagar': 'छत्रपति संभाजीनगर',

  'categories.OilseedsPulses': 'तिलहन और दालें',
  'categories.CashCropsSpices': 'नकदी फसलें और मसाले',
  'categories.CerealsGrains': 'अनाज और खाद्यान्न',
  'categories.HorticultureFruits': 'बागवानी और फल',
  'categories.Vegetables': 'सब्जियां',
  'categories.Fruits': 'फल',
  'categories.Spices': 'मसाले',
};

const newKeysGu: Record<string, string> = {
  themeToggle: 'થીમ બદલો (ડાર્ક / લાઇટ)',
  themeSwitchToDark: 'ડાર્ક મોડ શરૂ કરો',
  themeSwitchToLight: 'લાઇટ મોડ શરૂ કરો',
  langEnglish: 'English',
  langGujarati: 'ગુજરાતી',
  langHindi: 'हिंदी',
  langMarathi: 'मराठी',
  stateBadge: 'મહારાષ્ટ્ર',
  navSellProduce: 'પાક વેચો',
  roleFarmer: 'ખેડૂત',
  roleBuyer: 'ખરીદદાર',
  roleAdmin: 'એડમિન',
  myProfile: 'મારી પ્રોફાઇલ',
  logoutConfirmTitle: 'લૉગઆઉટની પુષ્ટિ કરો',
  logoutConfirmMsg: 'શું તમે ખરેખર કૃષિસેતુમાંથી લૉગઆઉટ કરવા માંગો છો?',
  logoutCancel: 'રદ કરો',
  logoutConfirm: 'હા, લૉગઆઉટ',

  publicHeroHeadline: 'ખેતરથી સીધું ખરીદદારને —',
  publicHeroHighlight: 'યોગ્ય ભાવ, પૂરી એસ્ક્રો સુરક્ષા!',
  publicHeroSubtext: 'વચેટિયા કે દલાલી મુક્ત. નાશિકની ડુંગળી, સોલાપુરના દાડમ, સાંગલીની હળદર, લાતૂરના સોયાબીન અને મહારાષ્ટ્રના તમામ પાકો માટે ૧૦૦% સુરક્ષિત પેમેન્ટ.',
  publicHeroBadge: 'મહારાષ્ટ્ર રાજ્ય પારદર્શક કૃષિ બજાર · Zero Middlemen Network',
  publicListenGuidance: 'ઓડિયો માર્ગદર્શન સાંભળો',
  publicAudioGuidanceText: 'કૃષિસેતુ મહારાષ્ટ્રમાં આપનું સ્વાગત છે. જો તમે ખેડૂત હોવ તો ખેડૂત લૉગિન પસંદ કરો, સંસ્થાકીય ખરીદદાર હોવ તો ખરીદદાર લૉગિન પસંદ કરો, અથવા વહીવટી અધિકારી હોવ તો એડમિન લૉગિન પસંદ કરો.',
  publicFarmerCardTitle: 'હું ખેડૂત / વેચનાર છું',
  publicFarmerCardSubtitle: 'પાક વેચો, મંડી ભાવ સરખાવો અને સુરક્ષિત સોદા કરો',
  publicFarmerCardBenefit1: '૪ પ્રાદેશિક ભાષાઓમાં સરળ મોબાઇલ લૉગિન',
  publicFarmerCardBenefit2: 'ખેતરથી સીધું ટ્રાન્સપોર્ટ અને બેંકમાં એસ્ક્રો જમા',
  publicFarmerBadge: 'ખેડૂતો / Sellers',
  publicBuyerCardTitle: 'હું ખરીદદાર / વેપારી છું',
  publicBuyerCardSubtitle: 'વેરિફાઈડ ખેડૂતો અને એફપીઓ પાસેથી સીધી જથ્થાબંધ ખરીદી',
  publicBuyerCardBenefit1: '૧૦૦% સરકારી ચકાસાયેલ ક્વોલિટી ગ્રેડિંગ',
  publicBuyerCardBenefit2: 'જથ્થાબંધ જરૂરિયાત નોંધાવો અને કસ્ટમ ડીલ્સ કરો',
  publicBuyerBadge: 'ખરીદદારો / Buyers',
  publicAdminCardTitle: 'અધિકૃત એડમિન પોર્ટલ',
  publicAdminCardSubtitle: 'મહારાષ્ટ્ર માર્કેટિંગ બોર્ડ (MSAMB) વેરિફિકેશન',
  publicAdminBadge: 'અધિકારી / Admin',
  publicDirectSubtitle: 'મહારાષ્ટ્રના ખેડૂતો અને વેરિફાઈડ સંસ્થાકીય ખરીદદારોનું પારદર્શક ડિજિટલ માર્કેટપ્લેસ',
  publicFarmerLoginBtn: 'ખેડૂત લૉગિન',
  publicBuyerLoginBtn: 'ખરીદદાર લૉગિન',
  publicAdminLoginBtn: 'એડમિન લૉગિન',

  farmerGreeting: 'નમસ્તે, {name}! 🌾',
  farmerPortalBadge: 'મહારાષ્ટ્ર ખેડૂત પોર્ટલ (MSAMB વેરિફાઈડ)',
  buyerPortalBadge: 'વેરિફાઈડ સંસ્થાકીય ખરીદદાર પોર્ટલ',
  adminPortalBadge: 'MSAMB વેરિફિકેશન ઓફિસર',
  alertOfferAccepted: 'અભિનંદન! ઓફર સ્વીકારી લેવામાં આવી છે. સોદો #{dealCode} બની ગયો છે.',
  alertCounterSent: 'કાઉન્ટર ઓફર ₹{price} સફળતાપૂર્વક ખરીદદારને મોકલાઈ ગઈ છે.',
  alertOfferRejected: 'ઓફર નકારી દેવામાં આવી.',
  alertRequirementPosted: 'તમારી ખરીદી જરૂરિયાત સફળતાપૂર્વક પોસ્ટ થઈ ગઈ છે!',
  alertListingStatusUpdated: 'પાક લિસ્ટિંગ #{code} {status} તરીકે અપડેટ થયું.',
  alertKycStatusUpdated: 'વપરાશકર્તા {name} નું વેરિફિકેશન {status} તરીકે અપડેટ થયું.',
  draftSaved: 'ડ્રાફ્ટ સાચવાયો ✓',
  submitListingSuccess: 'તમારો માલ વેરિફિકેશન માટે સફળતાપૂર્વક સબમિટ થઈ ચૂક્યો છે!',
  stepIndicator: 'પગલું {step} / 6 — પાક લિસ્ટિંગ ફોર્મ',
  statusVerified: '✓ અધિકૃત પ્રમાણિત (Verified)',
  statusRejected: '✗ અસ્વીકાર (Rejected)',
  statusPending: '⏳ ચકાસણી હેઠળ (Pending)',
  verifiedAccountDesc: 'તમારું ખાતું મહારાષ્ટ્ર સરકાર નિયમાનુસાર વેરિફાઈડ છે.',
  rejectedAccountDesc: 'તમારા વેરિફિકેશન દસ્તાવેજોમાં સુધારાની જરૂર છે.',
  pendingAccountDesc: 'તમારી વેરિફિકેશન વિનંતી MSAMB અધિકારીની સમીક્ષા હેઠળ છે.',
  verifiedBadgeBenefit: 'વેરિફાઈડ બેજ સાથે તમારા પાકને ખરીદદારોની પ્રથમ પસંદગી અને ૧૦૦% એસ્ક્રો સુરક્ષા મળે છે.',
  unverifiedBadgeBenefit: 'સરકારી 7/12 ઉતારો, આધાર કાર્ડ અથવા જીએસટી સબમિટ કરીને વેરિફિકેશન મેળવો.',
  offlineBanner: 'ઓફલાઇન મોડ: આપ અત્યારે ઇન્ટરનેટ વગર છો. સાચવેલ ડેટા દર્શાવવામાં આવી રહ્યો છે.',
  installAppTitle: 'KrushiSetu એપ (મહારાષ્ટ્ર)',
  installAppDesc: 'મોબાઇલમાં એપ ડાઉનલોડ કરો અને ઓફલાઇન વાપરો.',
  installAppBtn: 'એપ ઇન્સ્ટોલ કરો',
  installLaterBtn: 'પછી',
  searchNewsPlaceholder: 'સમાચાર, ટેકાના ભાવ અને યોજનાઓ શોધો...',
  allNewsTab: 'બધા સમાચાર',
  mspRatesTab: 'ટેકાના ભાવ અને દરો',
  schemesTab: 'સરકારી યોજનાઓ',
  advisoryTab: 'બજાર માર્ગદર્શન',
  notificationsTitle: 'સૂચનાઓ',
  newBadge: 'નવી',
  markAllRead: 'બધી વંચાઈ ગઈ',
  noNotifications: 'કોઈ નવી સૂચના નથી',

  'crops.Soybean': 'સોયાબીન',
  'crops.Cotton': 'કપાસ',
  'crops.Sugarcane': 'શેરડી',
  'crops.Onion': 'ડુંગળી',
  'crops.Grapes': 'દ્રાક્ષ',
  'crops.Pomegranate': 'દાડમ',
  'crops.Tur': 'તુવેર',
  'crops.Jowar': 'જુવાર',
  'crops.Bajra': 'બાજરી',
  'crops.Rice': 'ચોખા (ડાંગર)',
  'crops.Wheat': 'ઘઉં',
  'crops.Turmeric': 'હળદર',

  'mandi.Lasalgaon': 'લાસલગાવ APMC (નાશિક)',
  'mandi.Pune': 'પુણે APMC (ગુલટેકડી)',
  'mandi.Nashik': 'નાશિક APMC',
  'mandi.Nagpur': 'નાગપુર APMC (કળમના)',
  'mandi.Kolhapur': 'કોલ્હાપુર APMC (શાહૂપુરી)',
  'mandi.Solapur': 'સોલાપુર APMC (સિદ્ધેશ્વર)',
  'mandi.Latur': 'લાતૂર APMC (દાળ હબ)',
  'mandi.Jalgaon': 'જલગાંવ APMC',
  'mandi.Ahmednagar': 'અહમદનગર APMC',
  'mandi.ChhatrapatiSambhajinagar': 'છત્રપતિ સંભાજીનગર APMC',
  'mandi.Amravati': 'અમરાવતી APMC',
  'mandi.Satara': 'સાતારા APMC',

  'districts.Pune': 'પુણે',
  'districts.Nashik': 'નાશિક',
  'districts.Nagpur': 'નાગપુર',
  'districts.Kolhapur': 'કોલ્હાપુર',
  'districts.Satara': 'સાતારા',
  'districts.Solapur': 'સોલાપુર',
  'districts.Jalgaon': 'જલગાંવ',
  'districts.Ahmednagar': 'અહમદનગર',
  'districts.Latur': 'લાતૂર',
  'districts.Amravati': 'અમરાવતી',
  'districts.ChhatrapatiSambhajinagar': 'છત્રપતિ સંભાજીનગર',

  'categories.OilseedsPulses': 'તેલીબિયાં અને કઠોળ',
  'categories.CashCropsSpices': 'રોકડિયા પાકો અને મસાલા',
  'categories.CerealsGrains': 'અનાજ અને ધાન્ય',
  'categories.HorticultureFruits': 'બાગાયતી અને ફળો',
  'categories.Vegetables': 'શાકભાજી',
  'categories.Fruits': 'ફળો',
  'categories.Spices': 'મસાલા',
};

// Merge new keys into EN, HI, GU
Object.assign(en, newKeysEn);
Object.assign(hi, newKeysHi);
Object.assign(gu, newKeysGu);

// 3. Build complete MR dictionary
// We map key by key, providing native authentic Marathi translations.
const mrMap: Record<string, string> = {
  // Brand & Header
  brandName: 'कृषीसेतू',
  brandTagline: 'भाव जाणून घ्या. योग्य बाजार निवडा. विश्वासाने विक्री करा.',
  mahaGovt: 'महाराष्ट्र शासन · स्मार्ट इंडिया हॅकेथॉन २०२६',
  problemId: 'समस्या विवरण आयडी: २६१३२ · कृषी, फूडटेक आणि ग्रामीण विकास',

  // Theme & Language
  themeToggle: 'थीम बदला (डार्क / लाइट)',
  themeSwitchToDark: 'डार्क मोड सुरू करा',
  themeSwitchToLight: 'लाइट मोड सुरू करा',
  langEnglish: 'English',
  langGujarati: 'ગુજરાતી',
  langHindi: 'हिंदी',
  langMarathi: 'मराठी',
  stateBadge: 'महाराष्ट्र',
  navSellProduce: 'माल विका',
  roleFarmer: 'शेतकरी',
  roleBuyer: 'खरेदीदार',
  roleAdmin: 'ॲडमिन',
  myProfile: 'माझी प्रोफाइल',
  logoutConfirmTitle: 'लॉगआउट पुष्टीकरण',
  logoutConfirmMsg: 'आपण खरोखर कृषीसेतू खात्यातून बाहेर पडू इच्छिता?',
  logoutCancel: 'रद्द करा',
  logoutConfirm: 'होय, लॉगआउट',

  // Auth & Onboarding
  authWelcomeHeadline: 'थेट बांधावरून फायदेशीर बाजारपेठ बुद्धिमत्ता',
  authWelcomeSubtext: 'मध्यस्थांची दलाली संपवा, अचूक निव्वळ भाव मिळवा आणि १००% सुरक्षित एस्क्रो बँक पेमेंट मिळवा.',
  authBenefit1Title: 'विविध बाजार समित्यांच्या भावांची तुलना',
  authBenefit1Desc: 'वाहतूक खर्च वजा जाता एपीएमसी बाजार समित्या, प्रक्रिया उद्योग आणि मोठ्या खरेदीदारांच्या निव्वळ भावांची तुलना करा.',
  authBenefit2Title: 'पडताळणी झालेल्या खरेदीदारांशी थेट करार',
  authBenefit2Desc: 'महाराष्ट्रभरातील नामांकित प्रक्रिया कंपन्या, सुपरमार्केट्स आणि निर्यातदारांशी थेट विक्री करार करा.',
  authBenefit3Title: 'पारदर्शक आणि वेळेवर बँक खात्यात रक्कम',
  authBenefit3Desc: 'महाराष्ट्र राज्य क्लिअरिंग पूलद्वारे थेट आपल्या बँक खात्यात १००% सुरक्षित रक्कम जमा.',
  authTrust1: 'पारदर्शक दर निश्चिती',
  authTrust2: 'पडताळणी झालेले खरेदीदार',
  authTrust3: 'स्थानिक भाषा समर्थन',
  authTrust4: 'एस्क्रो पेमेंट ट्रॅकिंग',
  authSuccessStory: '“शेतकरी कुठे विक्री करायची हे ठरवण्यापूर्वी वेगवेगळ्या खरेदीदारांकडून मिळणाऱ्या अंतिम रकमेची तुलना करू शकतात.”',
  authSuccessFarmer: '— रमेश पाटील, सह्याद्री एफपीओ प्रमुख (नाशिक)',

  authTabLogin: 'लॉगिन',
  authTabSignUp: 'खाते उघडा',
  authMobileLabel: 'मोबाईल नंबर',
  authMobilePlaceholder: '१० अंकी मोबाईल नंबर टाका',
  authOtpLabel: '६ अंकी ओटीपी',
  authOtpPlaceholder: '६ अंकी ओटीपी टाका',
  authDemoOtpHint: 'डेमो ओटीपी: 123456',
  authLoginBtn: 'पडताळणी व लॉगिन',
  authDemoFarmerBtn: 'डेमो शेतकरी म्हणून पुढे जा',
  authDemoBuyerBtn: 'डेमो खरेदीदार म्हणून पुढे जा',
  authQuickDemoHeader: 'त्वरित डेमो प्रवेश',
  authHackathonDisclaimer: 'हे स्मार्ट इंडिया हॅकेथॉन प्रात्यक्षिक आहे. उत्पादन वातावरणात सुरक्षित ओटीपी आणि एनक्रिप्टेड सर्व्हर वापरला जातो.',

  // Signup Wizard
  authStep1: 'टप्पा १: खात्याचा प्रकार',
  authStep2: 'टप्पा २: मूलभूत माहिती',
  authStep3: 'टप्पा ३: प्रोफाइल तपशील',
  authRoleFarmer: 'शेतकरी',
  authRoleFarmerDesc: 'स्वतःचे पीक विकणारे शेतकरी',
  authRoleFpo: 'शेतकरी उत्पादक कंपनी (FPO)',
  authRoleFpoDesc: 'सभासदांच्या शेतमालाचे एकत्रीकरण करणारी सहकारी संस्था',
  authRoleBuyer: 'संस्थात्मक खरेदीदार',
  authRoleBuyerDesc: 'अन्न प्रक्रिया उद्योग, निर्यातदार, रिटेल चेन किंवा व्यापारी',

  authFullName: 'पूर्ण नाव',
  authFullNamePlaceholder: 'उदा. रमेश पाटील',
  authState: 'राज्य',
  authDistrict: 'जिल्हा',
  authSelectDistrict: 'जिल्हा निवडा',
  authVillageCity: 'गाव / तालुका / शहर',
  authVillagePlaceholder: 'उदा. बारामती / लासलगाव / राहुरी',
  authPinCode: 'पिन कोड',
  authPinPlaceholder: '६ अंकी पिन कोड',
  authPreferredLang: 'पसंतीची भाषा',
  authCreatePassword: 'पासवर्ड तयार करा',
  authPasswordPlaceholder: 'किमान ६ अक्षरे',
  authNextStep: 'पुढील टप्पा',
  authPrevStep: 'मागील टप्पा',
  authCompleteRegistration: 'नोंदणी पूर्ण करा',

  // Profile Specific Fields
  authFarmSize: 'शेतीचे क्षेत्र (एकर)',
  authFarmSizePlaceholder: 'उदा. ५ एकर',
  authPrimaryCrops: 'मुख्य पिके',
  authStorageFacility: 'आपल्याकडे स्वतःची साठवणूक सुविधा आहे का?',
  authTransportFacility: 'शेतमालासाठी वाहतूक व्यवस्थेची गरज आहे का?',
  authFpoAffiliation: 'FPO किंवा संस्थेशी संलग्नता (ऐच्छिक)',
  authFpoPlaceholder: 'उदा. सह्याद्री फार्मर्स प्रोड्युसर कंपनी',
  authUpiId: 'बँक UPI आयडी (थेट पेमेंटसाठी)',
  authUpiPlaceholder: 'उदा. ramesh@sbi',

  authOrgName: 'कंपनी / संस्थेचे नाव',
  authOrgPlaceholder: 'उदा. सह्याद्री ॲग्रो प्रोसेसिंग प्रा. लि.',
  authBuyerType: 'खरेदीदार प्रकार',
  authBuyerTypeProcessor: 'अन्न प्रक्रिया उद्योग (Food Processor)',
  authBuyerTypeExporter: 'कृषी माल निर्यातदार (Agri Exporter)',
  authBuyerTypeRetail: 'रिटेल सुपरमार्केट चेन (Retail Chain)',
  authBuyerTypeAggregator: 'घाऊक व्यापारी (Wholesaler / Aggregator)',
  authGstNumber: 'जीएसटी (GST) क्रमांक',
  authGstPlaceholder: '२२ अंकी GSTIN',
  authPanNumber: 'पॅन (PAN) क्रमांक',
  authPanPlaceholder: '१० अंकी पॅन कार्ड क्रमांक',
  authDeliveryAddress: 'माल स्वीकारण्याचे ठिकाण (गोदाम / कारखाना पत्ता)',
  authDeliveryPlaceholder: 'संपूर्ण कारखाना किंवा वेअरहाऊस पत्ता',
  authReqCommodities: 'खरेदी करायचा शेतमाल',

  // Admin Login
  adminPortalTitle: 'महाराष्ट्र शासन · ॲडमिन पडताळणी कक्ष',
  adminPortalSubtitle: 'महाराष्ट्र राज्य कृषी पणन मंडळ (MSAMB) अधिकृत पडताळणी अधिकारी लॉगिन',
  adminIdLabel: 'अधिकारी मोबाईल / आयडी',
  adminIdPlaceholder: 'अधिकृत मोबाईल नंबर टाका',
  adminPassLabel: 'सुरक्षा पासवर्ड',
  adminPassPlaceholder: 'प्रशासकीय पासवर्ड टाका',
  adminLoginBtn: 'सुरक्षित प्रवेश करा',
  adminBackBtn: 'मुख्य पानावर परत जा',
  adminDisclaimer: 'हा पोर्टल केवळ अधिकृत शासकीय कृषी अधिकारी व पणन निरीक्षकांसाठी मर्यादित आहे.',

  // Roles & Nav
  farmerRole: 'शेतकरी / FPO कक्ष',
  buyerRole: 'पडताळणी झालेले खरेदीदार',
  roleSwitcherHint: 'शेतकरी आणि संस्थात्मक खरेदीदार दृष्टिकोनात त्वरित बदल करा',
  navLiveMarkets: 'बाजारभाव तुलना',
  navForecast: 'भाव अंदाज (AI)',
  navCreateLot: 'माल विका',
  navMarketplace: 'खरेदीदार',
  navLogistics: 'एकत्रित वाहतूक',
  navStorage: 'गोदामे',
  navPayments: 'एस्क्रो व खाती',
  navGrievance: 'तक्रार निवारण',
  navImpact: 'हॅकेथॉन परिणाम',
  demoTour: 'मार्गदर्शित डेमो फेरफटका',

  // Hero Section
  heroEyebrow: 'महाराष्ट्र कृषी बाजारपेठ बुद्धिमत्ता',
  heroHeadline: 'प्रत्येक शेतमालाला मिळावा योग्य बाजारभाव.',
  heroSubtext: 'कृषीसेतू महाराष्ट्रातील शेतकऱ्यांना बाजार समित्यांच्या भावांची तुलना करण्यास, मागणीचा अंदाज घेण्यास, पडताळणी झालेले खरेदीदार शोधण्यास आणि बांधापासून थेट खात्यात पेमेंट मिळवण्यास मदत करते.',
  heroCtaPrimary: 'बाजारभाव तपासा',
  heroCtaSecondary: 'शेतकरी फेरफटका पहा',
  impactMetric1: '१८–२४% अधिक निव्वळ उत्पन्न',
  impactMetric2: '३०% जलद खरेदीदार जोडणी',
  impactMetric3: '१२% कमी शेतमाल नासाडी',
  prototypeNote: '*महाराष्ट्र एपीएमसी आणि शेतकरी उत्पादक कंपन्यांच्या पायलट अभ्यासावर आधारित अंदाज.',
  heroBadge1: 'लासलगाव बाजार समिती · ₹२८.५/किग्रॅ',
  heroBadge2: 'पुणे खरेदीदार मागणी · उच्च',
  heroBadge3: 'योग्य विक्री वेळ · ३ दिवस',

  // Public Landing Page
  publicHeroHeadline: 'शेतकऱ्यांचा शेतमाल, थेट व्यापाऱ्यांना —',
  publicHeroHighlight: 'योग्य भाव, पूर्ण सुरक्षितता!',
  publicHeroSubtext: 'कोणताही मध्यस्थ किंवा दलाली नाही. नाशिकचा कांदा, सांगलीची हळद, सोलापूरचे डाळिंब, लातूरचे सोयाबीन व कडधान्यांसाठी १००% पडताळलेले खरेदीदार आणि एस्क्रो पेमेंट हमी.',
  publicHeroBadge: 'महाराष्ट्र शासन प्रेरित पारदर्शक शेतमाल बाजारपेठ (शून्य दलाली)',
  publicListenGuidance: 'ध्वनी मार्गदर्शन ऐका',
  publicAudioGuidanceText: 'कृषीसेतू महाराष्ट्रमध्ये आपले स्वागत आहे. आपण शेतकरी असल्यास शेतकरी लॉगिन दाबा, खरेदीदार असल्यास खरेदीदार लॉगिन दाबा किंवा प्रशासकीय अधिकारी असल्यास ॲडमिन लॉगिन दाबा.',
  publicFarmerCardTitle: 'मी शेतकरी / विक्रेता आहे',
  publicFarmerCardSubtitle: 'शेतमाल विका, बाजारभाव तपासा आणि सौदे करा',
  publicFarmerCardBenefit1: '४ भाषांमध्ये सोपे लॉगिन व नोंदणी',
  publicFarmerCardBenefit2: 'थेट बांधावरून वाहतूक आणि बँक खात्यात हमी रक्कम',
  publicFarmerBadge: 'शेतकरी / विक्रेते',
  publicBuyerCardTitle: 'मी खरेदीदार / व्यापारी आहे',
  publicBuyerCardSubtitle: 'पडताळणी झालेल्या शेतकरी व FPO कडून थेट खरेदी',
  publicBuyerCardBenefit1: '१००% शासकीय मानांकन व प्रतवारी तपासणी',
  publicBuyerCardBenefit2: 'घाऊक मागणी नोंदवा आणि करार करा',
  publicBuyerBadge: 'खरेदीदार / व्यापारी',
  publicAdminCardTitle: 'अधिकृत ॲडमिन पोर्टल',
  publicAdminCardSubtitle: 'पणन मंडळ पडताळणी आणि कृषी अधिकारी कक्ष',
  publicAdminBadge: 'अधिकारी / ॲडमिन',
  publicDirectSubtitle: 'महाराष्ट्रातील शेतकरी आणि पडताळणी झालेल्या खरेदीदारांची थेट बाजारपेठ',
  publicFarmerLoginBtn: 'शेतकरी लॉगिन',
  publicBuyerLoginBtn: 'खरेदीदार लॉगिन',
  publicAdminLoginBtn: 'ॲडमिन लॉगिन',

  // Dashboard & Alerts
  farmerGreeting: 'नमस्कार, {name}! 🌾',
  farmerPortalBadge: 'महाराष्ट्र शेतकरी पोर्टल (पणन मंडळ प्रमाणित)',
  buyerPortalBadge: 'पडताळणी झालेले संस्थात्मक खरेदीदार पोर्टल',
  adminPortalBadge: 'महाराष्ट्र पणन मंडळ तपासणी अधिकारी',
  alertOfferAccepted: 'अभिनंदन! खरेदीदाराची ऑफर स्वीकारली गेली. सौदा #{dealCode} तयार झाला आहे.',
  alertCounterSent: 'प्रति-ऑफर ₹{price} खरेदीदाराला यशस्वीरीत्या पाठवली गेली.',
  alertOfferRejected: 'ऑफर नाकारली गेली.',
  alertRequirementPosted: 'आपली खरेदी मागणी यशस्वीरीत्या प्रकाशित झाली!',
  alertListingStatusUpdated: 'शेतमाल लिस्टिंग #{code} स्थिती {status} अशी अद्यतनित झाली.',
  alertKycStatusUpdated: 'वापरकर्ता {name} पडताळणी स्थिती {status} अशी अद्यतनित झाली.',
  draftSaved: 'मसुदा सेव्ह केला ✓',
  submitListingSuccess: 'आपला शेतमाल पडताळणीसाठी यशस्वीरीत्या सादर केला गेला आहे!',
  stepIndicator: 'टप्पा {step} / ६ — शेतमाल नोंदणी फॉर्म',
  statusVerified: '✓ प्रमाणित व पडताळणी पूर्ण (Verified)',
  statusRejected: '✗ कागदपत्रे नामंजूर (Rejected)',
  statusPending: '⏳ पडताळणी चालू (Under Review)',
  verifiedAccountDesc: 'आपले खाते महाराष्ट्र कृषी पणन नियमानुसार प्रमाणित आहे.',
  rejectedAccountDesc: 'आपल्या कागदपत्रांमध्ये दुरुस्तीची आवश्यकता आहे.',
  pendingAccountDesc: 'आपली पडताळणी विनंती सध्या पणन अधिकाऱ्यांच्या तपासणीत आहे.',
  verifiedBadgeBenefit: 'पडताळणी बॅजमुळे आपल्या शेतमालाला खरेदीदारांची पहिली पसंती आणि १००% एस्क्रो सुरक्षा मिळते.',
  unverifiedBadgeBenefit: '७/१२ उतारा, आधार कार्ड किंवा जीएसटी जोडून प्रमाणित बॅज मिळवा.',
  offlineBanner: 'ऑफलाइन मोड: आपण सध्या इंटरनेटशिवाय आहात. जतन केलेला डेटा दाखवला जात आहे.',
  installAppTitle: 'कृषीसेतू ॲप (महाराष्ट्र)',
  installAppDesc: 'मोबाईलमध्ये ॲप इन्स्टॉल करा आणि ऑफलाइन बाजारभाव पहा.',
  installAppBtn: 'ॲप इन्स्टॉल करा',
  installLaterBtn: 'नंतर',
  searchNewsPlaceholder: 'बातम्या, हमीभाव आणि कृषी सल्ले शोधा...',
  allNewsTab: 'सर्व बातम्या',
  mspRatesTab: 'हमीभाव (MSP) व दर',
  schemesTab: 'शासकीय योजना',
  advisoryTab: 'बाजार सल्ला',
  notificationsTitle: 'सूचना',
  newBadge: 'नवीन',
  markAllRead: 'सर्व वाचल्याचे चिन्हांकित करा',
  noNotifications: 'कोणतीही नवीन सूचना नाही',

  // Crop Translation Keys
  'crops.Soybean': 'सोयाबीन',
  'crops.Cotton': 'कापूस',
  'crops.Sugarcane': 'ऊस',
  'crops.Onion': 'कांदा',
  'crops.Grapes': 'द्राक्षे',
  'crops.Pomegranate': 'डाळिंब',
  'crops.Tur': 'तूर',
  'crops.Jowar': 'ज्वारी',
  'crops.Bajra': 'बाजरी',
  'crops.Rice': 'भात (तांदूळ)',
  'crops.Wheat': 'गहू',
  'crops.Turmeric': 'हळद',
  'crops.Potato': 'बटाटा',
  'crops.Tomato': 'टोमॅटो',
  'crops.GreenChillies': 'हिरवी मिरची',
  'crops.BottleGourd': 'दुधी भोपळा',
  'crops.BitterGourd': 'कारले',
  'crops.Banana': 'केळी',
  'crops.KesarMango': 'केशर आंबा',
  'crops.Papaya': 'पपई',
  'crops.Dates': 'खजूर',
  'crops.Cumin': 'जिरे',
  'crops.Fennel': 'बडीशेप',
  'crops.Coriander': 'धणे',
  'crops.Mustard': 'मोहरी',
  'crops.Fenugreek': 'मेथी',

  // Mandi Translation Keys
  'mandi.Lasalgaon': 'लासलगाव बाजार समिती (नाशिक)',
  'mandi.Pune': 'पुणे बाजार समिती (गुलटेकडी)',
  'mandi.Nashik': 'नाशिक बाजार समिती',
  'mandi.Nagpur': 'नागपूर बाजार समिती (कळमना)',
  'mandi.Kolhapur': 'कोल्हापूर बाजार समिती (शाहूपुरी)',
  'mandi.Solapur': 'सोलापूर बाजार समिती',
  'mandi.Latur': 'लातूर बाजार समिती (कडधान्य केंद्र)',
  'mandi.Jalgaon': 'जळगाव बाजार समिती',
  'mandi.Ahmednagar': 'अहमदनगर बाजार समिती',
  'mandi.ChhatrapatiSambhajinagar': 'छत्रपती संभाजीनगर बाजार समिती',
  'mandi.Amravati': 'अमरावती बाजार समिती',
  'mandi.Satara': 'सातारा बाजार समिती',
  'mandi.Gondal': 'गोंडल बाजार समिती',
  'mandi.Rajkot': 'राजकोट बाजार समिती',
  'mandi.Surat': 'सुरत बाजार समिती',
  'mandi.Ahmedabad': 'अहमदाबाद बाजार समिती',
  'mandi.Unjha': 'उंझा बाजार समिती',
  'mandi.Mahuva': 'महुवा बाजार समिती',
  'mandi.Deesa': 'डीसा बाजार समिती',
  'mandi.Dholka': 'धोलका बाजार समिती',

  // Districts
  'districts.Pune': 'पुणे',
  'districts.Nashik': 'नाशिक',
  'districts.Nagpur': 'नागपूर',
  'districts.Kolhapur': 'कोल्हापूर',
  'districts.Satara': 'सातारा',
  'districts.Solapur': 'सोलापूर',
  'districts.Jalgaon': 'जळगाव',
  'districts.Ahmednagar': 'अहमदनगर',
  'districts.Latur': 'लातूर',
  'districts.Amravati': 'अमरावती',
  'districts.ChhatrapatiSambhajinagar': 'छत्रपती संभाजीनगर',

  // Categories
  'categories.OilseedsPulses': 'गळीतधान्ये व कडधान्ये',
  'categories.CashCropsSpices': 'नगदी पिके व मसाले',
  'categories.CerealsGrains': 'अन्नधान्य व तृणधान्ये',
  'categories.HorticultureFruits': 'फलोत्पादन व फळे',
  'categories.Vegetables': 'भाजीपाला',
  'categories.Fruits': 'फळे',
  'categories.Spices': 'मसाले',

  // Status mapping
  'status.Draft': 'मसुदा (Draft)',
  'status.Submitted': 'सादर केले (Submitted)',
  'status.UnderReview': 'तपासणी सुरू (Under Review)',
  'status.MoreInformationRequired': 'अधिक माहिती हवी',
  'status.Verified': 'प्रमाणित (Verified)',
  'status.Rejected': 'नामंजूर (Rejected)',
  'status.Published': 'सक्रिय विक्री (Published)',
  'status.Reserved': 'राखीव (Reserved)',
  'status.Sold': 'विक्री झाली (Sold)',
  'status.Completed': 'पूर्ण झाले (Completed)',
  'status.Expired': 'मुदत संपली (Expired)',
  'status.Active': 'सक्रिय (Active)',
  'status.UnderOffer': 'ऑफर सुरू (Under Offer)',
  'status.Matched': 'जोडणी झाली (Matched)',
  'status.Dispatched': 'रवाना झाले (Dispatched)',
  'status.Pending': 'प्रलंबित (Pending)',
  'status.Accepted': 'स्वीकारले (Accepted)',
  'status.Countered': 'प्रति-ऑफर (Countered)',
  'status.Withdrawn': 'मागे घेतले (Withdrawn)',
  'status.DiscussionStarted': 'चर्चा सुरू',
  'status.OfferAccepted': 'ऑफर स्वीकारली',
  'status.PickupScheduled': 'वाहतूक निश्चित',
  'status.ProductCollected': 'माल भरला गेला',
  'status.InTransit': 'मार्गावर आहे',
  'status.Delivered': 'पोहोचले',
  'status.PaymentPending': 'पेमेंट प्रलंबित',
  'status.Cancelled': 'रद्द केले',
  'status.Disputed': 'विवादित',

  // Grades
  'grades.GradeA': 'दर्जा अ (निर्यात / उत्कृष्ट प्रत)',
  'grades.GradeB': 'दर्जा ब (प्रीमियम टेबल प्रत)',
  'grades.GradeC': 'दर्जा क (प्रक्रिया / मध्यम प्रत)',

  // Buyer Types
  'buyerType.Exporter': 'निर्यातदार (Exporter)',
  'buyerType.FoodProcessor': 'अन्न प्रक्रिया उद्योग (Food Processor)',
  'buyerType.RetailChain': 'रिटेल सुपरमार्केट (Retail Chain)',
  'buyerType.InstitutionalBuyer': 'संस्थात्मक खरेदीदार',
  'buyerType.Wholesaler': 'घाऊक व्यापारी',

  // Farmer Dashboard
  farmerDashboardTitle: 'शेतकरी कृषी कक्ष',
  dashboardSubtitle: 'महाराष्ट्रातील चालू शेतमाल, खरेदीदारांच्या ऑफर्स आणि एस्क्रो पेमेंटची थेट माहिती',
  farmerRecoTitle: 'आजचा विक्री सल्ला: {crop}',
  farmerRecoAction: 'थेट प्रक्रिया उद्योगाला विक्री करा',
  farmerRecoReason: 'कारण: मराठवाड्यात आवक पुढील आठवड्यात वाढणार आहे; थेट प्रक्रियादाराला विकल्यास ₹२.४/किग्रॅ अधिक निव्वळ नफा मिळेल.',
  activeLotsTab: 'माझे शेतमाल लॉट्स ({count})',
  receivedOffersTab: 'प्राप्त झालेल्या ऑफर्स ({count})',
  activeDealsTab: 'चालू व्यवहार व सौदे ({count})',
  farmerMetricsLots: 'एकूण नोंदणीकृत लॉट्स',
  farmerMetricsDeals: 'यशस्वी सौदे',
  farmerMetricsEarnings: 'एकूण मिळालेली रक्कम',
  farmerMetricsPending: 'एस्क्रो खात्यात सुरक्षित',
  btnCreateListing: 'नवीन शेतमाल विक्री नोंदवा',
  emptyLotsTitle: 'अजून कोणताही शेतमाल नोंदवला नाही',
  emptyLotsDesc: 'खरेदीदारांकडून थेट खरेदीच्या ऑफर्स मिळवण्यासाठी आपला शेतमाल नोंदवा.',
  emptyOffersTitle: 'अजून कोणत्याही ऑफर्स प्राप्त झाल्या नाहीत',
  emptyOffersDesc: 'आपल्या शेतमालाची पडताळणी पूर्ण झाल्यावर खरेदीदार येथे थेट ऑफर्स देतील.',
  emptyDealsTitle: 'सध्या कोणताही चालू सौदा नाही',
  emptyDealsDesc: 'खरेदीदाराची ऑफर स्वीकारल्यानंतर येथे संपूर्ण व्यवहार व वाहतूक ट्रॅक करता येईल.',

  // Price Discovery Component
  priceDiscoveryTitle: 'थेट निव्वळ दर तुलना (Net Price Discovery)',
  priceDiscoverySubtitle: 'वाहतूक व बाजार समिती खर्च वजा करून महाराष्ट्रातील बाजार समित्या आणि थेट खरेदीदारांच्या निव्वळ रकमेची तुलना करा.',
  selectCropLabel: 'पीक निवडा:',
  selectMandiLabel: 'जवळची बाजार समिती निवडा:',
  highestNetBadge: 'सर्वाधिक निव्वळ भाव',
  grossPriceLabel: 'एकूण जाहीर भाव',
  mandiCessLabel: 'बाजार समिती सेस व तोलाई',
  handlingFeeLabel: 'हमाली व ग्रेडिंग खर्च',
  transportCostLabel: 'वाहतूक खर्च',
  netPayoutLabel: 'शेतकऱ्याला मिळणारा निव्वळ भाव',
  paymentTermLabel: 'पेमेंट मुदत',
  reliabilityScoreLabel: 'विश्वसनीयता',
  trendChartTitle: '७ दिवसांचा भाव कल (₹ / क्विंटल)',

  // Price Forecast Component
  forecastTitle: 'AI भाव अंदाज आणि विक्री वेळ (Price Forecast)',
  forecastSubtitle: 'महाराष्ट्रातील जिल्ह्यांमध्ये आवक-मागणी विश्लेषण आणि शेतमाल विक्रीसाठी सर्वोत्तम कालावधीचा अंदाज.',
  forecastSelectCrop: 'पीक निवडा:',
  forecastSelectDistrict: 'जिल्हा निवडा:',
  forecastCurrentPrice: 'आजचा सरासरी भाव',
  forecastPredictedPrice: 'अपेक्षित भाव (७ दिवस)',
  forecastTrendUp: 'वाढीचा कल (भाव वाढणार)',
  forecastTrendDown: 'घटीचा कल (भाव घसरणार)',
  forecastTrendStable: 'स्थिर भाव',
  forecastConfidence: 'अंदाज अचूकता',
  forecastOptimalWindow: 'विक्रीची सर्वोत्तम वेळ:',
  forecastDestination: 'सर्वोत्तम बाजारपेठ:',
  forecastArrivalPressure: 'बाजारातील आवक दबाव:',

  // Create Lot Wizard
  createLotModalTitle: 'शेतमाल विक्री नोंदणी (नवीन लॉट)',
  step1Title: 'पिकाचा प्रकार व जात',
  step2Title: 'प्रमाण आणि दर्जा (Grade)',
  step3Title: 'कापणी तारीख व साठवणूक',
  step4Title: 'अपेक्षित किंमत (₹)',
  step5Title: 'शेतमालाचे फोटो व व्हिडिओ',
  step6Title: 'शेतमाल उचलण्याचे ठिकाण (पत्ता)',
  cropLabel: 'पीक',
  varietyLabel: 'जात / वाण',
  varietyPlaceholder: 'उदा. नाशिक लाल कांदा / फुले कल्याणी',
  quantityLabel: 'एकूण प्रमाण',
  quantityPlaceholder: 'प्रमाण प्रविष्ट करा',
  unitLabel: 'युनिट',
  gradeLabel: 'दर्जा / प्रतवारी',
  harvestDateLabel: 'कापणीची तारीख',
  freshnessLabel: 'मालाची स्थिती व वैशिष्ट्ये',
  freshnessPlaceholder: 'उदा. उन्हात सुकवलेला, जाळीदार साल, ५५ मिमी+ जाडी',
  isOrganicLabel: 'सेंद्रिय प्रमाणीकरण आहे का?',
  expectedPriceLabel: 'अपेक्षित किंमत (₹ प्रति क्विंटल)',
  pickupAddressLabel: 'शेत किंवा गोदामाचा पत्ता',
  pickupAddressPlaceholder: 'गावाचे नाव, गट नंबर, तालुका, जिल्हा',
  storageAvailableLabel: 'शेतमाल साठवण्याची सोय आहे',
  transportNeededLabel: 'वाहतूक वाहनाची आवश्यकता आहे',
  btnSubmitLot: 'पडताळणीसाठी सादर करा',
  btnSaveDraft: 'मसुदा जतन करा',
  lotCreatedSuccessTitle: 'शेतमाल यशस्वीरीत्या नोंदवला गेला!',
  lotCreatedSuccessDesc: 'आपला शेतमाल महाराष्ट्रातील पडताळणी झालेल्या खरेदीदारांना पाठवला गेला आहे. २ तासांत ऑफर्स येणे सुरू होईल.',

  // Marketplace & Buyers
  marketplaceTitle: 'पडताळणी झालेले खरेदीदार आणि थेट करार',
  marketplaceSubtitle: 'महाराष्ट्रातील नामांकित प्रक्रिया उद्योग, सुपरमार्केट्स आणि निर्यातदारांशी थेट १००% सुरक्षित एस्क्रो व्यवहार.',
  buyerSearchPlaceholder: 'खरेदीदार किंवा पीक शोधा (उदा. कांदा / सोयाबीन)...',
  filterAllBuyers: 'सर्व खरेदीदार',
  filterProcessors: 'प्रक्रिया उद्योग',
  filterExporters: 'निर्यातदार',
  filterRetail: 'सुपरमार्केट्स',
  buyerReliabilityLabel: 'विश्वसनीयता स्कोअर:',
  buyerCompletedDeals: 'पूर्ण झालेले सौदे:',
  buyerPaymentTerms: 'पेमेंट मुदत: २४ तासांत एस्क्रो थेट खात्यात',
  btnSendOffer: 'माझा शेतमाल ऑफर करा',
  btnViewBuyerDetails: 'तपशील पहा',

  // Logistics Optimizer
  logisticsTitle: 'एकत्रित कृषी वाहतूक (Pooled Logistics)',
  logisticsSubtitle: 'इतर शेतकऱ्यांसोबत शेतमाल एकत्र करून वाहतूक खर्चात ५०% पर्यंत बचत करा.',
  logisticsSavingsHeader: 'वाहतूक खर्च बचत',
  regularCostLabel: 'स्वतंत्र वाहतूक खर्च:',
  optimizedCostLabel: 'एकत्रित वाहतूक खर्च:',
  co2SavedLabel: 'कार्बन उत्सर्जन बचत:',
  routeTimelineTitle: 'वाहतूक मार्ग व संकलन थांबे',

  // Storage Advisor
  storageTitle: 'गोदाम व शीतगृह सल्लागार (Storage Advisor)',
  storageSubtitle: 'महाराष्ट्रातील शासकीय मान्यताप्राप्त वेअरहाऊस शोधा आणि शेतमाल ३-५ दिवस साठवणे फायदेशीर आहे का ते तपासा.',
  storageCapacityAvailable: 'उपलब्ध क्षमता:',
  storageRateDay: 'दर: ₹ प्रति क्विंटल / दिवस',
  storageNetBenefit: '३ दिवस साठवल्यास निव्वळ नफा:',

  // Payment & Escrow
  paymentsTitle: 'डिजिटल एस्क्रो आणि पेमेंट सुरक्षा',
  paymentsSubtitle: 'शेतमाल बांधावरून उचलण्यापूर्वी खरेदीदाराची रक्कम सुरक्षित एस्क्रो खात्यात जमा होते.',
  escrowGuaranteed: 'महाराष्ट्र राज्य क्लिअरिंग पूलद्वारे १००% सुरक्षित एस्क्रो पेमेंट',
  timelineStep1: 'करार निश्चित व रक्कम एस्क्रोमध्ये जमा',
  timelineStep2: 'बांधावर मालाची गुणवत्ता तपासणी',
  timelineStep3: 'वाहनात माल भरून रवाना',
  timelineStep4: 'खरेदीदाराच्या गोदामात माल पोहोचला',
  timelineStep5: 'अंतिम वजन व पोचपावती पडताळणी',
  timelineStep6: 'शेतकऱ्याच्या बँक खात्यात थेट रक्कम वर्ग',

  // Grievances
  grievanceTitle: 'तक्रार निवारण व मध्यस्थी कक्ष (Grievance Portal)',
  grievanceSubtitle: 'वजन, गुणवत्ता किंवा पेमेंट संबंधी तक्रारींचे ४८ तासांत शासकीय नियमांनुसार निवारण.',
  btnFileGrievance: 'नवीन तक्रार नोंदवा',
  grievanceCategoryLabel: 'तक्रारीचा प्रकार',
  grievanceDescLabel: 'तक्रारीचा सविस्तर तपशील',
  grievanceTxnLabel: 'व्यवहार क्रमांक / संदर्भ आयडी',
  slaNotice: 'महाराष्ट्र कृषी पणन नियमांनुसार ४८ तासांत तक्रार निवारणाची हमी.',

  // Impact Section
  impactTitle: 'महाराष्ट्राच्या कृषी क्षेत्रातील क्रांती: पायलट निकाल',
  impactSubtitle: 'स्मार्ट इंडिया हॅकेथॉन २०२६ अंतर्गत महाराष्ट्रातील शेतकरी आणि खरेदीदारांचा थेट डिजिटल सेतू.',
  impactMetric1Value: '१८–२४%',
  impactMetric1Label: 'शेतकऱ्यांच्या निव्वळ उत्पन्नात वाढ',
  impactMetric2Value: '३०%',
  impactMetric2Label: 'जलद खरेदीदार जोडणी वेळ',
  impactMetric3Value: '१२%',
  impactMetric3Label: 'कापणीनंतरच्या शेतमाल नासाडीत घट',
  impactMetric4Value: '१००%',
  impactMetric4Label: 'एस्क्रो सुरक्षित थेट बँक पेमेंट्स',

  // Help & Call Center
  helpModalTitle: 'मदत व शेतकरी सहाय्य केंद्र (Help & Support)',
  helpCallCenterTitle: 'टोल-फ्री शेतकरी सहाय्यता क्रमांक:',
  helpCallCenterNumber: '१८००-२३३-२६१३२ (टोल-फ्री)',
  helpCallCenterTiming: 'मराठी, हिंदी, इंग्रजी आणि गुजरातीमध्ये २४x७ उपलब्ध',
  helpFaqHeader: 'वारंवार विचारले जाणारे प्रश्न (FAQ)',
  faq1Q: 'कृषीसेतूवर माझे पैसे कसे सुरक्षित राहतात?',
  faq1A: 'शेतमाल बांधावरून उचलण्यापूर्वी खरेदीदाराला १००% रक्कम महाराष्ट्र राज्य एस्क्रो खात्यात जमा करावी लागते. माल पोहोचल्याची खात्री होताच रक्कम थेट आपल्या बँक खात्यात जमा होते.',
  faq2Q: 'मी मालाची वाहतूक कशी करू?',
  faq2A: 'आपण खरेदीदाराने पाठवलेली गाडी निवडू शकता, स्वतःची गाडी करू शकता किंवा कृषीसेतूच्या एकत्रित वाहतुकीचा लाभ घेऊन ५०% खर्च वाचवू शकता.',
  faq3Q: 'बाजारभावाची माहिती कशी दिली जाते?',
  faq3A: 'महाराष्ट्रातील प्रमुख बाजार समित्यांचे थेट भाव आणि कृत्रिम बुद्धिमत्ता (AI) द्वारे पुढील ७ दिवसांचा संभाव्य भाव दाखवला जातो.',

  // Buyer Dashboard
  buyerDashboardTitle: 'संस्थात्मक खरेदीदार खरेदी कक्ष',
  buyerDashboardSubtitle: 'प्रमाणित प्रतवारी, एस्क्रो सुरक्षा आणि वाहतूक ट्रॅकिंगसह महाराष्ट्रातील FPOs कडून थेट खरेदी',
  buyerMetricsSpent: 'एकूण केलेली खरेदी',
  buyerMetricsActiveOffers: 'चालू ऑफर्स',
  buyerMetricsLotsPurchased: 'खरेदी केलेले लॉट्स',
  buyerMetricsInTransit: 'मार्गावर असलेले शेतमाल',
  btnPostRequirement: 'नवीन खरेदी मागणी नोंदवा',
  availableProduceTitle: 'महाराष्ट्रातील उपलब्ध शेतमाल लॉट्स',
  searchProducePlaceholder: 'पीक, जिल्हा किंवा जात शोधा...',

  // Admin Verification Dashboard
  adminDashboardTitle: 'महाराष्ट्र कृषी पणन मंडळ (MSAMB) पडताळणी कक्ष',
  adminTabListings: 'प्रलंबित शेतमाल लॉट्स ({count})',
  adminTabKyc: 'शेतकरी / खरेदीदार KYC ({count})',
  adminTabNews: 'कृषी बातम्या व सूचना व्यवस्थापन',
  adminTabAudit: 'प्रशासकीय तपासणी नोंदी',
  btnApproveListing: 'प्रमाणित करा व प्रकाशित करा',
  btnRejectListing: 'सुधारणा सुचवा / नाकारा',
  inspectionNotesLabel: 'तपासणी अधिकारी शेरा / गुणवत्ता निष्कर्ष',

  // User Profile
  profileTabBasic: '१. मूलभूत माहिती',
  profileTabCrops: '२. पिके व शेतजमीन',
  profileTabBank: '३. बँक खात्याचा तपशील',
  profileTabDocs: '४. शासकीय कागदपत्रे (KYC)',
  profileSavedSuccess: 'प्रोफाइल यशस्वीरीत्या जतन झाली!',
  profileSavedDesc: 'आपली माहिती पडताळणीसाठी अद्यतनित करण्यात आली आहे.',

  // News & Footer
  newsHeaderTitle: 'कृषी बातम्या, हमीभाव (MSP) आणि बाजार अपडेट्स',
  footerBrandDesc: 'महाराष्ट्र शासन शेतकरी बाजारपेठ सक्षमीकरण मंच. थेट शेतकरी-खरेदीदार बाजारपेठ.',
  footerTagline: 'कृषीसेतू · महाराष्ट्रातील शेतकऱ्यांना फायदेशीर बाजारपेठांशी जोडणारा सेतू',
  govtNotice: 'स्मार्ट इंडिया हॅकेथॉन २०२६ साठी विकसित · महाराष्ट्र शासन · प्रात्यक्षिकासाठी तयार केलेले खुले प्रोटोटाइप.',
  copyrightText: '© २०२६ कृषीसेतू महाराष्ट्र. सर्व हक्क राखीव. स्मार्ट इंडिया हॅकेथॉन २०२६.',

  // Voice & Chatbot
  voiceListen: 'ऐका (Listen)',
  audioSpeaking: 'आवाज सुरू आहे...',
  voiceUnavailableGu: 'या उपकरणावर प्रादेशिक आवाज उपलब्ध नाही',
  chatOnlineStatus: 'ऑनलाइन आणि मदतीसाठी सज्ज',
  chatAutoReadOn: 'उत्तरे आपोआप बोला: चालू',
  chatAutoReadOff: 'उत्तरे आपोआप बोला: बंद',
  chatClear: 'संभाषण साफ करा',
  chatClearConfirmTitle: 'चॅट इतिहास साफ करायचा?',
  chatClearConfirmMessage: 'यामुळे कृषी सहाय्यकासोबतचे आपले चालू संभाषण रीसेट होईल.',
  chatInputPlaceholder: 'प्रश्न विचारा किंवा माइक दाबा...',
  chatSend: 'संदेश पाठवा',
  chatMicPrompt: 'आपला प्रश्न बोला',
  chatStopMic: 'बोलणे थांबवा',
  chatPrivacyNotice: 'आपले संभाषण आपल्या फोनवरच सुरक्षित राहते.',
  chatButtonLabel: 'कृषी सहाय्यकाला विचारा',
  unitKg: 'किग्रॅ',
  unitTonne: 'टन',
  unitTonnes: 'टन',
  invalidQuantityError: 'कृपया ० पेक्षा जास्त वैध प्रमाण टाका.',
  quantityPreview: 'एकूण हिशोब केलेले प्रमाण:',
  ratePerKgLabel: 'दर प्रति किग्रॅ',
  netPayoutPerKg: 'निव्वळ परतावा प्रति किग्रॅ',
};

// Now build the complete mr dictionary by taking every key from en
for (const key of Object.keys(en)) {
  if (mrMap[key]) {
    mr[key] = mrMap[key];
  } else if (hi[key]) {
    // If exact mr mapping not specified, use Hindi as regional base
    mr[key] = hi[key];
  } else {
    mr[key] = en[key];
  }
}

console.log('Total keys in EN:', Object.keys(en).length);
console.log('Total keys in HI:', Object.keys(hi).length);
console.log('Total keys in GU:', Object.keys(gu).length);
console.log('Total keys in MR:', Object.keys(mr).length);

// Verify exact key parity across all 4
const enKeys = Object.keys(en).sort();
const hiKeys = Object.keys(hi).sort();
const guKeys = Object.keys(gu).sort();
const mrKeys = Object.keys(mr).sort();

const missingHi = enKeys.filter(k => !(k in hi));
const missingGu = enKeys.filter(k => !(k in gu));
const missingMr = enKeys.filter(k => !(k in mr));

console.log('Missing in HI:', missingHi);
console.log('Missing in GU:', missingGu);
console.log('Missing in MR:', missingMr);

// Output the TypeScript file
function formatDict(dict: Record<string, string>): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(dict)) {
    const escapedVal = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
    lines.push(`    '${key}': '${escapedVal}',`);
  }
  return lines.join('\n');
}

const fileContent = `import type { Language } from '../types';

export interface TranslationDictionary {
  [key: string]: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
${formatDict(en)}
  },
  hi: {
${formatDict(hi)}
  },
  gu: {
${formatDict(gu)}
  },
  mr: {
${formatDict(mr)}
  },
};
`;

fs.writeFileSync(
  path.resolve('src/i18n/translations.ts'),
  fileContent,
  'utf8'
);

console.log('Successfully wrote src/i18n/translations.ts!');
