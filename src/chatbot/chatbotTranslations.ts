import type { Language } from '../types';

export interface ChatbotUIStrings {
  title: string;
  onlineStatus: string;
  autoReadOn: string;
  autoReadOff: string;
  clear: string;
  clearConfirmTitle: string;
  clearConfirmMessage: string;
  inputPlaceholder: string;
  send: string;
  privacyNotice: string;
  listening: string;
  processing: string;
  speaking: string;
  voiceNotSupported: string;
  voiceUnavailableGu: string;
  voiceUnavailableHi: string;
  micPermissionRequired: string;
}

export const CHATBOT_UI_TRANSLATIONS: Record<Language, ChatbotUIStrings> = {
  en: {
    title: 'KrishiSahayak',
    onlineStatus: 'Online and ready to help',
    autoReadOn: 'Auto-read replies: ON',
    autoReadOff: 'Auto-read replies: OFF',
    clear: 'Clear conversation',
    clearConfirmTitle: 'Clear conversation?',
    clearConfirmMessage: 'This will reset your chat history and start fresh.',
    inputPlaceholder: 'Ask in English, Hindi, or Gujarati...',
    send: 'Send message',
    privacyNotice: 'Your demo conversation stays on this device.',
    listening: 'Listening…',
    processing: 'Processing…',
    speaking: 'Speaking…',
    voiceNotSupported: 'Voice input is not supported in this browser',
    voiceUnavailableGu: 'Gujarati voice is not installed on this device',
    voiceUnavailableHi: 'Hindi voice is not installed on this device',
    micPermissionRequired: 'Microphone permission is required',
  },
  hi: {
    title: 'कृषि सहायक',
    onlineStatus: 'ऑनलाइन और सहायता के लिए तैयार',
    autoReadOn: 'उत्तर स्वतः बोलें: चालू',
    autoReadOff: 'उत्तर स्वतः बोलें: बंद',
    clear: 'बातचीत साफ़ करें',
    clearConfirmTitle: 'क्या बातचीत साफ़ करें?',
    clearConfirmMessage: 'इससे आपकी पिछली बातचीत हट जाएगी और नई शुरुआत होगी।',
    inputPlaceholder: 'हिंदी, गुजराती या अंग्रेजी में पूछें...',
    send: 'संदेश भेजें',
    privacyNotice: 'आपकी डेमो बातचीत इसी उपकरण पर रहती है।',
    listening: 'सुन रहा हूँ…',
    processing: 'प्रक्रिया जारी है…',
    speaking: 'बोल रहा हूँ…',
    voiceNotSupported: 'यह ब्राउज़र आवाज़ से प्रश्न पूछने की सुविधा का समर्थन नहीं करता',
    voiceUnavailableGu: 'इस उपकरण पर गुजराती आवाज़ उपलब्ध नहीं है',
    voiceUnavailableHi: 'इस उपकरण पर हिंदी आवाज़ उपलब्ध नहीं है',
    micPermissionRequired: 'माइक्रोफ़ोन की अनुमति आवश्यक है',
  },
  gu: {
    title: 'કૃષિ સહાયક',
    onlineStatus: 'ઓનલાઇન અને મદદ માટે તૈયાર',
    autoReadOn: 'જવાબ આપમેળે બોલો: ચાલુ',
    autoReadOff: 'જવાબ આપમેળે બોલો: બંધ',
    clear: 'વાતચીત સાફ કરો',
    clearConfirmTitle: 'શું વાતચીત સાફ કરવી છે?',
    clearConfirmMessage: 'આનાથી તમારી જૂની વાતચીત હટી જશે અને નવી શરૂઆત થશે.',
    inputPlaceholder: 'ગુજરાતી, હિન્દી કે અંગ્રેજીમાં પૂછો...',
    send: 'સંદેશ મોકલો',
    privacyNotice: 'તમારી ડેમો વાતચીત આ ઉપકરણમાં જ રહે છે.',
    listening: 'સાંભળી રહ્યો છું…',
    processing: 'પ્રક્રિયા ચાલુ છે…',
    speaking: 'બોલી રહ્યો છું…',
    voiceNotSupported: 'આ બ્રાઉઝર અવાજ દ્વારા પ્રશ્ન પૂછવાની સુવિધાને સપોર્ટ કરતું નથી',
    voiceUnavailableGu: 'આ ઉપકરણમાં ગુજરાતી અવાજ ઉપલબ્ધ નથી',
    voiceUnavailableHi: 'આ ઉપકરણમાં હિન્દી અવાજ ઉપલબ્ધ નથી',
    micPermissionRequired: 'માઇક્રોફોનની પરવાનગી જરૂરી છે',
  },
  mr: {
    title: 'कृषी सहाय्यक',
    onlineStatus: 'ऑनलाइन आणि साहाय्यासाठी सज्ज',
    autoReadOn: 'उत्तर आपोआप वाचा: चालू',
    autoReadOff: 'उत्तर आपोआप वाचा: बंद',
    clear: 'संभाषण साफ करा',
    clearConfirmTitle: 'संभाषण साफ करायचे आहे का?',
    clearConfirmMessage: 'यामुळे तुमचे मागील संभाषण नष्ट होईल आणि नवीन सुरुवात होईल.',
    inputPlaceholder: 'मराठी, हिंदी, गुजराती किंवा इंग्रजीत विचारा...',
    send: 'संदेश पाठवा',
    privacyNotice: 'तुमचे डेमो संभाषण या डिव्हाइसवरच सुरक्षित राहते.',
    listening: 'ऐकत आहे…',
    processing: 'प्रक्रिया सुरू आहे…',
    speaking: 'बोलत आहे…',
    voiceNotSupported: 'हे ब्राउझर आवाजाद्वारे प्रश्न विचारण्यास समर्थन देत नाही',
    voiceUnavailableGu: 'या डिव्हाइसवर गुजराती आवाज उपलब्ध नाही',
    voiceUnavailableHi: 'या डिव्हाइसवर हिंदी आवाज उपलब्ध नाही',
    micPermissionRequired: 'मायक्रोफोनची परवानगी आवश्यक आहे',
  },
};
