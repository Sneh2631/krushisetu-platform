import { useState, useEffect } from 'react';
import { WifiOff, Download, X } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { t } = useTranslation();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-md animate-slide-down text-center text-xs md:text-sm font-semibold">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>{t('offlineBanner')}</span>
    </div>
  );
}

export function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the user is on mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileSize = window.innerWidth < 768;
      const isMobileUA = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileSize || isMobileUA);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install promotion
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Only show on mobile devices (as requested: "shows on mobile") and if prompted
  if (!isVisible || !isMobile) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 md:hidden bg-[#17362C] text-[#F6F1E4] p-4 rounded-xl shadow-2xl border border-[#D9FF55]/30 flex flex-col gap-3 animate-bounce-subtle">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2">
          <div className="p-2 bg-[#D9FF55]/15 rounded-lg text-[#D9FF55]">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#D9FF55]">{t('installAppTitle')}</h4>
            <p className="text-xs text-[#F6F1E4]/80 mt-0.5">{t('installAppDesc')}</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-[#F6F1E4]/60 hover:text-[#F6F1E4] p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 py-2 px-3 bg-[#D9FF55] text-[#17362C] font-black text-xs rounded-lg hover:scale-[1.02] active:scale-95 transition-all text-center"
        >
          {t('installAppBtn')}
        </button>
        <button
          onClick={handleDismiss}
          className="py-2 px-3 bg-white/10 text-[#F6F1E4] font-semibold text-xs rounded-lg hover:bg-white/20 transition-colors text-center"
        >
          {t('installLaterBtn')}
        </button>
      </div>
    </div>
  );
}
