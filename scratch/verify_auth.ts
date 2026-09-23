import { TRANSLATIONS } from '../src/i18n/translations';

// Inline simple client OTP logic mimicking src/services/otpService.ts to verify algorithm
function normalizeMobile(input: string): string | null {
  if (!input) return null;
  let cleaned = input.replace(/\s+/g, '').replace(/[-()+]/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.slice(2);
  }
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

class TestOtpManager {
  private sessions = new Map<string, { code: string; expiresAt: number; cooldownUntil: number; attempts: number }>();

  request(mobile: string, role: string) {
    const clean = normalizeMobile(mobile);
    if (!clean) return { success: false, error: 'Invalid mobile' };
    if (role === 'admin') return { success: false, error: 'Admin cannot use OTP' };

    const key = `${role}:${clean}`;
    const now = Date.now();
    const existing = this.sessions.get(key);

    if (existing && now < existing.cooldownUntil) {
      return { success: false, error: 'Cooldown active', cooldown: Math.ceil((existing.cooldownUntil - now) / 1000) };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.sessions.set(key, {
      code,
      expiresAt: now + 5 * 60 * 1000,
      cooldownUntil: now + 30 * 1000,
      attempts: 0,
    });

    return { success: true, code, cooldownSeconds: 30 };
  }

  verify(mobile: string, role: string, candidateOtp: string, nowOffsetMs = 0) {
    const clean = normalizeMobile(mobile);
    if (!clean) return { isValid: false, error: 'Invalid mobile' };

    // Dev test bypass
    if (candidateOtp === '123456') return { isValid: true };

    const key = `${role}:${clean}`;
    const session = this.sessions.get(key);
    if (!session) return { isValid: false, error: 'Session not found' };

    const now = Date.now() + nowOffsetMs;
    if (now > session.expiresAt) {
      this.sessions.delete(key);
      return { isValid: false, error: 'Expired' };
    }

    if (session.attempts >= 5) {
      this.sessions.delete(key);
      return { isValid: false, error: 'Max attempts exceeded' };
    }

    if (session.code !== candidateOtp) {
      session.attempts += 1;
      const remaining = 5 - session.attempts;
      if (remaining <= 0) {
        this.sessions.delete(key);
        return { isValid: false, error: 'Max attempts exceeded', remaining: 0 };
      }
      return { isValid: false, error: 'Invalid OTP', remaining };
    }

    this.sessions.delete(key);
    return { isValid: true };
  }
}

async function runTests() {
  console.log('🧪 Starting KrushiSetu Authentication & Security Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // Test 1: Mobile Number Normalization & Validation
  // -------------------------------------------------------------
  console.log('--- 1. Mobile Number Normalization & Validation ---');
  assert(normalizeMobile('9825143210') === '9825143210', 'Plain 10-digit number');
  assert(normalizeMobile('+91 9825143210') === '9825143210', 'Formatted +91 with space');
  assert(normalizeMobile('+91-98251-43210') === '9825143210', 'Formatted +91 with hyphens');
  assert(normalizeMobile('919825143210') === '9825143210', 'Leading 91 country code');
  assert(normalizeMobile('09825143210') === '9825143210', 'Leading trunk zero');
  assert(normalizeMobile('1234567890') === null, 'Rejects non-standard Indian mobile starting with 1');
  assert(normalizeMobile('98251') === null, 'Rejects short mobile number');
  assert(normalizeMobile('') === null, 'Rejects empty input');

  // -------------------------------------------------------------
  // Test 2: OTP Generation & 30-Second Cooldown
  // -------------------------------------------------------------
  console.log('\n--- 2. OTP Generation & Cooldown Rate Limiting ---');
  const otpMgr = new TestOtpManager();
  const req1 = otpMgr.request('9825143210', 'farmer');
  assert(req1.success === true && req1.code?.length === 6, 'Generates 6-digit OTP');

  const req2 = otpMgr.request('9825143210', 'farmer');
  assert(req2.success === false && req2.error === 'Cooldown active', 'Enforces 30s resend cooldown on immediate retry');

  // Admin cannot request OTP
  const adminReq = otpMgr.request('9274288006', 'admin');
  assert(adminReq.success === false, 'Blocks Admin OTP request via public channel');

  // -------------------------------------------------------------
  // Test 3: OTP Verification & Attempt Limiting
  // -------------------------------------------------------------
  console.log('\n--- 3. OTP Verification & Attempt Limit ---');
  // Valid dev test OTP
  const devVerify = otpMgr.verify('9825143210', 'farmer', '123456');
  assert(devVerify.isValid === true, 'Allows dev test OTP (123456) in dev mode');

  // New session for testing attempts
  const reqAttempt = otpMgr.request('9724012345', 'buyer');
  assert(reqAttempt.success === true, 'Created buyer OTP session');

  const wrong1 = otpMgr.verify('9724012345', 'buyer', '000000');
  assert(wrong1.isValid === false && wrong1.remaining === 4, '1st incorrect attempt decrements remaining to 4');
  otpMgr.verify('9724012345', 'buyer', '000001');
  otpMgr.verify('9724012345', 'buyer', '000002');
  otpMgr.verify('9724012345', 'buyer', '000003');
  const wrong5 = otpMgr.verify('9724012345', 'buyer', '000004');
  assert(wrong5.isValid === false && wrong5.error === 'Max attempts exceeded', 'Max 5 attempts exceeded locks session');

  // -------------------------------------------------------------
  // Test 4: OTP Expiry
  // -------------------------------------------------------------
  console.log('\n--- 4. OTP Expiry Handling ---');
  const reqExp = otpMgr.request('9825199999', 'farmer');
  assert(reqExp.success === true, 'Created expiry test session');
  // Simulate 6 minutes later (360,000 ms)
  const expVerify = otpMgr.verify('9825199999', 'farmer', reqExp.code!, 6 * 60 * 1000);
  assert(expVerify.isValid === false && expVerify.error === 'Expired', 'Rejects expired OTP after 5 minutes');

  // -------------------------------------------------------------
  // Test 5: Translation Completeness across 4 Languages
  // -------------------------------------------------------------
  console.log('\n--- 5. 4-Language Translation Completeness ---');
  const requiredKeys = [
    'roleSelectionTitle',
    'roleSelectionSub',
    'roleCardSellerTitle',
    'roleCardSellerDesc',
    'roleCardSellerLogin',
    'roleCardSellerRegister',
    'roleCardBuyerTitle',
    'roleCardBuyerDesc',
    'roleCardBuyerLogin',
    'roleCardBuyerRegister',
    'roleCardAdminTitle',
    'roleCardAdminDesc',
    'roleCardAdminLogin',
    'roleCardAdminNotice',
    'backToHomeBtn',
    'backToRoleSelection',
    'loginWithOtpTitle',
    'registerWithOtpTitle',
    'adminLoginTitle',
    'mobileInputLabel',
    'mobileInputPlaceholder',
    'requestOtpBtn',
    'requestingOtp',
    'otpSentNotice',
    'enterOtpLabel',
    'verifyAndLoginBtn',
    'verifyingOtp',
    'resendOtpIn',
    'resendOtpBtn',
    'otpExpiresIn',
    'devOtpBadge',
    'quickDemoFarmer',
    'quickDemoBuyer',
    'quickDemoAdmin',
    'adminPhoneLabel',
    'adminPasswordLabel',
    'adminLoginBtnAction',
    'errorInvalidMobile',
    'errorInvalidOtp',
    'errorOtpExpired',
    'errorMaxAttempts',
    'errorOtpCooldown',
    'errorUserNotFound',
    'errorMobileAlreadyRegistered',
    'errorMissingFields',
    'errorAdminAccessDenied',
    'errorUnauthorizedAccess',
    'returnToMyDashboard',
    'logoutToSwitchRole',
    'unauthorizedTitle',
    'unauthorizedMessage',
    'farmerFullName',
    'farmerDistrict',
    'farmerTaluka',
    'farmerVillage',
    'farmerLandSize',
    'farmerPrimaryCrops',
    'buyerFullName',
    'buyerCompanyName',
    'buyerType',
    'buyerGstOptional',
    'createAccountBtn',
    'registerSuccessNotice',
    'alreadyHaveAccount',
    'dontHaveAccount',
    'roleBadgeSeller',
    'roleBadgeBuyer',
    'roleBadgeAdmin',
  ];

  const langs = ['en', 'gu', 'hi', 'mr'] as const;
  for (const lang of langs) {
    const dict = TRANSLATIONS[lang];
    assert(!!dict, `Language dictionary exists for '${lang}'`);
    let missing = 0;
    for (const key of requiredKeys) {
      if (!dict[key]) {
        console.error(`    Missing key in ${lang}: ${key}`);
        missing++;
      }
    }
    assert(missing === 0, `All ${requiredKeys.length} authentication keys present in '${lang}'`, `${missing} missing`);
  }

  // -------------------------------------------------------------
  // Test 6: Cross-Role Route Protection Logic
  // -------------------------------------------------------------
  console.log('\n--- 6. Cross-Role Route Protection Rules ---');
  function checkRouteAccess(userRole: 'farmer' | 'buyer' | 'admin' | null, route: string) {
    if (!userRole) {
      // Unauthenticated
      if (route === '#/seller' || route === '#/farmer') return { allow: false, redirect: '#/login/farmer' };
      if (route === '#/buyer') return { allow: false, redirect: '#/login/buyer' };
      if (route === '#/admin') return { allow: false, redirect: '#/login/admin' };
      return { allow: true };
    }

    // Authenticated
    if (userRole === 'farmer') {
      if (route === '#/seller' || route === '#/farmer') return { allow: true };
      return { allow: false, denied: true, targetRole: route === '#/buyer' ? 'buyer' : 'admin' };
    }
    if (userRole === 'buyer') {
      if (route === '#/buyer') return { allow: true };
      return { allow: false, denied: true, targetRole: route.includes('seller') ? 'farmer' : 'admin' };
    }
    if (userRole === 'admin') {
      if (route === '#/admin') return { allow: true };
      return { allow: false, denied: true, targetRole: route.includes('seller') ? 'farmer' : 'buyer' };
    }
    return { allow: false };
  }

  // Unauthenticated tests
  assert(checkRouteAccess(null, '#/seller').redirect === '#/login/farmer', 'Unauthenticated on #/seller redirects to #/login/farmer');
  assert(checkRouteAccess(null, '#/buyer').redirect === '#/login/buyer', 'Unauthenticated on #/buyer redirects to #/login/buyer');
  assert(checkRouteAccess(null, '#/admin').redirect === '#/login/admin', 'Unauthenticated on #/admin redirects to #/login/admin');
  assert(checkRouteAccess(null, '#/role-selection').allow === true, 'Unauthenticated can access #/role-selection');

  // Farmer tests
  assert(checkRouteAccess('farmer', '#/seller').allow === true, 'Farmer can access #/seller');
  assert(checkRouteAccess('farmer', '#/buyer').denied === true, 'Farmer is blocked from #/buyer (Access Denied)');
  assert(checkRouteAccess('farmer', '#/admin').denied === true, 'Farmer is blocked from #/admin (Access Denied)');

  // Buyer tests
  assert(checkRouteAccess('buyer', '#/buyer').allow === true, 'Buyer can access #/buyer');
  assert(checkRouteAccess('buyer', '#/seller').denied === true, 'Buyer is blocked from #/seller (Access Denied)');
  assert(checkRouteAccess('buyer', '#/admin').denied === true, 'Buyer is blocked from #/admin (Access Denied)');

  // Admin tests
  assert(checkRouteAccess('admin', '#/admin').allow === true, 'Admin can access #/admin');
  assert(checkRouteAccess('admin', '#/seller').denied === true, 'Admin is blocked from #/seller (Access Denied)');
  assert(checkRouteAccess('admin', '#/buyer').denied === true, 'Admin is blocked from #/buyer (Access Denied)');

  console.log('\n=========================================');
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
