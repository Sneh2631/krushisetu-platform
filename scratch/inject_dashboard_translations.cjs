const fs = require('fs');

const extraTranslations = {
  farmerGreeting: {
    en: 'Welcome,',
    hi: 'नमस्ते,',
    gu: 'નમસ્તે,',
    mr: 'नमस्कार,',
  },
  farmerPortalBadge: {
    en: 'MAHARASHTRA FARMER PORTAL (MSAMB VERIFIED)',
    hi: 'महाराष्ट्र किसान पोर्टल (MSAMB सत्यापित)',
    gu: 'મહારાષ્ટ્ર ખેડૂત પોર્ટલ (MSAMB વેરિફાઇડ)',
    mr: 'महाराष्ट्र शेतकरी पोर्टल (MSAMB प्रमाणित)',
  },
  mainActionsTitle: {
    en: 'Main Actions',
    hi: 'मुख्य सेवाएं',
    gu: 'મુખ્ય સેવાઓ',
    mr: 'मुख्य सेवा',
  },
  actionSellProduce: {
    en: '1. Sell Produce',
    hi: '१. उपज बेचें',
    gu: '૧. પાક વેચો',
    mr: '१. शेतीमाल विका',
  },
  actionSellProduceSub: {
    en: 'Sell Produce (New Listing)',
    hi: 'उपज बेचें (नई लिस्टिंग)',
    gu: 'પાક વેચો (નવું લિસ્ટિંગ)',
    mr: 'शेतीमाल विका (नवीन नोंदणी)',
  },
  actionCheckPrices: {
    en: '2. Check Market Prices',
    hi: '२. बाज़ार भाव देखें',
    gu: '૨. બજાર ભાવ જુઓ',
    mr: '२. बाजारभाव पहा',
  },
  actionCheckPricesSub: {
    en: 'APMC Mandi Price Matrix',
    hi: 'एपीएमसी मंडी मूल्य मैट्रिक्स',
    gu: 'APMC માર્કેટ ભાવ મેટ્રિક્સ',
    mr: 'कृषी उत्पन्न बाजार समिती भाव',
  },
  actionBuyerDemand: {
    en: '3. Buyer Demand',
    hi: '३. खरीदार मांग',
    gu: '૩. ખરીદદારની માંગ',
    mr: '३. खरेदीदारांची मागणी',
  },
  actionBuyerDemandSub: {
    en: 'Buyer Offers',
    hi: 'खरीदार प्रस्ताव',
    gu: 'ખરીદદાર ઓફર્સ',
    mr: 'खरेदीदार ऑफर्स',
  },
  actionMyDeals: {
    en: '4. My Deals',
    hi: '४. मेरे सौदे',
    gu: '૪. મારા સોદા',
    mr: '४. माझे सौदे',
  },
  actionMyDealsSub: {
    en: 'Active Deals',
    hi: 'सक्रिय सौदे',
    gu: 'સક્રિય સોદા',
    mr: 'सक्रिय सौदे',
  },
  farmerVoiceHelpText: {
    en: "Welcome farmer friend. Welcome to KrushiSetu. Tap the green 'Sell Produce' button to list your harvest lot.",
    hi: "नमस्ते किसान मित्र। कृषिसेतु में आपका स्वागत है। उपज बेचने के लिए हरे रंग का 'उपज बेचें' बटन दबाएं।",
    gu: "નમસ્તે ખેડૂત મિત્ર. કૃષિસેતુમાં આપનું સ્વાગત છે. પાક વેચવા માટે લીલા રંગનું 'પાક વેચો' બટન દબાવો.",
    mr: "नमस्कार शेतकरी मित्रहो. कृषिसेतू मध्ये आपले स्वागत आहे. शेतीमाल विक्रीसाठी हिरवे 'शेतीमाल विका' बटण दाबा.",
  },
  farmerVoiceHelpLabel: {
    en: 'Audio Help',
    hi: 'ऑडियो सहायता',
    gu: 'ઓડિયો સહાય',
    mr: 'ऑडिओ मदत',
  },
  farmerMyProfileBtn: {
    en: 'My Profile',
    hi: 'मेरी प्रोफाइल',
    gu: 'મારી પ્રોફાઇલ',
    mr: 'माझे प्रोफाईल',
  },
  farmerHelpBtn: {
    en: 'Help & Support',
    hi: 'मदद एवं सहायता',
    gu: 'મદદ અને સહાય',
    mr: 'मदत व सहाय्य',
  },
  statMyListings: {
    en: 'My Produce Listings',
    hi: 'मेरी उपज लिस्टिंग',
    gu: 'મારા પાક લિસ્ટિંગ',
    mr: 'माझी पीक नोंदणी',
  },
  statUpcomingPickup: {
    en: 'Upcoming Logistics Pickup',
    hi: 'आगामी वाहन पिकअप',
    gu: 'આગામી વાહન પિકઅપ',
    mr: 'आगामी वाहन पिकअप',
  },
  statExpectedEscrow: {
    en: 'Expected Escrow Payout',
    hi: 'अपेक्षित एस्क्रो भुगतान',
    gu: 'અપેક્ષિત એસ્ક્રૉ ચૂકવણી',
    mr: 'अपेक्षित एस्क्रो रक्कम',
  },
  statLiveListingsSuffix: {
    en: 'Live',
    hi: 'लाइव',
    gu: 'લાઈવ',
    mr: 'थेट',
  },
  statInReviewSuffix: {
    en: 'Under Review',
    hi: 'समीक्षाधीन',
    gu: 'ચકાસણી હેઠળ',
    mr: 'पडताळणी अंतर्गत',
  },
  statNoPickup: {
    en: 'No pickup pending',
    hi: 'कोई पिकअप लंबित नहीं',
    gu: 'કોઈ પિકઅપ પેન્ડિંગ નથી',
    mr: 'कोणतेही पिकअप प्रलंबित नाही',
  },
  statVehicleLabel: {
    en: 'Vehicle',
    hi: 'वाहन',
    gu: 'વાહન',
    mr: 'वाहन',
  },
  statEscrowLocked: {
    en: '100% Locked in State Escrow',
    hi: '100% राज्य एस्क्रो में सुरक्षित',
    gu: '100% સ્ટેટ એસ્ક્રૉમાં લોક થયેલ',
    mr: '१००% शासकीय एस्क्रोमध्ये सुरक्षित',
  },
  tabOverviewLabel: {
    en: 'Overview',
    hi: 'मुख्य अवलोकन',
    gu: 'મુખ્ય અવલોકન',
    mr: 'मुख्य आढावा',
  },
  tabListingsLabel: {
    en: 'My Listings',
    hi: 'मेरी लिस्टिंग',
    gu: 'મારા લિસ્ટિંગ',
    mr: 'माझी नोंदणी',
  },
  tabOffersLabel: {
    en: 'Buyer Offers',
    hi: 'खरीदार ऑफर्स',
    gu: 'ખરીદદાર ઓફર્સ',
    mr: 'खरेदीदार ऑफर्स',
  },
  tabDealsLabel: {
    en: 'My Deals',
    hi: 'मेरे सौदे',
    gu: 'મારા સોદા',
    mr: 'माझे सौदे',
  },
  tabVerificationLabel: {
    en: 'Verification Status (KYC)',
    hi: 'सत्यापन स्थिति (KYC)',
    gu: 'વેરિફિકેશન સ્થિતિ (KYC)',
    mr: 'पडताळणी स्थिती (KYC)',
  },
  tabNewsLabel: {
    en: 'KrushiSetu News',
    hi: 'कृषिसेतु समाचार',
    gu: 'કૃષિસેતુ સમાચાર',
    mr: 'कृषिसेतू बातम्या',
  },
  recentListingsTitle: {
    en: 'Recent Listings & Inspection Status',
    hi: 'हालिया लिस्टिंग एवं सत्यापन स्थिति',
    gu: 'તાજેતરના લિસ્ટિંગ્સ અને ચકાસણી સ્ટેટસ',
    mr: 'अलीकडील नोंदी आणि पडताळणी स्थिती',
  },
  viewAllBtn: {
    en: 'View All →',
    hi: 'सभी देखें →',
    gu: 'બધા જુઓ →',
    mr: 'सर्व पहा →',
  },
  pendingOffersTitle: {
    en: 'Pending Buyer Inquiries & Offers',
    hi: 'लंबित खरीदार पूछताछ एवं प्रस्ताव',
    gu: 'પેન્ડિંગ ખરીદદાર પૂછપરછ અને ઓફર્સ',
    mr: 'प्रलंबित खरेदीदार चौकशी व ऑफर्स',
  },
  noOffersReceivedYet: {
    en: 'No offers received yet. Check back soon or optimize listing price.',
    hi: 'अभी तक कोई प्रस्ताव प्राप्त नहीं हुआ। कृपया जल्द जांचें।',
    gu: 'હજુ સુધી કોઈ ઓફર મળી નથી. ટૂંક સમયમાં તપાસો.',
    mr: 'अद्याप कोणतीही ऑफर मिळालेली नाही. कृपया लवकरच पुन्हा तपासा.',
  },
  acceptOfferBtn: {
    en: 'Accept Offer',
    hi: 'प्रस्ताव स्वीकारें',
    gu: 'ઓફર સ્વીકારો',
    mr: 'ऑफर स्वीकारा',
  },
  rejectOfferBtn: {
    en: 'Reject',
    hi: 'अस्वीकार करें',
    gu: 'નકારો',
    mr: 'नाकारा',
  },
  counterOfferBtn: {
    en: 'Counter Offer',
    hi: 'काउंटर ऑफर दें',
    gu: 'કાઉન્ટર ઓફર આપો',
    mr: 'काऊंटर ऑफर द्या',
  },
  buyerCorporateName: {
    en: 'Chitale Agro & Dairy Foods Ltd',
    hi: 'चितळे ॲग्रो अँड डेअरी फुड्स लि.',
    gu: 'ચિતાલે એગ્રો એન્ડ ડેરી ફૂડ્સ લિ.',
    mr: 'चितळे ॲग्रो अँड डेअरी फुड्स लि.',
  },
  buyerProcurementTitle: {
    en: 'Institutional Procurement Desk',
    hi: 'संस्थागत खरीद डेस्क',
    gu: 'સંસ્થાકીય ખરીદી ડેસ્ક',
    mr: 'संस्थात्मक खरेदी कक्ष',
  },
  buyerMahaGstNotice: {
    en: 'MSAMB Licensed Direct Procurement Entity · GST: 27AAACB1234F1Z8',
    hi: 'MSAMB लाइसेंस प्राप्त संस्थागत खरीद इकाई · GST: 27AAACB1234F1Z8',
    gu: 'MSAMB લાઇસન્સ પ્રાપ્ત સંસ્થાકીય ખરીદી એકમ · GST: 27AAACB1234F1Z8',
    mr: 'MSAMB परवानाधारक थेट खरेदी संस्था · GST: 27AAACB1234F1Z8',
  },
  adminOfficerBadge: {
    en: 'MSAMB NODAL INSPECTION OFFICER',
    hi: 'MSAMB नोडल निरीक्षण अधिकारी',
    gu: 'MSAMB નોડલ નિરીક્ષણ અધિકારી',
    mr: 'MSAMB नोडल तपासणी अधिकारी',
  },
  adminVerificationQueueTitle: {
    en: 'Maharashtra Agricultural Marketing Board — Produce Inspection & KYC Clearance',
    hi: 'महाराष्ट्र राज्य कृषि पणन मंडळ — उपज निरीक्षण एवं KYC मंजूरी',
    gu: 'મહારાષ્ટ્ર રાજ્ય કૃષિ માર્કેટિંગ બોર્ડ — પાક નિરીક્ષણ અને KYC મંજૂરી',
    mr: 'महाराष्ट्र राज्य कृषी पणन मंडळ — शेतीमाल तपासणी व KYC मंजुरी',
  },
  adminApproveBtn: {
    en: 'Approve & Issue Certificate',
    hi: 'स्वीकृत करें एवं प्रमाण पत्र जारी करें',
    gu: 'મંજૂર કરો અને પ્રમાણપત્ર આપો',
    mr: 'मंजूर करा व प्रमाणपत्र जारी करा',
  },
  adminRejectBtn: {
    en: 'Reject / Request Resubmission',
    hi: 'अस्वीकार करें / पुनः जमा करने का अनुरोध करें',
    gu: 'નકારો / ફરીથી સબમિટ કરવા કહો',
    mr: 'नाकारा / पुन्हा सादर करण्याची विनंती करा',
  },
  adminSampleTested: {
    en: 'AGMARK Lab Certified Grade A',
    hi: 'AGMARK प्रयोगशाला प्रमाणित ग्रेड A',
    gu: 'AGMARK લેબ પ્રમાણિત ગ્રેડ A',
    mr: 'अॅगमार्क प्रयोगशाळा प्रमाणित ग्रेड A',
  },
  stepBasicDetails: {
    en: 'Basic Produce Details',
    hi: 'उपज का मूल विवरण',
    gu: 'પાકની મૂળભૂત વિગતો',
    mr: 'शेतीमालाचा प्राथमिक तपशील',
  },
  stepQuantityPrice: {
    en: 'Quantity & Target Price',
    hi: 'मात्रा एवं लक्षित मूल्य',
    gu: 'જથ્થો અને લક્ષિત ભાવ',
    mr: 'प्रमाण व अपेक्षित किंमत',
  },
  stepQualityGrade: {
    en: 'Quality & AGMARK Grade',
    hi: 'गुणवत्ता एवं एगमार्क ग्रेड',
    gu: 'ગુણવત્તા અને એગમાર્ક ગ્રેડ',
    mr: 'गुणवत्ता व अॅगमार्क प्रत',
  },
  stepLogisticsStorage: {
    en: 'Logistics & Farm Storage',
    hi: 'लॉजिस्टिक्स एवं भंडारण',
    gu: 'લોજિસ્ટિક્સ અને સ્ટોરેજ',
    mr: 'वाहतूक व शेत साठवणूक',
  },
  stepPhotosDocs: {
    en: 'Crop Photos & 7/12 (Satbara)',
    hi: 'उपज फोटो एवं 7/12 (सातबारा)',
    gu: 'પાકના ફોટા અને ૭/૧૨',
    mr: 'पीक फोटो व ७/१२ (सातबारा)',
  },
  stepReviewSubmit: {
    en: 'Review & Broadcast to Buyers',
    hi: 'समीक्षा करें एवं खरीदारों को भेजें',
    gu: 'ચકાસો અને ખરીદદારોને મોકલો',
    mr: 'तपासा आणि खरेदीदारांना पाठवा',
  },
  dealWorkspaceTitle: {
    en: 'State Escrow Deal Workspace',
    hi: 'राज्य एस्क्रो सौदा कार्यक्षेत्र',
    gu: 'સ્ટેટ એસ્ક્રૉ સોદા કાર્યક્ષેત્ર',
    mr: 'शासकीय एस्क्रो व्यवहार कक्ष',
  },
  escrowFundedBadge: {
    en: '100% Escrow Deposited & Secured',
    hi: '100% एस्क्रो जमा एवं सुरक्षित',
    gu: '100% એસ્ક્રૉ જમા અને સુરક્ષિત',
    mr: '१००% एस्क्रो जमा व सुरक्षित',
  },
  dealCodeLabel: {
    en: 'Deal Code',
    hi: 'सौदा कोड',
    gu: 'સોદા કોડ',
    mr: 'सौदा कोड',
  },
  buyerContactUnlocked: {
    en: 'Buyer Direct Contact (Unlocked)',
    hi: 'खरीदार सीधा संपर्क (सत्यापित)',
    gu: 'ખરીદદારનો સીધો સંપર્ક (અનલૉક)',
    mr: 'खरेदीदाराचा थेट संपर्क (सत्यापित)',
  },
  farmerContactUnlocked: {
    en: 'Farmer Direct Contact (Unlocked)',
    hi: 'किसान सीधा संपर्क (सत्यापित)',
    gu: 'ખેડૂતનો સીધો સંપર્ક (અનલૉક)',
    mr: 'शेतकऱ्याचा थेट संपर्क (सत्यापित)',
  },
  releasePaymentBtn: {
    en: 'Authorize Final Bank Transfer',
    hi: 'अंतिम बैंक अंतरण अधिकृत करें',
    gu: 'અંતિમ બેંક ટ્રાન્સફર મંજૂર કરો',
    mr: 'अंतिम बँक हस्तांतरण मंजूर करा',
  },
  downloadContractPdf: {
    en: 'Download Tri-Party Legal Contract (PDF)',
    hi: 'त्रिपक्षीय कानूनी अनुबंध (PDF) डाउनलोड करें',
    gu: 'ત્રિપક્ષીય કાનૂની કરાર (PDF) ડાઉનલોડ કરો',
    mr: 'त्रिपक्षीय कायदेशीर करार (PDF) डाउनलोड करा',
  },
};

// Now let's inject these into src/i18n/translations.ts
const filePath = 'src/i18n/translations.ts';
let code = fs.readFileSync(filePath, 'utf8');

const languages = ['en', 'hi', 'gu', 'mr'];

languages.forEach(lang => {
  // Find where the lang dictionary ends or add before its closing bracket
  // Pattern: lang: {\n ... \n  },
  let insertSnippet = '';
  for (const [key, trans] of Object.entries(extraTranslations)) {
    const val = (trans[lang] || trans['en']).replace(/'/g, "\\'");
    insertSnippet += `    '${key}': '${val}',\n`;
  }

  // We can insert at the beginning of the dictionary: `${lang}: {\n`
  const targetHeader = `${lang}: {\n`;
  if (code.includes(targetHeader)) {
    code = code.replace(targetHeader, targetHeader + insertSnippet);
    console.log(`Injected ${Object.keys(extraTranslations).length} keys into ${lang}`);
  } else {
    console.error(`Could not find header for ${lang}`);
  }
});

fs.writeFileSync(filePath, code, 'utf8');
console.log('Saved translations.ts with extra dashboard keys!');
