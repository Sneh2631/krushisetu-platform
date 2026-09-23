import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Language, Crop, QualityGrade } from '../types';
import { TRANSLATIONS } from './translations';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, paramsOrFallback?: Record<string, string | number> | string, fallback?: string) => string;
  formatINR: (amount: number) => string;
  translateCrop: (crop: Crop | string) => string;
  translateStatus: (status: string) => string;
  translateGrade: (grade: QualityGrade | string) => string;
  translateBuyerType: (type: string) => string;
  translateMandi: (mandi: string) => string;
  translateDistrict: (district: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('krishisetu_lang') as Language;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'gu' || saved === 'mr')) {
        return saved;
      }
    } catch (_) {}
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('krishisetu_lang', lang);
    } catch (_) {}
  };

  // Update HTML lang attribute whenever language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (
    key: string,
    paramsOrFallback?: Record<string, string | number> | string,
    fallback?: string
  ): string => {
    if (!key) return '';
    const params = typeof paramsOrFallback === 'object' && paramsOrFallback !== null ? paramsOrFallback : undefined;
    const defaultText = typeof paramsOrFallback === 'string' ? paramsOrFallback : fallback;

    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let translation: string = langDict[key] || '';

    if (!translation) {
      // Fallback to English
      translation = TRANSLATIONS.en[key] || defaultText || '';
      if (!translation) {
        // Humanize missing key if fallback is missing
        const parts = key.split('.');
        const lastPart = parts[parts.length - 1] || key;
        translation = lastPart.replace(/([A-Z])/g, ' $1').trim() || key;
      }
    }

    // Interpolate dynamic parameters like {name}, {count}, etc.
    if (params && translation) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      });
    }

    return translation || key;
  };

  const formatINR = (amount: number): string => {
    if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const translateCrop = (crop: Crop | string): string => {
    const key = `crops.${crop}`;
    const result = t(key);
    return result !== key ? result : crop;
  };

  const translateStatus = (status: string): string => {
    const cleanKey = status.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '');
    const key = `status.${cleanKey}`;
    const result = t(key);
    return result !== key ? result : status;
  };

  const translateGrade = (grade: QualityGrade | string): string => {
    if (grade.includes('Grade A')) return t('grades.GradeA');
    if (grade.includes('Grade B')) return t('grades.GradeB');
    if (grade.includes('Grade C')) return t('grades.GradeC');
    return grade;
  };

  const translateBuyerType = (type: string): string => {
    const cleanKey = type.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '');
    const key = `buyerType.${cleanKey}`;
    const result = t(key);
    return result !== key ? result : type;
  };

  const translateMandi = (mandi: string): string => {
    const cleanKey = mandi.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '');
    const key = `mandi.${cleanKey}`;
    const result = t(key);
    return result !== key ? result : mandi;
  };

  const translateDistrict = (district: string): string => {
    const cleanKey = district.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '');
    const key = `districts.${cleanKey}`;
    const result = t(key);
    return result !== key ? result : district;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatINR,
        translateCrop,
        translateStatus,
        translateGrade,
        translateBuyerType,
        translateMandi,
        translateDistrict,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    console.warn('useTranslation used outside LanguageProvider; using fallback');
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string, paramsOrFallback?: Record<string, string | number> | string, fallback?: string) => {
        const defaultText = typeof paramsOrFallback === 'string' ? paramsOrFallback : fallback;
        return defaultText || key;
      },
      formatINR: (amount: number) => `₹${amount}`,
      translateCrop: (crop: Crop | string) => String(crop),
      translateStatus: (status: string) => status,
      translateGrade: (grade: QualityGrade | string) => String(grade),
      translateBuyerType: (type: string) => type,
      translateMandi: (mandi: string) => mandi,
      translateDistrict: (district: string) => district,
    };
  }
  return context;
};
