import type { Crop, CropCategory, Language } from '../types';

export interface ProductCatalogItem {
  id: Crop;
  category: CropCategory;
  categoryGu: string;
  categoryHi: string;
  categoryMr: string;
  categoryEn: string;
  nameEn: string;
  nameGu: string;
  nameHi: string;
  nameMr: string;
  icon: string;
  image: string;
  defaultVariety: string;
  defaultUnit: 'kg' | 'tonne' | 'Ton' | 'Kg';
  typicalPricePerKg: number;
  typicalYieldDistrict: string;
  descriptionEn: string;
  descriptionGu: string;
  descriptionHi: string;
  descriptionMr: string;
}

export const PRODUCT_CATEGORIES: {
  id: CropCategory;
  nameEn: string;
  nameGu: string;
  nameHi: string;
  nameMr: string;
  icon: string;
}[] = [
  {
    id: 'Oilseeds & Pulses',
    nameEn: 'Oilseeds & Pulses',
    nameGu: 'તેલીબિયાં અને કઠોળ',
    nameHi: 'तिलहन और दालें',
    nameMr: 'गळीतधान्ये व कडधान्ये',
    icon: '🌱',
  },
  {
    id: 'Cash Crops & Spices',
    nameEn: 'Cash Crops & Spices',
    nameGu: 'રોકડિયા પાકો અને મસાલા',
    nameHi: 'नकदी फसलें और मसाले',
    nameMr: 'नगदी पिके व मसाले',
    icon: '🎋',
  },
  {
    id: 'Cereals & Grains',
    nameEn: 'Cereals & Grains',
    nameGu: 'અનાજ અને ધાન્ય',
    nameHi: 'अनाज और खाद्यान्न',
    nameMr: 'अन्नधान्य व तृणधान्ये',
    icon: '🌾',
  },
  {
    id: 'Horticulture & Fruits',
    nameEn: 'Horticulture & Fruits',
    nameGu: 'બાગાયતી અને ફળો',
    nameHi: 'बागवानी और फल',
    nameMr: 'फलोत्पादन व फळे',
    icon: '🍎',
  },
  {
    id: 'Vegetables',
    nameEn: 'Vegetables',
    nameGu: 'શાકભાજી',
    nameHi: 'सब्जियां',
    nameMr: 'भाजीपाला',
    icon: '🥬',
  },
  {
    id: 'Fruits',
    nameEn: 'Fruits',
    nameGu: 'ફળો',
    nameHi: 'फल',
    nameMr: 'फळे',
    icon: '🍇',
  },
  {
    id: 'Spices',
    nameEn: 'Spices',
    nameGu: 'મસાલા',
    nameHi: 'मसाले',
    nameMr: 'मसाले',
    icon: '🌿',
  },
];

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  // 1. Soybean — सोयाबीन
  {
    id: 'Soybean',
    category: 'Oilseeds & Pulses',
    categoryEn: 'Oilseeds & Pulses',
    categoryGu: 'તેલીબિયાં અને કઠોળ',
    categoryHi: 'तिलहन और दालें',
    categoryMr: 'गळीतधान्ये व कडधान्ये',
    nameEn: 'Soybean',
    nameGu: 'સોયાબીન',
    nameHi: 'सोयाबीन',
    nameMr: 'सोयाबीन',
    icon: '🌱',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'JS-335 / Phule Kalyani',
    defaultUnit: 'tonne',
    typicalPricePerKg: 46,
    typicalYieldDistrict: 'Latur',
    descriptionEn: 'High protein, oil-rich yellow soybean from Latur-Marathwada belt.',
    descriptionGu: 'લાતૂર અને મરાઠાવાડા પંથકનું ઉચ્ચ પ્રોટીનયુક્ત પીળું સોયાબીન.',
    descriptionHi: 'लातूर-मराठवाड़ा क्षेत्र का उच्च प्रोटीन व तेल युक्त पीला सोयाबीन।',
    descriptionMr: 'लातूर-मराठवाडा पट्ट्यातील उच्च प्रथिने व तेलयुक्त पिवळे सोयाबीन.',
  },

  // 2. Cotton — कापूस
  {
    id: 'Cotton',
    category: 'Cash Crops & Spices',
    categoryEn: 'Cash Crops & Spices',
    categoryGu: 'રોકડિયા પાકો અને મસાલા',
    categoryHi: 'नकदी फसलें और मसाले',
    categoryMr: 'नगदी पिके व मसाले',
    nameEn: 'Cotton',
    nameGu: 'કપાસ',
    nameHi: 'कपास',
    nameMr: 'कापूस',
    icon: '☁️',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Bt Cotton Long Staple (30mm+)',
    defaultUnit: 'tonne',
    typicalPricePerKg: 72,
    typicalYieldDistrict: 'Nagpur',
    descriptionEn: 'Long staple, high-yield premium cotton from Vidarbha & Khandesh.',
    descriptionGu: 'વિદર્ભ અને ખાનદેશનો લાંબા તારવાળો શુદ્ધ સફેદ કપાસ.',
    descriptionHi: 'विदर्भ और खानदेश का लंबा रेशा युक्त प्रीमियम सफेद कपास।',
    descriptionMr: 'विदर्भ व खान्देशातील लांब धाग्याचा उत्कृष्ट पांढरा शुभ्र कापूस.',
  },

  // 3. Sugarcane — ऊस
  {
    id: 'Sugarcane',
    category: 'Cash Crops & Spices',
    categoryEn: 'Cash Crops & Spices',
    categoryGu: 'રોકડિયા પાકો અને મસાલા',
    categoryHi: 'नकदी फसलें और मसाले',
    categoryMr: 'नगदी पिके व मसाले',
    nameEn: 'Sugarcane',
    nameGu: 'શેરડી',
    nameHi: 'गन्ना',
    nameMr: 'ऊस',
    icon: '🎋',
    image: 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Co-86032 (Nira)',
    defaultUnit: 'tonne',
    typicalPricePerKg: 3.4,
    typicalYieldDistrict: 'Kolhapur',
    descriptionEn: 'High brix sucrose sugarcane preferred by cooperative sugar factories.',
    descriptionGu: 'કોલ્હાપુર અને સાંગલીનો ઉચ્ચ સુક્રોઝ અને ખાંડ ધરાવતી તાજી શેરડી.',
    descriptionHi: 'कोल्हापुर-सांगली का उच्च सुक्रोज युक्त शर्करा बहुल ताजा गन्ना।',
    descriptionMr: 'कोल्हापूर-सांगली भागातील उच्च सुक्रोज व साखर उतारा असलेला दर्जेदार ऊस.',
  },

  // 4. Onion — कांदा
  {
    id: 'Onion',
    category: 'Vegetables',
    categoryEn: 'Vegetables',
    categoryGu: 'શાકભાજી',
    categoryHi: 'सब्जियां',
    categoryMr: 'भाजीपाला',
    nameEn: 'Onion',
    nameGu: 'ડુંગળી',
    nameHi: 'प्याज',
    nameMr: 'कांदा',
    icon: '🧅',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Nashik & Lasalgaon Red Super',
    defaultUnit: 'tonne',
    typicalPricePerKg: 28.5,
    typicalYieldDistrict: 'Nashik',
    descriptionEn: 'World-famous Lasalgaon Nashik red onions with long storage life and high pungency.',
    descriptionGu: 'લાંબો સંગ્રહ સહન કરતી પ્રખ્યાત લાસલગાવ નાશિક લાલ ડુંગળી.',
    descriptionHi: 'विश्वप्रसिद्ध लासलगांव नासिक लाल प्याज, उत्कृष्ट भंडारण क्षमता और तीखा स्वाद।',
    descriptionMr: 'दीर्घकाळ टिकणारा, तिखट चवीचा आशियातील सर्वात मोठा लासलगाव नाशिक लाल कांदा.',
  },

  // 5. Grapes — द्राक्षे
  {
    id: 'Grapes',
    category: 'Fruits',
    categoryEn: 'Fruits',
    categoryGu: 'ફળો',
    categoryHi: 'फल',
    categoryMr: 'फळे',
    nameEn: 'Grapes',
    nameGu: 'દ્રાક્ષ',
    nameHi: 'अंगूर',
    nameMr: 'द्राक्षे',
    icon: '🍇',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Thompson Seedless / Manik Chaman',
    defaultUnit: 'kg',
    typicalPricePerKg: 85,
    typicalYieldDistrict: 'Nashik',
    descriptionEn: 'Export-quality sweet Thompson seedless green grapes from Nashik valley.',
    descriptionGu: 'નાશિક વેલીના નિકાસ લાયક મીઠાં થોમ્પસન બી વગરનાં દ્રાક્ષ.',
    descriptionHi: 'नासिक घाटी के निर्यात गुणवत्ता वाले मीठे थॉमसन सीडलेस अंगूर।',
    descriptionMr: 'नाशिक खोऱ्यातील निर्यातक्षम गोड थॉमसन सीडलेस हिरवी द्राक्षे.',
  },

  // 6. Pomegranate — डाळिंब
  {
    id: 'Pomegranate',
    category: 'Fruits',
    categoryEn: 'Fruits',
    categoryGu: 'ફળો',
    categoryHi: 'फल',
    categoryMr: 'फळे',
    nameEn: 'Pomegranate',
    nameGu: 'દાડમ',
    nameHi: 'अनार',
    nameMr: 'डाळिंब',
    icon: '🍎',
    image: 'https://images.unsplash.com/photo-1541344999736-83eca872f241?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Solapur Bhagwa (GI Certified)',
    defaultUnit: 'kg',
    typicalPricePerKg: 110,
    typicalYieldDistrict: 'Solapur',
    descriptionEn: 'Deep ruby-red arils, soft-seeded Bhagwa pomegranate from Solapur.',
    descriptionGu: 'સોલાપુરનું ડીપ રેબી રેડ સોફ્ટ બીજવાળું ભગવા દાડમ.',
    descriptionHi: 'सोलापुर का जीआई प्रमाणित गहरे लाल दानों वाला भगवा अनार।',
    descriptionMr: 'सोलापूरचे भौगोलिक निर्देशांक (GI) प्राप्त गडद लाल दाण्यांचे भगवा डाळिंब.',
  },

  // 7. Tur — तूर
  {
    id: 'Tur',
    category: 'Oilseeds & Pulses',
    categoryEn: 'Oilseeds & Pulses',
    categoryGu: 'તેલીબિયાં અને કઠોળ',
    categoryHi: 'तिलहन और दालें',
    categoryMr: 'गळीतधान्ये व कडधान्ये',
    nameEn: 'Tur (Pigeon Pea)',
    nameGu: 'તુવેર',
    nameHi: 'तूर (अरहर)',
    nameMr: 'तूर',
    icon: '🥣',
    image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Marathwada White / BDN-711',
    defaultUnit: 'tonne',
    typicalPricePerKg: 95,
    typicalYieldDistrict: 'Latur',
    descriptionEn: 'Premium bold grain pigeon pea from Latur dal mill hub.',
    descriptionGu: 'લાતૂર દાળ બજારની ઉત્તમ ક્વોલિટીની બોલ્ડ તુવેર.',
    descriptionHi: 'लातूर दाल हब का प्रीमियम बोल्ड दानेदार अरहर (तूर)।',
    descriptionMr: 'लातूर डाळ हबमधील ठळक दाण्याची प्रथिनयुक्त पांढरी व लाल तूर.',
  },

  // 8. Jowar — ज्वारी
  {
    id: 'Jowar',
    category: 'Cereals & Grains',
    categoryEn: 'Cereals & Grains',
    categoryGu: 'અનાજ અને ધાન્ય',
    categoryHi: 'अनाज और खाद्यान्न',
    categoryMr: 'अन्नधान्य व तृणधान्ये',
    nameEn: 'Jowar (Sorghum)',
    nameGu: 'જુવાર',
    nameHi: 'ज्वार',
    nameMr: 'ज्वारी',
    icon: '🌾',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Maldandi M-35-1 (Solapur)',
    defaultUnit: 'tonne',
    typicalPricePerKg: 38,
    typicalYieldDistrict: 'Solapur',
    descriptionEn: 'Celebrated Maldandi grain sorghum known for sweet soft rotis and high nutrition.',
    descriptionGu: 'સોલાપુરની સ્વાદિષ્ટ અને પૌષ્ટિક રોટલા માટે જાણીતી માલદાંડી જુવાર.',
    descriptionHi: 'स्वादिष्ट और मुलायम रोटियों के लिए विख्यात सोलापुर की मालदांडी ज्वार।',
    descriptionMr: 'मऊ, पांढऱ्याशुभ्र व चवदार भाकरीसाठी प्रसिद्ध सोलापूरची मालदांडी ज्वारी.',
  },

  // 9. Bajra — बाजरी
  {
    id: 'Bajra',
    category: 'Cereals & Grains',
    categoryEn: 'Cereals & Grains',
    categoryGu: 'અનાજ અને ધાન્ય',
    categoryHi: 'अनाज और खाद्यान्न',
    categoryMr: 'अन्नधान्य व तृणधान्ये',
    nameEn: 'Bajra (Pearl Millet)',
    nameGu: 'બાજરી',
    nameHi: 'बाजरा',
    nameMr: 'बाजरी',
    icon: '🌽',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Shraddha / Pioneer Hybrid',
    defaultUnit: 'tonne',
    typicalPricePerKg: 26,
    typicalYieldDistrict: 'Ahmednagar',
    descriptionEn: 'Drought-tolerant, mineral-rich pearl millet cultivated in western Maharashtra.',
    descriptionGu: 'પશ્ચિમ મહારાષ્ટ્રની પૌષ્ટિક અને ખનિજયુક્ત બાજરી.',
    descriptionHi: 'पश्चिमी महाराष्ट्र का पौष्टिक, खनिज संपन्‍न संकरित बाजरा।',
    descriptionMr: 'पश्चिम महाराष्ट्रातील पौष्टिक, खनिजयुक्त व दर्जेदार बाजरी.',
  },

  // 10. Rice — भात (तांदूळ)
  {
    id: 'Rice',
    category: 'Cereals & Grains',
    categoryEn: 'Cereals & Grains',
    categoryGu: 'અનાજ અને ધાન્ય',
    categoryHi: 'अनाज और खाद्यान्न',
    categoryMr: 'अन्नधान्य व तृणधान्ये',
    nameEn: 'Rice',
    nameGu: 'ચોખા (ડાંગર)',
    nameHi: 'चावल (धान)',
    nameMr: 'भात (तांदूळ)',
    icon: '🍚',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Indrayani / Wada Kolam',
    defaultUnit: 'tonne',
    typicalPricePerKg: 52,
    typicalYieldDistrict: 'Pune',
    descriptionEn: 'Aromatic soft-cooking Indrayani & Kolam rice from Western Ghats belt.',
    descriptionGu: 'પશ્ચિમ ઘાટ પંથકના સુગંધિત અને સ્વાદિષ્ટ ઇન્દ્રાયણી ચોખા.',
    descriptionHi: 'पश्चिमी घाट क्षेत्र का सुगंधित और मुलायम पकने वाला इंद्रायणी व कोलम चावल।',
    descriptionMr: 'मावळ व पश्चिम घाटातील सुवासिक, मऊ शिजणारा अस्सल इंद्रायणी व कोलम भात.',
  },

  // 11. Wheat — गहू
  {
    id: 'Wheat',
    category: 'Cereals & Grains',
    categoryEn: 'Cereals & Grains',
    categoryGu: 'અનાજ અને ધાન્ય',
    categoryHi: 'अनाज और खाद्यान्न',
    categoryMr: 'अन्नधान्य व तृणधान्ये',
    nameEn: 'Wheat',
    nameGu: 'ઘઉં',
    nameHi: 'गेहूं',
    nameMr: 'गहू',
    icon: '🍞',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Lokwan & Sharbati',
    defaultUnit: 'tonne',
    typicalPricePerKg: 32,
    typicalYieldDistrict: 'Jalgaon',
    descriptionEn: 'Golden bold grain Lokwan wheat popular for soft chapatis.',
    descriptionGu: 'નાશિક અને ખાનદેશનો ચમકદાર ગોલ્ડન લોકવન ઘઉં.',
    descriptionHi: 'नासिक और जलगांव का सुनहरे बोल्ड दानेदार लोकवन गेहूं।',
    descriptionMr: 'नाशिक व खान्देशातील टपोऱ्या दाण्यांचा चमकदार लोकवन व शरबती गहू.',
  },

  // 12. Turmeric — हळद
  {
    id: 'Turmeric',
    category: 'Cash Crops & Spices',
    categoryEn: 'Cash Crops & Spices',
    categoryGu: 'રોકડિયા પાકો અને મસાલા',
    categoryHi: 'नकदी फसलें और मसाले',
    categoryMr: 'नगदी पिके व मसाले',
    nameEn: 'Turmeric',
    nameGu: 'હળદર',
    nameHi: 'हल्दी',
    nameMr: 'हळद',
    icon: '🟡',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Sangli Rajapuri / Salem Golden',
    defaultUnit: 'kg',
    typicalPricePerKg: 145,
    typicalYieldDistrict: 'Kolhapur',
    descriptionEn: 'High curcumin content golden yellow turmeric fingers from Sangli spice exchange.',
    descriptionGu: 'સાંગલી માર્કેટની હાઇ કર્ક્યુમિન ધરાવતી તેજસ્વી રાજાપુરી હળદર.',
    descriptionHi: 'सांगली मसाला मंडी की उच्च करक्यूमिन युक्त सुनहरी राजापुरी हल्दी।',
    descriptionMr: 'सांगली हळद बाजारपेठेतील उच्च कर्क्युमिनयुक्त अस्सल राजापुरी हळद.',
  },

  // Legacy fallback crops (for backward compatibility)
  {
    id: 'Potato',
    category: 'Vegetables',
    categoryEn: 'Vegetables',
    categoryGu: 'શાકભાજી',
    categoryHi: 'सब्जियां',
    categoryMr: 'भाजीपाला',
    nameEn: 'Potato',
    nameGu: 'બટાટા',
    nameHi: 'आलू',
    nameMr: 'बटाटा',
    icon: '🥔',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Kufri Jyoti',
    defaultUnit: 'tonne',
    typicalPricePerKg: 22,
    typicalYieldDistrict: 'Pune',
    descriptionEn: 'Fresh table and processing grade potatoes from Manchar-Pune belt.',
    descriptionGu: 'મંચર-પુણે પંથકના તાજા બટાટા.',
    descriptionHi: 'मंचर-पुणे क्षेत्र के ताजे आलू।',
    descriptionMr: 'मंचर-पुणे भागातील दर्जेदार बटाटा.',
  },
  {
    id: 'Tomato',
    category: 'Vegetables',
    categoryEn: 'Vegetables',
    categoryGu: 'શાકભાજી',
    categoryHi: 'सब्जियां',
    categoryMr: 'भाजीपाला',
    nameEn: 'Tomato',
    nameGu: 'ટામેટા',
    nameHi: 'टमाटर',
    nameMr: 'टोमॅटो',
    icon: '🍅',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    defaultVariety: 'Narayangaon Red Hybrid',
    defaultUnit: 'kg',
    typicalPricePerKg: 26,
    typicalYieldDistrict: 'Pune',
    descriptionEn: 'Firm, juicy hybrid tomatoes from Narayangaon market hub.',
    descriptionGu: 'નારાયણગાંવ માર્કેટના તાજા લાલ ટામેટા.',
    descriptionHi: 'नारायणगांव मंडी के ताजे लाल संकरित टमाटर।',
    descriptionMr: 'नारायणगाव बाजारपेठेतील टणक व रसरशीत टोमॅटो.',
  },
];

