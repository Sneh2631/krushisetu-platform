import React, { useState, useEffect } from 'react';
import { X, Sprout, CheckCircle2, AlertCircle, Sparkles, Image, Info } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { cropService, type MongoCropItem } from '../services/cropService';
import { PRODUCT_CATEGORIES, getCategoryName } from '../data/productCatalog';

interface NewCropRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCropName?: string;
  onCropRegistered: (newCrop: MongoCropItem) => void;
}

export const NewCropRegistrationModal: React.FC<NewCropRegistrationModalProps> = ({
  isOpen,
  onClose,
  initialCropName = '',
  onCropRegistered,
}) => {
  const { t, language } = useTranslation();

  const [nameEn, setNameEn] = useState(initialCropName);
  const [nameGu, setNameGu] = useState('');
  const [categoryCode, setCategoryCode] = useState<string>('Fruits');
  const [variety, setVariety] = useState('');
  const [typicalSeason, setTypicalSeason] = useState('Current Season / Year Round');
  const [defaultUnit, setDefaultUnit] = useState<'kg' | 'quintal' | 'tonne'>('quintal');
  const [marketBenchmarkPrice, setMarketBenchmarkPrice] = useState<string>('2500');
  const [primaryMarket, setPrimaryMarket] = useState('Local APMC / Farmgate');
  const [imageUrl, setImageUrl] = useState('');
  const [farmerNotes, setFarmerNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateMatch, setDuplicateMatch] = useState<MongoCropItem | null>(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

  // Sync initialCropName when modal opens
  useEffect(() => {
    if (isOpen) {
      setNameEn(initialCropName);
      setErrorMessage(null);
      setDuplicateMatch(null);
      // Auto-suggest Gujarati name if known (e.g. Banana -> કેળા)
      const normalized = initialCropName.trim().toLowerCase();
      if (normalized === 'banana') {
        setNameGu('કેળા (Banana)');
        setCategoryCode('Fruits');
        setVariety('Grand Naine / Robusta');
        setImageUrl('https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80');
      } else if (normalized === 'papaya') {
        setNameGu('પપૈયા');
        setCategoryCode('Fruits');
      } else if (normalized === 'guava') {
        setNameGu('જામફળ');
        setCategoryCode('Fruits');
      }
    }
  }, [isOpen, initialCropName]);

  // Real-time duplicate check with debounce
  useEffect(() => {
    if (!nameEn.trim() || nameEn.trim().length < 2) {
      setDuplicateMatch(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingDuplicate(true);
      try {
        const searchRes = await cropService.searchCrops(nameEn);
        if (searchRes.exactMatch) {
          setDuplicateMatch(searchRes.exactMatch);
        } else {
          setDuplicateMatch(null);
        }
      } catch {
        setDuplicateMatch(null);
      } finally {
        setCheckingDuplicate(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [nameEn]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nameEn.trim()) {
      setErrorMessage('English crop name is required');
      return;
    }
    if (!nameGu.trim()) {
      setErrorMessage('Gujarati crop name is required');
      return;
    }

    // If duplicate exists and is approved, suggest selecting it directly
    if (duplicateMatch && duplicateMatch.status === 'approved') {
      onCropRegistered(duplicateMatch);
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await cropService.requestNewCrop({
        nameEn: nameEn.trim(),
        nameGu: nameGu.trim(),
        categoryCode,
        variety: variety.trim() || undefined,
        typicalSeason: typicalSeason.trim() || undefined,
        defaultUnit,
        marketBenchmarkPrice: marketBenchmarkPrice ? parseFloat(marketBenchmarkPrice) : undefined,
        primaryMarket: primaryMarket.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        farmerNotes: farmerNotes.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Failed to register new crop.');
        setIsSubmitting(false);
        return;
      }

      if (res.crop) {
        onCropRegistered(res.crop);
        onClose();
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to save new crop to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#12261E] rounded-3xl border border-[#17362C]/20 dark:border-white/10 shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#17362C] dark:bg-[#0D1D16] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#D9FF55]/20 flex items-center justify-center text-[#D9FF55]">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#D9FF55]">
                {t('addNewCropTitle')}
              </h3>
              <p className="text-[11px] text-white/70">
                {t('addNewCropSubtitle')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Info Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#D9FF55] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">
                {t('instantListingNotice')}
              </span>
              <p className="text-[11px] opacity-90">
                {t('instantListingDesc')}
              </p>
            </div>
          </div>

          {/* Duplicate Notice */}
          {duplicateMatch && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  {t('cropAlreadyInDirNotice', { crop: duplicateMatch.nameEn })}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onCropRegistered(duplicateMatch);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] cursor-pointer"
              >
                {t('useExistingBtn')}
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Crop Names (English & Gujarati) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                {t('cropNameEnLabel')} *
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder={language === 'gu' ? "દા.ત. કેળા, જામફળ, આદુ" : language === 'hi' ? "उदा. केला, अमरूद, अदरक" : language === 'mr' ? "उदा. केळी, पेरू, आले" : "e.g. Banana, Guava, Ginger"}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                {t('cropNameGuLabel')} *
              </label>
              <input
                type="text"
                value={nameGu}
                onChange={(e) => setNameGu(e.target.value)}
                placeholder={language === 'gu' ? "દા.ત. કેળા, જામફળ, આદુ" : language === 'hi' ? "उदा. केला, अमरूद, अदरक" : language === 'mr' ? "उदा. केळी, पेरू, आले" : "e.g. Banana, Guava, Ginger"}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Category & Variety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                {t('cropCategoryLabel')} *
              </label>
              <select
                value={categoryCode}
                onChange={(e) => setCategoryCode(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="dark:bg-[#12261E]">
                    {cat.icon} {getCategoryName(cat.id as any, language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                {t('cropVarietyLabel')} (Optional)
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder={language === 'gu' ? "e.g. JS-335, Phule Kalyani..." : language === 'hi' ? "उदा. JS-335, फुले कल्याणी..." : language === 'mr' ? "उदा. JS-335, फुले कल्याणी..." : "e.g. JS-335, Phule Kalyani..."}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Season & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                {t('typicalSeasonLabel')}
              </label>
              <input
                type="text"
                value={typicalSeason}
                onChange={(e) => setTypicalSeason(e.target.value)}
                placeholder="e.g. Kharif, Rabi, Summer, Year Round"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                {t('defaultUnitLabel')}
              </label>
              <select
                value={defaultUnit}
                onChange={(e) => setDefaultUnit(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="quintal">{t('unitQuintal')}</option>
                <option value="tonne">{t('unitTonne')}</option>
                <option value="kg">{t('unitKg')}</option>
              </select>
            </div>
          </div>

          {/* Benchmark Price & Market */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                {t('benchmarkPriceLabel')}
              </label>
              <input
                type="number"
                value={marketBenchmarkPrice}
                onChange={(e) => setMarketBenchmarkPrice(e.target.value)}
                placeholder="2500"
                min="0"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                {t('primaryMarketLabel')}
              </label>
              <input
                type="text"
                value={primaryMarket}
                onChange={(e) => setPrimaryMarket(e.target.value)}
                placeholder="e.g. Pune, Jalgaon, Bharuch"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
              {t('cropImageLabel')} (Optional)
            </label>
            <div className="relative">
              <Image className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Farmer Notes */}
          <div>
            <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
              {t('farmerNotesLabel')} (Optional)
            </label>
            <textarea
              value={farmerNotes}
              onChange={(e) => setFarmerNotes(e.target.value)}
              placeholder="e.g. Fresh farm harvested, grown without artificial ripening chemicals..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-[#17362C]/10 dark:border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-neutral-300 dark:border-white/20 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || checkingDuplicate}
              className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? t('registeringCropBtn') : t('registerCropAndUseBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};