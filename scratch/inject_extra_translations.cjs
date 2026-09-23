const fs = require('fs');
const path = require('path');

const extraKeys = {
  landingBadge: {
    en: 'Transparent Agri Marketplace Promoted by Maharashtra Government · Zero Middlemen APMC Network',
    mr: 'महाराष्ट्र शासन पुरस्कृत पारदर्शक कृषी बाजारपेठ · शून्य दलाल कृषी उत्पन्न बाजार समिती नेटवर्क',
    hi: 'महाराष्ट्र सरकार समर्थित पारदर्शी कृषि बाज़ार · शून्य बिचौलिया एपीएमसी नेटवर्क',
    gu: 'મહારાષ્ટ્ર સરકાર પ્રેરિત પારદર્શક કૃષિ બજાર · ઝીરો દલાલ એપીએમસી નેટવર્ક'
  },
  landingHeadline: {
    en: 'Direct Farm Produce to Buyers — Fair Prices, Complete Security!',
    mr: 'शेतकऱ्यांचा माल, थेट व्यापाऱ्याला — योग्य भाव, संपूर्ण सुरक्षितता!',
    hi: 'किसान की उपज, सीधे व्यापारी को — सही मूल्य, पूरी सुरक्षा!',
    gu: 'ખેડૂતનો માલ, સીધો વેપારીને — યોગ્ય ભાવ, પૂરી સુરક્ષા!'
  },
  landingSubtext: {
    en: 'Zero middlemen, zero hidden commissions. 100% verified corporate buyers and escrow payment guarantee across Maharashtra mandis including Lasalgaon, Pune, Nagpur, Latur, and Kolhapur.',
    mr: 'मध्यस्थ किंवा छुपे कमिशन नाही. लासलगाव, पुणे, नागपूर, लातूर आणि कोल्हापूरसह महाराष्ट्रातील बाजार समित्यांसाठी १००% पडताळणी केलेले खरेदीदार आणि एस्क्रो पेमेंट हमी.',
    hi: 'कोई बिचौलिया या छुपा कमीशन नहीं। लासलगांव, पुणे, नागपुर, लातूर और कोल्हापुर सहित महाराष्ट्र की मंडियों के लिए 100% सत्यापित खरीदार और एस्क्रो भुगतान गारंटी।',
    gu: 'વચ્ચે કોઈ દલાલ કે કમિશન નહીં. લાસલગાંવ, પુણે, નાગપુર, લાતૂર અને કોલ્હાપુર સહિત મહારાષ્ટ્રની બજારો માટે ૧૦૦% વેરિફાઈડ ખરીદદારો અને એસ્ક્રૉ પેમેન્ટ ગેરંટી.'
  },
  landingAudioText: {
    en: 'Welcome to KrushiSetu. If you are a farmer, click I am a Farmer. If you are a buyer, click I am a Buyer. Or for government nodal officers, click Admin Login.',
    mr: 'कृषीसेतूमध्ये आपले स्वागत आहे. आपण शेतकरी असल्यास मी शेतकरी आहे बटण दाबा, खरेदीदार असल्यास मी खरेदीदार आहे बटण दाबा, किंवा शासकीय अधिकाऱ्यांसाठी ॲडमिन लॉगिन निवडा.',
    hi: 'कृषिसेतु में आपका स्वागत है। यदि आप किसान हैं तो मैं किसान हूँ बटन दबाएं, खरीदार हैं तो मैं खरीदार हूँ बटन दबाएं, या नोडल अधिकारियों के लिए एडमिन लॉगिन चुनें।',
    gu: 'કૃષિસેતુમાં આપનું સ્વાગત છે. જો તમે ખેડૂત હોવ તો હું ખેડૂત છું બટન દબાવો, ખરીદદાર હોવ તો હું ખરીદદાર છું બટન દબાવો, અથવા નોડલ અધિકારીઓ માટે એડમિન લૉગિન પસંદ કરો.'
  },
  landingFarmerBadge: {
    en: 'Farmers / Sellers',
    mr: 'शेतकरी / उत्पादक',
    hi: 'किसान / विक्रेता',
    gu: 'ખેડૂતો / વેચનાર'
  },
  landingFarmerTitle: {
    en: 'I am a Farmer / Seller',
    mr: 'मी शेतकरी / विक्रेता आहे',
    hi: 'मैं किसान / विक्रेता हूँ',
    gu: 'હું ખેડૂત / વેચનાર છું'
  },
  landingFarmerSubtitle: {
    en: 'Sell produce, compare live prices, and lock guaranteed deals',
    mr: 'माल विका, थेट बाजारभाव तपासा आणि खात्रीशीर सौदे करा',
    hi: 'उपज बेचें, बाज़ार भाव देखें और पक्के सौदे करें',
    gu: 'પાક વેચો, ભાવ જુઓ અને ખાતરીપૂર્વક સોદા કરો'
  },
  landingFarmerBullet1: {
    en: 'Easy signup in Marathi, Hindi, Gujarati & English',
    mr: 'मराठी, हिंदी, गुजराती आणि इंग्रजीमध्ये सोपे लॉगिन व नोंदणी',
    hi: 'मराठी, हिंदी, गुजराती और अंग्रेज़ी में सरल लॉगिन व पंजीकरण',
    gu: 'મરાઠી, હિન્દી, ગુજરાતી અને અંગ્રેજીમાં સરળ લૉગિન & રજીસ્ટ્રેશન'
  },
  landingFarmerBullet2: {
    en: 'Farmgate logistics pickup & direct bank escrow payment',
    mr: 'शेत बांधावरून थेट वाहतूक व बँक खात्यात सुरक्षित पेमेंट',
    hi: 'खेत से सीधी ढुलाई व बैंक खाते में सुरक्षित भुगतान',
    gu: 'ખેતરથી સીધું ટ્રાન્સપોર્ટ & બેંકમાં સુરક્ષિત જમા'
  },
  landingBuyerBadge: {
    en: 'Buyers / Traders',
    mr: 'खरेदीदार / व्यापारी',
    hi: 'खरीदार / व्यापारी',
    gu: 'વેપારીઓ / ખરીદદાર'
  },
  landingBuyerTitle: {
    en: 'I am a Buyer / Corporate',
    mr: 'मी खरेदीदार / कॉर्पोरेट आहे',
    hi: 'मैं खरीदार / व्यापारी हूँ',
    gu: 'હું ખરીદદાર / વેપારી છું'
  },
  landingBuyerSubtitle: {
    en: 'Direct procurement from verified Maharashtra farmers',
    mr: 'महाराष्ट्रातील पडताळणी केलेल्या शेतकऱ्यांकडून थेट खरेदी',
    hi: 'महाराष्ट्र के सत्यापित किसानों से सीधी खरीद',
    gu: 'મહારાષ્ટ્રના વેરિફાઈડ ખેડૂતો પાસેથી સીધી ખરીદી'
  },
  landingBuyerBullet1: {
    en: '100% government & FPO verified quality grading',
    mr: '१००% शासकीय व एफपीओ प्रमाणित प्रतवारी',
    hi: '100% सरकारी व एफपीओ प्रमाणित गुणवत्ता ग्रेडिंग',
    gu: '૧૦૦% સરકારી અને એફપીઓ ચકાસાયેલ ક્વોલિટી ગ્રેડિંગ'
  },
  landingBuyerBullet2: {
    en: 'Post bulk requirements & negotiate customized contracts',
    mr: 'मोठ्या प्रमाणातील मागणी नोंदवा आणि सानुकूल सौदे करा',
    hi: 'थोक आवश्यकता दर्ज करें व सीधे सौदे तय करें',
    gu: 'જથ્થાબંધ જરૂરિયાત નોંધાવો & સીધા સોદા નક્કી કરો'
  },
  landingAdminBadge: {
    en: 'Nodal Officer / Admin',
    mr: 'नोडल अधिकारी / प्रशासक',
    hi: 'नोडल अधिकारी / व्यवस्थापक',
    gu: 'નોડલ અધિકારી / એડમિન'
  },
  landingAdminTitle: {
    en: 'Official Admin Login',
    mr: 'अधिकृत ॲडमिन लॉगिन',
    hi: 'अधिकृत एडमिन लॉगिन',
    gu: 'અધિકૃત એડમિન લૉગિન'
  },
  landingAdminSubtitle: {
    en: 'Admin Portal (Government Nodal Officer & MSAMB Verification)',
    mr: 'ॲडमिन पोर्टल (शासकीय नोडल अधिकारी व एमएसएएमबी पडताळणी)',
    hi: 'एडमिन पोर्टल (सरकारी नोडल अधिकारी एवं एमएसएएमबी सत्यापन)',
    gu: 'એડમિન પોર્ટલ (સરકારી નોડલ ઓફિસર & એમએસએએમબી વેરિફિકેશન)'
  },
  landingAdminBullet1: {
    en: 'Secure credential verification',
    mr: 'सुरक्षित ओळखपत्र व अधिकार पडताळणी',
    hi: 'सुरक्षित क्रेडेंशियल सत्यापन',
    gu: 'સુરક્ષિત ઓળખપત્ર ચકાસણી'
  },
  landingAdminBullet2: {
    en: 'Platform analytics, KYC inspection & audit logs',
    mr: 'प्लॅटफॉर्म डेटा, केवायसी तपासणी व ऑडिट नोंदी',
    hi: 'प्लेटफ़ॉर्म डेटा, केवाईसी निरीक्षण व ऑडिट लॉग',
    gu: 'પ્લેટફોર્મ ડેટા, કેવાયસી તપાસ & ઓડિટ લોગ્સ'
  },
  pillarZeroCommissionTitle: {
    en: 'Zero Commission',
    mr: 'शून्य कमिशन',
    hi: 'शून्य कमीशन',
    gu: 'ઝીરો કમિશન'
  },
  pillarZeroCommissionDesc: {
    en: 'Full farmer earnings credited directly to bank account',
    mr: 'शेतकऱ्याचे संपूर्ण उत्पन्न थेट बँक खात्यात जमा',
    hi: 'किसान की पूरी कमाई सीधे बैंक खाते में',
    gu: 'ખેડૂતના પૂરા પૈસા સીધા બેંક ખાતામાં'
  },
  pillarEscrowTitle: {
    en: 'Escrow Payment Protection',
    mr: 'एस्क्रो पेमेंट सुरक्षा',
    hi: 'एस्क्रो भुगतान सुरक्षा',
    gu: 'એસ્ક્રૉ પેમેન્ટ પ્રોટેક્શન'
  },
  pillarEscrowDesc: {
    en: 'Instant online disbursement upon delivery confirmation',
    mr: 'माल पोहोचताच त्वरित ऑनलाइन थेट खात्यात वर्ग',
    hi: 'माल पहुँचते ही तुरंत ऑनलाइन भुगतान',
    gu: 'માલ પહોંચતા જ તરત ઓનલાઈન ચુકવણી'
  },
  pillarTransportTitle: {
    en: 'Pooled Route Logistics',
    mr: 'एकत्रित वाहतूक सुविधा',
    hi: 'साझा परिवहन सुविधा',
    gu: 'પૂલ ટ્રાન્સપોર્ટ સગવડ'
  },
  pillarTransportDesc: {
    en: 'Direct farmgate pickup with shared freight savings',
    mr: 'शेत बांधावरून थेट वाहन उचल व कमी खर्च',
    hi: 'खेत से सीधी गाड़ी व कम भाड़ा बचत',
    gu: 'ખેતરના દરવાજેથી સીધું વ્હીકલ પિકઅપ અને ભાડા બચત'
  },
  pillarTestingTitle: {
    en: 'Government Lab Testing',
    mr: 'शासकीय प्रयोगशाळा तपासणी',
    hi: 'सरकारी लैब परीक्षण',
    gu: 'સરકારી લેબ ટેસ્ટિંગ'
  },
  pillarTestingDesc: {
    en: 'Grade-A verification and GI tagging certification',
    mr: 'ग्रेड-ए पडताळणी व जीआय टॅग प्रमाणीकरण',
    hi: 'ग्रेड-ए सत्यापन और जीआई टैग प्रमाणीकरण',
    gu: 'ગ્રેડ-A વેરિફિકેશન અને જીઆઈ ટેગિંગ'
  },
  footerPlatformInfo: {
    en: 'KrushiSetu — Maharashtra State Agricultural Marketing Board (MSAMB) Partner Digital Platform',
    mr: 'कृषीसेतू — महाराष्ट्र राज्य कृषी पणन मंडळ (MSAMB) डिजिटल भागीदार मंच',
    hi: 'कृषिसेतु — महाराष्ट्र राज्य कृषि विपणन बोर्ड (MSAMB) डिजिटल सहभागी मंच',
    gu: 'કૃષિસેતુ — મહારાષ્ટ્ર રાજ્ય કૃષિ વિપણન બોર્ડ (MSAMB) સહયોગી ડિજિટલ પ્લેટફોર્મ'
  },
  footerHelpline: {
    en: 'Toll-Free Farmer Helpline: 1800-233-0199',
    mr: 'टोल-फ्री शेतकरी हेल्पलाइन: १८००-२३३-०१९९',
    hi: 'टोल-फ्री किसान हेल्पलाइन: 1800-233-0199',
    gu: 'ટોલ-ફ્રી ખેડૂત સહાય: ૧૮૦૦-૨૩૩-૦૧૯૯'
  },
  howItWorksTitle: {
    en: 'How KrushiSetu Works',
    mr: 'कृषीसेतू कसे कार्य करते?',
    hi: 'कृषिसेतु कैसे काम करता है?',
    gu: 'કૃષિસેતુ કેવી રીતે કામ કરે છે?'
  },
  howItWorksSub: {
    en: '3 Simple Steps from Harvest to Bank Payout',
    mr: 'पिकापासून बँक खात्यापर्यंत सोप्या ३ पायऱ्या',
    hi: 'फसल से बैंक भुगतान तक आसान ३ चरण',
    gu: 'પાકથી બેંક ખાતા સુધી સરળ ૩ પગલાં'
  },
  secureGuaranteed: {
    en: '100% Secure',
    mr: '१००% सुरक्षित',
    hi: '100% सुरक्षित',
    gu: '૧૦૦% સુરક્ષિત'
  },
  heroStep1Title: {
    en: '1. Farmer Lists Harvest',
    mr: '१. शेतकरी पीक नोंदवतात',
    hi: '१. किसान फसल दर्ज करें',
    gu: '૧. ખેડૂત પાક નોંધાવે'
  },
  heroStep1Desc: {
    en: 'Record produce quality, photos, and expected price via mobile. Zero middlemen or commission.',
    mr: 'मोबाईलद्वारे पिकाची गुणवत्ता, फोटो आणि अपेक्षित दर थेट नोंदवा. कोणताही दलाल किंवा कमिशन नाही.',
    hi: 'मोबाइल से फसल की गुणवत्ता, फोटो और अपेक्षित मूल्य दर्ज करें। कोई बिचौलिया या कमीशन नहीं।',
    gu: 'મોબાઈલ દ્વારા પાકની ગુણવત્તા, ફોટા અને અપેક્ષિત ભાવ સીધા નોંધાવો. કોઈ દલાલ કે કમિશન નહીં.'
  },
  heroStep2Title: {
    en: '2. Buyer Discovers & Offers',
    mr: '२. खरेदीदार शोधतात व ऑफर देतात',
    hi: '२. खरीदार खोजें व प्रस्ताव भेजें',
    gu: '૨. ખરીદદાર શોધે & ઓફર કરે'
  },
  heroStep2Desc: {
    en: 'Verified food processors and institutional buyers browse produce lots and submit binding offers.',
    mr: 'पडताळणी केलेले अन्न प्रक्रियादार व मोठे व्यापारी थेट माल निवडून सुरक्षित खरेदी प्रस्ताव पाठवतात.',
    hi: 'सत्यापित खाद्य प्रसंस्करणकर्ता व बड़े व्यापारी सीधे माल चुनकर सुरक्षित प्रस्ताव भेजते हैं।',
    gu: 'વેરિફાઈડ ફૂડ પ્રોસેસર્સ અને મોટા વેપારીઓ સીધા ખેડૂતનો માલ પસંદ કરી સુરક્ષિત ઓફર મોકલે છે.'
  },
  heroStep3Title: {
    en: '3. Verification, Escrow Payout & Delivery',
    mr: '३. पडताळणी, एस्क्रो पेमेंट व पोहोच',
    hi: '३. सत्यापन, एस्क्रो भुगतान व डिलीवरी',
    gu: '૩. વેરિફિકેશન, એસ્ક્રૉ ચૂકવણી & ડિલિવરી'
  },
  heroStep3Desc: {
    en: 'Funds securely locked in State Escrow, official quality inspection completed, and doorstep logistics coordinated.',
    mr: 'शासकीय एस्क्रोमध्ये पैसे सुरक्षित, अधिकृत गुणवत्ता तपासणी आणि शेतावरूनच थेट वाहतूक व्यवस्था.',
    hi: 'राज्य एस्क्रो में राशि सुरक्षित, आधिकारिक गुणवत्ता जांच और खेत से सीधी ढुलाई व्यवस्था।',
    gu: '૧૦૦% સ્ટેટ એસ્ક્રૉમાં નાણાં લોક થાય છે, સરકારી ચકાસણી થાય છે અને ખેતરથી જ સીધું ટ્રાન્સપોર્ટ ગોઠવાય છે.'
  },
  liveMandiTicker: {
    en: 'Live Mandi Ticker',
    mr: 'थेट बाजार समिती भाव',
    hi: 'लाइव मंडी टिकर',
    gu: 'લાઈવ માર્કેટ ટિકર'
  },
  liveMandiTickerSample: {
    en: 'Red Onion · ₹2,920/Qtl',
    mr: 'लाल कांदा · ₹२,९२०/क्विंटल',
    hi: 'लाल प्याज · ₹2,920/क्विंटल',
    gu: 'લાલ ડુંગળી · ₹૨,૯૨૦/ક્વિન્ટલ'
  },
  liveMandiTickerDemand: {
    en: 'Lasalgaon APMC · 40T buyer demand live',
    mr: 'लासलगाव बाजार समिती · ४० टन खरेदीदार मागणी थेट',
    hi: 'लासलगांव मंडी · 40 टन खरीदार मांग लाइव',
    gu: 'લાસલગાંવ APMC · ૪૦T બાયર ડિમાન્ડ લાઈવ'
  },
  viewPrices: {
    en: 'View Prices →',
    mr: 'दर पहा →',
    hi: 'भाव देखें →',
    gu: 'ભાવ જુઓ →'
  },
  backToHome: {
    en: 'Back to Homepage',
    mr: 'मुख्यपृष्ठावर परत जा',
    hi: 'मुख्य पृष्ठ पर वापस जाएं',
    gu: 'હોમપેજ પર પાછા જાઓ'
  },
  cancel: {
    en: 'Cancel',
    mr: 'रद्द करा',
    hi: 'रद्द करें',
    gu: 'રદ કરો'
  },
  confirm: {
    en: 'Confirm',
    mr: 'नक्की करा',
    hi: 'पुष्टि करें',
    gu: 'ખાતરી કરો'
  },
  confirmLogout: {
    en: 'Yes, Logout',
    mr: 'होय, लॉगआउट करा',
    hi: 'हाँ, लॉगआउट करें',
    gu: 'હા, લૉગઆઉટ'
  },
  stateMaharashtra: {
    en: 'Maharashtra',
    mr: 'महाराष्ट्र',
    hi: 'महाराष्ट्र',
    gu: 'મહારાષ્ટ્ર'
  },
  listenVoiceGuide: {
    en: 'Listen Voice Guidance',
    mr: 'व्हॉइस मार्गदर्शन ऐका',
    hi: 'वॉयस मार्गदर्शन सुनें',
    gu: 'ઓડિયો માર્ગદર્શન સાંભળો'
  },
  adminPortalNotice: {
    en: 'This portal is strictly for authorized government nodal officers. Please complete admin login.',
    mr: 'हे पोर्टल केवळ अधिकृत शासकीय नोडल अधिकाऱ्यांसाठी आहे. कृपया ॲडमिन लॉगिन पूर्ण करा.',
    hi: 'यह पोर्टल केवल अधिकृत सरकारी नोडल अधिकारियों के लिए है। कृपया एडमिन लॉगिन पूरा करें।',
    gu: 'આ પોર્ટલ ફક્ત અધિકૃત સરકારી નોડલ અધિકારીઓ માટે છે. કૃપા કરીને એડમિન લૉગિન પૂર્ણ કરો.'
  },
  officialAdminLogin: {
    en: 'Official Admin Login',
    mr: 'अधिकृत ॲडमिन लॉगिन',
    hi: 'अधिकृत एडमिन लॉगिन',
    gu: 'અધિકૃત એડમિન લૉગિન'
  },
  farmerLoginBtn: {
    en: 'Farmer Login',
    mr: 'शेतकरी लॉगिन',
    hi: 'किसान लॉगिन',
    gu: 'ખેડૂત લૉગિન'
  },
  buyerLoginBtn: {
    en: 'Buyer Login',
    mr: 'खरेदीदार लॉगिन',
    hi: 'खरीदार लॉगिन',
    gu: 'ખરીદદાર લૉગિન'
  },
  adminLoginBtn: {
    en: 'Admin Login',
    mr: 'ॲडमिन लॉगिन',
    hi: 'एडमिन लॉगिन',
    gu: 'એડમિન લૉગિન'
  },
  mahaMarketplaceTagline: {
    en: 'Direct marketplace for Maharashtra farmers & verified buyers',
    mr: 'महाराष्ट्रातील शेतकरी व पडताळणी केलेल्या खरेदीदारांचे थेट व्यासपीठ',
    hi: 'महाराष्ट्र के किसानों और सत्यापित खरीदारों का सीधा बाज़ार',
    gu: 'મહારાષ્ટ્રના ખેડૂતો અને વેરિફાઈડ ખરીદદારોનું ડાયરેક્ટ માર્કેટપ્લેસ'
  }
};

const tsPath = path.join(__dirname, '../src/i18n/translations.ts');
let content = fs.readFileSync(tsPath, 'utf8');

for (const lang of ['en', 'hi', 'gu', 'mr']) {
  const marker = new RegExp('(' + lang + ':\\s*\\{)');
  let additions = '';
  for (const [key, trans] of Object.entries(extraKeys)) {
    const safeVal = trans[lang].replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    additions += `\n    '${key}': '${safeVal}',`;
  }
  content = content.replace(marker, `$1${additions}`);
}

fs.writeFileSync(tsPath, content, 'utf8');
console.log('Injected keys successfully! Total extra keys:', Object.keys(extraKeys).length);
