const fs = require('fs');
const path = require('path');

const allNewTranslations = {
  // UserProfileModal
  'farmerProfileModalTitle': {
    en: 'Farmer Profile',
    hi: 'किसान प्रोफ़ाइल',
    gu: 'મારી ખેડૂત પ્રોફાઇલ',
    mr: 'शेतकरी प्रोफाइल',
  },
  'buyerProfileModalTitle': {
    en: 'Buyer Profile',
    hi: 'खरीदार प्रोफ़ाइल',
    gu: 'મારી ખરીદદાર પ્રોફાઇલ',
    mr: 'खरेदीदार प्रोफाइल',
  },
  'adminProfileModalTitle': {
    en: 'Admin Profile',
    hi: 'व्यवस्थापक प्रोफ़ाइल',
    gu: 'એડમિન પ્રોફાઇલ',
    mr: 'प्रशासक प्रोफाइल',
  },
  'tabBasicDetails': {
    en: '1. Basic Details',
    hi: '१. बुनियादी विवरण',
    gu: '૧. પ્રાથમિક વિગતો',
    mr: '१. मूलभूत माहिती',
  },
  'tabCropsLand': {
    en: '2. Crops & Land',
    hi: '२. फसलें एवं भूमि',
    gu: '૨. પાક અને જમીન',
    mr: '२. पिके व जमीन',
  },
  'tabBusinessGst': {
    en: '2. Business & GST',
    hi: '२. व्यापार एवं जीएसटी',
    gu: '૨. વ્યવસાય વિગતો',
    mr: '२. व्यवसाय व जीएसटी',
  },
  'tabBankPayout': {
    en: '3. Bank & Payout',
    hi: '३. बैंक एवं भुगतान',
    gu: '૩. બેંક અને પેમેન્ટ',
    mr: '३. बँक व पेमेंट',
  },
  'tabKycDocs': {
    en: '4. KYC & Documents',
    hi: '४. केवाईसी एवं दस्तावेज़',
    gu: '૪. સરકારી દસ્તાવેજ',
    mr: '४. केवायसी व कागदपत्रे',
  },
  'profileUpdatedSuccess': {
    en: 'Profile updated successfully!',
    hi: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!',
    gu: 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ ગઈ છે!',
    mr: 'प्रोफाइल यशस्वीरीत्या अपडेट झाली!',
  },
  'profileUpdatedDesc': {
    en: 'All your profile details have been securely saved and are available for review.',
    hi: 'आपकी प्रोफ़ाइल का विवरण सुरक्षित रूप से सहेज लिया गया है और समीक्षा के लिए उपलब्ध है।',
    gu: 'તમારી પ્રોફાઇલની તમામ વિગતો ડેટાબેઝમાં સાચવી લેવામાં આવી છે અને સમીક્ષા માટે ઉપલબ્ધ છે.',
    mr: 'आपल्या प्रोफाइलचे सर्व तपशील जतन केले गेले असून तपासणीसाठी उपलब्ध आहेत.',
  },
  'fullNameLabel': {
    en: 'Full Name',
    hi: 'पूरा नाम',
    gu: 'પૂરું નામ',
    mr: 'पूर्ण नाव',
  },
  'mobileNumberLabel': {
    en: 'Mobile Number',
    hi: 'मोबाइल नंबर',
    gu: 'મોબાઇલ નંબર',
    mr: 'मोबाईल क्रमांक',
  },
  'emailAddressLabel': {
    en: 'Email Address',
    hi: 'ईमेल पता',
    gu: 'ઇમેઇલ સરનામું',
    mr: 'ईमेल पत्ता',
  },
  'stateLabel': {
    en: 'State',
    hi: 'राज्य',
    gu: 'રાજ્ય',
    mr: 'राज्य',
  },
  'districtLabel': {
    en: 'District',
    hi: 'जिला',
    gu: 'જિલ્લો',
    mr: 'जिल्हा',
  },
  'talukaLabel': {
    en: 'Taluka / Tehsil',
    hi: 'तहसील / तालुका',
    gu: 'તાલુકો',
    mr: 'तालुका',
  },
  'villageTownLabel': {
    en: 'Village / Town',
    hi: 'गाँव / शहर',
    gu: 'ગામ / શહેર',
    mr: 'गाव / शहर',
  },
  'pincodeLabel': {
    en: 'PIN Code',
    hi: 'पिन कोड',
    gu: 'પિનકોડ',
    mr: 'पिन कोड',
  },
  'farmGateAddressLabel': {
    en: 'Farm Gate / Loading Address',
    hi: 'फार्म गेट / लोडिंग का पता',
    gu: 'ખેતર / પિકઅપ સરનામું',
    mr: 'शेत / लोडिंग पत्ता',
  },
  'farmGateAddressPlaceholder': {
    en: 'Survey number, near highway, pickup location details',
    hi: 'सर्वे नंबर, राजमार्ग के पास, पिकअप स्थान विवरण',
    gu: 'સર્વે નંબર, હાઈવે નજીક, પિકઅપ સ્થળની વિગત',
    mr: 'सर्व्हे क्रमांक, महामार्गाजवळ, पिकअप ठिकाण तपशील',
  },
  'fpoSocietyName': {
    en: 'FPO / Society Name',
    hi: 'एफपीओ / सहकारी समिति का नाम',
    gu: 'FPO / મંડળીનું નામ',
    mr: 'एफपीओ / संस्थेचे नाव',
  },
  'fpoSocietyPlaceholder': {
    en: 'e.g. Mahuva Saurashtra Farmer Producer Company',
    hi: 'उदा. महूवा सौराष्ट्र फार्मर प्रोड्यूसर कंपनी',
    gu: 'દા.ત. મહુવા સૌરાષ્ટ્ર ફાર્મર પ્રોડ્યુસર કંપની',
    mr: 'उदा. महा एफपीसी शेतकरी उत्पादक कंपनी',
  },
  'farmSizeLabel': {
    en: 'Farm Size (in Acres)',
    hi: 'भूमि का आकार (एकड़ में)',
    gu: 'જમીન ધારણ / ખેતરનું ક્ષેત્રફળ (એકર)',
    mr: 'शेतीचे क्षेत्रफळ (एकर)',
  },
  'farmSizePlaceholder': {
    en: 'e.g. 8.5 Acres',
    hi: 'उदा. 8.5 एकड़',
    gu: 'દા.ત. 8.5 Acres',
    mr: 'उदा. ८.५ एकर',
  },
  'primaryCropsGrown': {
    en: 'Primary Crops Grown',
    hi: 'उगाई जाने वाली मुख्य फसलें',
    gu: 'ઉગાડાતા મુખ્ય પાક',
    mr: 'पिकवली जाणारी मुख्य पिके',
  },
  'storageAvailableLabel': {
    en: 'Storage / warehouse available on farm or nearby',
    hi: 'खेत पर या निकट गोदाम / भंडारण उपलब्ध है',
    gu: 'ખેતરે / નજીકમાં સંગ્રહ ગોડાઉન ઉપલબ્ધ છે',
    mr: 'शेतावर किंवा जवळ गोदाम / साठवणूक उपलब्ध आहे',
  },
  'requireTransportPoolingLabel': {
    en: 'Require shared transport / logistics pooling',
    hi: 'साझा परिवहन / लॉजिस्टिक्स पूलिंग की आवश्यकता है',
    gu: 'સહિયારા પરિવહનની જરૂરિયાત રહે છે',
    mr: 'सामायिक वाहतूक / पूलिंगची गरज आहे',
  },
  'companyBusinessName': {
    en: 'Company / Business Name',
    hi: 'कंपनी / व्यवसाय का नाम',
    gu: 'કંપની / પેઢીનું નામ',
    mr: 'कंपनी / व्यवसायाचे नाव',
  },
  'companyPlaceholder': {
    en: 'e.g. Balaji Agro Foods Ltd.',
    hi: 'उदा. बालाजी एग्रो फूड्स लिमिटेड',
    gu: 'દા.ત. બાલાજી વેફર્સ એન્ડ એગ્રો ફૂડ્સ લી.',
    mr: 'उदा. बालाजी ॲग्रो फूड्स लि.',
  },
  'buyerTypeLabel': {
    en: 'Buyer Category',
    hi: 'खरीदार श्रेणी',
    gu: 'ખરીદદાર કેટેગરી',
    mr: 'खरेदीदार प्रकार',
  },
  'foodProcessor': {
    en: 'Food Processor',
    hi: 'खाद्य प्रसंस्करण इकाई',
    gu: 'ફૂડ પ્રોસેસિંગ એકમ',
    mr: 'अन्न प्रक्रिया उद्योग',
  },
  'institutionalBuyer': {
    en: 'Institutional Buyer',
    hi: 'संस्थागत खरीदार',
    gu: 'સંસ્થાકીય ખરીદદાર',
    mr: 'संस्थात्मक खरेदीदार',
  },
  'agriExporter': {
    en: 'Agri Exporter',
    hi: 'कृषि निर्यातक',
    gu: 'કૃષિ નિકાસકાર',
    mr: 'कृषी निर्यातदार',
  },
  'retailChain': {
    en: 'Retail Chain / Supermarket',
    hi: 'खुदरा श्रृंखला / सुपरमार्केट',
    gu: 'રિટેલ ચેઇન / સુપરમાર્કેટ',
    mr: 'किरकोळ साखळी / सुपरमार्केट',
  },
  'bulkAggregator': {
    en: 'Bulk Aggregator / Trader',
    hi: 'थोक व्यापारी / एग्रीगेटर',
    gu: 'જથ્થાબંધ વેપારી / ટ્રેડર',
    mr: 'मोठा व्यापारी / खरेदीदार',
  },
  'gstNumberLabel': {
    en: 'GSTIN Number',
    hi: 'जीएसटी संख्या',
    gu: 'GSTIN નંબર',
    mr: 'जीएसटी क्रमांक',
  },
  'panNumberLabel': {
    en: 'Business PAN',
    hi: 'व्यावसायिक पैन',
    gu: 'PAN નંબર',
    mr: 'व्यवसाय पॅन',
  },
  'deliveryAddressLabel': {
    en: 'Delivery Warehouse / Factory Address',
    hi: 'डिलिवरी गोदाम / फैक्ट्री का पता',
    gu: 'ડિલિવરી ગોડાઉન / ફેક્ટરી સરનામું',
    mr: 'वितरण गोदाम / फॅक्टरी पत्ता',
  },
  'deliveryAddressPlaceholder': {
    en: 'Plot number, industrial estate, unloading point',
    hi: 'प्लाट नंबर, औद्योगिक क्षेत्र, अनलोडिंग बिंदु',
    gu: 'પ્લોટ નંબર, જીઆઇડીસી એસ્ટેટ, અનલોડિંગ પોઇન્ટ',
    mr: 'प्लॉट क्रमांक, एमआयडीसी, अनलोडिंग पॉइंट',
  },
  'procurementCommoditiesLabel': {
    en: 'Required Procurement Commodities',
    hi: 'नियमित खरीद के लिए आवश्यक फसलें',
    gu: 'નિયમિત ખરીદી માટે જરૂરી પાકો',
    mr: 'नियमित खरेदीसाठी आवश्यक शेतीमाल',
  },
  'secureEscrowNotice': {
    en: 'All deal payouts on KrushiSetu are settled directly into your verified bank account via secure nodal escrow clearing.',
    hi: 'कृषिसेतु पर सभी सौदों का भुगतान सुरक्षित नोडल एस्क्रो के माध्यम से सीधे आपके बैंक खाते में जमा किया जाता है।',
    gu: 'કૃષિસેતુ પ્લેટફોર્મ પર તમામ સોદાના નાણાં સીધા તમારા બેંક ખાતામાં સુરક્ષિત એસ્ક્રૉ ક્લિયરિંગ દ્વારા જમા થાય છે.',
    mr: 'कृषिसेतूवर सर्व सौद्यांचे पैसे थेट आपल्या बँक खात्यात सुरक्षित एस्क्रो क्लिअरिंगद्वारे जमा केले जातात.',
  },
  'secureEscrowNoticePrefix': {
    en: 'Secure Escrow & Direct Bank Account:',
    hi: 'सुरक्षित एस्क्रो एवं प्रत्यक्ष बैंक खाता:',
    gu: 'સુરક્ષિત એસ્ક્રૉ અને ડાયરેક્ટ બેંક એકાઉન્ટ:',
    mr: 'सुरक्षित एस्क्रो व थेट बँक खाते:',
  },
  'accountHolderNameLabel': {
    en: 'Account Holder Name',
    hi: 'खाताधारक का नाम',
    gu: 'બેંક ખાતાધારકનું નામ',
    mr: 'खातेदाराचे नाव',
  },
  'accountHolderNamePlaceholder': {
    en: 'e.g. Ramesh J Patel',
    hi: 'उदा. रमेश जे पटेल',
    gu: 'દા.ત. રમેશ જે પટેલ',
    mr: 'उदा. रमेश जे पाटील',
  },
  'bankAccountNumberLabel': {
    en: 'Bank Account Number',
    hi: 'बैंक खाता संख्या',
    gu: 'બેંક એકાઉન્ટ નંબર',
    mr: 'बँक खाते क्रमांक',
  },
  'bankIfscCodeLabel': {
    en: 'Bank IFSC Code',
    hi: 'बैंक आईएफएससी कोड',
    gu: 'IFSC કોડ',
    mr: 'बँक आयएफएससी कोड',
  },
  'upiIdLabel': {
    en: 'UPI ID / VPA (Optional)',
    hi: 'यूपीआई आईडी (वैकल्पिक)',
    gu: 'UPI ID (મરજિયાત)',
    mr: 'युपीआय आयडी (पर्यायी)',
  },
  'govtVerificationStatusLabel': {
    en: 'Government Verification Status:',
    hi: 'सरकारी सत्यापन स्थिति:',
    gu: 'સરકારી ચકાસણી સ્થિતિ:',
    mr: 'शासकीय पडताळणी स्थिती:',
  },
  'verificationBadgeDesc': {
    en: 'Submit your 7/12 Land Record or GST Certificate to receive a verified badge.',
    hi: 'सत्यापित बैज प्राप्त करने के लिए अपना 7/12 भू-अभिलेख या जीएसटी प्रमाणपत्र जमा करें।',
    gu: 'અધિકૃત 7/12 ઉતારો અથવા જીએસટી સર્ટિફિકેટ સબમિટ કરીને વેરિફાઈડ બેજ મેળવો.',
    mr: 'प्रमाणित बॅज मिळवण्यासाठी आपला ७/१२ उतारा किंवा जीएसटी प्रमाणपत्र सादर करा.',
  },
  'openVerificationPageBtn': {
    en: 'Open Verification Page →',
    hi: 'सत्यापन पृष्ठ खोलें →',
    gu: 'વેરિફિકેશન પેજ ખોલો →',
    mr: 'पडताळणी पृष्ठ उघडा →',
  },
  'identityDocTypeLabel': {
    en: 'Identity / Land Document Type',
    hi: 'पहचान / भूमि दस्तावेज़ प्रकार',
    gu: 'દસ્તાવેજ પ્રકાર',
    mr: 'ओळख / जमीन कागदपत्र प्रकार',
  },
  'identityDocNumberLabel': {
    en: 'Document / Survey Number',
    hi: 'दस्तावेज़ / सर्वे संख्या',
    gu: 'દસ્તાવેજ / સર્વે નંબર',
    mr: 'कागदपत्र / सर्व्हे क्रमांक',
  },
  'identityDocNumberPlaceholder': {
    en: 'e.g. SURVEY-42-MAHUVA',
    hi: 'उदा. SURVEY-42-MAHUVA',
    gu: 'દા.ત. SURVEY-42-MAHUVA',
    mr: 'उदा. SURVEY-42-PUNE',
  },
  'identityDocUrlLabel': {
    en: 'Document File URL / Link',
    hi: 'दस्तावेज़ फ़ाइल लिंक / यूआरएल',
    gu: 'દસ્તાવેજ ફાઇલ URL / લિંક',
    mr: 'कागदपत्र फाइल लिंक / यूआरएल',
  },
  'closeBtn': {
    en: 'Close',
    hi: 'बंद करें',
    gu: 'બંધ કરો',
    mr: 'बंद करा',
  },
  'saveProfileBtn': {
    en: 'Save Profile',
    hi: 'प्रोफ़ाइल सहेजें',
    gu: 'પ્રોફાઇલ સાચવો',
    mr: 'प्रोफाइल जतन करा',
  },
  'savingBtn': {
    en: 'Saving...',
    hi: 'सहेज रहे हैं...',
    gu: 'સાચવી રહ્યા છીએ...',
    mr: 'जतन करत आहे...',
  },

  // DealWorkspaceModal
  'sharedDealWorkspace': {
    en: 'Shared Deal Workspace',
    hi: 'साझा सौदा कार्यस्थल',
    gu: 'સોદા કાર્યસ્થળ',
    mr: 'सामायिक सौदा कार्यस्थळ',
  },
  'dealMilestonesTitle': {
    en: 'Deal Execution Milestones',
    hi: 'सौदा निष्पादन चरण',
    gu: 'સોદા ટ્રેકિંગ પ્રગતિ',
    mr: 'सौदा प्रगती टप्पे',
  },
  'farmerContactBadge': {
    en: 'Farmer Contact',
    hi: 'किसान संपर्क',
    gu: 'ખેડૂત સંપર્ક',
    mr: 'शेतकरी संपर्क',
  },
  'verifiedFarmerBadge': {
    en: 'Verified Farmer',
    hi: 'सत्यापित किसान',
    gu: 'વેરિફાઈડ ખેડૂત',
    mr: 'प्रमाणित शेतकरी',
  },
  'callFarmerBtn': {
    en: 'Call Farmer',
    hi: 'किसान को कॉल करें',
    gu: 'ખેડૂતને કૉલ કરો',
    mr: 'शेतकऱ्याला कॉल करा',
  },
  'buyerContactBadge': {
    en: 'Corporate Buyer',
    hi: 'कॉर्पोरेट खरीदार',
    gu: 'ખરીદદાર',
    mr: 'खरेदीदार',
  },
  'escrowProtectedBadge': {
    en: 'Escrow Protected',
    hi: 'एस्क्रो सुरक्षित',
    gu: 'એસ્ક્રૉ પ્રોટેક્ટેડ',
    mr: 'एस्क्रो सुरक्षित',
  },
  'callBuyerBtn': {
    en: 'Call Buyer',
    hi: 'खरीदार को कॉल करें',
    gu: 'ખરીદદારને કૉલ કરો',
    mr: 'खरेदीदाराला कॉल करा',
  },
  'dealValueSummaryTitle': {
    en: 'Deal Value & Produce Details',
    hi: 'सौदा मूल्य एवं उत्पाद विवरण',
    gu: 'સોદાની કિંમત અને માલ વિગતો',
    mr: 'सौदा मूल्य व माल तपशील',
  },
  'cropVarietyLabel': {
    en: 'Crop / Variety',
    hi: 'फसल / किस्म',
    gu: 'પાક / જાત',
    mr: 'पीक / वाण',
  },
  'agreedQuantityLabel': {
    en: 'Agreed Quantity',
    hi: 'सहमति मात्रा',
    gu: 'નક્કી થયેલ જથ્થો',
    mr: 'निश्चित प्रमाण',
  },
  'agreedPriceLabel': {
    en: 'Agreed Price',
    hi: 'स्वीकृत मूल्य',
    gu: 'મંજૂર ભાવ',
    mr: 'मान्य भाव',
  },
  'totalDealAmountLabel': {
    en: 'Total Deal Amount',
    hi: 'कुल सौदा राशि',
    gu: 'કુલ સોદા રકમ',
    mr: 'एकूण सौदा रक्कम',
  },
  'transportLogisticsTitle': {
    en: 'Transport & Logistics Coordination',
    hi: 'परिवहन एवं लॉजिस्टिक्स समन्वय',
    gu: 'વાહન અને પરિવહન વ્યવસ્થા',
    mr: 'वाहतूक व लॉजिस्टिक्स व्यवस्था',
  },
  'assignVehicleBtn': {
    en: '+ Assign Vehicle',
    hi: '+ वाहन आवंटित करें',
    gu: '+ વાહન ફાળવો',
    mr: '+ वाहन जोडा',
  },
  'changeVehicleBtn': {
    en: 'Change Transport Details',
    hi: 'वाहन विवरण बदलें',
    gu: 'વાહન વિગત બદલો',
    mr: 'वाहन तपशील बदला',
  },
  'cancelBtn': {
    en: 'Cancel',
    hi: 'रद्द करें',
    gu: 'રદ કરો',
    mr: 'रद्द करा',
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
    mr: 'चालकाचा मोबाईल',
  },
  'vehicleNumberLabel': {
    en: 'Vehicle Number',
    hi: 'वाहन संख्या',
    gu: 'વાહન નંબર',
    mr: 'वाहन क्रमांक',
  },
  'estimatedFreightLabel': {
    en: 'Estimated Freight (₹)',
    hi: 'अनुमानित भाड़ा (₹)',
    gu: 'અંદાજિત ભાડું (₹)',
    mr: 'अंदाजे भाडे (₹)',
  },
  'saveTransportBtn': {
    en: 'Save Transport Details',
    hi: 'वाहन विवरण सहेजें',
    gu: 'વાહન કન્ફર્મ કરો',
    mr: 'वाहन तपशील जतन करा',
  },
  'noTransportYet': {
    en: "Transport details not added yet. Click 'Assign Vehicle'.",
    hi: "वाहन विवरण अभी तक नहीं जोड़ा गया है। 'वाहन आवंटित करें' पर क्लिक करें।",
    gu: "વાહનની વિગત હજુ ઉમેરાયેલ નથી. 'વાહન ફાળવો' પર ક્લિક કરો.",
    mr: "वाहन तपशील अद्याप जोडलेला नाही. 'वाहन जोडा' वर क्लिक करा.",
  },
  'driverContact': {
    en: 'Driver Contact',
    hi: 'चालक संपर्क',
    gu: 'ડ્રાઈવર સંપર્ક',
    mr: 'चालक संपर्क',
  },
  'transportCost': {
    en: 'Transport Cost',
    hi: 'परिवहन खर्च',
    gu: 'ટ્રાન્સપોર્ટ ખર્ચ',
    mr: 'वाहतूक खर्च',
  },
  'assigned': {
    en: 'Assigned',
    hi: 'आवंटित',
    gu: 'ફાળવેલ',
    mr: 'वाटप झाले',
  },
  'milestoneActionsTitle': {
    en: 'Progress Deal Milestones',
    hi: 'सौदा प्रगति क्रियाएं',
    gu: 'સ્ટેટસ અપડેટ ક્રિયાઓ',
    mr: 'सौदा प्रगती कृती',
  },
  'schedulePickupBtn': {
    en: 'Schedule Pickup',
    hi: 'पिकअप शेड्यूल करें',
    gu: 'પિકઅપ શિડ્યુલ કરો',
    mr: 'पिकअप निश्चित करा',
  },
  'productCollectedBtn': {
    en: 'Product Collected',
    hi: 'माल लोड हुआ',
    gu: 'માલ લોડ થયો',
    mr: 'माल भरला गेला',
  },
  'inTransitBtn': {
    en: 'Dispatched (In Transit)',
    hi: 'रवाना हुआ (मार्गस्थ)',
    gu: 'રવાના થયું (In Transit)',
    mr: 'मार्गस्थ (रवाना झाले)',
  },
  'deliveredBtn': {
    en: 'Delivered',
    hi: 'पहुंच गया',
    gu: 'પહોંચી ગયું',
    mr: 'पोहोचले',
  },
  'completeAndReleaseEscrowBtn': {
    en: 'Complete Deal & Release Escrow',
    hi: 'सौदा पूर्ण करें एवं एस्क्रो जारी करें',
    gu: 'સોદો પૂર્ણ કરો અને એસ્ક્રૉ રિલીઝ કરો',
    mr: 'सौदा पूर्ण करा आणि एस्क्रो जमा करा',
  },
  'dealCompletedNotice': {
    en: 'Deal successfully completed. Escrow funds have been credited to the seller account.',
    hi: 'सौदा सफलतापूर्वक पूरा हुआ। एस्क्रो राशि विक्रेता के खाते में जमा कर दी गई है।',
    gu: 'સોદો સફળતાપૂર્વક પૂર્ણ થયેલ છે. એસ્ક્રૉ ખાતામાંથી રકમ જમા થઈ ગઈ છે.',
    mr: 'सौदा यशस्वीरीत्या पूर्ण झाला. एस्क्रो रक्कम विक्रेत्याच्या खात्यात जमा झाली आहे.',
  },
  'rateFarmerTitle': {
    en: 'Rate and Review Farmer',
    hi: 'किसान को रेटिंग व समीक्षा दें',
    gu: 'ખેડૂતને રેટિંગ અને ફીડબેક આપો',
    mr: 'शेतकऱ्याला रेटिंग आणि अभिप्राय द्या',
  },
  'rateBuyerTitle': {
    en: 'Rate and Review Buyer',
    hi: 'खरीदार को रेटिंग व समीक्षा दें',
    gu: 'ખરીદદારને રેટિંગ અને ફીડબેક આપો',
    mr: 'खरेदीदाराला रेटिंग आणि अभिप्राय द्या',
  },
  'ratingFeedbackPlaceholder': {
    en: 'Write about your experience (e.g. prompt payment, excellent produce)...',
    hi: 'अपने अनुभव के बारे में लिखें (उदा. समय पर भुगतान, उत्कृष्ट उपज)...',
    gu: 'અનુભવ વિશે લખો (દા.ત. સમયસર પેમેન્ટ, ઉત્તમ માલ)...',
    mr: 'आपला अनुभव लिहा (उदा. वेळेवर पैसे, उत्कृष्ट शेतमाल)...',
  },
  'submitRatingBtn': {
    en: 'Submit Rating',
    hi: 'रेटिंग जमा करें',
    gu: 'રેટિંગ સબમિટ કરો',
    mr: 'रेटिंग सादर करा',
  },
  'ratingSubmittedAlert': {
    en: 'Rating and feedback submitted successfully!',
    hi: 'रेटिंग और समीक्षा सफलतापूर्वक भेजी गई!',
    gu: 'રેટિંગ અને ફીડબેક સફળતાપૂર્વક સબમિટ થયું!',
    mr: 'रेटिंग व अभिप्राय यशस्वीरीत्या सादर झाला!',
  },
  'supportHelpline': {
    en: 'Support Toll-Free Helpline',
    hi: 'सहायता टोल-फ्री हेल्पलाइन',
    gu: 'સહાયતા માટે હેલ્પલાઈન',
    mr: 'मदत टोल-फ्री हेल्पलाइन',
  },

  // FarmerDashboard
  'dealsTrackingEscrow': {
    en: 'Deals & Payment Escrow Tracking',
    hi: 'सौदा एवं भुगतान एस्क्रो ट्रैकिंग',
    gu: 'સોદા અને ચૂકવણી એસ્ક્રૉ ટ્રેકિંગ',
    mr: 'सौदा आणि पेमेंट एस्क्रो ट्रॅकिंग',
  },
  'guaranteedEscrow': {
    en: '100% Guaranteed Escrow',
    hi: '१००% गारंटीकृत एस्क्रो',
    gu: '૧૦૦% ગેરેન્ટેડ એસ્ક્રૉ',
    mr: '१००% हमीयुक्त एस्क्रो',
  },
  'dealsTrackingSub': {
    en: "Track each order's real-time transit location and milestone-by-milestone payment clearance into your bank account.",
    hi: 'प्रत्येक ऑर्डर के वास्तविक समय पारगमन स्थान और चरणबद्ध बैंक भुगतान निकासी को ट्रैक करें।',
    gu: 'દરેક ઓર્ડરના પરિવહનનું સ્થળ અને તબક્કાવાર બેંક પેમેન્ટ ક્લિયરન્સ ટ્રેક કરો.',
    mr: 'प्रत्येक ऑर्डरचे थेट वाहतूक स्थान आणि टप्प्याटप्प्याने बँक खात्यात होणारे पेमेंट तपासा.',
  },
  'totalActivePayouts': {
    en: 'Total Active Payouts',
    hi: 'कुल सक्रिय भुगतान',
    gu: 'કુલ સક્રિય ચૂકવણી',
    mr: 'एकूण सक्रिय पेआउट',
  },
  'buyerLabel': {
    en: 'Buyer',
    hi: 'खरीदार',
    gu: 'ખરીદદાર',
    mr: 'खरेदीदार',
  },
  'pickupLabel': {
    en: 'Pickup',
    hi: 'पिकअप',
    gu: 'પિકઅપ',
    mr: 'पिकअप',
  },
  'escrowTimelineTitle': {
    en: 'Transparent Escrow Payment Timeline',
    hi: 'पारदर्शी एस्क्रो भुगतान समयरेखा',
    gu: 'પારદર્શક એસ્ક્રૉ પેમેન્ટ સમયરેખા',
    mr: 'पारदर्शक एस्क्रो पेमेंट टाइमलाइन',
  },
  'bankAccountLabel': {
    en: 'Bank Account',
    hi: 'बैंक खाता',
    gu: 'બેંક એકાઉન્ટ',
    mr: 'बँक खाते',
  },
  'advanceEscrow': {
    en: 'Advance Escrow',
    hi: 'अग्रिम एस्क्रो',
    gu: 'એડવાન્સ એસ્ક્રૉ',
    mr: 'आगाऊ एस्क्रो',
  },
  'lockedInNodalEscrow': {
    en: '✓ Locked in Nodal Escrow',
    hi: '✓ नोडल एस्क्रो में सुरक्षित',
    gu: '✓ નોડલ એસ્ક્રૉમાં સુરક્ષિત',
    mr: '✓ नोडल एस्क्रोमध्ये जमा',
  },
  'weighmentDispatch': {
    en: 'Weighment & Dispatch',
    hi: 'वजन एवं प्रेषण',
    gu: 'વજન અને રવાનગી',
    mr: 'वजन आणि डिस्पॅच',
  },
  'weighmentSlipApproved': {
    en: '✓ Weighment Slip Approved',
    hi: '✓ वजन पर्ची स्वीकृत',
    gu: '✓ વજન સ્લિપ માન્ય',
    mr: '✓ वजन पावती मंजूर',
  },
  'readyForPickup': {
    en: '⏳ Ready for Farm-Gate Pickup',
    hi: '⏳ फार्म-गेट पिकअप के लिए तैयार',
    gu: '⏳ ફાર્મ-ગેટ પિકઅપ માટે તૈયાર',
    mr: '⏳ शेतावरून पिकअपसाठी सज्ज',
  },
  'qualityCheck': {
    en: 'Assay & Quality Check',
    hi: 'गुणवत्ता परीक्षण एवं जांच',
    gu: 'ગુણવત્તા અને ચકાસણી',
    mr: 'गुणवत्ता चाचणी व तपासणी',
  },
  'moisturePassed': {
    en: '✓ Moisture ≤ 10% Passed',
    hi: '✓ नमी ≤ 10% उत्तीर्ण',
    gu: '✓ ભેજ ≤ ૧૦% પાસ',
    mr: '✓ आर्द्रता ≤ १०% उत्तीर्ण',
  },
  'inTransitToHub': {
    en: 'In Transit to Buyer Hub',
    hi: 'खरीदार हब के रास्ते में',
    gu: 'ખરીદદાર હબ તરફ રવાના',
    mr: 'खरेदीदार हबकडे मार्गस्थ',
  },
  'directBankCredit': {
    en: 'Direct Bank Credit',
    hi: 'सीधा बैंक जमा',
    gu: 'સીધું બેંકમાં જમા',
    mr: 'थेट बँक खात्यात जमा',
  },
  'clearedViaRtgs': {
    en: '✓ 100% Cleared via RTGS',
    hi: '✓ RTGS द्वारा १००% भुगतान',
    gu: '✓ RTGS દ્વારા ૧૦૦% ચૂકવણું',
    mr: '✓ RTGS द्वारे १००% जमा',
  },
  'releaseOnGateScan': {
    en: 'Instant Release on Gate Scan',
    hi: 'गेट स्कैन पर त्वरित भुगतान',
    gu: 'ગેટ સ્કેન થતાં ત્વરિત રકમ જમા',
    mr: 'गेट स्कॅन होताच तत्काळ जमा',
  },
  'liveTransit': {
    en: 'Live Transit:',
    hi: 'लाइव परिवहन:',
    gu: 'લાઇવ પરિવહન:',
    mr: 'थेट वाहतूक:',
  },
  'zeroDefaultEscrowGuarantee': {
    en: 'Backed by MSAMB Zero-Default Escrow Guarantee',
    hi: 'MSAMB शून्य-डिफ़ॉल्ट एस्क्रो गारंटी द्वारा समर्थित',
    gu: 'MSAMB શૂન્ય-ડિફોલ્ટ એસ્ક્રૉ ગેરંટી સાથે સુરક્ષિત',
    mr: 'पणन मंडळ शून्य-डिफॉल्ट एस्क्रो हमीने सुरक्षित',
  },

  // ProduceLotCreationModal
  'addNewCrop': {
    en: 'Add New Crop',
    hi: 'नई फसल जोड़ें',
    gu: 'નવો પાક ઉમેરો',
    mr: 'नवीन पीक जोडा',
  },
  'cropNotInDirectory': {
    en: '"{crop}" is not in the directory. Add this crop.',
    hi: '"{crop}" सूची में नहीं है। यह फसल जोड़ें।',
    gu: '"{crop}" યાદીમાં નથી. આ પાક ઉમેરો.',
    mr: '"{crop}" सूचीमध्ये उपलब्ध नाही. हे पीक जोडा.',
  },
  'cropNotInDirectoryDesc': {
    en: "You don't need to select another crop. Complete the new-crop registration and start creating your listing immediately.",
    hi: 'आपको दूसरी फसल चुनने की आवश्यकता नहीं है। नई फसल पंजीकरण पूरा करें और तुरंत अपनी लिस्टिंग बनाएं।',
    gu: 'તમારે અન્ય પાક પસંદ કરવાની જરૂર નથી. નવા પાકની નોંધણી પૂર્ણ કરો અને તરત જ લિસ્ટિંગ બનાવો.',
    mr: 'आपल्याला दुसरे पीक निवडण्याची गरज नाही. नवीन पीक नोंदणी पूर्ण करून त्वरित विक्री नोंदणी करा.',
  },
  'registerCropNow': {
    en: 'Register "{crop}" Now',
    hi: '"{crop}" को अभी पंजीकृत करें',
    gu: '"{crop}" હવે રજીસ્ટર કરો',
    mr: '"{crop}" आता नोंदणी करा',
  },
  'pendingReviewBadge': {
    en: 'Pending Review',
    hi: 'समीक्षाधीन',
    gu: 'સમીક્ષા હેઠળ',
    mr: 'तपासणी सुरू',
  },
  'mandiAvgPrice': {
    en: 'Mandi Avg',
    hi: 'मंडी औसत',
    gu: 'મંડી સરેરાશ',
    mr: 'बाजार सरासरी',
  },
  'pendingCropApproval': {
    en: 'Pending crop approval',
    hi: 'फसल अनुमोदन लंबित',
    gu: 'પાક મંજૂરી બાકી',
    mr: 'पीक मंजुरी प्रलंबित',
  },
};

