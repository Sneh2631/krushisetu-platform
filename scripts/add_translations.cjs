const fs = require('fs');
const path = require('path');

const newTranslations = {
  // Escrow timeline
  'escrowTimelineTitle': {
    en: 'Transparent Escrow Payment Timeline',
    hi: 'पारदर्शी एस्क्रो भुगतान समयरेखा',
    gu: 'પારદર્શક એસ્ક્રૉ ચુકવણી સમયરેખા',
    mr: 'पारदर्शक एस्क्रो पेमेंट वेळापत्रक',
  },
  'advanceEscrow': {
    en: 'Advance Escrow',
    hi: 'अग्रिम एस्क्रो',
    gu: 'એડવાન્સ એસ્ક્રૉ',
    mr: 'अ‍ॅडव्हान्स एस्क्रो',
  },
  'lockedInEscrow': {
    en: '✓ Locked in Nodal Escrow',
    hi: '✓ नोडल एस्क्रो में सुरक्षित',
    gu: '✓ નોડલ એસ્ક્રૉમાં સુરક્ષિત',
    mr: '✓ नोडल एस्क्रोमध्ये सुरक्षित',
  },
  'weighmentDispatch': {
    en: 'Weighment & Dispatch',
    hi: 'वजन एवं प्रेषण',
    gu: 'વજન અને રવાનગી',
    mr: 'वजन आणि डिस्पॅच',
  },
  'transitVerified': {
    en: 'Transit Verified',
    hi: 'परिवहन सत्यापित',
    gu: 'ટ્રાન્સિટ વેરિફાઈડ',
    mr: 'ट्रान्झिट पडताळणी',
  },
  'assayQualityCheck': {
    en: 'Assay & Quality Check',
    hi: 'गुणवत्ता एवं परख जांच',
    gu: 'ગુણવત્તા અને ગુણ ચકાસણી',
    mr: 'गुणवत्ता आणि लॅब तपासणी',
  },
  'gradeAssayed': {
    en: 'Grade Assayed',
    hi: 'ग्रेड प्रमाणित',
    gu: 'ગ્રેડ પ્રમાણિત',
    mr: 'ग्रेड प्रमाणित',
  },
  'directBankCredit': {
    en: 'Direct Bank Credit',
    hi: 'सीधा बैंक खाता क्रेडिट',
    gu: 'સીધું બેંક જમા (NEFT/RTGS)',
    mr: 'थेट बँक खात्यात जमा',
  },
  'instantRelease': {
    en: 'Instant Release',
    hi: 'त्वरित भुगतान',
    gu: 'તત્કાલ રિલીઝ',
    mr: 'त्वरित जमा',
  },
  'totalActivePayouts': {
    en: 'Total Active Payouts',
    hi: 'कुल सक्रिय भुगतान',
    gu: 'કુલ સક્રિય ચૂકવણી',
    mr: 'एकूण सक्रिय देयके',
  },
  'guaranteedEscrow': {
    en: '100% Guaranteed Escrow',
    hi: '100% गारंटीकृत एस्क्रो',
    gu: '100% સુરક્ષિત એસ્ક્રૉ',
    mr: '१००% हमीभाव एस्क्रो',
  },
  'escrowGuaranteeSubtitle': {
    en: 'Backed by MSAMB Zero-Default Escrow Guarantee',
    hi: 'MSAMB शून्य-डिफ़ॉल्ट एस्क्रो गारंटी द्वारा समर्थित',
    gu: 'MSAMB ઝીરો-ડિફોલ્ટ એસ્ક્રૉ ગેરંટી દ્વારા સમર્થિત',
    mr: 'पणन मंडळ शून्य-डिफॉल्ट एस्क्रो हमी अंतर्गत सुरक्षित',
  },
  'step1': {
    en: 'Step 1',
    hi: 'चरण १',
    gu: 'પગલું ૧',
    mr: 'टप्पा १',
  },
  'step2': {
    en: 'Step 2',
    hi: 'चरण २',
    gu: 'પગલું ૨',
    mr: 'टप्पा २',
  },
  'step3': {
    en: 'Step 3',
    hi: 'चरण ३',
    gu: 'પગલું ૩',
    mr: 'टप्पा ३',
  },
  'step4': {
    en: 'Step 4',
    hi: 'चरण ४',
    gu: 'પગલું ૪',
    mr: 'टप्पा ४',
  },

  // Produce lot creation missing
  'addNewCrop': {
    en: 'Add New Crop',
    hi: 'नई फसल जोड़ें',
    gu: 'નવો પાક ઉમેરો',
    mr: 'नवीन पीक जोडा',
  },
  'cropNotInDirectory': {
    en: '"{crop}" is not in the directory. Add this crop.',
    hi: '"{crop}" निर्देशिका में नहीं है। यह फसल जोड़ें।',
    gu: '"{crop}" યાદીમાં નથી. આ પાક ઉમેરો.',
    mr: '"{crop}" सूचीमध्ये नाही. हे पीक जोडा.',
  },
  'cropNotInDirectoryDesc': {
    en: 'Complete new-crop registration and start creating your listing immediately.',
    hi: 'नई फसल पंजीकरण पूरा करें और तुरंत अपनी लिस्टिंग बनाएं।',
    gu: 'નવા પાકની નોંધણી પૂર્ણ કરો અને તરત જ તમારું લિસ્ટિંગ બનાવો.',
    mr: 'नवीन पीक नोंदणी पूर्ण करा आणि त्वरित आपली नोंदणी तयार करा.',
  },
  'registerCropNow': {
    en: 'Register "{crop}" Now',
    hi: 'अब "{crop}" पंजीकृत करें',
    gu: 'હમણાં "{crop}" નોંધણી કરો',
    mr: 'आत्ता "{crop}" नोंदणी करा',
  },
  'mandiAvgPrice': {
    en: 'Mandi Avg',
    hi: 'मंडी औसत भाव',
    gu: 'માર્કેટ સરેરાશ',
    mr: 'बाजार समिती सरासरी',
  },

  // Verification status section
  'farmerKycProtocol': {
    en: 'FARMER KYC PROTOCOL',
    hi: 'किसान केवाईसी प्रोटोकॉल',
    gu: 'ખેડૂત કેવાયસી પ્રોટોકોલ',
    mr: 'शेतकरी केवायसी प्रोटोकॉल',
  },
  'buyerVerificationProtocol': {
    en: 'BUYER VERIFICATION',
    hi: 'खरीदार सत्यापन',
    gu: 'ખરીદદાર વેરિફિકેશન',
    mr: 'खरेदीदार पडताळणी',
  },
  'docsSecuredPrivate': {
    en: 'All documents are stored securely and kept strictly confidential.',
    hi: 'सभी दस्तावेज़ सुरक्षित और गोपनीय रखे जाते हैं।',
    gu: 'તમામ દસ્તાવેજો સુરક્ષિત અને ખાનગી રાખવામાં આવે છે.',
    mr: 'सर्व कागदपत्रे सुरक्षित आणि गोपनीय ठेवली जातात.',
  },
  'submitVerificationDoc': {
    en: 'Submit Verification Document',
    hi: 'सत्यापन दस्तावेज़ जमा करें',
    gu: 'નવો દસ્તાવેજ સબમિટ કરો',
    mr: 'पडताळणी कागदपत्र जमा करा',
  },
  'docSubmitSuccess': {
    en: 'Document submitted successfully! Verification officer will review within 24 hours.',
    hi: 'दस्तावेज़ सफलतापूर्वक जमा हुआ! अधिकारी 24 घंटे में समीक्षा करेंगे।',
    gu: 'દસ્તાવેજ સફળતાપૂર્વક સબમિટ થયો! અધિકારી ૨૪ કલાકમાં સમીક્ષા કરશે.',
    mr: 'कागदपत्र यशस्वीरीत्या जमा झाले! अधिकारी २४ तासांत पडताळणी करतील.',
  },
  'documentType': {
    en: 'Document Type',
    hi: 'दस्तावेज़ का प्रकार',
    gu: 'દસ્તાવેજનો પ્રકાર',
    mr: 'कागदपत्राचा प्रकार',
  },
  'doc712LandRecord': {
    en: '7/12 Land Extract / Village Form 8A',
    hi: '7/12 खतौनी / भूमि रिकॉर्ड',
    gu: '7/12 જમીન ઉતારો (ગામ નમૂનો 8A)',
    mr: '७/१२ सातबारा उतारा / गाव नमुना ८अ',
  },
  'docAadhaarCard': {
    en: 'Aadhaar Card',
    hi: 'आधार कार्ड',
    gu: 'આધાર કાર્ડ',
    mr: 'आधार कार्ड',
  },
  'docKisanCreditCard': {
    en: 'Kisan Credit Card (KCC)',
    hi: 'किसान क्रेडिट कार्ड (KCC)',
    gu: 'કિસાન ક્રેડિટ કાર્ડ (KCC)',
    mr: 'किसान क्रेडिट कार्ड (KCC)',
  },
  'docOrganicCert': {
    en: 'Organic Certificate (NPOP / PGS)',
    hi: 'जैविक प्रमाणीकरण प्रमाण पत्र',
    gu: 'ઓર્ગેનિક પ્રમાણપત્ર (NPOP / PGS)',
    mr: 'सेंद्रिय प्रमाणपत्र (NPOP / PGS)',
  },
  'docSoilHealthCard': {
    en: 'Soil Health Card (Soil Test Report)',
    hi: 'मृदा स्वास्थ्य कार्ड (सॉइल टेस्ट)',
    gu: 'સોઇલ હેલ્થ કાર્ડ (જમીન ચકાસણી અહેવાલ)',
    mr: 'मृदा आरोग्य पत्रिका (माती परीक्षण अहवाल)',
  },
  'docGstCert': {
    en: 'GST Registration Certificate',
    hi: 'जीएसटी पंजीकरण प्रमाण पत्र',
    gu: 'જીએસટી નોંધણી પ્રમાણપત્ર',
    mr: 'जीएसटी नोंदणी प्रमाणपत्र',
  },
  'docCompanyPan': {
    en: 'Company / Business PAN Card',
    hi: 'कंपनी / व्यावसायिक पैन कार्ड',
    gu: 'કંપની પાન કાર્ડ',
    mr: 'कंपनी पॅन कार्ड',
  },
  'docFssaiLicense': {
    en: 'FSSAI Food Safety License',
    hi: 'एफएसएसएआई खाद्य सुरक्षा लाइसेंस',
    gu: 'FSSAI ફૂડ સેફ્ટી લાયસન્સ',
    mr: 'FSSAI अन्न सुरक्षा परवाना',
  },
  'docApmcLicense': {
    en: 'APMC Trader License',
    hi: 'एपीएमसी व्यापारी लाइसेंस',
    gu: 'APMC ટ્રેડર લાયસન્સ',
    mr: 'कृषी उत्पन्न बाजार समिती व्यापारी परवाना',
  },
  'docCancelledCheque': {
    en: 'Bank Cancelled Cheque / Bank Proof',
    hi: 'बैंक रद्द चेक / बैंक प्रमाण',
    gu: 'બેંક કેન્સલ ચેક (બેંક પુરાવો)',
    mr: 'बँक रद्द केलेला धनादेश',
  },
  'documentNumber': {
    en: 'Document / Survey / Reg. Number',
    hi: 'दस्तावेज़ / सर्वे / पंजीकरण संख्या',
    gu: 'દસ્તાવેજ / સર્વે / નોંધણી નંબર',
    mr: 'कागदपत्र / सर्व्हे / नोंदणी क्रमांक',
  },
  'docNumberPlaceholder': {
    en: 'e.g. SURVEY-42-MAHUVA or 24AAACB1234F1Z8',
    hi: 'उदा. SURVEY-42-NASHIK या 27AAACB1234F1Z8',
    gu: 'દા.ત. SURVEY-42-MAHUVA અથવા 24AAACB1234F1Z8',
    mr: 'उदा. SURVEY-42-PUNE किंवा 27AAACB1234F1Z8',
  },
  'documentUrlLabel': {
    en: 'Document Image / Storage URL',
    hi: 'दस्तावेज़ फोटो / स्टोरेज लिंक',
    gu: 'દસ્તાવેજ ફોટો / સ્ટોરેજ URL',
    mr: 'कागदपत्र फोटो / स्टोरेज लिंक',
  },
  'defaultMockUrlHint': {
    en: 'A default sample document URL will be used if left empty.',
    hi: 'खाली छोड़ने पर डिफ़ॉल्ट नमूना दस्तावेज़ लिंक का उपयोग किया जाएगा।',
    gu: 'ખાલી રાખશો તો ડિફોલ્ટ સેમ્પલ દસ્તાવેજ લિંક વપરાશે.',
    mr: 'रिकामे ठेवल्यास डीफॉल्ट नमुना कागदपत्र लिंक वापरली जाईल.',
  },
  'additionalNotesLabel': {
    en: 'Additional Notes / Farm Details',
    hi: 'अतिरिक्त विवरण / खेत की जानकारी',
    gu: 'વધારાની નોંધ / ખેતરની વિગત',
    mr: 'अतिरिक्त माहिती / शेताचा तपशील',
  },
  'additionalNotesPlaceholder': {
    en: 'Land acreage, crop variety or organization details...',
    hi: 'जमीन का क्षेत्रफल, फसल किस्म या कंपनी विवरण...',
    gu: 'જમીનનું ક્ષેત્રફળ, પાકની જાત અથવા કંપનીની માહિતી...',
    mr: 'जमिनीचे क्षेत्रफळ, वाण किंवा व्यवसायाची माहिती...',
  },
  'submitForVerification': {
    en: 'Submit for Verification',
    hi: 'सत्यापन हेतु भेजें',
    gu: 'ચકાસણી માટે મોકલો',
    mr: 'पडताळणीसाठी पाठवा',
  },
  'verificationHistoryTitle': {
    en: 'Verification History & Admin Notes',
    hi: 'सत्यापन इतिहास एवं अधिकारी टिप्पणी',
    gu: 'વેરિફિકેશન ઇતિહાસ અને સમીક્ષા નોંધ',
    mr: 'पडताळणी इतिहास व अधिकारी अभिप्राय',
  },
  'requestsCount': {
    en: 'requests',
    hi: 'अनुरोध',
    gu: 'વિનંતીઓ',
    mr: 'विनंत्या',
  },
  'noVerificationRequests': {
    en: 'No verification requests submitted yet',
    hi: 'अभी तक कोई सत्यापन अनुरोध नहीं भेजा गया',
    gu: 'કોઈ વેરિફિકેશન વિનંતી નથી',
    mr: 'अद्याप कोणतीही पडताळणी विनंती पाठवली नाही',
  },
  'submitDocPrompt': {
    en: 'Submit your 7/12 land extract or GST document using the form.',
    hi: 'फॉर्म का उपयोग करके अपना 7/12 या जीएसटी दस्तावेज़ जमा करें।',
    gu: 'ફોર્મ દ્વારા તમારો 7/12 ઉતારો અથવા જીએસટી દસ્તાવેજ સબમિટ કરો.',
    mr: 'फॉर्मद्वारे आपला ७/१२ उतारा किंवा जीएसटी कागदपत्र सादर करा.',
  },
  'farmerNote': {
    en: 'Farmer Note',
    hi: 'किसान टिप्पणी',
    gu: 'ખેડૂત નોંધ',
    mr: 'शेतकरी नोंद',
  },
  'buyerNote': {
    en: 'Buyer Note',
    hi: 'खरीदार टिप्पणी',
    gu: 'ખરીદદાર નોંધ',
    mr: 'खरेदीदार नोंद',
  },
  'officerReviewNotes': {
    en: 'Officer Review Notes',
    hi: 'अधिकारी समीक्षा टिप्पणी',
    gu: 'અધિકારી સમીક્ષા નોંધ',
    mr: 'अधिकारी पडताळणी अभिप्राय',
  },
  'gsambOfficer': {
    en: 'GSAMB Officer',
    hi: 'कृषि विपणन अधिकारी',
    gu: 'GSAMB અધિકારી',
    mr: 'पणन मंडळ अधिकारी',
  },
  'requestedInfoNotes': {
    en: 'Requested Additional Information',
    hi: 'आवश्यक अतिरिक्त जानकारी',
    gu: 'વધારાની જરૂરી માહિતી',
    mr: 'आवश्यक अतिरिक्त माहिती',
  },
  'reviewed': {
    en: 'Reviewed',
    hi: 'समीक्षित',
    gu: 'ચકાસાયેલ',
    mr: 'तपासले',
  },

  // UserProfileModal
  'verifiedFarmerRole': {
    en: 'Verified Farmer Member',
    hi: 'सत्यापित किसान सदस्य',
    gu: 'પ્રમાણિત ખેડૂત સભ્ય',
    mr: 'प्रमाणित शेतकरी सदस्य',
  },
  'buyerAccountRole': {
    en: 'Registered Buyer / Trader',
    hi: 'पंजीकृत खरीदार / व्यापारी',
    gu: 'વેપારી / ખરીદદાર ખાતું',
    mr: 'नोंदणीकृत खरेदीदार / व्यापारी',
  },
  'userId': {
    en: 'User ID',
    hi: 'यूजर आईडी',
    gu: 'યુઝર આઈડી',
    mr: 'वापरकर्ता आयडी',
  },
  'tabBasicDetails': {
    en: '1. Basic Details',
    hi: '१. प्राथमिक विवरण',
    gu: '૧. પ્રાથમિક વિગતો',
    mr: '१. प्राथमिक माहिती',
  },
  'tabCropsLand': {
    en: '2. Crops & Land',
    hi: '२. फसल एवं भूमि',
    gu: '૨. પાક અને જમીન',
    mr: '२. पिके व जमीन',
  },
  'tabBusinessGst': {
    en: '2. Business & GST',
    hi: '२. व्यवसाय एवं जीएसटी',
    gu: '૨. વ્યવસાય વિગતો',
    mr: '२. व्यवसाय व जीएसटी',
  },
  'tabBankPayout': {
    en: '3. Bank & Payout',
    hi: '३. बैंक एवं भुगतान',
    gu: '૩. બેંક અને પેમેન્ટ',
    mr: '३. बँक व पेआउट',
  },
  'tabKycDocs': {
    en: '4. KYC & Documents',
    hi: '४. केवाईसी एवं दस्तावेज़',
    gu: '૪. સરકારી દસ્તાવેજ',
    mr: '४. केवायसी व कागदपत्रे',
  },
  'profileUpdateSuccess': {
    en: 'Profile Updated Successfully!',
    hi: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',
    gu: 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ ગઈ!',
    mr: 'प्रोफाइल यशस्वीरीत्या जतन झाली!',
  },
  'profileUpdateSuccessDesc': {
    en: 'Your updated profile details are saved and available for verification review.',
    hi: 'आपका प्रोफ़ाइल विवरण सुरक्षित कर लिया गया है और समीक्षा के लिए उपलब्ध है।',
    gu: 'તમારી પ્રોફાઇલ વિગતો સાચવી લેવામાં આવી છે અને સમીક્ષા માટે ઉપલબ્ધ છે.',
    mr: 'आपली माहिती सुरक्षित जतन झाली असून पडताळणीसाठी उपलब्ध आहे.',
  },
  'namePlaceholder': {
    en: 'e.g. Ramesh Patel',
    hi: 'उदा. रमेश पटेल',
    gu: 'દા.ત. રમેશભાઈ પટેલ',
    mr: 'उदा. रमेश पाटील',
  },
  'talukaPlaceholder': {
    en: 'e.g. Mahuva / Gondal',
    hi: 'उदा. महुवा / गोंडल',
    gu: 'દા.ત. મહુવા / ગોંડલ',
    mr: 'उदा. बारामती / निफाड',
  },
  'villagePlaceholder': {
    en: 'e.g. Mahuva Rural',
    hi: 'उदा. महुवा ग्रामीण',
    gu: 'દા.ત. મહુવા રૂરલ',
    mr: 'उदा. बारामती ग्रामीण',
  },
  'pickupAddressLabel': {
    en: 'Farm Gate / Loading Address',
    hi: 'खेत / लोडिंग का पता',
    gu: 'ખેતર / પિકઅપ સરનામું',
    mr: 'शेत / लोडिंग पत्ता',
  },
  'pickupAddressPlaceholder': {
    en: 'Survey number, landmark, farm pickup address',
    hi: 'सर्वे नंबर, नजदीकी लैंडमार्क, लोडिंग स्थान',
    gu: 'સર્વે નંબર, હાઈવે નજીક, પિકઅપ સ્થળની વિગત',
    mr: 'सर्व्हे क्रमांक, मुख्य रस्ता, लोडिंग ठिकाण',
  },
  'fpoSocietyName': {
    en: 'FPO / Society Name (Optional)',
    hi: 'एफपीओ / सहकारी समिति का नाम',
    gu: 'FPO / મંડળીનું નામ',
    mr: 'शेतकरी उत्पादक कंपनी / सोसायटीचे नाव',
  },
  'fpoPlaceholder': {
    en: 'e.g. Mahuva Saurashtra Farmer Producer Co.',
    hi: 'उदा. महुवा किसान उत्पादक कंपनी',
    gu: 'દા.ત. મહુવા સૌરાષ્ટ્ર ફાર્મર પ્રોડ્યુસર કંપની',
    mr: 'उदा. सह्याद्री शेतकरी उत्पादक कंपनी',
  },
  'farmSizeLabel': {
    en: 'Farm Size in Acres',
    hi: 'खेत का क्षेत्रफल (एकड़)',
    gu: 'જમીન ધારણ / ખેતરનું ક્ષેત્રફળ',
    mr: 'शेती क्षेत्रफळ (एकर)',
  },
  'farmSizePlaceholder': {
    en: 'e.g. 8.5 Acres',
    hi: 'उदा. 8.5 एकड़',
    gu: 'દા.ત. 8.5 એકર',
    mr: 'उदा. ८.५ एकर',
  },
  'primaryCropsGrown': {
    en: 'Primary Crops Grown',
    hi: 'उगाई जाने वाली मुख्य फसलें',
    gu: 'ઉગાડાતા મુખ્ય પાક',
    mr: 'पिकवली जाणारी प्रमुख पिके',
  },
  'storageAvailableLabel': {
    en: 'Storage / Godown available at or near farm',
    hi: 'खेत पर या निकट भंडारण/गोदाम उपलब्ध है',
    gu: 'ખેતરે / નજીકમાં સંગ્રહ ગોડાઉન ઉપલબ્ધ છે',
    mr: 'शेतावर अथवा जवळ साठवणूक गोदाम उपलब्ध आहे',
  },
  'transportNeededLabel': {
    en: 'Require shared transport pooling assistance',
    hi: 'साझा परिवहन सहायता की आवश्यकता है',
    gu: 'સહિયારા પરિવહનની જરૂરિયાત રહે છે',
    mr: 'सामायिक वाहतूक सुविधेची आवश्यकता आहे',
  },
  'companyPlaceholder': {
    en: 'e.g. Balaji Agro & Food Processing Ltd.',
    hi: 'उदा. बालाजी एग्रो फूड्स लिमिटेड',
    gu: 'દા.ત. બાલાજી વેફર્સ એન્ડ એગ્રો ફૂડ્સ લી.',
    mr: 'उदा. चितळे अ‍ॅग्रो फूड्स प्रा. लि.',
  },
  'buyerCategory': {
    en: 'Buyer Category',
    hi: 'खरीदार श्रेणी',
    gu: 'ખરીદદાર કેટેગરી',
    mr: 'खरेदीदार वर्गवारी',
  },
  'deliveryAddressLabel': {
    en: 'Delivery Plant / Processing Warehouse Address',
    hi: 'डिलीवरी प्लांट / प्रसंस्करण गोदाम का पता',
    gu: 'ડિલિવરી ગોડાઉન / ફેક્ટરી સરનામું',
    mr: 'वितरण केंद्र / प्रक्रिया युनिटचा पत्ता',
  },
  'deliveryAddressPlaceholder': {
    en: 'Plot number, industrial estate, unloading point',
    hi: 'प्लाट नंबर, औद्योगिक क्षेत्र, अनलोडिंग स्थल',
    gu: 'પ્લોટ નંબર, જીઆઇડીસી એસ્ટેટ, અનલોડિંગ પોઇન્ટ',
    mr: 'प्लॉट नंबर, एमआयडीसी, अनलोडिंग ठिकाण',
  },
  'procurementCommodities': {
    en: 'Commodities Procured Regularly',
    hi: 'नियमित खरीदी जाने वाली फसलें',
    gu: 'નિયમિત ખરીદી માટે જરૂરી પાકો',
    mr: 'नियमित खरेदी केली जाणारी पिके',
  },
  'bankEscrowNotice': {
    en: 'Secure Escrow & Direct Bank Account: All deal funds are settled directly into your verified bank account via nodal clearing.',
    hi: 'सुरक्षित एस्क्रो एवं बैंक खाता: सभी सौदों की राशि नोडल क्लीयरिंग द्वारा सीधे आपके बैंक खाते में जमा की जाती है।',
    gu: 'સુરક્ષિત એસ્ક્રૉ અને ડાયરેક્ટ બેંક એકાઉન્ટ: તમામ સોદાના નાણાં સીધા તમારા બેંક ખાતામાં એસ્ક્રૉ ક્લિયરિંગ દ્વારા જમા થાય છે.',
    mr: 'सुरक्षित एस्क्रो व बँक खाते: सर्व सौद्यांची रक्कम थेट आपल्या खात्यात एस्क्रो क्लिअरिंगद्वारे जमा केली जाते.',
  },
  'accountHolderName': {
    en: 'Account Holder Name',
    hi: 'खाताधारक का नाम',
    gu: 'બેંક ખાતાધારકનું નામ',
    mr: 'खातेदाराचे नाव',
  },
  'accountHolderPlaceholder': {
    en: 'e.g. Ramesh J. Patel',
    hi: 'उदा. रमेश जे. पटेल',
    gu: 'દા.ત. રમેશ જે પટેલ',
    mr: 'उदा. रमेश जे. पाटील',
  },
  'bankAccountNumber': {
    en: 'Bank Account Number',
    hi: 'बैंक खाता संख्या',
    gu: 'બેંક એકાઉન્ટ નંબર',
    mr: 'बँक खाते क्रमांक',
  },
  'bankIfscCode': {
    en: 'Bank IFSC Code',
    hi: 'बैंक आईएफएससी कोड',
    gu: 'IFSC કોડ',
    mr: 'बँक आयएफएससी कोड',
  },
  'upiIdOptional': {
    en: 'UPI ID / VPA (Optional)',
    hi: 'यूपीआई आईडी (ऐच्छिक)',
    gu: 'UPI ID (ઓપ્શનલ)',
    mr: 'युपीआय आयडी (ऐच्छिक)',
  },
  'govVerificationStatus': {
    en: 'Government Verification Status',
    hi: 'सरकारी सत्यापन स्थिति',
    gu: 'સરકારી ચકાસણી સ્થિતિ',
    mr: 'शासकीय पडताळणी स्थिती',
  },
  'govVerificationSubtitle': {
    en: 'Submit your 7/12 land extract or GST certificate to get a verified badge.',
    hi: 'सत्यापित बैज प्राप्त करने के लिए अपना 7/12 या जीएसटी प्रमाणपत्र जमा करें।',
    gu: 'અધિકૃત 7/12 ઉતારો અથવા જીએસટી સર્ટિફિકેટ સબમિટ કરીને વેરિફાઈડ બેજ મેળવો.',
    mr: 'प्रमाणित बॅज मिळवण्यासाठी आपला ७/१२ उतारा किंवा जीएसटी प्रमाणपत्र सादर करा.',
  },
  'openVerificationPage': {
    en: 'Open Verification Portal',
    hi: 'सत्यापन पोर्टल खोलें',
    gu: 'વેરિફિકેશન પેજ ખોલો',
    mr: 'पडताळणी पोर्टल उघडा',
  },

  // DealWorkspaceModal
  'sharedDealWorkspace': {
    en: 'Shared Deal Workspace',
    hi: 'साझा सौदा कार्यक्षेत्र',
    gu: 'સોદા કાર્યસ્થળ',
    mr: 'सामायिक सौदा कार्यक्षेत्र',
  },
  'dealExecutionMilestones': {
    en: 'Deal Execution Milestones',
    hi: 'सौदा प्रगति मील के पत्थर',
    gu: 'સોદા ટ્રેકિંગ પ્રગતિ',
    mr: 'सौदा प्रगती टप्पे',
  },
  'farmerContact': {
    en: 'Farmer Contact',
    hi: 'किसान संपर्क',
    gu: 'ખેડૂત સંપર્ક',
    mr: 'शेतकरी संपर्क',
  },
  'verifiedFarmer': {
    en: 'Verified Farmer',
    hi: 'सत्यापित किसान',
    gu: 'વેરિફાઈડ ખેડૂત',
    mr: 'प्रमाणित शेतकरी',
  },
  'callFarmer': {
    en: 'Call Farmer',
    hi: 'किसान को कॉल करें',
    gu: 'ખેડૂતને કૉલ કરો',
    mr: 'शेतकऱ्याला कॉल करा',
  },
  'buyerContact': {
    en: 'Corporate Buyer',
    hi: 'कॉर्पोरेट खरीदार',
    gu: 'ખરીદદાર સંપર્ક',
    mr: 'खरेदीदार संपर्क',
  },
  'escrowProtected': {
    en: 'Escrow Protected',
    hi: 'एस्क्रो सुरक्षित',
    gu: 'એસ્ક્રૉ સુરક્ષિત',
    mr: 'एस्क्रो सुरक्षित',
  },
  'callBuyer': {
    en: 'Call Buyer',
    hi: 'खरीदार को कॉल करें',
    gu: 'ખરીદદારને કૉલ કરો',
    mr: 'खरेदीदाराला कॉल करा',
  },
  'dealValueSummary': {
    en: 'Deal Value & Commodity Details',
    hi: 'सौदा मूल्य एवं उत्पाद विवरण',
    gu: 'સોદાની કિંમત અને માલ વિગતો',
    mr: 'सौदा मूल्य व माल तपशील',
  },
  'cropVariety': {
    en: 'Crop & Variety',
    hi: 'फसल एवं किस्म',
    gu: 'પાક અને જાત',
    mr: 'पीक व वाण',
  },
  'agreedQuantity': {
    en: 'Agreed Quantity',
    hi: 'तय मात्रा',
    gu: 'નક્કી થયેલ જથ્થો',
    mr: 'निश्चित प्रमाण',
  },
  'agreedPrice': {
    en: 'Agreed Price',
    hi: 'तय दर',
    gu: 'મંજૂર ભાવ',
    mr: 'मंजूर भाव',
  },
  'totalDealValue': {
    en: 'Total Deal Value',
    hi: 'कुल सौदा मूल्य',
    gu: 'કુલ સોદા રકમ',
    mr: 'एकूण सौदा मूल्य',
  },
  'transportCoordination': {
    en: 'Transport & Logistics Coordination',
    hi: 'परिवहन एवं लॉजिस्टिक्स समन्वय',
    gu: 'વાહન અને પરિવહન વ્યવસ્થા',
    mr: 'वाहतूक व लॉजिस्टिक्स नियोजन',
  },
  'changeVehicleDetails': {
    en: 'Change Vehicle Details',
    hi: 'वाहन विवरण बदलें',
    gu: 'વાહન વિગત બદલો',
    mr: 'वाहन तपशील बदला',
  },
  'assignVehicle': {
    en: '+ Assign Vehicle',
    hi: '+ वाहन आवंटित करें',
    gu: '+ વાહન ફાળવો',
    mr: '+ वाहन जोडा',
  },
  'vehicleTypeLabel': {
    en: 'Vehicle Type',
    hi: 'वाहन का प्रकार',
    gu: 'વાહનનો પ્રકાર',
    mr: 'वाहनाचा प्रकार',
  },
  'driverNameLabel': {
    en: 'Driver Name',
    hi: 'चालक का नाम',
    gu: 'ડ્રાઇવરનું નામ',
    mr: 'चालकाचे नाव',
  },
  'driverMobileLabel': {
    en: 'Driver Mobile',
    hi: 'चालक का मोबाइल',
    gu: 'ડ્રાઇવર મોબાઇલ',
    mr: 'चालक मोबाईल',
  },
  'vehicleNumberLabel': {
    en: 'Vehicle Number',
    hi: 'वाहन क्रमांक',
    gu: 'વાહન નંબર',
    mr: 'वाहन क्रमांक',
  },
  'estimatedFreightLabel': {
    en: 'Estimated Freight (₹)',
    hi: 'अनुमानित भाड़ा (₹)',
    gu: 'અંદાજિત ભાડું (₹)',
    mr: 'अंदाजे वाहतूक खर्च (₹)',
  },
  'saveTransportBtn': {
    en: 'Save Transport Details',
    hi: 'वाहन विवरण सुरक्षित करें',
    gu: 'વાહન કન્ફર્મ કરો',
    mr: 'वाहन तपशील जतन करा',
  },
  'vehicle': {
    en: 'Vehicle',
    hi: 'वाहन',
    gu: 'વાહન',
    mr: 'वाहन',
  },
  'driverContact': {
    en: 'Driver Contact',
    hi: 'चालक संपर्क',
    gu: 'ડ્રાઈવર સંપર્ક',
    mr: 'चालक संपर्क',
  },
  'transportCost': {
    en: 'Transport Freight',
    hi: 'परिवहन खर्च',
    gu: 'ટ્રાન્સપોર્ટ ખર્ચ',
    mr: 'वाहतूक खर्च',
  },
  'noVehicleAssigned': {
    en: 'No vehicle assigned yet. Click "Assign Vehicle" to allocate transport.',
    hi: 'अभी तक कोई वाहन आवंटित नहीं किया गया। वाहन जोड़ने के लिए "+ वाहन आवंटित करें" पर क्लिक करें।',
    gu: "વાહનની વિગત હજુ ઉમેરાયેલ નથી. '+ વાહન ફાળવો' પર ક્લિક કરો.",
    mr: 'अद्याप कोणतेही वाहन जोडलेले नाही. वाहतूक नियोजनासाठी "+ वाहन जोडा" वर क्लिक करा.',
  },
  'progressMilestones': {
    en: 'Progress Deal Milestones',
    hi: 'सौदा प्रगति कदम',
    gu: 'સ્ટેટસ અપડેટ ક્રિયાઓ',
    mr: 'सौदा प्रगती कृती',
  },
  'schedulePickup': {
    en: 'Schedule Pickup',
    hi: 'पिकअप शेड्यूल करें',
    gu: 'પિકઅપ શિડ્યુલ કરો',
    mr: 'पिकअप निश्चित करा',
  },
  'markCollected': {
    en: 'Product Collected',
    hi: 'उत्पाद एकत्र किया गया',
    gu: 'માલ લોડ થયો',
    mr: 'माल लोड झाला',
  },
  'markInTransit': {
    en: 'Dispatched / In Transit',
    hi: 'रवाना हुआ / रास्ते में',
    gu: 'રવાના થયું',
    mr: 'मार्गस्थ / रवाना',
  },
  'markDelivered': {
    en: 'Delivered to Facility',
    hi: 'पहुंच गया',
    gu: 'પહોંચી ગયું',
    mr: 'वितरित झाले',
  },
  'completeAndReleaseEscrow': {
    en: 'Complete Deal & Release Escrow',
    hi: 'सौदा पूर्ण करें एवं एस्क्रो जारी करें',
    gu: 'સોદો પૂર્ણ કરો અને એસ્ક્રૉ રિલીઝ કરો',
    mr: 'सौदा पूर्ण करा आणि एस्क्रो जमा करा',
  },
  'dealCompletedNotice': {
    en: 'Deal completed successfully. Escrow funds have been credited to the seller account.',
    hi: 'सौदा सफलतापूर्वक पूरा हुआ। एस्क्रो राशि विक्रेता के खाते में जमा कर दी गई है।',
    gu: 'સોદો સફળતાપૂર્વક પૂર્ણ થયેલ છે. એસ્ક્રૉ ખાતામાંથી રકમ જમા થઈ ગઈ છે.',
    mr: 'सौदा यशस्वीरीत्या पूर्ण झाला. एस्क्रो रक्कम विक्रेत्याच्या खात्यात जमा झाली आहे.',
  },
  'rateFarmerPrompt': {
    en: 'Rate & Provide Feedback for Farmer',
    hi: 'किसान को रेटिंग एवं प्रतिक्रिया दें',
    gu: 'ખેડૂતને રેટિંગ અને ફીડબેક આપો',
    mr: 'शेतकऱ्याला रेटिंग व अभिप्राय द्या',
  },
  'rateBuyerPrompt': {
    en: 'Rate & Provide Feedback for Buyer',
    hi: 'खरीदार को रेटिंग एवं प्रतिक्रिया दें',
    gu: 'ખરીદદારને રેટિંગ અને ફીડબેક આપો',
    mr: 'खरेदीदाराला रेटिंग व अभिप्राय द्या',
  },
  'feedbackPlaceholder': {
    en: 'Share your experience (e.g. timely delivery, top quality produce)...',
    hi: 'अपना अनुभव साझा करें (उदा. समय पर भुगतान, उच्च गुणवत्ता)...',
    gu: 'અનુભવ વિશે લખો (દા.ત. સમયસર પેમેન્ટ, ઉત્તમ માલ)...',
    mr: 'आपला अनुभव लिहा (उदा. वेळेवर पेमेंट, उत्कृष्ट शेतीमाल)...',
  },
  'submitRating': {
    en: 'Submit Rating',
    hi: 'रेटिंग जमा करें',
    gu: 'રેટિંગ સબમિટ કરો',
    mr: 'रेटिंग सबमिट करा',
  },
  'ratingSubmittedSuccess': {
    en: 'Rating and feedback submitted successfully!',
    hi: 'रेटिंग एवं प्रतिक्रिया सफलतापूर्वक दर्ज की गई!',
    gu: 'રેટિંગ અને ફીડબેક સફળતાપૂર્વક સબમિટ થયું!',
    mr: 'रेटिंग आणि अभिप्राय यशस्वीरीत्या नोंदवले गेले!',
  },
  'supportHelpline': {
    en: 'Support Toll-Free Helpline:',
    hi: 'टोल-फ्री सहायता हेल्पलाइन:',
    gu: 'સહાયતા માટે હેલ્પલાઈન:',
    mr: 'मदत टोल-फ्री हेल्पलाइन:',
  },
};

