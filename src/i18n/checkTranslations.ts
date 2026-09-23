import { TRANSLATIONS } from './translations';

export function runTranslationCoverageCheck(): {
  success: boolean;
  totalKeys: number;
  missingInHindi: string[];
  missingInGujarati: string[];
  missingInMarathi: string[];
} {
  const enKeys = Object.keys(TRANSLATIONS.en);
  const hiKeys = new Set(Object.keys(TRANSLATIONS.hi));
  const guKeys = new Set(Object.keys(TRANSLATIONS.gu));
  const mrKeys = new Set(Object.keys(TRANSLATIONS.mr));

  const missingInHindi: string[] = [];
  const missingInGujarati: string[] = [];
  const missingInMarathi: string[] = [];

  for (const key of enKeys) {
    if (!hiKeys.has(key)) {
      missingInHindi.push(key);
    }
    if (!guKeys.has(key)) {
      missingInGujarati.push(key);
    }
    if (!mrKeys.has(key)) {
      missingInMarathi.push(key);
    }
  }

  const success =
    missingInHindi.length === 0 &&
    missingInGujarati.length === 0 &&
    missingInMarathi.length === 0;

  console.log('==========================================');
  console.log('KRISHISETU 4-LANGUAGE TRANSLATION COVERAGE');
  console.log('==========================================');
  console.log(`Total Keys in English: ${enKeys.length}`);
  console.log(`Keys in Hindi: ${hiKeys.size} (Missing: ${missingInHindi.length})`);
  console.log(`Keys in Gujarati: ${guKeys.size} (Missing: ${missingInGujarati.length})`);
  console.log(`Keys in Marathi: ${mrKeys.size} (Missing: ${missingInMarathi.length})`);

  if (!success) {
    if (missingInHindi.length > 0) console.warn('Missing in Hindi:', missingInHindi);
    if (missingInGujarati.length > 0) console.warn('Missing in Gujarati:', missingInGujarati);
    if (missingInMarathi.length > 0) console.warn('Missing in Marathi:', missingInMarathi);
  } else {
    console.log('✅ 100% Full Translation Coverage across English, Gujarati, Hindi, and Marathi!');
  }
  console.log('==========================================');

  return {
    success,
    totalKeys: enKeys.length,
    missingInHindi,
    missingInGujarati,
    missingInMarathi,
  };
}