const filePath = path.join(__dirname, '..', 'src', 'i18n', 'translations.ts');
let fileContent = fs.readFileSync(filePath, 'utf8');

const languages = ['en', 'hi', 'gu', 'mr'];

for (const lang of languages) {
  let closingIndex = -1;
  if (lang === 'en') {
    const match = fileContent.match(/\n\s*},\s*\n\s*hi:\s*\{/);
    closingIndex = match ? match.index : -1;
  } else if (lang === 'hi') {
    const match = fileContent.match(/\n\s*},\s*\n\s*gu:\s*\{/);
    closingIndex = match ? match.index : -1;
  } else if (lang === 'gu') {
    const match = fileContent.match(/\n\s*},\s*\n\s*mr:\s*\{/);
    closingIndex = match ? match.index : -1;
  } else if (lang === 'mr') {
    const match = fileContent.match(/\n\s*}\s*\n};/);
    closingIndex = match ? match.index : -1;
  }

  if (closingIndex === -1) {
    console.error(`Could not find closing bracket for language: ${lang}`);
    process.exit(1);
  }

  // Find start of this language block
  const langHeader = `${lang}: {`;
  const langStartIndex = fileContent.lastIndexOf(langHeader, closingIndex);
  if (langStartIndex === -1) {
    console.error(`Could not find start for language: ${lang}`);
    process.exit(1);
  }

  const langSection = fileContent.substring(langStartIndex, closingIndex);

  let injection = '';
  for (const [key, trans] of Object.entries(allNewTranslations)) {
    const keyPattern = new RegExp(`'${key}':\\s*`);
    if (!keyPattern.test(langSection)) {
      const val = (trans[lang] || trans['en']).replace(/'/g, "\\'");
      injection += `    '${key}': '${val}',\n`;
    }
  }

  if (injection) {
    fileContent = fileContent.slice(0, closingIndex) + '\n' + injection + fileContent.slice(closingIndex);
  }
}

fs.writeFileSync(filePath, fileContent, 'utf8');
console.log('Successfully injected all missing translations into src/i18n/translations.ts!');
