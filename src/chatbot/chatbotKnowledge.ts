import type { Language } from '../types';
import type { ChatbotIntentType } from './chatbotIntents';

export interface ChatbotAction {
  label: string;
  sectionId?: string;
  modalTrigger?: 'createLot' | 'help' | 'demoTour';
}

export interface ChatbotResponseItem {
  message: string;
  steps?: string[];
  action?: ChatbotAction;
  suggestions?: string[];
}

export const CHATBOT_NAME: Record<Language, string> = {
  en: 'KrishiSahayak',
  hi: 'कृषि सहायक',
  gu: 'કૃષિ સહાયક',
  mr: 'कृषी सहाय्यक',
};

export const CHATBOT_WELCOME: Record<Language, ChatbotResponseItem> = {
  en: {
    message: 'Namaste! I am KrishiSahayak. I can help you check prices, sell produce, find buyers, arrange transport and track payments. What would you like help with?',
    suggestions: [
      'Show today\'s prices',
      'How do I sell my produce?',
      'How do I find a buyer?',
      'How is final payout calculated?',
      'I need help with transport',
      'How do I track payment?',
    ],
  },
  hi: {
    message: 'नमस्ते! मैं कृषि सहायक हूँ। मैं आपको भाव देखने, उपज बेचने, खरीदार खोजने, परिवहन की व्यवस्था करने और भुगतान की स्थिति जानने में सहायता कर सकता हूँ। आपको किस काम में सहायता चाहिए?',
    suggestions: [
      'आज के भाव दिखाएँ',
      'मैं अपनी उपज कैसे बेचूँ?',
      'खरीदार कैसे खोजें?',
      'अंतिम भुगतान की गणना कैसे होती है?',
      'मुझे परिवहन में सहायता चाहिए',
      'भुगतान की स्थिति कैसे देखें?',
    ],
  },
  gu: {
    message: 'નમસ્તે! હું કૃષિ સહાયક છું. હું તમને ભાવ જોવા, ઉપજ વેચવા, ખરીદદાર શોધવા, પરિવહનની વ્યવસ્થા કરવા અને ચુકવણીની સ્થિતિ જાણવા મદદ કરી શકું છું. તમને કયા કામમાં મદદ જોઈએ?',
    suggestions: [
      'આજના ભાવ બતાવો',
      'હું મારી ઉપજ કેવી રીતે વેચું?',
      'ખરીદદાર કેવી રીતે શોધવો?',
      'અંતિમ ચુકવણીની ગણતરી કેવી રીતે થાય છે?',
      'મને પરિવહનમાં મદદ જોઈએ',
      'ચુકવણીની સ્થિતિ કેવી રીતે જોવી?',
    ],
  },
  mr: {
    message: 'नमस्कार! मी कृषी सहाय्यक आहे. मी तुम्हाला बाजारभाव पाहण्यास, शेतमाल विकण्यास, खरेदीदार शोधण्यास, वाहतुकीची व्यवस्था करण्यास आणि पेमेंट तपासण्यास मदत करू शकतो. आपल्याला कशात साहाय्य हवे आहे?',
    suggestions: [
      'आजचे बाजारभाव दाखवा',
      'मी माझी शेतीमाल कसा विकू?',
      'खरेदीदार कसे शोधायचे?',
      'अंतिम पेमेंटचा हिशोब कसा होतो?',
      'मला वाहतुकीसाठी मदत हवी आहे',
      'पेमेंटची स्थिती कशी तपासायची?',
    ],
  },
};