const translationsPath = path.join(__dirname, '../src/i18n/translations.ts');
let fileContent = fs.readFileSync(translationsPath, 'utf8');

// Function to generate the key-value block to insert for a language
function generateBlock(lang) {
  let block = '';
  for (const [key, valObj] of Object.entries(newTranslations)) {
    const val = (valObj[lang] || valObj['en']).replace(/'/g, "\\'");
    block += `    '${key}': '${val}',\n`;
  }
  return block;
}

// Check where each language section ends:
// en ends before '  hi: {'
// hi ends before '  gu: {'
// gu ends before '  mr: {'
// mr ends before '  }\n};'

const enBlock = generateBlock('en');
const hiBlock = generateBlock('hi');
const guBlock = generateBlock('gu');
const mrBlock = generateBlock('mr');

// 1. Insert into en
fileContent = fileContent.replace(/(\n  hi: \{)/, `${enBlock}$1`);
// 2. Insert into hi
fileContent = fileContent.replace(/(\n  gu: \{)/, `${hiBlock}$1`);
// 3. Insert into gu
fileContent = fileContent.replace(/(\n  mr: \{)/, `${guBlock}$1`);
// 4. Insert into mr (before the closing '  }\n};')
fileContent = fileContent.replace(/(\n  \}\s*\n\};)/, `${mrBlock}$1`);

fs.writeFileSync(translationsPath, fileContent, 'utf8');
console.log('Added ' + Object.keys(newTranslations).length + ' translation keys to all 4 languages in translations.ts!');
