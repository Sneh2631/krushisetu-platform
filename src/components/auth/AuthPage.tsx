import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';
import type { Language, UserRole } from '../../types';
import { ThemeToggle } from '../ThemeToggle';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Phone,
  Lock,
  Sparkles,
  AlertCircle,
  Globe,
  ChevronDown,
  RotateCw,
  Building2,
  User,
  MapPin,
} from 'lucide-react';
import { PRODUCT_CATALOG } from '../../data/productCatalog';

interface AuthPageProps {
  initialRole?: UserRole;
  initialMode?: 'login' | 'register';
  onBackToRoleSelection?: () => void;
  onBackToHome?: () => void;
}

const LANGUAGE_CHOICES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
];

const MAHARASHTRA_DISTRICTS = [
  'Pune',
  'Nashik',
  'Nagpur',
  'Kolhapur',
  'Solapur',
  'Latur',
  'Satara',
  'Jalgaon',
  'Ahmednagar',
  'Amravati',
  'Chhatrapati Sambhajinagar',
  'Nanded',
  'Sangli',
  'Buldhana',
  'Yavatmal',
];

export const AuthPage: React.FC<AuthPageProps> = ({
  initialRole = 'farmer',
  initialMode = 'login',
  onBackToRoleSelection,
  onBackToHome,
}) => {
  const {
    requestOtp,
    loginWithOtp,
    registerWithOtp,
    loginWithAdminCredentials,
    loginAsDemoFarmer,
    loginAsDemoBuyer,
    loginAsDemoAdmin,
  } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  const [role] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>(
    initialRole === 'admin' ? 'login' : initialMode
  );
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Common OTP & Mobile States
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Expiry & Cooldown Timers
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(0);

  // Farmer Registration Fields
  const [farmerName, setFarmerName] = useState('');
  const [farmerDistrict, setFarmerDistrict] = useState('Pune');
  const [farmerTaluka, setFarmerTaluka] = useState('Haveli');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [farmerLandSize, setFarmerLandSize] = useState('5-10 Acres');
  const [farmerCrops, setFarmerCrops] = useState<string[]>(['Soybean', 'Cotton', 'Sugarcane', 'Onion']);

  // Buyer Registration Fields
  const [buyerName, setBuyerName] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerType, setBuyerType] = useState('Food Processor');
  const [buyerDistrict, setBuyerDistrict] = useState('Pune');
  const [buyerDeliveryAddress, setBuyerDeliveryAddress] = useState('');
  const [buyerGst, setBuyerGst] = useState('');

  // Admin Credentials
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const currentLangLabel =
    LANGUAGE_CHOICES.find((l) => l.code === language)?.label || 'English';

  // Cooldown timer interval
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Expiry timer interval
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const timer = setInterval(() => {
      setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [expirySeconds]);

  // Crop toggle for farmer registration
  const handleCropToggle = (cropName: string) => {
    if (farmerCrops.includes(cropName)) {
      if (farmerCrops.length > 1) {
        setFarmerCrops(farmerCrops.filter((c) => c !== cropName));
      }
    } else {
      setFarmerCrops([...farmerCrops, cropName]);
    }
  };

  const cropOptions = PRODUCT_CATALOG.map((p) => {
    let localizedName = p.nameEn;
    if (language === 'mr') localizedName = p.nameMr;
    else if (language === 'gu') localizedName = p.nameGu;
    else if (language === 'hi') localizedName = p.nameHi;

    return {
      id: p.nameEn,
      label: localizedName,
      icon: p.icon,
    };
  });

  // Handle Request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    // Validate registration fields if registering
    if (authMode === 'register') {
      if (role === 'farmer' && !farmerName.trim()) {
        setErrorMessage(t('errorMissingFields', 'Please enter your Full Name.'));
        return;
      }
      if (role === 'buyer' && (!buyerName.trim() || !buyerCompany.trim())) {
        setErrorMessage(t('errorMissingFields', 'Please enter Contact Name and Company Name.'));
        return;
      }
    }

    setIsSendingOtp(true);
    try {
      const res = await requestOtp(mobile, role, authMode === 'register');
      if (!res.success) {
        if (res.errorKey === 'errorMobileAlreadyRegistered') {
          setErrorMessage(res.serverMessage || t('errorMobileAlreadyRegistered', 'This mobile number is already registered for this role. Please login instead.'));
        } else if (res.errorKey === 'errorRoleMismatch') {
          setErrorMessage(
            res.serverMessage ||
            `This mobile number is registered as a ${res.registeredRole || 'different role'}. Please switch to ${res.registeredRole || ''} login.`
          );
        } else if (res.errorKey === 'errorAccountNotFound' || res.errorKey === 'errorUserNotFound') {
          setErrorMessage(t('errorAccountNotFound', 'No account found with this mobile number. Please register first.'));
        } else if (res.errorKey === 'errorOtpCooldown') {
          setErrorMessage(t('errorOtpCooldown', 'Please wait before requesting another OTP.'));
        } else {
          setErrorMessage(res.serverMessage || t('errorInvalidMobile', 'Please enter a valid 10-digit Indian mobile number.'));
        }
        setIsSendingOtp(false);
        return;
      }

      setOtpSent(true);
      setCooldownSeconds(30);
      setExpirySeconds(300); // 5 minutes
      setSuccessNotice(
        t('otpSentNotice', '6-digit OTP sent to +91 {mobile}').replace('{mobile}', res.mobile || mobile)
      );
    } catch (_) {
      setErrorMessage('Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Verify & Login or Register
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMessage(t('errorInvalidOtp', 'Invalid OTP entered. Please check and try again.'));
      return;
    }

    setIsVerifying(true);
    try {
      if (authMode === 'login') {
        const res = await loginWithOtp(mobile, otp, role);
        if (!res.success) {
          if (res.errorKey === 'errorAccountNotFound' || res.errorKey === 'errorUserNotFound') {
            setErrorMessage(t('errorAccountNotFound', 'No account found with this mobile number. Please register first.'));
          } else if (res.errorKey === 'errorRoleMismatch') {
            setErrorMessage(
              res.message ||
              `This account is registered as a ${res.registeredRole || 'different role'}. Please switch to ${res.registeredRole || ''} login.`
            );
          } else if (res.errorKey === 'errorOtpExpired') {
            setErrorMessage(t('errorOtpExpired', 'This OTP has expired. Please request a fresh OTP.'));
          } else if (res.errorKey === 'errorMaxAttempts') {
            setErrorMessage(t('errorMaxAttempts', 'Maximum verification attempts exceeded. Please request a new OTP.'));
          } else {
            setErrorMessage(
              res.message ||
              (res.attemptsRemaining !== undefined
                ? `${t('errorInvalidOtp', 'Invalid OTP entered.')} (${res.attemptsRemaining} attempts left)`
                : t('errorInvalidOtp', 'Invalid OTP entered. Please check and try again.'))
            );
          }
          setIsVerifying(false);
          return;
        }
        // Success redirect handled by AuthContext
      } else {
        // Register Mode
        const newUserData = {
          name: role === 'farmer' ? farmerName : buyerName,
          mobile: mobile.trim(),
          role: role,
          accountType: role as 'farmer' | 'buyer',
          state: 'Maharashtra',
          district: role === 'farmer' ? farmerDistrict : buyerDistrict,
          taluka: role === 'farmer' ? farmerTaluka : '',
          village: role === 'farmer' ? farmerVillage : '',
          preferredLanguage: language,
          isVerified: true,
          verificationStatus: 'Verified' as const,
          // Farmer fields
          crops: role === 'farmer' ? farmerCrops : undefined,
          farmSize: role === 'farmer' ? farmerLandSize : undefined,
          // Buyer fields
          company: role === 'buyer' ? buyerCompany : undefined,
          companyName: role === 'buyer' ? buyerCompany : undefined,
          buyerType: role === 'buyer' ? buyerType : undefined,
          gstNumber: role === 'buyer' && buyerGst ? buyerGst : undefined,
          deliveryAddress: role === 'buyer' && buyerDeliveryAddress ? buyerDeliveryAddress : undefined,
        };

        const res = await registerWithOtp(newUserData, otp);
        if (!res.success) {
          if (res.errorKey === 'errorMobileAlreadyRegistered') {
            setErrorMessage(t('errorMobileAlreadyRegistered', 'This mobile number is already registered. Please login instead.'));
          } else if (res.errorKey === 'errorOtpExpired') {
            setErrorMessage(t('errorOtpExpired', 'This OTP has expired. Please request a fresh OTP.'));
          } else if (res.errorKey === 'errorMaxAttempts') {
            setErrorMessage(t('errorMaxAttempts', 'Maximum verification attempts exceeded. Please request a new OTP.'));
          } else {
            setErrorMessage(res.message || t('errorInvalidOtp', 'Invalid OTP entered. Please check and try again.'));
          }
          setIsVerifying(false);
          return;
        }
        // Success redirect handled by AuthContext
      }
    } catch (_) {
      setErrorMessage('Verification failed. Please try again.');
      setIsVerifying(false);
    }
  };

  // Handle Admin Credentials Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsVerifying(true);

    try {
      const res = await loginWithAdminCredentials(adminPhone, adminPassword);
      if (!res.success) {
        setErrorMessage(
          res.message || t('errorAdminAccessDenied', 'Admin portal is restricted to authorized MSAMB Nodal Officers.')
        );
        setIsVerifying(false);
        return;
      }
      // Redirect handled by AuthContext
    } catch (_) {
      setErrorMessage('Admin login failed. Please verify credentials.');
      setIsVerifying(false);
    }
  };

  // Format expiry time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getPortalTheme = () => {
    if (role === 'farmer') {
      return {
        badgeBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        primaryBtn: 'bg-[#17362C] hover:bg-[#244E3E] dark:bg-[#D9FF55] dark:hover:bg-lime-300 text-[#D9FF55] dark:text-[#17362C]',
        accentText: 'text-emerald-700 dark:text-emerald-400',
        icon: '🚜',
        title: t('roleCardSellerTitle', 'Seller / Farmer Portal'),
        sub: t('roleCardSellerDesc', 'Direct sales to verified corporate processors, APMC mandi price discovery, farm-gate logistics pickup, and 100% digital escrow safety.'),
      };
    }
    if (role === 'buyer') {
      return {
        badgeBg: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        primaryBtn: 'bg-[#FF7043] hover:bg-[#e65c2e] text-white',
        accentText: 'text-[#FF7043] dark:text-amber-400',
        icon: '🏢',
        title: t('roleCardBuyerTitle', 'Buyer / Corporate Procurement'),
        sub: t('roleCardBuyerDesc', 'Direct farmgate procurement of AGMARK graded crops from verified Maharashtra farmers with digital escrow and contract security.'),
      };
    }
    return {
      badgeBg: 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800',
      primaryBtn: 'bg-red-700 hover:bg-red-800 text-white',
      accentText: 'text-red-600 dark:text-red-400',
      icon: '🛡️',
      title: t('adminLoginTitle', 'MSAMB Admin Authentication'),
      sub: t('roleCardAdminDesc', 'Restricted government portal for produce quality inspection, KYC verification, and market governance.'),
    };
  };

  const theme = getPortalTheme();

  return (
    <div className="min-h-screen bg-[#F6F1E4] text-[#132B23] dark:bg-[#0B1713] dark:text-[#EDF5F1] flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-3.5 bg-[#17362C] dark:bg-[#0A1612] text-[#F6F1E4] flex items-center justify-between border-b border-[#D9FF55]/20 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToRoleSelection || onBackToHome}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#D9FF55] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title={onBackToRoleSelection ? t('backToRoleSelection', '← Back to Role Selection') : t('backToHomeBtn', '← Back to Home')}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
              {onBackToRoleSelection ? t('backToRoleSelection', 'Role Selection') : t('backToHomeBtn', 'Home')}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#D9FF55] text-[#17362C] flex items-center justify-center font-black text-lg shadow-md">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black font-editorial tracking-tight text-white">
                  KrushiSetu
                </span>
                <span className="text-[10px] font-bold text-[#D9FF55] bg-[#D9FF55]/20 px-1.5 py-0.5 rounded-full">
                  {t('stateBadge', 'Maharashtra')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top-Right Controls */}
        <div className="flex items-center gap-2">
          {/* 4-Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 text-[#F6F1E4] border border-white/10 text-xs font-bold transition-colors cursor-pointer"
              aria-label="Language Selector"
            >
              <Globe className="w-3.5 h-3.5 text-[#D9FF55]" />
              <span>{currentLangLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#17362C] dark:bg-[#0C1A14] border border-[#D9FF55]/20 shadow-2xl py-1.5 z-50 text-xs font-bold animate-scale-up">
                {LANGUAGE_CHOICES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setLanguage(item.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer ${
                      language === item.code ? 'text-[#D9FF55] font-black bg-white/5' : 'text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {language === item.code && <CheckCircle2 className="w-3.5 h-3.5 text-[#D9FF55]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
        {/* Development Mode Helpers Banner (Development Only) */}
        {import.meta.env.DEV && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t('devOtpBadge', 'Dev Mode: Test OTP is {otp}').replace('{otp}', '123456')}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 font-black">
                [Development Only]
              </span>
            </div>
            <div className="text-[11px] text-amber-800 dark:text-amber-300">
              One-Click Quick Login (Local Testing):
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {role === 'farmer' && (
                <button
                  type="button"
                  onClick={loginAsDemoFarmer}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {t('quickDemoFarmer', 'Quick Demo Farmer (Ramesh Patil)')}
                </button>
              )}
              {role === 'buyer' && (
                <button
                  type="button"
                  onClick={loginAsDemoBuyer}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {t('quickDemoBuyer', 'Quick Demo Buyer (Chitale Agro)')}
                </button>
              )}
              {role === 'admin' && (
                <button
                  type="button"
                  onClick={loginAsDemoAdmin}
                  className="px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {t('quickDemoAdmin', 'Quick Demo Admin (Dr. Suresh Patil)')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Portal Box */}
        <div className="w-full bg-white dark:bg-[#12261E] rounded-3xl border border-[#17362C]/15 dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header of Box */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">{theme.icon}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${theme.badgeBg}`}>
                {theme.title}
              </span>
            </div>
            <p className="text-xs text-[#132B23]/70 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
              {theme.sub}
            </p>
          </div>

          {/* Mode Switch Tabs for Farmer / Buyer (Admin has no registration) */}
          {role !== 'admin' && (
            <div className="flex p-1 rounded-2xl bg-[#F6F1E4] dark:bg-black/30 border border-[#17362C]/10 dark:border-white/10 text-xs font-black">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setOtpSent(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-[#1A382C] text-[#132B23] dark:text-white shadow-sm font-black'
                    : 'text-[#132B23]/60 dark:text-white/60 hover:text-[#132B23] dark:hover:text-white'
                }`}
              >
                {t('loginWithOtpTitle', 'Mobile OTP Login')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setOtpSent(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-[#1A382C] text-[#132B23] dark:text-white shadow-sm font-black'
                    : 'text-[#132B23]/60 dark:text-white/60 hover:text-[#132B23] dark:hover:text-white'
                }`}
              >
                {t('registerWithOtpTitle', 'Create Account with OTP')}
              </button>
            </div>
          )}

          {/* Error & Success Feedback Alerts */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs space-y-2 font-medium">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>{errorMessage}</span>
              </div>
              {(errorMessage.includes('register first') || errorMessage.includes('No account found')) && role !== 'admin' && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setOtpSent(false);
                      setErrorMessage(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{role === 'farmer' ? t('registerAsFarmerLink', 'Register as Farmer Now →') : t('registerAsBuyerLink', 'Register as Buyer Now →')}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* ADMIN LOGIN FORM */}
          {role === 'admin' ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>{t('roleCardAdminNotice', 'Restricted to authorized nodal officers. Public registration not permitted.')}</span>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                  {t('adminPhoneLabel', 'Authorized Admin Mobile')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="Enter Admin Mobile"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                  {t('adminPasswordLabel', 'Secure Admin Password')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 px-4 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>{t('verifyingOtp', 'Authenticating...')}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('adminLoginBtnAction', 'Authenticate as Admin')}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* FARMER & BUYER OTP LOGIN & REGISTRATION */
            <div className="space-y-4">
              {/* Registration Extra Fields (Shown before OTP in Register mode) */}
              {authMode === 'register' && (
                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                  {role === 'farmer' ? (
                    /* Farmer Registration Fields */
                    <>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                          {t('farmerFullName', 'Full Name (as per 7/12 record)')} *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={farmerName}
                            onChange={(e) => setFarmerName(e.target.value)}
                            placeholder="e.g. Ramesh Patil"
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                            {t('farmerDistrict', 'District (Maharashtra)')} *
                          </label>
                          <select
                            value={farmerDistrict}
                            onChange={(e) => setFarmerDistrict(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            {MAHARASHTRA_DISTRICTS.map((d) => (
                              <option key={d} value={d} className="dark:bg-[#12261E]">
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                            {t('farmerTaluka', 'Taluka')}
                          </label>
                          <input
                            type="text"
                            value={farmerTaluka}
                            onChange={(e) => setFarmerTaluka(e.target.value)}
                            placeholder="e.g. Haveli / Baramati"
                            className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                            {t('farmerVillage', 'Village')}
                          </label>
                          <input
                            type="text"
                            value={farmerVillage}
                            onChange={(e) => setFarmerVillage(e.target.value)}
                            placeholder="e.g. Baramati Rural"
                            className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                            {t('farmerLandSize', 'Farm / Land Size')}
                          </label>
                          <select
                            value={farmerLandSize}
                            onChange={(e) => setFarmerLandSize(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="< 2 Acres" className="dark:bg-[#12261E]">&lt; 2 Acres (Small)</option>
                            <option value="2-5 Acres" className="dark:bg-[#12261E]">2-5 Acres (Medium)</option>
                            <option value="5-10 Acres" className="dark:bg-[#12261E]">5-10 Acres (Commercial)</option>
                            <option value="10+ Acres" className="dark:bg-[#12261E]">10+ Acres (Large)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                          {t('farmerPrimaryCrops', 'Major Crops Grown')}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {cropOptions.map((crop) => (
                            <button
                              key={crop.id}
                              type="button"
                              onClick={() => handleCropToggle(crop.id)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                farmerCrops.includes(crop.id)
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-[#17362C]/5 dark:bg-white/10 text-[#132B23]/70 dark:text-white/70 hover:bg-[#17362C]/10'
                              }`}
                            >
                              <span>{crop.icon}</span>
                              <span>{crop.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Buyer Registration Fields */
                    <>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                          {t('buyerFullName', 'Contact Person Name')} *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            placeholder="e.g. Rohan Deshmukh"
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                          {t('buyerCompanyName', 'Company / Business Name')} *
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={buyerCompany}
                            onChange={(e) => setBuyerCompany(e.target.value)}
                            placeholder="e.g. Chitale Agro & Dairy Foods Ltd"
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                            {t('buyerType', 'Buyer Business Type')}
                          </label>
                          <select
                            value={buyerType}
                            onChange={(e) => setBuyerType(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="Food Processor" className="dark:bg-[#12261E]">Food Processor / FMCG</option>
                            <option value="Wholesaler / Trader" className="dark:bg-[#12261E]">Wholesaler / Mandi Trader</option>
                            <option value="Exporter" className="dark:bg-[#12261E]">Agricultural Exporter</option>
                            <option value="Retail Chain" className="dark:bg-[#12261E]">Retail / Supermarket Chain</option>
                            <option value="FPO Aggregator" className="dark:bg-[#12261E]">FPO Federation Aggregator</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                            {t('farmerDistrict', 'District (Maharashtra)')}
                          </label>
                          <select
                            value={buyerDistrict}
                            onChange={(e) => setBuyerDistrict(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                          >
                            {MAHARASHTRA_DISTRICTS.map((d) => (
                              <option key={d} value={d} className="dark:bg-[#12261E]">
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                            Delivery Warehouse / City
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input
                              type="text"
                              value={buyerDeliveryAddress}
                              onChange={(e) => setBuyerDeliveryAddress(e.target.value)}
                              placeholder="e.g. Hadapsar Industrial Area, Pune"
                              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                            {t('buyerGstOptional', 'GST Number (Optional)')}
                          </label>
                          <input
                            type="text"
                            value={buyerGst}
                            onChange={(e) => setBuyerGst(e.target.value.toUpperCase())}
                            placeholder="e.g. 27AAACB1234F1Z8"
                            className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Input Field */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#132B23] dark:text-neutral-200">
                  {t('mobileInputLabel', 'Mobile Number')} *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-[#132B23]/60 dark:text-white/60">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      if (otpSent) setOtpSent(false); // Reset OTP if mobile changes
                    }}
                    maxLength={10}
                    placeholder="9825143210"
                    disabled={otpSent && expirySeconds > 0}
                    className="w-full pl-12 pr-28 py-2.5 rounded-2xl bg-white dark:bg-black/20 border border-[#17362C]/20 dark:border-white/20 text-xs font-mono font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                    required
                  />

                  {/* Send OTP / Resend OTP Action Button */}
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    disabled={isSendingOtp || (otpSent && cooldownSeconds > 0) || !mobile.trim()}
                    className={`absolute right-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer disabled:opacity-40 ${
                      otpSent ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200' : theme.primaryBtn
                    }`}
                  >
                    {isSendingOtp ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : otpSent && cooldownSeconds > 0 ? (
                      <span>{cooldownSeconds}s</span>
                    ) : otpSent ? (
                      <span>{t('resendOtpBtn', 'Resend')}</span>
                    ) : (
                      <span>{t('requestOtpBtn', 'Send OTP')}</span>
                    )}
                  </button>
                </div>
              </div>

              {/* OTP Input Section (Visible once OTP is sent) */}
              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2 border-t border-[#17362C]/10 dark:border-white/10">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#132B23] dark:text-neutral-200">
                        {t('enterOtpLabel', 'Enter 6-Digit OTP')}
                      </label>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                        {t('otpExpiresIn', 'OTP expires in {time}').replace('{time}', formatTime(expirySeconds))}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      placeholder="• • • • • •"
                      className="w-full text-center tracking-[0.5em] text-lg font-black py-3 rounded-2xl bg-white dark:bg-black/20 border-2 border-[#17362C]/30 dark:border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      autoFocus
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || otp.length !== 6 || expirySeconds === 0}
                    className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${theme.primaryBtn}`}
                  >
                    {isVerifying ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>{t('verifyingOtp', 'Verifying...')}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {authMode === 'login'
                            ? t('verifyAndLoginBtn', 'Verify OTP & Login')
                            : t('createAccountBtn', 'Complete Registration & Proceed')}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Switch Auth Mode or Role Link */}
          <div className="pt-3 border-t border-[#17362C]/10 dark:border-white/10 text-center space-y-2">
            {role !== 'admin' && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {authMode === 'login' ? (
                  <>
                    <span>{t('newUserQuestion', 'New user?')}</span>{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('register');
                        setOtpSent(false);
                        setErrorMessage(null);
                      }}
                      className="font-black text-emerald-700 dark:text-[#D9FF55] hover:underline cursor-pointer ml-1"
                    >
                      {role === 'farmer' ? t('registerAsFarmerLink', 'Register as Farmer') : t('registerAsBuyerLink', 'Register as Buyer')}
                    </button>
                  </>
                ) : (
                  <>
                    <span>{t('alreadyHaveAccount', 'Already have an account?')}</span>{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setOtpSent(false);
                        setErrorMessage(null);
                      }}
                      className="font-black text-emerald-700 dark:text-[#D9FF55] hover:underline cursor-pointer ml-1"
                    >
                      {t('loginHere', 'Login here')}
                    </button>
                  </>
                )}
              </p>
            )}

            {onBackToRoleSelection && (
              <div>
                <button
                  type="button"
                  onClick={onBackToRoleSelection}
                  className="text-xs font-black text-[#17362C]/75 dark:text-white/75 hover:underline cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>{t('backToRoleSelection', '← Choose a different portal')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
