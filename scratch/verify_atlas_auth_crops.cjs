const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, data: parsed });
      });
    });
    req.on('error', (err) => reject(err));
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('🚀 Starting KrushiSetu MongoDB Atlas, Auth & Crop Verification...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  // 1. Backend Health Check
  console.log('--- TEST 1: Backend Health Check ---');
  try {
    const health = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET',
    });
    assert(health.statusCode === 200 || health.statusCode === 503, `Health check returned HTTP ${health.statusCode}`);
    assert(typeof health.data?.databaseConnected === 'boolean', `Health check returned databaseConnected: ${health.data?.databaseConnected}`);
    assert(!JSON.stringify(health.data).includes('mongodb+srv'), 'Health check does not leak credentials or connection string');
  } catch (err) {
    console.error('Health check error:', err.message);
  }

  // 2. Register Before Login Requirement
  console.log('\n--- TEST 2: Registration Before Login ---');
  const unregisteredPhone = '9999' + Math.floor(100000 + Math.random() * 900000);
  try {
    const otpRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/request-otp',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { phone: unregisteredPhone, role: 'farmer', isRegistration: false });

    assert(
      otpRes.statusCode === 404 && (otpRes.data?.code === 'ACCOUNT_NOT_FOUND' || otpRes.data?.error?.includes('register')),
      `Unregistered phone (${unregisteredPhone}) rejected with ACCOUNT_NOT_FOUND (HTTP ${otpRes.statusCode})`
    );
  } catch (err) {
    console.error('OTP rejection test error:', err.message);
  }

  // 3. User Registration Flow
  console.log('\n--- TEST 3: User Registration Flow ---');
  const testPhone = '9876' + Math.floor(100000 + Math.random() * 900000);
  let regToken = null;
  let testUserId = null;
  try {
    // Request OTP for registration
    const regOtpReq = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/request-otp',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { phone: testPhone, role: 'farmer', isRegistration: true });
    assert(regOtpReq.statusCode === 200, `Registration OTP sent for ${testPhone}`);

    // Register user
    const regRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      name: 'નરેશભાઈ પટેલ',
      phone: testPhone,
      role: 'farmer',
      district: 'Bhavnagar',
      taluka: 'Mahuva',
      village: 'Mahuva Rural',
      password: 'SecurePassword123!',
    });
    if (regRes.statusCode !== 201) {
      console.log('Registration response data:', JSON.stringify(regRes.data));
    }
    assert(regRes.statusCode === 201, `User successfully registered (HTTP ${regRes.statusCode})`);
    assert(!!regRes.data?.user?.id, `User received MongoDB ID: ${regRes.data?.user?.id}`);
    regToken = regRes.data?.token;
    testUserId = regRes.data?.user?.id;
  } catch (err) {
    console.error('Registration test error:', err.message);
  }

  // 4. Duplicate Registration Prevention
  console.log('\n--- TEST 4: Duplicate Phone Registration Prevention ---');
  try {
    const dupRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      name: 'ડુપ્લિકેટ યુઝર',
      phone: testPhone,
      role: 'farmer',
      district: 'Rajkot',
      village: 'Gondal',
    });
    assert(dupRes.statusCode === 409, `Duplicate registration rejected with HTTP 409 Conflict`);
  } catch (err) {
    console.error('Duplicate registration error:', err.message);
  }

  // 5. Crop Directory & Search
  console.log('\n--- TEST 5: Crop Catalog & Unlisted Crop Search ---');
  const uniqueCropName = 'DragonFruit' + Math.floor(100 + Math.random() * 900);
  try {
    const searchRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: `/api/crops/search?q=${encodeURIComponent(uniqueCropName)}`,
      method: 'GET',
    });
    assert(searchRes.statusCode === 200, `Crop search endpoint returned 200`);
    assert(searchRes.data?.exactMatch === null, `Unique crop "${uniqueCropName}" correctly identified as unlisted`);
  } catch (err) {
    console.error('Crop search error:', err.message);
  }

  // 6. Farmer Requests New Crop
  console.log('\n--- TEST 6: Farmer Requests New Crop Registration ---');
  let createdCropId = null;
  try {
    const reqCropRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/crops/request',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(regToken ? { 'Authorization': `Bearer ${regToken}` } : {}),
      },
    }, {
      nameEn: uniqueCropName,
      nameGu: 'ડ્રેગન ફ્રૂટ (કમલમ)',
      categoryCode: 'Fruits',
      variety: 'Red Flesh Cultivar',
      typicalSeason: 'Monsoon to Winter',
      defaultUnit: 'kg',
      marketBenchmarkPrice: 120,
      primaryMarket: 'Mahuva / Surat APMC',
      farmerNotes: 'Fresh organic harvest from Kutch cluster.',
    });
    assert(reqCropRes.statusCode === 201, `New crop registration created (HTTP 201)`);
    assert(reqCropRes.data?.crop?.status === 'pending', `New crop status is "pending"`);
    createdCropId = reqCropRes.data?.crop?._id;
  } catch (err) {
    console.error('New crop registration error:', err.message);
  }

  // 7. Duplicate Crop Submission Prevention
  console.log('\n--- TEST 7: Duplicate Crop Submission Prevention ---');
  try {
    const dupCropRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/crops/request',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      nameEn: uniqueCropName.toLowerCase(), // testing normalized case insensitivity
      categoryCode: 'Fruits',
    });
    assert(dupCropRes.statusCode === 409, `Duplicate normalized crop rejected with HTTP 409 Conflict`);
  } catch (err) {
    console.error('Duplicate crop test error:', err.message);
  }

  // 8. Admin Crop Review & Approval
  console.log('\n--- TEST 8: Admin Review & Approval Flow ---');
  try {
    if (createdCropId) {
      // Admin approves crop
      const reviewRes = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: `/api/crops/${createdCropId}/review`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }, {
        status: 'approved',
        marketBenchmarkPrice: 135,
      });
      assert(reviewRes.statusCode === 200, `Admin successfully approved crop (HTTP 200)`);
      assert(reviewRes.data?.crop?.status === 'approved', `Crop status updated to "approved"`);
      assert(reviewRes.data?.crop?.marketBenchmarkPrice === 135, `Admin calibrated benchmark price to ₹135`);
    }
  } catch (err) {
    console.error('Admin review error:', err.message);
  }

  console.log(`\n========================================`);
  console.log(`FINAL RESULT: ${passed} / ${total} tests passed.`);
  console.log(`========================================\n`);

  process.exit(passed === total ? 0 : 1);
}

runVerification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