// Helper to get localized crop name
export function getCropName(item: ProductCatalogItem, lang: Language): string {
  switch (lang) {
    case 'mr':
      return item.nameMr || item.nameEn;
    case 'hi':
      return item.nameHi || item.nameEn;
    case 'gu':
      return item.nameGu || item.nameEn;
    default:
      return item.nameEn;
  }
}

// Helper to get localized category name
export function getCategoryName(category: CropCategory, lang: Language): string {
  const cat = PRODUCT_CATEGORIES.find((c) => c.id === category);
  if (!cat) return category;
  switch (lang) {
    case 'mr':
      return cat.nameMr || cat.nameEn;
    case 'hi':
      return cat.nameHi || cat.nameEn;
    case 'gu':
      return cat.nameGu || cat.nameEn;
    default:
      return cat.nameEn;
  }
}

// Helper to get localized description
export function getCropDescription(item: ProductCatalogItem, lang: Language): string {
  switch (lang) {
    case 'mr':
      return item.descriptionMr || item.descriptionEn;
    case 'hi':
      return item.descriptionHi || item.descriptionEn;
    case 'gu':
      return item.descriptionGu || item.descriptionEn;
    default:
      return item.descriptionEn;
  }
}

// Helper to get product by id or name
export function getProductById(id: string | Crop): ProductCatalogItem | undefined {
  return PRODUCT_CATALOG.find((p) => p.id === id || p.nameEn.toLowerCase() === String(id).toLowerCase());
}

