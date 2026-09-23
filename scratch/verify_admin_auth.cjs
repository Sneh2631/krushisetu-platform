// @ts-check
const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ statusCode: res.statusCode, headers: res.headers, data: parsed });
        } catch (_) {
          resolve({ statusCode: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

function parseJwt(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  return JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
}

async function runAdminVerificationSuite() {
  console.log('🚀 Starting KrushiSetu Admin Authentication & Security Verification...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  const ADMIN_PHONE = '9274288006';
  const VALID_PASSWORD = '123456789';
  const INVALID_PASSWORD = 'wrong_password_999';
  const NON_ADMIN_PHONE = '9825012345';

  let adminToken = null;

  // --- TEST 1: Admin Login with Correct Credentials ---
  console.log('--- TEST 1: Admin Login with Correct Credentials ---');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/admin-login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { phone: ADMIN_PHONE, password: VALID_PASSWORD });

    assert(res.statusCode === 200, `Admin login successful (HTTP 200)`);
    assert(!!res.data?.token, `Received JWT session token`);
    assert(res.data?.user?.role === 'admin', `User object role is 'admin'`);
    assert(res.data?.user?.phone === ADMIN_PHONE, `User object phone matches admin phone (${ADMIN_PHONE})`);
    assert(!res.data?.user?.password && !res.data?.user?.passwordHash, `Password / passwordHash is NEVER leaked in response`);

    adminToken = res.data?.token;

    // Verify JWT payload
    if (adminToken) {
      const payload = parseJwt(adminToken);
      assert(payload?.role === 'admin', `JWT payload contains role: 'admin'`);
      assert(!payload?.password && !payload?.passwordHash, `JWT payload does NOT contain password or hash`);
    }
  } catch (err) {
    console.error('Test 1 error:', err.message);
  }

  // --- TEST 2: Admin Login with Invalid Password ---
  console.log('\n--- TEST 2: Admin Login with Invalid Password ---');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/admin-login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { phone: ADMIN_PHONE, password: INVALID_PASSWORD });

    assert(res.statusCode === 401, `Invalid password rejected with HTTP 401 Unauthorized`);
    assert(!res.data?.token, `No token issued for invalid password`);
  } catch (err) {
    console.error('Test 2 error:', err.message);
  }

  // --- TEST 3: Admin Login with Non-Admin Phone Number ---
  console.log('\n--- TEST 3: Admin Login with Non-Admin Phone Number ---');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/admin-login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { phone: NON_ADMIN_PHONE, password: VALID_PASSWORD });

    assert(res.statusCode === 403, `Non-admin phone rejected with HTTP 403 Forbidden`);
    assert(!res.data?.token, `No token issued for unauthorized phone`);
  } catch (err) {
    console.error('Test 3 error:', err.message);
  }

  // --- TEST 4: Block Admin OTP Request (Admin Must Use Password) ---
  console.log('\n--- TEST 4: Block Admin OTP Login (Separate from Buyer/Seller) ---');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/request-otp',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { phone: ADMIN_PHONE, role: 'admin' });

    assert(res.statusCode === 403, `OTP login blocked for admin role (HTTP 403)`);
  } catch (err) {
    console.error('Test 4 error:', err.message);
  }

  // --- TEST 5: Protected Route Access Without Authentication ---
  console.log('\n--- TEST 5: Protected Route Access Without Authentication ---');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/me',
      method: 'GET',
    });

    assert(res.statusCode === 401, `Unauthenticated request blocked from protected route (HTTP 401)`);
  } catch (err) {
    console.error('Test 5 error:', err.message);
  }

  // --- TEST 6: Protected Route Access With Admin Token ---
  console.log('\n--- TEST 6: Protected Route Access With Admin Token ---');
  try {
    if (adminToken) {
      const res = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/me',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });

      assert(res.statusCode === 200, `Admin access to /api/auth/me granted (HTTP 200)`);
      assert(res.data?.user?.role === 'admin', `Authenticated user profile has role 'admin'`);
      assert(!res.data?.user?.passwordHash, `Protected profile response omits passwordHash`);
    } else {
      assert(false, `Admin token was not obtained in Test 1`);
    }
  } catch (err) {
    console.error('Test 6 error:', err.message);
  }

  console.log('\n========================================');
  console.log(`FINAL RESULT: ${passed} / ${passed + failed} tests passed.`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAdminVerificationSuite().catch(console.error);