export const CHATBOT_KNOWLEDGE: Record<Language, Record<ChatbotIntentType, ChatbotResponseItem>> = {
  en: {
    welcome: {
      message: 'Hello! How can I assist you with your farming and marketing today?',
      suggestions: ['Show today\'s prices', 'How do I sell my produce?', 'Find verified buyers'],
    },
    sell_produce: {
      message: 'Here is the easy 6-step flow to sell your harvest on KrushiSetu:',
      steps: [
        'Step 1: Click "List Harvest Lot" button below.',
        'Step 2: Choose your crop and variety.',
        'Step 3: Enter quantity in kilograms or tonnes.',
        'Step 4: Add harvest date and quality grade.',
        'Step 5: Select transport requirement & review estimated net payout.',
        'Step 6: Publish lot to receive direct corporate bids.',
      ],
      action: {
        label: 'Start Selling Produce →',
        modalTrigger: 'createLot',
      },
      suggestions: ['How is final payout calculated?', 'Show today\'s prices', 'I need help with transport'],
    },
    check_prices: {
      message: 'You can compare live prices across APMC Mandis, Food Processors, and Institutional Buyers in Gujarat with transparent deductions.',
      steps: [
        'Select your crop (e.g. Potato, Onion, Kesar Mango, Cumin, Fennel).',
        'Compare gross price vs mandi cess vs transport charges.',
        'Choose the channel with the green "Best Value" indicator for highest bank credit.',
      ],
      action: {
        label: 'Open Price Comparison Matrix →',
        sectionId: 'price-discovery',
      },
      suggestions: ['How do I sell my produce?', 'How is final payout calculated?', 'Find verified buyers'],
    },
    find_buyers: {
      message: 'KrushiSetu connects you directly with state-vetted corporate processors like Balaji Wafers, Jivraj Agro, and Adani Wilmar.',
      steps: [
        'Browse institutional procurement demands.',
        'Review quality specifications and delivery terms.',
        'Lock contract with 100% state escrow guarantee.',
      ],
      action: {
        label: 'Browse Verified Buyers →',
        sectionId: 'marketplace',
      },
      suggestions: ['How do I sell my produce?', 'How do I track payment?', 'Show today\'s prices'],
    },
    counter_offer: {
      message: 'When a buyer makes an offer that seems low, you can negotiate with a counter-offer directly in the Deal Workspace.',
      steps: [
        'Step 1: Open the specific deal from your Active Deals list.',
        'Step 2: Review the buyer\'s current offer price per kg.',
        'Step 3: Click "Counter Offer" and enter your desired higher price.',
        'Step 4: The system shows you the revised net payout instantly.',
        'Step 5: Submit counter-offer; buyer receives instant notification.',
        'Tip: Counter-offers are common and professional. Aim within 8-12% above buyer\'s offer for best acceptance rates.',
      ],
      suggestions: ['How do I sell my produce?', 'How is final payout calculated?', 'Show today\'s prices'],
    },
    registration_login: {
      message: 'To use KrushiSetu, you need a verified mobile number. Here\'s how to register or log in:',
      steps: [
        'Registration: Click "Register as Farmer" or "Register as Buyer", enter your mobile number, verify the 6-digit OTP, and complete your profile with your name and district.',
        'Login: Click "Login", enter the same mobile number you registered with, verify OTP, and you\'re in!',
        'Switching Role: If you registered as Farmer but need Buyer access (or vice versa), you must use a different mobile number. One number = One role.',
        'Forgot which number? Try the number you used during registration. The system will recognize you.',
      ],
      suggestions: ['How do I sell my produce?', 'Find verified buyers', 'Show today\'s prices'],
    },
    agronomy_disease: {
      message: 'For crop health, disease diagnosis, and fertilizer advice, I recommend these trusted resources:',
      steps: [
        '1. Kisan Call Center (KCC): Dial 1800-180-1551 for free expert agronomy advice in Hindi, Gujarati, or Marathi.',
        '2. KrishiSetu Gemini AI: If you have a Gemini API key configured, I can answer specific agronomy questions directly.',
        '3. District Agricultural Officer: Visit your nearest Krishi Vigyan Kendra (KVK) for soil testing and pest identification.',
        'Common Issues: Yellow leaves often indicate nitrogen deficiency (apply urea). Brown spots may be fungal (spray copper-based fungicide).',
      ],
      suggestions: ['Show today\'s prices', 'How do I sell my produce?', 'Government schemes and subsidies'],
    },
    schemes_subsidies: {
      message: 'Here are the major government schemes for farmers in Maharashtra and Gujarat:',
      steps: [
        'PM-Kisan: ₹6,000/year direct benefit transfer (DBT) in 3 installments. Check eligibility at pmkisan.gov.in.',
        'Namo Shetkari Mahasanman Nidhi (Maharashtra): Additional ₹6,000/year for farmers with land up to 5 acres.',
        'Pradhan Mantri Fasal Bima Yojana (PMFBY): Crop insurance covering natural calamities. Premium: 2% for Kharif, 1.5% for Rabi.',
        'Kusum Solar Pump Subsidy: 90% subsidy on solar pumps (60% central + 30% state). Apply via your district agriculture office.',
        'MahaDBT Portal: Register at mahadbt.maharashtra.gov.in for direct subsidy tracking and application.',
      ],
      action: {
        label: 'Learn More About Schemes →',
        sectionId: 'news',
      },
      suggestions: ['How do I sell my produce?', 'Crop disease and fertilizer advice', 'Show today\'s prices'],
    },
    net_payout: {
      message: 'Net payout is the actual money deposited into your bank account after all deductions.',
      steps: [
        'Gross Offer: The headline price per kg offered by the buyer.',
        'Minus Mandi Cess: Exempt (₹0) when selling directly on KrushiSetu.',
        'Minus Handling Fee: Small loading/unloading cost.',
        'Minus Pooled Transport: Low shared vehicle freight rate.',
        'Equals Final Bank Credit: Highest cash in your pocket with zero middleman brokerage.',
      ],
      action: {
        label: 'Compare Net Payouts Now →',
        sectionId: 'price-discovery',
      },
      suggestions: ['Show today\'s prices', 'I need help with transport', 'How do I sell my produce?'],
    },
    transport: {
      message: 'Our dynamic farm-gate pooling consolidates small loads from nearby farms along the same highway, saving up to 57% on freight.',
      steps: [
        'No need to book an entire vehicle alone.',
        'Your crop is picked up right at your village gate.',
        'Track live vehicle GPS route and estimated arrival.',
      ],
      action: {
        label: 'View Pooled Route Logistics →',
        sectionId: 'logistics',
      },
      suggestions: ['How do I sell my produce?', 'How do I track payment?', 'Store in cold storage'],
    },
    storage: {
      message: 'Avoid distress selling during peak harvest gluts by holding your produce in WDRA-accredited cold storages across Gujarat.',
      steps: [
        'Use our Sell Today vs Store calculator.',
        'Evaluate projected price rise over 3 to 7 days.',
        'Ensure net profit exceeds the small daily storage fee.',
      ],
      action: {
        label: 'Open Storage Decision Advisor →',
        sectionId: 'storage',
      },
      suggestions: ['Show today\'s prices', 'I need help with transport', 'How do I sell my produce?'],
    },
    payment_escrow: {
      message: 'All contracts are backed by Gujarat State Escrow. The buyer deposits 100% of the funds before harvest dispatch.',
      steps: [
        'Milestone 1: Contract signed & escrow funded.',
        'Milestone 2: Farm-gate quality check.',
        'Milestone 3: Pooled transport pickup.',
        'Milestone 4: Delivery & weighment verification.',
        'Milestone 5: Instant IMPS / UPI transfer released to your bank.',
      ],
      action: {
        label: 'View Escrow Audit Trail →',
        sectionId: 'payments',
      },
      suggestions: ['How do I submit a complaint?', 'How do I sell my produce?', 'Show today\'s prices'],
    },
    track_orders: {
      message: 'You can monitor your harvest lot dispatch, vehicle route, and payment clearance status anytime.',
      action: {
        label: 'Check Order & Payment Status →',
        sectionId: 'payments',
      },
      suggestions: ['How do I track payment?', 'I need help with transport', 'Show today\'s prices'],
    },
    complaint_grievance: {
      message: 'If you face any weighment discrepancy, quality grade dispute, or delivery delay, submit a ticket for 48-hour SLA resolution.',
      steps: [
        'Enter your Transaction or Contract ID.',
        'Select the issue category (e.g. Weighment, Quality, Payment).',
        'State FPO Conciliation desk resolves disputes within 48 hours.',
      ],
      action: {
        label: 'Open Grievance Portal →',
        sectionId: 'grievance',
      },
      suggestions: ['How do I track payment?', 'General helpline support', 'Show today\'s prices'],
    },
    units_quantity: {
      message: 'KrushiSetu uses simple farmer-friendly units: Kilograms (kg) and Tonnes (1 tonne = 1,000 kg).',
      steps: [
        'Less than 1,000 kg is shown in kg (e.g. 500 kg).',
        '1,000 kg or more is shown in tonnes (e.g. 2,500 kg = 2.5 tonnes).',
        'Prices are shown clearly per kg (e.g. ₹28/kg).',
      ],
      suggestions: ['Show today\'s prices', 'How do I sell my produce?', 'How is final payout calculated?'],
    },
    change_language: {
      message: 'You can change the complete application language anytime between English, हिंदी, and ગુજરાતી using the language switcher at the top header.',
      suggestions: ['Show today\'s prices', 'How do I sell my produce?', 'Find verified buyers'],
    },
    general_help: {
      message: 'KrushiSetu provides complete support for Gujarat farmers. You can also reach our toll-free Kisan Call Center at 1800-180-1551.',
      action: {
        label: 'Open Help & Support Drawer →',
        modalTrigger: 'help',
      },
      suggestions: ['Show today\'s prices', 'How do I sell my produce?', 'How do I submit a complaint?'],
    },
    fallback: {
      message: 'I am sorry, I did not fully understand that. Here are some quick topics you can ask me about:',
      suggestions: [
        'Show today\'s prices',
        'How do I sell my produce?',
        'How is final payout calculated?',
        'I need help with transport',
        'How do I track payment?',
      ],
    },
  },

  hi: {
    welcome: {
      message: 'नमस्ते! मैं आपकी कृषि और विपणन में क्या सहायता कर सकता हूँ?',
      suggestions: ['आज के भाव दिखाएँ', 'मैं अपनी उपज कैसे बेचूँ?', 'खरीदार कैसे खोजें?'],
    },
    sell_produce: {
      message: 'कृषिसेतु पर अपनी फसल बेचने के 6 आसान चरण:',
      steps: [
        'चरण 1: नीचे दिए गए "उपज बेचने के लिए जोड़ें" बटन पर क्लिक करें।',
        'चरण 2: अपनी फसल और किस्म चुनें।',
        'चरण 3: मात्रा किलोग्राम या टन में दर्ज करें।',
        'चरण 4: कटाई की तारीख और गुणवत्ता ग्रेड चुनें।',
        'चरण 5: वाहन की आवश्यकता चुनें और अनुमानित शुद्ध भुगतान देखें।',
        'चरण 6: लॉट प्रकाशित करें ताकि खरीदार सीधे बोली लगा सकें।',
      ],
      action: {
        label: 'उपज बेचने के लिए जोड़ें →',
        modalTrigger: 'createLot',
      },
      suggestions: ['अंतिम भुगतान की गणना कैसे होती है?', 'आज के भाव दिखाएँ', 'मुझे परिवहन में सहायता चाहिए'],
    },
    check_prices: {
      message: 'आप गुजरात की एपीएमसी मंडियों, फूड प्रोसेसर्स और कंपनियों के ताजा भाव और कटौतियों की तुलना कर सकते हैं।',
      steps: [
        'अपनी फसल चुनें (जैसे आलू, प्याज, केसर आम, जीरा, सौंफ)।',
        'मंडी भाव, सेस और परिवहन खर्च की तुलना करें।',
        'सबसे ज्यादा बैंक भुगतान के लिए हरे रंग वाले "सर्वोत्तम मूल्य" विकल्प को चुनें।',
      ],
      action: {
        label: 'भाव तुलना मैट्रिक्स खोलें →',
        sectionId: 'price-discovery',
      },
      suggestions: ['मैं अपनी उपज कैसे बेचूँ?', 'अंतिम भुगतान की गणना कैसे होती है?', 'खरीदार कैसे खोजें?'],
    },
    find_buyers: {
      message: 'कृषिसेतु आपको बालाजी वेफर्स, जीवराज एग्रो और अडानी विल्मर जैसे सत्यापित खरीदारों से सीधे जोड़ता है।',
      steps: [
        'कंपनियों की खरीद मांग देखें।',
        'गुणवत्ता और डिलीवरी की शर्तें जांचें।',
        '100% सरकारी एस्क्रो सुरक्षा के साथ अनुबंध पक्का करें।',
      ],
      action: {
        label: 'सत्यापित खरीदार देखें →',
        sectionId: 'marketplace',
      },
      suggestions: ['मैं अपनी उपज कैसे बेचूँ?', 'भुगतान की स्थिति कैसे देखें?', 'आज के भाव दिखाएँ'],
    },
    counter_offer: {
      message: 'जब खरीदार का भाव कम लगे, तो आप डील वर्कस्पेस में काउंटर ऑफर (पलटवार भाव) दे सकते हैं।',
      steps: [
        'चरण 1: अपनी सक्रिय डील सूची से वह डील खोलें।',
        'चरण 2: खरीदार का मौजूदा प्रति किलो भाव देखें।',
        'चरण 3: "काउंटर ऑफर" पर क्लिक करें और अपना चाहा हुआ ऊंचा भाव दर्ज करें।',
        'चरण 4: सिस्टम आपका नया शुद्ध भुगतान तुरंत दिखाएगा।',
        'चरण 5: काउंटर ऑफर सबमिट करें; खरीदार को तुरंत सूचना मिल जाएगी।',
        'सुझाव: खरीदार के भाव से 8-12% ज्यादा मांगना सामान्य है और स्वीकृति की संभावना अच्छी होती है।',
      ],
      suggestions: ['मैं अपनी उपज कैसे बेचूँ?', 'अंतिम भुगतान की गणना कैसे होती है?', 'आज के भाव दिखाएँ'],
    },
    registration_login: {
      message: 'कृषिसेतु का इस्तेमाल करने के लिए आपको एक सत्यापित मोबाइल नंबर चाहिए। रजिस्ट्रेशन और लॉगिन कैसे करें:',
      steps: [
        'रजिस्ट्रेशन: "किसान के रूप में पंजीकरण" या "खरीदार के रूप में पंजीकरण" पर क्लिक करें, अपना मोबाइल नंबर दर्ज करें, 6 अंकों का ओटीपी सत्यापित करें, और अपना नाम व जिला भरें।',
        'लॉगिन: "लॉगिन" पर क्लिक करें, वही मोबाइल नंबर दर्ज करें जिससे आपने पंजीकरण किया था, ओटीपी सत्यापित करें, और आप अंदर हैं!',
        'भूमिका बदलना: अगर आपने किसान के रूप में पंजीकरण किया लेकिन खरीदार के रूप में लॉगिन करना चाहते हैं (या उल्टा), तो आपको दूसरा मोबाइल नंबर इस्तेमाल करना होगा। एक नंबर = एक भूमिका।',
        'नंबर भूल गए? वह नंबर आजमाएं जो आपने रजिस्ट्रेशन के समय दिया था। सिस्टम आपको पहचान लेगा।',
      ],
      suggestions: ['मैं अपनी उपज कैसे बेचूँ?', 'खरीदार कैसे खोजें?', 'आज के भाव दिखाएँ'],
    },
    agronomy_disease: {
      message: 'फसल स्वास्थ्य, रोग निदान और खाद सलाह के लिए मैं इन भरोसेमंद साधनों की सिफारिश करता हूं:',
      steps: [
        '1. किसान कॉल सेंटर (KCC): 1800-180-1551 पर डायल करें और हिंदी, गुजराती या मराठी में मुफ्त कृषि सलाह लें।',
        '2. कृषिसेतु जेमिनी AI: अगर आपने Gemini API Key सेट किया है, तो मैं सीधे कृषि संबंधी सवालों का जवाब दे सकता हूं।',
        '3. जिला कृषि अधिकारी: मिट्टी परीक्षण और कीट पहचान के लिए अपने नजदीकी कृषि विज्ञान केंद्र (KVK) जाएं।',
        'सामान्य समस्याएं: पीली पत्तियां अक्सर नाइट्रोजन की कमी दर्शाती हैं (यूरिया डालें)। भूरे धब्बे फफूंद हो सकते हैं (कॉपर आधारित फफूंदीनाशक स्प्रे करें)।',
      ],
      suggestions: ['आज के भाव दिखाएँ', 'मैं अपनी उपज कैसे बेचूँ?', 'सरकारी योजनाएं और सब्सिडी'],
    },
    schemes_subsidies: {
      message: 'महाराष्ट्र और गुजरात के किसानों के लिए प्रमुख सरकारी योजनाएं:',
      steps: [
        'पीएम-किसान: ₹6,000/वर्ष सीधे बैंक में 3 किस्तों में। पात्रता pmkisan.gov.in पर देखें।',
        'नमो शेतकरी महासन्मान निधि (महाराष्ट्र): 5 एकड़ तक की जमीन वाले किसानों को अतिरिक्त ₹6,000/वर्ष।',
        'प्रधानमंत्री फसल बीमा योजना (PMFBY): प्राकृतिक आपदा पर फसल बीमा। प्रीमियम: खरीफ के लिए 2%, रबी के लिए 1.5%।',
        'कुसुम सोलर पंप सब्सिडी: सोलर पंप पर 90% सब्सिडी (60% केंद्र + 30% राज्य)। अपने जिला कृषि कार्यालय में आवेदन करें।',
        'महाडीबीटी पोर्टल: mahadbt.maharashtra.gov.in पर रजिस्टर करें और सब्सिडी ट्रैक करें।',
      ],
      action: {
        label: 'योजनाओं के बारे में और जानें →',
        sectionId: 'news',
      },
      suggestions: ['मैं अपनी उपज कैसे बेचूँ?', 'फसल रोग और खाद सलाह', 'आज के भाव दिखाएँ'],
    },
    net_payout: {
      message: 'अंतिम शुद्ध भुगतान वह असली रकम है जो सभी खर्च कटने के बाद आपके बैंक खाते में जमा होती है।',
      steps: [
        'सकल भाव: खरीदार द्वारा दिया गया प्रति किलोग्राम का कुल भाव।',
        'घटाएं मंडी सेस: कृषिसेतु पर सीधे बेचने पर ₹0 (शून्य सेस)।',
        'घटाएं लोडिंग/हैंडलिंग खर्च: न्यूनतम लोडिंग चार्ज।',
        'घटाएं साझा परिवहन: साझा वाहन से कम भाड़ा।',
        'बराबर अंतिम बैंक भुगतान: बिना किसी बिचौलिए या दलाली के पूरी रकम सीधे आपके खाते में।',
      ],
      action: {
        label: 'शुद्ध भुगतान की तुलना करें →',
        sectionId: 'price-discovery',
      },
      suggestions: ['आज के भाव दिखाएँ', 'मुझे परिवहन में सहायता चाहिए', 'मैं अपनी उपज कैसे बेचूँ?'],
    },
    transport: {
      message: 'हमारा साझा वाहन रूट पास के खेतों की उपज को एक साथ जोड़ता है, जिससे भाड़े में 57% तक की बचत होती है।',
      steps: [
        'अकेले पूरा वाहन किराए पर लेने की जरूरत नहीं।',
        'आपके गांव के गेट से ही उपज उठाई जाती है।',
        'वाहन का लाइव रूट और पहुंचने का समय ट्रैक करें।',
      ],
      action: {
        label: 'साझा परिवहन व्यवस्था देखें →',
        sectionId: 'logistics',
      },
      suggestions: ['मैं अपनी उपज कैसे बेचूँ?', 'भुगतान की स्थिति कैसे देखें?', 'कोल्ड स्टोरेज में रखें'],
    },
    storage: {
      message: 'मंडी में मंदी के समय अपनी उपज को गुजरात के डब्ल्यूडीआरए प्रमाणित कोल्ड स्टोरेज में सुरक्षित रखें।',
      steps: [
        'हमारे "आज बेचें बनाम 3 दिन रोकें" कैलकुलेटर का उपयोग करें।',
        '3 से 7 दिनों में संभावित मूल्य वृद्धि देखें।',
        'सुनिश्चित करें कि मिलने वाला अतिरिक्त लाभ भंडारण शुल्क से अधिक हो।',
      ],
      action: {
        label: 'भंडारण सलाहकार खोलें →',
        sectionId: 'storage',
      },
      suggestions: ['आज के भाव दिखाएँ', 'मुझे परिवहन में सहायता चाहिए', 'मैं अपनी उपज कैसे बेचूँ?'],
    },
    payment_escrow: {
      message: 'सभी सौदे गुजरात राज्य एस्क्रो द्वारा सुरक्षित हैं। माल उठाने से पहले खरीदार 100% रकम जमा करता है।',
      steps: [
        'पड़ाव 1: अनुबंध बना और एस्क्रो फंड जमा हुआ।',
        'पड़ाव 2: खेत पर गुणवत्ता जांच।',
        'पड़ाव 3: साझा वाहन से माल रवाना।',
        'पड़ाव 4: डिलीवरी और वजन सत्यापन।',
        'पड़ाव 5: बैंक खाते में तत्काल आईएमपीएस/यूपीआई द्वारा भुगतान।',
      ],
      action: {
        label: 'एस्क्रो पेमेंट ट्रैकर देखें →',
        sectionId: 'payments',
      },
      suggestions: ['शिकायत कैसे दर्ज करें?', 'मैं अपनी उपज कैसे बेचूँ?', 'आज के भाव दिखाएँ'],
    },
    track_orders: {
      message: 'आप अपनी फसल की रवानगी, वाहन का रास्ता और भुगतान की स्थिति कभी भी देख सकते हैं।',
      action: {
        label: 'ऑर्डर और भुगतान स्थिति देखें →',
        sectionId: 'payments',
      },
      suggestions: ['भुगतान की स्थिति कैसे देखें?', 'मुझे परिवहन में सहायता चाहिए', 'आज के भाव दिखाएँ'],
    },
    complaint_grievance: {
      message: 'यदि तौल, गुणवत्ता या भुगतान में कोई समस्या हो, तो 48 घंटे में समाधान के लिए शिकायत दर्ज करें।',
      steps: [
        'अपना लेन-देन या अनुबंध नंबर दर्ज करें।',
        'समस्या का प्रकार चुनें (जैसे तौल, गुणवत्ता, भुगतान)।',
        'राज्य एफपीओ मध्यस्थता सेल 48 घंटे के भीतर निपटारा करता है।',
      ],
      action: {
        label: 'शिकायत निवारण पोर्टल खोलें →',
        sectionId: 'grievance',
      },
      suggestions: ['भुगतान की स्थिति कैसे देखें?', 'हेल्पलाइन सहायता', 'आज के भाव दिखाएँ'],
    },
    units_quantity: {
      message: 'कृषिसेतु में सरल इकाइयां हैं: किलोग्राम (किग्रा) और टन (1 टन = 1,000 किग्रा)।',
      steps: [
        '1,000 किग्रा से कम मात्रा को किग्रा में दिखाया जाता है (जैसे 500 किग्रा)।',
        '1,000 किग्रा या अधिक मात्रा को टन में दिखाया जाता है (जैसे 2,500 किग्रा = 2.5 टन)।',
        'भाव प्रति किग्रा में दिखाए जाते हैं (जैसे स्पष्ट ₹28/किग्रा)।',
      ],
      suggestions: ['आज के भाव दिखाएँ', 'मैं अपनी उपज कैसे बेचूँ?', 'अंतिम भुगतान की गणना कैसे होती है?'],
    },
    change_language: {
      message: 'आप ऊपर दिए गए भाषा बटन से पूरी वेबसाइट को कभी भी अंग्रेजी, हिंदी या गुजराती में बदल सकते हैं।',
      suggestions: ['आज के भाव दिखाएँ', 'मैं अपनी उपज कैसे बेचूँ?', 'खरीदार कैसे खोजें?'],
    },
    general_help: {
      message: 'कृषिसेतु किसानों की हर कदम पर सहायता करता है। आप हमारे टोल-फ्री किसान कॉल सेंटर 1800-180-1551 पर भी कॉल कर सकते हैं।',
      action: {
        label: 'सहायता केंद्र खोलें →',
        modalTrigger: 'help',
      },
      suggestions: ['आज के भाव दिखाएँ', 'मैं अपनी उपज कैसे बेचूँ?', 'शिकायत कैसे दर्ज करें?'],
    },
    fallback: {
      message: 'माफ़ कीजिए, मैं आपकी बात पूरी तरह समझ नहीं पाया। आप इन मुख्य विषयों के बारे में पूछ सकते हैं:',
      suggestions: [
        'आज के भाव दिखाएँ',
        'मैं अपनी उपज कैसे बेचूँ?',
        'अंतिम भुगतान की गणना कैसे होती है?',
        'मुझे परिवहन में सहायता चाहिए',
        'भुगतान की स्थिति कैसे देखें?',
      ],
    },
  },

  gu: {
    welcome: {
      message: 'નમસ્તે! હું તમારી ખેતી અને વેચાણમાં શું મદદ કરી શકું?',
      suggestions: ['આજના ભાવ બતાવો', 'હું મારી ઉપજ કેવી રીતે વેચું?', 'ખરીદદાર કેવી રીતે શોધવો?'],
    },
    sell_produce: {
      message: 'કૃષિસેતુ પર પાક વેચવાના 6 સરળ પગલાં:',
      steps: [
        'પગલું 1: નીચે આપેલા "પાક વેચાણ નોંધણી" બટન પર ક્લિક કરો.',
        'પગલું 2: તમારો પાક અને જાત પસંદ કરો.',
        'પગલું 3: જથ્થો કિલોગ્રામ અથવા ટનમાં દાખલ કરો.',
        'પગલું 4: કાપણીની તારીખ અને ગુણવત્તા ગ્રેડ પસંદ કરો.',
        'પગલું 5: વાહનની જરૂરિયાત પસંદ કરો અને અંદાજિત ચોખ્ખી રકમ જુઓ.',
        'પગલું 6: લોટ પ્રકાશિત કરો જેથી ખરીદદારો સીધા જ ઓફર કરી શકે.',
      ],
      action: {
        label: 'પાક વેચાણ નોંધણી કરો →',
        modalTrigger: 'createLot',
      },
      suggestions: ['અંતિમ ચુકવણીની ગણતરી કેવી રીતે થાય છે?', 'આજના ભાવ બતાવો', 'મને પરિવહનમાં મદદ જોઈએ'],
    },
    check_prices: {
      message: 'તમે ગુજરાતની એપીએમસી માર્કેટિંગ યાર્ડ, ફૂડ પ્રોસેસર્સ અને કંપનીઓના તાજા ભાવ અને કપાતોની સરખામણી કરી શકો છો.',
      steps: [
        'તમારો પાક પસંદ કરો (દા.ત. બટાટા, ડુંગળી, કેસર કેરી, જીરું, વરિયાળી).',
        'મંડી ભાવ, સેસ અને વાહન ભાડાની સરખામણી કરો.',
        'સૌથી વધુ બેંક જમા રકમ માટે લીલા બોર્ડરવાળા "સૌથી વધુ ચોખ્ખો નફો" વિકલ્પ પસંદ કરો.',
      ],
      action: {
        label: 'ભાવ સરખામણી મેટ્રિક્સ ખોલો →',
        sectionId: 'price-discovery',
      },
      suggestions: ['હું મારી ઉપજ કેવી રીતે વેચું?', 'અંતિમ ચુકવણીની ગણતરી કેવી રીતે થાય છે?', 'ખરીદદાર કેવી રીતે શોધવો?'],
    },
    find_buyers: {
      message: 'કૃષિસેતુ તમને બાલાજી વેફર્સ, જીવરાજ એગ્રો અને અદાણી વિલ્મર જેવા ચકાસાયેલા ખરીદદારો સાથે સીધા જોડે છે.',
      steps: [
        'કંપનીઓની ખરીદ માંગ જુઓ.',
        'ગુણવત્તા અને ડિલિવરીની શરતો ચકાસો.',
        '100% સરકારી એસ્ક્રો સુરક્ષા સાથે સોદો પાકો કરો.',
      ],
      action: {
        label: 'ચકાસાયેલા ખરીદદારો જુઓ →',
        sectionId: 'marketplace',
      },
      suggestions: ['હું મારી ઉપજ કેવી રીતે વેચું?', 'ચુકવણીની સ્થિતિ કેવી રીતે જોવી?', 'આજના ભાવ બતાવો'],
    },
    counter_offer: {
      message: 'જ્યારે ખરીદદારનો ભાવ ઓછો લાગે, ત્યારે તમે ડીલ વર્કસ્પેસમાં કાઉન્ટર ઓફર (વળતો ભાવ) આપી શકો છો.',
      steps: [
        'પગલું 1: તમારી સક્રિય ડીલ યાદીમાંથી તે ડીલ ખોલો.',
        'પગલું 2: ખરીદદારનો વર્તમાન પ્રતિ કિલો ભાવ જુઓ.',
        'પગલું 3: "કાઉન્ટર ઓફર" પર ક્લિક કરો અને તમારો ઈચ્છિત વધુ ભાવ દાખલ કરો.',
        'પગલું 4: સિસ્ટમ તમારી નવી ચોખ્ખી રકમ તરત જ બતાવશે.',
        'પગલું 5: કાઉન્ટર ઓફર સબમિટ કરો; ખરીદદારને તરત જ સૂચના મળશે.',
        'સૂચન: ખરીદદારના ભાવથી 8-12% વધુ માંગવું સામાન્ય છે અને સ્વીકૃતિની શક્યતા સારી હોય છે.',
      ],
      suggestions: ['હું મારી ઉપજ કેવી રીતે વેચું?', 'અંતિમ ચુકવણીની ગણતરી કેવી રીતે થાય છે?', 'આજના ભાવ બતાવો'],
    },
    registration_login: {
      message: 'કૃષિસેતુનો ઉપયોગ કરવા માટે તમને એક ચકાસાયેલ મોબાઇલ નંબર જોઈએ છે. નોંધણી અને લોગિન કેવી રીતે કરવું:',
      steps: [
        'નોંધણી: "ખેડૂત તરીકે નોંધણી" અથવા "ખરીદદાર તરીકે નોંધણી" પર ક્લિક કરો, તમારો મોબાઇલ નંબર દાખલ કરો, 6 અંકનો OTP ચકાસો, અને તમારું નામ અને જિલ્લો ભરો.',
        'લોગિન: "લોગિન" પર ક્લિક કરો, તે જ મોબાઇલ નંબર દાખલ કરો જેનાથી તમે નોંધણી કરાવી હતી, OTP ચકાસો, અને તમે અંદર છો!',
        'ભૂમિકા બદલવી: જો તમે ખેડૂત તરીકે નોંધણી કરાવી પરંતુ ખરીદદાર તરીકે લોગિન કરવું છે (અથવા ઊલટું), તો તમારે બીજો મોબાઇલ નંબર વાપરવો પડશે. એક નંબર = એક ભૂમિકા.',
        'નંબર ભૂલી ગયા? તે નંબર અજમાવો જે તમે નોંધણી સમયે આપ્યો હતો. સિસ્ટમ તમને ઓળખી લેશે.',
      ],
      suggestions: ['હું મારી ઉપજ કેવી રીતે વેચું?', 'ખરીદદાર કેવી રીતે શોધવો?', 'આજના ભાવ બતાવો'],
    },
    agronomy_disease: {
      message: 'પાક આરોગ્ય, રોગ નિદાન અને ખાતર સલાહ માટે હું આ વિશ્વસનીય સાધનોની ભલામણ કરું છું:',
      steps: [
        '1. કિસાન કોલ સેન્ટર (KCC): 1800-180-1551 પર ડાયલ કરો અને હિન્દી, ગુજરાતી અથવા મરાઠીમાં મફત કૃષિ સલાહ લો.',
        '2. કૃષિસેતુ જેમિની AI: જો તમે Gemini API Key સેટ કર્યું છે, તો હું સીધા જ ખેતી સંબંધિત પ્રશ્નોના જવાબ આપી શકું છું.',
        '3. જિલ્લા કૃષિ અધિકારી: માટી પરીક્ષણ અને જીવાત ઓળખ માટે તમારા નજીકના કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) જાઓ.',
        'સામાન્ય સમસ્યાઓ: પીળા પાનો ઘણીવાર નાઇટ્રોજનની ઉણપ દર્શાવે છે (યુરિયા નાખો). ભૂરા ડાઘ ફૂગ હોઈ શકે છે (કોપર આધારિત ફંગીસાઇડ છાંટો).',
      ],
      suggestions: ['આજના ભાવ બતાવો', 'હું મારી ઉપજ કેવી રીતે વેચું?', 'સરકારી યોજનાઓ અને સબસિડી'],
    },
    schemes_subsidies: {
      message: 'મહારાષ્ટ્ર અને ગુજરાતના ખેડૂતો માટેની મુખ્ય સરકારી યોજનાઓ:',
      steps: [
        'પીએમ-કિસાન: ₹6,000/વર્ષ સીધા બેંકમાં 3 હપ્તામાં. પાત્રતા pmkisan.gov.in પર જુઓ.',
        'નમો શેતકરી મહાસન્માન નિધિ (મહારાષ્ટ્ર): 5 એકર સુધીની જમીન ધરાવતા ખેડૂતોને વધારાના ₹6,000/વર્ષ.',
        'પ્રધાનમંત્રી ફસલ બીમા યોજના (PMFBY): કુદરતી આફત પર પાક વીમો. પ્રીમિયમ: ખરીફ માટે 2%, રબી માટે 1.5%.',
        'કુસુમ સોલાર પંપ સબસિડી: સોલાર પંપ પર 90% સબસિડી (60% કેન્દ્ર + 30% રાજ્ય). તમારી જિલ્લા કૃષિ ઓફિસમાં અરજી કરો.',
        'મહાડીબીટી પોર્ટલ: mahadbt.maharashtra.gov.in પર રજિસ્ટર કરો અને સબસિડી ટ્રેક કરો.',
      ],
      action: {
        label: 'યોજનાઓ વિશે વધુ જાણો →',
        sectionId: 'news',
      },
      suggestions: ['હું મારી ઉપજ કેવી રીતે વેચું?', 'પાક રોગ અને ખાતર સલાહ', 'આજના ભાવ બતાવો'],
    },
    net_payout: {
      message: 'ચોખ્ખી રકમ એ સાચી રકમ છે જે તમામ ખર્ચ બાદ થયા પછી તમારા બેંક ખાતામાં સીધી જમા થાય છે.',
      steps: [
        'કુલ ભાવ: ખરીદદાર દ્વારા આપવામાં આવેલો પ્રતિ કિલોગ્રામનો કુલ દર.',
        'બાદ મંડી સેસ: કૃષિસેતુ પર સીધા વેચાણથી ₹0 (શૂન્ય સેસ).',
        'બાદ હેન્ડલિંગ/મજૂરી: નહિવત લોડિંગ ખર્ચ.',
        'બાદ શેરિંગ વાહન ભાડું: સાથે જોડાયેલ વાહનથી ઓછું ભાડું.',
        'બરાબર અંતિમ બેંક જમા: કોઈ પણ દલાલ કે વચેટિયા વગર પૂરેપૂરી રકમ સીધી તમારા બેંક ખાતામાં.',
      ],
      action: {
        label: 'ચોખ્ખી રકમ સરખાવો →',
        sectionId: 'price-discovery',
      },
      suggestions: ['આજના ભાવ બતાવો', 'મને પરિવહનમાં મદદ જોઈએ', 'હું મારી ઉપજ કેવી રીતે વેચું?'],
    },
    transport: {
      message: 'અમારું શેરિંગ વાહન રૂટિંગ નજીકના ખેતરોનો માલ એક જ વાહનમાં જોડે છે, જેથી વાહન ભાડામાં 57% સુધીની બચત થાય છે.',
      steps: [
        'એકલું આખું વાહન ભાડે રાખવાની જરૂર નથી.',
        'તમારા ગામના પાદરેથી જ માલ ઉપાડવામાં આવે છે.',
        'વાહનનો લાઈવ રૂટ અને પહોંચવાનો સમય ટ્રેક કરો.',
      ],
      action: {
        label: 'શેરિંગ વાહન વ્યવસ્થા જુઓ →',
        sectionId: 'logistics',
      },
      suggestions: ['હું મારી ઉપજ કેવી રીતે વેચું?', 'ચુકવણીની સ્થિતિ કેવી રીતે જોવી?', 'કોલ્ડ સ્ટોરેજ સલાહ'],
    },
    storage: {
      message: 'કાપણીની મોસમમાં ભાવ ઘટવા સામે રક્ષણ મેળવવા માટે તમારા પાકને ડબલ્યુડીઆરએ પ્રમાણિત કોલ્ડ સ્ટોરેજમાં સાચવો.',
      steps: [
        'અમારા "આજે વેચો કે 3 દિવસ સાચવો" કેલ્ક્યુલેટરનો ઉપયોગ કરો.',
        '3 થી 7 દિવસમાં અંદાજિત ભાવ વધારો જુઓ.',
        'ખાતરી કરો કે મળતો વધારાનો નફો સંગ્રહ ખર્ચ કરતાં ઘણો વધારે હોય.',
      ],
      action: {
        label: 'કોલ્ડ સ્ટોરેજ સલાહકાર ખોલો →',
        sectionId: 'storage',
      },
      suggestions: ['આજના ભાવ બતાવો', 'મને પરિવહનમાં મદદ જોઈએ', 'હું મારી ઉપજ કેવી રીતે વેચું?'],
    },
    payment_escrow: {
      message: 'તમામ સોદા ગુજરાત રાજ્ય એસ્ક્રો દ્વારા સુરક્ષિત છે. માલ ઉપાડતા પહેલા ખરીદદાર 100% રકમ સરકારી એસ્ક્રો ખાતામાં જમા કરાવે છે.',
      steps: [
        'પગલું 1: કરાર થયો અને એસ્ક્રો રકમ જમા થઈ.',
        'પગલું 2: ખેતર પર ગુણવત્તા ચકાસણી.',
        'પગલું 3: શેરિંગ વાહન દ્વારા માલ રવાના.',
        'પગલું 4: ડિલિવરી અને વજન ચકાસણી.',
        'પગલું 5: બેંક ખાતામાં તાત્કાલિક IMPS/UPI દ્વારા રકમ જમા.',
      ],
      action: {
        label: 'એસ્ક્રો પેમેન્ટ ટ્રેકર જુઓ →',
        sectionId: 'payments',
      },
      suggestions: ['ફરિયાદ કેવી રીતે નોંધાવવી?', 'હું મારી ઉપજ કેવી રીતે વેચું?', 'આજના ભાવ બતાવો'],
    },
    track_orders: {
      message: 'તમે તમારા પાકની રવાનગી, વાહનનો રસ્તો અને પેમેન્ટ ક્લિયરન્સ સ્થિતિ ગમે ત્યારે જોઈ શકો છો.',
      action: {
        label: 'ઓર્ડર અને પેમેન્ટ સ્થિતિ જુઓ →',
        sectionId: 'payments',
      },
      suggestions: ['ચુકવણીની સ્થિતિ કેવી રીતે જોવી?', 'મને પરિવહનમાં મદદ જોઈએ', 'આજના ભાવ બતાવો'],
    },
    complaint_grievance: {
      message: 'જો તોલાઈ, ગુણવત્તા કે પેમેન્ટમાં કોઈ વિવાદ હોય, તો 48 કલાકમાં ઉકેલ માટે ફરિયાદ નોંધાવો.',
      steps: [
        'તમારો ટ્રાન્ઝેક્શન કે કરાર નંબર દાખલ કરો.',
        'સમસ્યાનો પ્રકાર પસંદ કરો (દા.ત. તોલાઈ, ગુણવત્તા, પેમેન્ટ).',
        'રાજ્ય એફપીઓ લવાદ સેલ 48 કલાકમાં નિરાકરણ લાવે છે.',
      ],
      action: {
        label: 'ફરિયાદ નિવારણ પોર્ટલ ખોલો →',
        sectionId: 'grievance',
      },
      suggestions: ['ચુકવણીની સ્થિતિ કેવી રીતે જોવી?', 'હેલ્પલાઇન સહાય', 'આજના ભાવ બતાવો'],
    },
    units_quantity: {
      message: 'કૃષિસેતુમાં સરળ એકમો વપરાય છે: કિલોગ્રામ (કિગ્રા) અને ટન (1 ટન = 1,000 કિગ્રા).',
      steps: [
        '1,000 કિગ્રાથી ઓછો જથ્થો કિગ્રામાં દર્શાવાય છે (દા.ત. 500 કિગ્રા).',
        '1,000 કિગ્રા કે તેથી વધુ જથ્થો ટનમાં દર્શાવાય છે (દા.ત. 2,500 કિગ્રા = 2.5 ટન).',
        'ભાવ પ્રતિ કિગ્રામાં દર્શાવાય છે (દા.ત. સ્પષ્ટ ₹28/કિગ્રા).',
      ],
      suggestions: ['આજના ભાવ બતાવો', 'હું મારી ઉપજ કેવી રીતે વેચું?', 'અંતિમ ચુકવણીની ગણતરી કેવી રીતે થાય છે?'],
    },
    change_language: {
      message: 'તમે ઉપર આપેલા ભાષા બટનથી આખી વેબસાઇટ ગમે ત્યારે અંગ્રેજી, હિન્દી કે ગુજરાતીમાં બદલી શકો છો.',
      suggestions: ['આજના ભાવ બતાવો', 'હું મારી ઉપજ કેવી રીતે વેચું?', 'ખરીદદાર કેવી રીતે શોધવો?'],
    },
    general_help: {
      message: 'કૃષિસેતુ ખેડૂત મિત્રોને દરેક પગલે મદદ કરે છે. તમે અમારા ટોલ-ફ્રી કિસાન કોલ સેન્ટર 1800-180-1551 પર પણ કોલ કરી શકો છો.',
      action: {
        label: 'સહાયતા કેન્દ્ર ખોલો →',
        modalTrigger: 'help',
      },
      suggestions: ['આજના ભાવ બતાવો', 'હું મારી ઉપજ કેવી રીતે વેચું?', 'ફરિયાદ કેવી રીતે નોંધાવવી?'],
    },
    fallback: {
      message: 'માફ કરશો, હું તમારી વાત બરાબર સમજી શક્યો નથી. તમે આ મુખ્ય વિષયો વિશે પૂછી શકો છો:',
      suggestions: [
        'આજના ભાવ બતાવો',
        'હું મારી ઉપજ કેવી રીતે વેચું?',
        'અંતિમ ચુકવણીની ગણતરી કેવી રીતે થાય છે?',
        'મને પરિવહનમાં મદદ જોઈએ',
        'ચુકવણીની સ્થિતિ કેવી રીતે જોવી?',
      ],
    },
  },

  mr: {
    welcome: {
      message: 'नमस्कार! आज मी तुम्हाला शेती आणि शेतमाल विक्रीमध्ये कशी मदत करू शकतो?',
      suggestions: ['आजचे बाजारभाव दाखवा', 'मी माझी शेतीमाल कसा विकू?', 'सत्यापित खरेदीदार शोधा'],
    },
    sell_produce: {
      message: 'कृषीसेतूवर आपला शेतमाल विकण्यासाठी खालील ६ सोप्या पायऱ्या वापरा:',
      steps: [
        'पायरी १: खालील "शेतमाल विक्री नोंदणी" बटनावर क्लिक करा.',
        'पायरी २: आपले पीक व वाण (उदा. सोयाबीन, कांदा, कापूस) निवडा.',
        'पायरी ३: विक्रीसाठी उपलब्ध प्रमाण (क्विंटल किंवा टन) प्रविष्ट करा.',
        'पायरी ४: कापणीची तारीख व मालाचा दर्जा (Grade A/B/C) निवडा.',
        'पायरी ५: वाहतुकीची गरज निवडा व अंदाजे निव्वळ रक्कम तपासा.',
        'पायरी ६: थेट कॉर्पोरेट खरेदीदारांकडून बोली मिळवण्यासाठी लॉट प्रकाशित करा.',
      ],
      action: {
        label: 'शेतमाल विक्री सुरू करा →',
        modalTrigger: 'createLot',
      },
      suggestions: ['अंतिम पेमेंटचा हिशोब कसा होतो?', 'आजचे बाजारभाव दाखवा', 'मला वाहतुकीसाठी मदत हवी आहे'],
    },
    check_prices: {
      message: 'तुम्ही महाराष्ट्रातील लासलगाव, पुणे, नाशिक, नागपूर, लातूर बाजार समित्या आणि थेट प्रक्रिया उद्योगांचे दर पारदर्शकपणे तपासू शकता.',
      steps: [
        'आपले पीक निवडा (उदा. सोयाबीन, कांदा, कापूस, द्राक्षे, तूर).',
        'एकूण भाव, बाजार उपकर व वाहतूक खर्चाची तुलना करा.',
        'जास्तीत जास्त बँक जमा रकमेसाठी हिरवा "सर्वोत्तम मूल्य" पर्याय निवडा.',
      ],
      action: {
        label: 'बाजारभाव तुलना तक्ता उघडा →',
        sectionId: 'price-discovery',
      },
      suggestions: ['मी माझी शेतीमाल कसा विकू?', 'अंतिम पेमेंटचा हिशोब कसा होतो?', 'सत्यापित खरेदीदार शोधा'],
    },
    find_buyers: {
      message: 'कृषीसेतू तुम्हाला सह्याद्री फार्म्स, चितळे ॲग्रो, हल्दीराम फुड्स आणि नामांकित प्रक्रिया उद्योगांशी थेट जोडते.',
      steps: [
        'खरेदीदारांच्या खरेदी आवश्यकता (Requirements) तपासा.',
        'मालाचा दर्जा आणि डिलिव्हरी अटींचे पुनरावलोकन करा.',
        '१००% सुरक्षित एस्क्रो हमीसह थेट करार पक्का करा.',
      ],
      action: {
        label: 'सत्यापित खरेदीदार पहा →',
        sectionId: 'marketplace',
      },
      suggestions: ['मी माझी शेतीमाल कसा विकू?', 'पेमेंटची स्थिती कशी तपासायची?', 'आजचे बाजारभाव दाखवा'],
    },
    counter_offer: {
      message: 'जेव्हा खरेदीदाराचा दर कमी वाटतो, तेव्हा तुम्ही डील वर्कस्पेसमध्ये काउंटर ऑफर (उलटा दर) देऊ शकता.',
      steps: [
        'पायरी १: तुमच्या सक्रिय डील यादीतून ती डील उघडा.',
        'पायरी २: खरेदीदाराचा सध्याचा प्रति किलो दर पहा.',
        'पायरी ३: "काउंटर ऑफर" वर क्लिक करा आणि तुमचा इच्छित जास्त दर प्रविष्ट करा.',
        'पायरी ४: सिस्टम तुमची नवी निव्वळ रक्कम लगेच दाखवेल.',
        'पायरी ५: काउंटर ऑफर सबमिट करा; खरेदीदाराला लगेच सूचना मिळेल.',
        'टीप: खरेदीदाराच्या दरापेक्षा ८-१२% जास्त मागणे सामान्य आहे आणि स्वीकृतीची शक्यता चांगली असते.',
      ],
      suggestions: ['मी माझी शेतीमाल कसा विकू?', 'अंतिम पेमेंटचा हिशोब कसा होतो?', 'आजचे बाजारभाव दाखवा'],
    },
    registration_login: {
      message: 'कृषीसेतू वापरण्यासाठी तुम्हाला एक सत्यापित मोबाईल नंबर हवा आहे. नोंदणी आणि लॉगिन कसे करावे:',
      steps: [
        'नोंदणी: "शेतकरी म्हणून नोंदणी" किंवा "खरेदीदार म्हणून नोंदणी" वर क्लिक करा, तुमचा मोबाईल नंबर प्रविष्ट करा, ६ अंकी OTP सत्यापित करा, आणि तुमचे नाव व जिल्हा भरा.',
        'लॉगिन: "लॉगिन" वर क्लिक करा, तोच मोबाईल नंबर प्रविष्ट करा ज्याने तुम्ही नोंदणी केली होती, OTP सत्यापित करा, आणि तुम्ही आत आहात!',
        'भूमिका बदलणे: जर तुम्ही शेतकरी म्हणून नोंदणी केली परंतु खरेदीदार म्हणून लॉगिन करायचे आहे (किंवा उलट), तर तुम्हाला दुसरा मोबाईल नंबर वापरावा लागेल. एक नंबर = एक भूमिका.',
        'नंबर विसरलात? तो नंबर वापरून पहा ज्याने तुम्ही नोंदणी केली होती. सिस्टम तुम्हाला ओळखेल.',
      ],
      suggestions: ['मी माझी शेतीमाल कसा विकू?', 'सत्यापित खरेदीदार शोधा', 'आजचे बाजारभाव दाखवा'],
    },
    agronomy_disease: {
      message: 'पिकांच्या आरोग्यासाठी, रोग निदानासाठी आणि खताच्या सल्ल्यासाठी मी या विश्वासार्ह स्रोतांची शिफारस करतो:',
      steps: [
        '१. किसान कॉल सेंटर (KCC): १८००-१८०-१५५१ वर डायल करा आणि मराठी, हिंदी किंवा गुजराथीमध्ये मोफत कृषि सल्ला घ्या.',
        '२. कृषीसेतू जेमिनी AI: जर तुम्ही Gemini API Key सेट केली असेल, तर मी थेट कृषी संबंधित प्रश्नांची उत्तरे देऊ शकतो.',
        '३. जिल्हा कृषी अधिकारी: मातीची चाचणी आणि किड ओळख यासाठी तुमच्या जवळच्या कृषी विज्ञान केंद्र (KVK) ला भेट द्या.',
        'सामान्य समस्या: पिवळी पाने बहुतेकदा नायट्रोजनची कमतरता दर्शवतात (युरिया टाका). तपकिरी डाग बुरशी असू शकतात (कॉपर आधारित बुरशीनाशक फवारा).',
      ],
      suggestions: ['आजचे बाजारभाव दाखवा', 'मी माझी शेतीमाल कसा विकू?', 'सरकारी योजना आणि सबसिडी'],
    },
    schemes_subsidies: {
      message: 'महाराष्ट्र आणि गुजरातमधील शेतकऱ्यांसाठीच्या प्रमुख सरकारी योजना:',
      steps: [
        'पीएम-किसान: ₹६,०००/वर्ष थेट बँकेत ३ हप्त्यांमध्ये. पात्रता pmkisan.gov.in वर तपासा.',
        'नमो शेतकरी महासन्मान निधी (महाराष्ट्र): ५ एकर पर्यंत जमीन असलेल्या शेतकऱ्यांना अतिरिक्त ₹६,०००/वर्ष.',
        'प्रधानमंत्री फसल बीमा योजना (PMFBY): नैसर्गिक आपत्तीवर पीक विमा. प्रीमियम: खरीपसाठी २%, रब्बीसाठी १.५%.',
        'कुसुम सोलर पंप सबसिडी: सोलर पंपवर ९०% सबसिडी (६०% केंद्र + ३०% राज्य). तुमच्या जिल्हा कृषी कार्यालयात अर्ज करा.',
        'महाडीबीटी पोर्टल: mahadbt.maharashtra.gov.in वर नोंदणी करा आणि सबसिडी ट्रॅक करा.',
      ],
      action: {
        label: 'योजनांबद्दल अधिक जाणा →',
        sectionId: 'news',
      },
      suggestions: ['मी माझी शेतीमाल कसा विकू?', 'पीक रोग आणि खत सल्ला', 'आजचे बाजारभाव दाखवा'],
    },
    net_payout: {
      message: 'निव्वळ रक्कम म्हणजे सर्व कपातीनंतर थेट तुमच्या बँक खात्यात जमा होणारी खरी रक्कम.',
      steps: [
        'एकूण बोली: खरेदीदाराने प्रति क्विंटल देऊ केलेला थेट भाव.',
        'बाजार समिती उपकर वजा: कृषीसेतूवर थेट विक्री केल्यास शून्य दलाली.',
        'हाताळणी शुल्क: माल चढवणे व उतरवणे यावरील नाममात्र खर्च.',
        'सामायिक वाहतूक: एकत्र वाहन उपलब्धतेमुळे भाड्यात ५७% पर्यंत बचत.',
        'अंतिम बँक खात्यात जमा: कोणतीही गुप्त कपात नसलेली पूर्ण रक्कम.',
      ],
      action: {
        label: 'निव्वळ पेमेंट तुलना करा →',
        sectionId: 'price-discovery',
      },
      suggestions: ['आजचे बाजारभाव दाखवा', 'मला वाहतुकीसाठी मदत हवी आहे', 'मी माझी शेतीमाल कसा विकू?'],
    },
    transport: {
      message: 'आमची बांधावरील सामायिक वाहतूक व्यवस्था एकाच मार्गावरील छोट्या शेतकऱ्यांचा माल एकत्र करून वाहतूक खर्चात ५७% पर्यंत बचत करते.',
      steps: [
        'शेतकऱ्याला एकट्याला पूर्ण वाहन भाड्याने घेण्याची गरज नाही.',
        'थेट तुमच्या गावाच्या बांधावरून अथवा मुख्य रस्त्यावरून माल उचलला जातो.',
        'वाहनाचे थेट जीपीएस (GPS) लोकेशन आणि पोहोचण्याची वेळ ट्रॅक करा.',
      ],
      action: {
        label: 'वाहतूक व लॉजिस्टिक्स पहा →',
        sectionId: 'logistics',
      },
      suggestions: ['मी माझी शेतीमाल कसा विकू?', 'पेमेंटची स्थिती कशी तपासायची?', 'गोदामात माल साठवणे'],
    },
    storage: {
      message: 'कापणीच्या हंगामात भाव घसरल्यास घाबरून विक्री टाळा; महाराष्ट्रातील MSAMB व WDRA प्रमाणित वेअरहाऊस आणि शीतगृहांत माल सुरक्षित ठेवा.',
      steps: [
        'आमचा "आज विक्री वि. साठवणूक" कॅल्क्युलेटर वापरा.',
        'पुढील काही दिवसांत अपेक्षित भाववाढीचा अंदाज घ्या.',
        'साठवणूक खर्च वजा जाता अधिक नफा होत असल्याची खात्री करा.',
      ],
      action: {
        label: 'साठवणूक सल्लागार उघडा →',
        sectionId: 'storage',
      },
      suggestions: ['आजचे बाजारभाव दाखवा', 'मला वाहतुकीसाठी मदत हवी आहे', 'मी माझी शेतीमाल कसा विकू?'],
    },
    payment_escrow: {
      message: 'सर्व व्यवहार महाराष्ट्र राज्य डिजिटल एस्क्रो खात्याद्वारे सुरक्षित असतात. माल उचलण्यापूर्वी खरेदीदार १००% रक्कम जमा करतो.',
      steps: [
        'टप्पा १: करार स्वाक्षरी व एस्क्रो खात्यात पैसे जमा.',
        'टप्पा २: शेतावर मालाची गुणवत्ता तपासणी.',
        'टप्पा ३: सामायिक वाहनाद्वारे माल उचलणे.',
        'टप्पा ४: डिलिव्हरी व प्रत्यक्ष वजन पडताळणी.',
        'टप्पा ५: थेट तुमच्या बँक खात्यात तत्काळ IMPS / UPI द्वारे पैसे जमा.',
      ],
      action: {
        label: 'एस्क्रो सुरक्षितता माहिती पहा →',
        sectionId: 'payments',
      },
      suggestions: ['तक्रार कशी नोंदवायची?', 'मी माझी शेतीमाल कसा विकू?', 'आजचे बाजारभाव दाखवा'],
    },
    track_orders: {
      message: 'तुम्ही तुमच्या शेतमालाची वाहतूक स्थिती, ट्रकचे लोकेशन आणि बँक पेमेंट क्लिअरन्स कधीही तपासू शकता.',
      action: {
        label: 'ऑर्डर व पेमेंट स्थिती तपासा →',
        sectionId: 'payments',
      },
      suggestions: ['पेमेंटची स्थिती कशी तपासायची?', 'मला वाहतुकीसाठी मदत हवी आहे', 'आजचे बाजारभाव दाखवा'],
    },
    complaint_grievance: {
      message: 'वजनात तफावत, दर्जाचा वाद अथवा पेमेंट विलंब झाल्यास ४८ तासांत निवारणासाठी तक्रार नोंदवा.',
      steps: [
        'तुमचा व्यवहार अथवा करार क्रमांक प्रविष्ट करा.',
        'समस्येचा प्रकार निवडा (वजन, गुणवत्ता, पेमेंट).',
        'एफपीओ व बाजार समिती मध्यस्थी टेबल ४८ तासांत तोडगा काढते.',
      ],
      action: {
        label: 'तक्रार निवारण पोर्टल उघडा →',
        sectionId: 'grievance',
      },
      suggestions: ['पेमेंटची स्थिती कशी तपासायची?', 'हेल्पलाइन साहाय्य', 'आजचे बाजारभाव दाखवा'],
    },
    units_quantity: {
      message: 'कृषीसेतू शेतकऱ्यांना समजायला सोपी एकके वापरते: किलोग्राम (किलो), क्विंटल आणि टन (१ टन = १० क्विंटल = १,००० किलो).',
      steps: [
        '१,००० किलोपेक्षा कमी माल किलोमध्ये दाखवला जातो.',
        '१,००० किलो किंवा अधिक माल टनांमध्ये दाखवला जातो (उदा. २५ क्विंटल = २.५ टन).',
        'भाव प्रति क्विंटल अथवा प्रति किलो स्पष्टपणे दर्शवले जातात.',
      ],
      suggestions: ['आजचे बाजारभाव दाखवा', 'मी माझी शेतीमाल कसा विकू?', 'अंतिम पेमेंटचा हिशोब कसा होतो?'],
    },
    change_language: {
      message: 'तुम्ही वरच्या उजव्या कोपऱ्यातील भाषा निवडकावरून कधीही English, ગુજરાતી, हिंदी किंवा मराठी भाषा निवडू शकता.',
      suggestions: ['आजचे बाजारभाव दाखवा', 'मी माझी शेतीमाल कसा विकू?', 'सत्यापित खरेदीदार शोधा'],
    },
    general_help: {
      message: 'कृषीसेतू महाराष्ट्रातील शेतकऱ्यांच्या सेवेसाठी सदैव तत्पर आहे. अधिक माहितीसाठी किसान कॉल सेंटर १८००-१८०-१५५१ वर संपर्क साधा.',
      action: {
        label: 'मदत व साहाय्य उघडा →',
        modalTrigger: 'help',
      },
      suggestions: ['आजचे बाजारभाव दाखवा', 'मी माझी शेतीमाल कसा विकू?', 'तक्रार कशी नोंदवायची?'],
    },
    fallback: {
      message: 'क्षमस्व, मला तुमचा प्रश्न पूर्णपणे समजला नाही. आपण खालील विषयांबद्दल मला विचारू शकता:',
      suggestions: [
        'आजचे बाजारभाव दाखवा',
        'मी माझी शेतीमाल कसा विकू?',
        'अंतिम पेमेंटचा हिशोब कसा होतो?',
        'मला वाहतुकीसाठी मदत हवी आहे',
        'पेमेंटची स्थिती कशी तपासायची?',
      ],
    },
  },
};
