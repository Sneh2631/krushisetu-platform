import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from '../i18n/useTranslation';
import {
  Lock,
  Phone,
  KeyRound,
  X,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLoginSuccess,
}) => {
  const { loginWithAdminCredentials } = useAuth();
  const { t } = useTranslation();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await loginWithAdminCredentials(phone, password);
      if (result.success) {
        setPassword('');
        if (onLoginSuccess) onLoginSuccess();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMsg(result.errorKey ? t(result.errorKey) : t('authErrorInvalidAdminCredentials', 'Invalid Admin credentials.'));
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || t('loginFailed', 'Login failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#F6F1E4] dark:bg-[#132B23] text-[#132B23] dark:text-[#EDF5F1] rounded-3xl shadow-2xl border border-[#17362C]/20 dark:border-[#D9FF55]/20 overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="px-6 py-5 bg-[#17362C] dark:bg-[#0C1A14] text-[#F6F1E4] flex items-center justify-between border-b border-[#D9FF55]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center font-black text-lg shadow-md">
              🛡️
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#D9FF55]">
                MAHARASHTRA AGRI BOARD · MSAMB
              </div>
              <h2 className="text-base font-black text-white">
                {t('adminPortalTitle', 'Official Admin Portal')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D9FF55] transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAdminLoginSubmit} className="p-6 space-y-5">
          <div className="p-3.5 rounded-2xl bg-[#17362C]/5 dark:bg-white/5 border border-[#17362C]/10 dark:border-white/10 text-xs text-[#132B23]/80 dark:text-white/80 space-y-1">
            <div className="font-black text-[#132B23] dark:text-[#D9FF55] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#3F754A] dark:text-[#D9FF55]" />
              <span>{t('adminPortalTitle', 'Restricted Nodal Officer Access')}:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {t('adminPortalNotice', 'Restricted to authorized government nodal officers & MSAMB inspectors. Unauthorized access is strictly prohibited.')}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 flex items-start gap-2.5 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="font-bold">{errorMsg}</div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                {t('authAdminPhone', 'Official Admin Phone Number')} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#132B23]/50 dark:text-white/50" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#17362C]/20 dark:border-white/20 text-xs font-mono font-black text-[#132B23] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3F754A] dark:focus:ring-[#D9FF55]"
                  placeholder="Enter Admin Mobile"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#132B23] dark:text-white mb-1">
                {t('password', 'Secure Admin Password')} *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#132B23]/50 dark:text-white/50" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#17362C]/20 dark:border-white/20 text-xs font-mono font-bold text-[#132B23] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3F754A] dark:focus:ring-[#D9FF55]"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-[#17362C] dark:bg-[#D9FF55] text-[#D9FF55] dark:text-[#17362C] font-black text-xs shadow-xl hover:bg-[#244E3E] dark:hover:bg-lime-300 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? t('verifying', 'Verifying...') : t('adminLoginBtn', 'Login to Admin Portal')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
