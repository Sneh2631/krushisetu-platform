const fs = require('fs');
const path = require('path');

const newTranslations = {
  // UserProfileModal titles & labels
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
  'companyBusinessName': {
    en: 'Company / Business Name',
    hi: 'कंपनी / व्यवसाय का नाम',
    gu: 'કંપની / પેઢીનું નામ',
    mr: 'कंपनी / व्यवसायाचे नाव',
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
  'identityDocTypeLabel': {
    en: 'Identity / Land Document Type',
    hi: 'पहचान / भूमि दस्तावेज़ का प्रकार',
    gu: 'દસ્તાવેજ પ્રકાર',
    mr: 'ओळख / जमीन कागदपत्राचा प्रकार',
  },
  'identityDocNumberLabel': {
    en: 'Document / Survey Number',
    hi: 'दस्तावेज़ / सर्वे संख्या',
    gu: 'દસ્તાવેજ / સર્વે નંબર',
    mr: 'कागदपत्र / सर्व्हे क्रमांक',
  },
  'identityDocUrlLabel': {
    en: 'Document File URL / Link',
    hi: 'दस्तावेज़ फ़ाइल लिंक',
    gu: 'દસ્તાવેજ ફાઇલ URL / લિંક',
    mr: 'कागदपत्र फाइल लिंक',
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
    en: 'Estimated Freight',
    hi: 'अनुमानित भाड़ा',
    gu: 'અંદાજિત ભાડું',
    mr: 'अंदाजे भाडे',
  },
  'saveTransportBtn': {
    en: 'Save Transport',
    hi: 'वाहन सहेजें',
    gu: 'વાહન કન્ફર્મ કરો',
    mr: 'वाहन जतन करा',
  },
  'noTransportYet': {
    en: "Transport details not added yet. Click 'Assign Vehicle'.",
    hi: "वाहन विवरण अभी तक नहीं जोड़ा गया है। 'वाहन आवंटित करें' पर क्लिक करें।",
    gu: "વાહનની વિગત હજુ ઉમેરાયેલ નથી. 'વાહન ફાળવો' પર ક્લિક કરો.",
    mr: "वाहन तपशील अद्याप जोडलेला नाही. 'वाहन जोडा' वर क्लिक करा.",
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
    hi: 'रवाना हुआ',
    gu: 'રવાના થયું (In Transit)',
    mr: 'रवाना झाले',
  },
  'deliveredBtn': {
    en: 'Delivered',
    hi: 'पहुंच गया',
    gu: 'પહોંચી ગયું',
    mr: 'पोहोचले',
  },
  'completeAndReleaseEscrowBtn': {
    en: 'Complete & Release Escrow',
    hi: 'सौदा पूर्ण करें एवं एस्क्रो जारी करें',
    gu: 'સોદો પૂર્ણ કરો અને એસ્ક્રૉ રિલીઝ કરો',
    mr: 'सौदा पूर्ण करा आणि एस्क्रो जमा करा',
  },
  'dealCompletedNotice': {
    en: 'Deal successfully completed. Payment settled from escrow account.',
    hi: 'सौदा सफलतापूर्वक पूरा हुआ। एस्क्रो खाते से भुगतान हो गया।',
    gu: 'સોદો સફળતાપૂર્વક પૂર્ણ થયેલ છે. એસ્ક્રૉ ખાતામાંથી રકમ જમા થઈ ગઈ છે.',
    mr: 'सौदा यशस्वीरीत्या पूर्ण झाला. एस्क्रो खात्यातून रक्कम जमा झाली.',
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
    hi: 'रेटिंग भेजें',
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
    en: 'Support Helpline',
    hi: 'सहायता हेल्पलाइन',
    gu: 'સહાયતા માટે હેલ્પલાઈન',
    mr: 'मदत हेल्पलाइन',
  },
  'cancelBtn': {
    en: 'Cancel',
    hi: 'रद्द करें',
    gu: 'રદ કરો',
    mr: 'रद्द करा',
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
  'tabDealsTracking': {
    en: 'Deals & Payment Escrow Tracking',
    hi: 'सौदा एवं भुगतान एस्क्रो ट्रैकिंग',
    gu: 'સોદા અને ચૂકવણી એસ્ક્રૉ ટ્રેકિંગ',
    mr: 'सौदा आणि पेमेंट एस्क्रो ट्रॅकिंग',
  },
  'vehicleOptionPickup': {
    en: 'Pickup Truck (1.5T)',
    hi: 'पिकअप (1.5T)',
    gu: 'બોલેરો પિકઅપ (1.5T)',
    mr: 'पिकअप (१.५ टन)',
  },
  'vehicleOptionEicher': {
    en: 'Eicher Truck (4T)',
    hi: 'आयशर ट्रक (4T)',
    gu: 'આઈશર ટ્રક (4T)',
    mr: 'आयशर ट्रक (४ टन)',
  },
  'vehicleOptionHeavy': {
    en: 'Heavy Truck (10T)',
    hi: 'भारी ट्रक (10T)',
    gu: 'હેવી ટ્રક (10T)',
    mr: 'मोठा ट्रक (१० टन)',
  },
  'vehicleOptionCold': {
    en: 'Cold Van (3T Refrigerated)',
    hi: 'कोल्ड वैन (3T प्रशीतित)',
    gu: 'કોલ્ડ વેન (3T Refrigerated)',
    mr: 'शीत व्हॅन (३ टन वातानुकूलित)',
  },
};

const filePath = path.join(__dirname, '..', 'src', 'i18n', 'translations.ts');
let fileContent = fs.readFileSync(filePath, 'utf8');

const languages = ['en', 'hi', 'gu', 'mr'];

for (const lang of languages) {
  let closingIndex = -1;
  if (lang === 'en') {
    closingIndex = fileContent.indexOf('\n  },\n  hi: {');
  } else if (lang === 'hi') {
    closingIndex = fileContent.indexOf('\n  },\n  gu: {');
  } else if (lang === 'gu') {
    closingIndex = fileContent.indexOf('\n  },\n  mr: {');
  } else if (lang === 'mr') {
    closingIndex = fileContent.lastIndexOf('\n  },');
  }

  if (closingIndex === -1) {
    console.error(`Could not find closing bracket for language: ${lang}`);
    process.exit(1);
  }

  let injection = '';
  for (const [key, trans] of Object.entries(newTranslations)) {
    // Only inject if key doesn't exist for this language
    const keyPattern = new RegExp(`'${key}':\\s*`);
    // Check in the section
    const sub = fileContent.substring(0, closingIndex);
    const langStart = sub.lastIndexOf(`${lang}: {`);
    const langSection = fileContent.substring(langStart, closingIndex);

    if (!keyPattern.test(langSection)) {
      const val = trans[lang].replace(/'/g, "\\'");
      injection += `    '${key}': '${val}',\n`;
    }
  }

  fileContent = fileContent.slice(0, closingIndex) + '\n' + injection + fileContent.slice(closingIndex);
}

fs.writeFileSync(filePath, fileContent, 'utf8');
console.log('Successfully injected additional translations for en, hi, gu, mr!');
