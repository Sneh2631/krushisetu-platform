import type { Language } from '../types';

/**
 * Standardized Agricultural Quantity & Price Utilities for KrushiSetu
 * 
 * Rules:
 * - Internal standard unit is Kilograms (kg)
 * - 1 Tonne = 1,000 kg
 * - 1 Quintal (legacy) = 100 kg
 * - < 1,000 kg -> display in kg (e.g. 50 kg, 500 kg, 999 kg)
 * - >= 1,000 kg -> display in tonnes (e.g. 1,000 kg -> 1 tonne, 1,250 kg -> 1.25 tonnes, 10,000 kg -> 10 tonnes)
 */

export type QuantityUnit = 'kg' | 'tonne';

/**
 * Normalize any legacy quantity into kilograms
 */
export function normalizeQuantityToKg(amount: number, unit?: string): number {
  if (!unit || unit.toLowerCase() === 'kg' || unit.toLowerCase() === 'kilogram' || unit.toLowerCase() === 'kilograms') {
    return amount;
  }
  const u = unit.toLowerCase();
  if (u === 'ton' || u === 'tonne' || u === 'tonnes' || u === 'mt') {
    return amount * 1000;
  }
  if (u === 'qtl' || u === 'quintal' || u === 'quintals') {
    return amount * 100;
  }
  return amount;
}

export const normalizeQuantity = normalizeQuantityToKg;

export function tonnesToKilograms(tonnes: number): number {
  return (isNaN(tonnes) ? 0 : tonnes) * 1000;
}

export function quintalsToKilograms(quintals: number): number {
  return (isNaN(quintals) ? 0 : quintals) * 100;
}

export function kilogramsToDisplay(kgAmount: number, language: Language = 'en'): string {
  return formatQuantity(kgAmount, language);
}

/**
 * Parse legacy strings like "10 Ton", "25 qtl", "500 kg" into kg
 */
export function parseLegacyQuantity(quantityStr: string | number, unitFallback: string = 'kg'): number {
  if (typeof quantityStr === 'number') {
    return normalizeQuantityToKg(quantityStr, unitFallback);
  }
  const match = quantityStr.match(/^([\d.,]+)\s*(.*)$/);
  if (!match) return 0;
  const num = parseFloat(match[1].replace(/,/g, ''));
  const unit = match[2].trim() || unitFallback;
  return normalizeQuantityToKg(num, unit);
}

/**
 * Convert kilograms into farmer-friendly localized display string
 */
export function formatQuantity(
  kgAmount: number,
  language: Language = 'en',
  options?: { forceUnit?: QuantityUnit; decimals?: number }
): string {
  if (isNaN(kgAmount) || kgAmount <= 0) {
    return `0 ${getUnitLabel('kg', 0, language)}`;
  }

  const forceUnit = options?.forceUnit;
  const isTonne = forceUnit ? forceUnit === 'tonne' : kgAmount >= 1000;

  if (isTonne) {
    const tonnes = kgAmount / 1000;
    const rounded = options?.decimals !== undefined 
      ? Number(tonnes.toFixed(options.decimals))
      : Number(tonnes.toFixed(2));
    // Remove trailing zeroes like 1.00 -> 1
    const displayNum = rounded.toLocaleString(language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'gu-IN');
    return `${displayNum} ${getUnitLabel('tonne', rounded, language)}`;
  } else {
    const displayNum = Math.round(kgAmount).toLocaleString(language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'gu-IN');
    return `${displayNum} ${getUnitLabel('kg', kgAmount, language)}`;
  }
}

/**
 * Get translated unit label (handling English singular/plural for tonne)
 */
export function getUnitLabel(unit: QuantityUnit, amount: number = 1, language: Language = 'en'): string {
  if (unit === 'kg') {
    switch (language) {
      case 'hi':
        return 'किग्रा';
      case 'gu':
        return 'કિગ્રા';
      default:
        return 'kg';
    }
  }

  // Tonne / Tonnes
  switch (language) {
    case 'hi':
      return 'टन';
    case 'gu':
      return 'ટન';
    default:
      return amount === 1 ? 'tonne' : 'tonnes';
  }
}

/**
 * Convert legacy ₹/qtl rate to farmer-friendly ₹/kg rate
 * e.g. ₹2,800/qtl -> ₹28/kg
 */
export function convertRateToPerKg(ratePerQtl: number): number {
  return Math.round((ratePerQtl / 100) * 10) / 10;
}

/**
 * Format rate per kg with Indian Rupee symbol
 * e.g. ₹28/kg, ₹28.5/किग्रा, ₹28.5/કિગ્રા
 */
export function formatRatePerKg(ratePerKg: number, language: Language = 'en'): string {
  const unitLabel = getUnitLabel('kg', 1, language);
  const formattedNum = ratePerKg % 1 === 0 ? ratePerKg.toString() : ratePerKg.toFixed(1);
  return `₹${formattedNum}/${unitLabel}`;
}

/**
 * Calculate total value from kg and ₹/kg rate
 */
export function calculateTotalValue(kgAmount: number, ratePerKg: number): number {
  return Math.round(kgAmount * ratePerKg);
}
