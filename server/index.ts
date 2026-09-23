import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { connectToDatabase, isDatabaseConnected } from './db/connection';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import listingRoutes from './routes/listingRoutes';
import verificationRoutes from './routes/verificationRoutes';
import offerRoutes from './routes/offerRoutes';
import dealRoutes from './routes/dealRoutes';
import transportRoutes from './routes/transportRoutes';
import notificationRoutes from './routes/notificationRoutes';
import newsRoutes from './routes/newsRoutes';
import auditRoutes from './routes/auditRoutes';
import buyerReqRoutes from './routes/buyerReqRoutes';
import uploadRoutes from './routes/uploadRoutes';
import cropRoutes from './routes/cropRoutes';
import {
  ProductCategory,
  Crop,
  Product,
  User,
  FarmerProfile,
  BuyerProfile,
  ProduceListing,
  Deal,
  News,
} from './models';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file hosting for local uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Health Check API with accurate database availability reporting (without leaking credentials)
app.get('/api/health', (req, res) => {
  const dbConnected = isDatabaseConnected();
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'online' : 'degraded',
    service: 'KrushiSetu Backend API (MongoDB Atlas)',
    databaseConnected: dbConnected,
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/transports', transportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/buyer-requirements', buyerReqRoutes);
app.use('/api/uploads', uploadRoutes);

// Seed initial product categories & demo accounts if empty
async function seedCatalogIfEmpty() {
  try {
    const categoryCount = await ProductCategory.countDocuments();
    if (categoryCount === 0) {
      await ProductCategory.insertMany([
        { code: 'Vegetables', nameGu: 'શાકભાજી', nameEn: 'Vegetables', displayOrder: 1, icon: '🥕' },
        { code: 'Fruits', nameGu: 'ફળો', nameEn: 'Fruits', displayOrder: 2, icon: '🥭' },
        { code: 'Spices', nameGu: 'મસાલા પાકો', nameEn: 'Spices', displayOrder: 3, icon: '🌿' },
        { code: 'Oilseeds & Pulses', nameGu: 'તેલીબિયાં અને કઠોળ', nameEn: 'Oilseeds & Pulses', displayOrder: 4, icon: '🌱' },
        { code: 'Cereals & Grains', nameGu: 'અનાજ અને ધાન્ય', nameEn: 'Cereals & Grains', displayOrder: 5, icon: '🌾' },
      ]);
      console.log('🌱 [MongoDB Atlas] Pre-seeded product categories.');
    }

    const cropCount = await Crop.countDocuments();
    if (cropCount === 0) {
      await Crop.insertMany([
        {
          cropId: 'Onion',
          normalizedName: 'onion',
          categoryCode: 'Vegetables',
          nameGu: 'ડુંગળી (કાંદા)',
          nameEn: 'Red Onion',
          primaryMarket: 'Lasalgaon / Mahuva',
          typicalSeason: 'Rabi & Kharif',
          defaultUnit: 'quintal',
          marketBenchmarkPrice: 2950,
          imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80',
          status: 'approved',
        },
        {
          cropId: 'Potato',
          normalizedName: 'potato',
          categoryCode: 'Vegetables',
          nameGu: 'બટાટા',
          nameEn: 'Potato',
          primaryMarket: 'Deesa & Pune',
          typicalSeason: 'Winter Harvest',
          defaultUnit: 'quintal',
          marketBenchmarkPrice: 1850,
          imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
          status: 'approved',
        },
        {
          cropId: 'KesarMango',
          normalizedName: 'kesarmango',
          categoryCode: 'Fruits',
          nameGu: 'ગીર કેસર કેરી (GI Tagged)',
          nameEn: 'Gir Kesar Mango',
          primaryMarket: 'Talala & Junagadh',
          typicalSeason: 'Summer (April - June)',
          defaultUnit: 'quintal',
          marketBenchmarkPrice: 12500,
          imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
          status: 'approved',
        },
        {
          cropId: 'Cumin',
          normalizedName: 'cumin',
          categoryCode: 'Spices',
          nameGu: 'જીરું (ઊંઝા સ્પેશિયલ)',
          nameEn: 'Cumin',
          primaryMarket: 'Unjha & Rajkot',
          typicalSeason: 'Rabi Harvest',
          defaultUnit: 'quintal',
          marketBenchmarkPrice: 28500,
          imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80',
          status: 'approved',
        },
        {
          cropId: 'Soybean',
          normalizedName: 'soybean',
          categoryCode: 'Oilseeds & Pulses',
          nameGu: 'સોયાબીન',
          nameEn: 'Soybean',
          primaryMarket: 'Latur & Nagpur',
          typicalSeason: 'Kharif Harvest',
          defaultUnit: 'quintal',
          marketBenchmarkPrice: 4800,
          imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80',
          status: 'approved',
        },
      ]);
      console.log('🌾 [MongoDB Atlas] Pre-seeded verified catalog crops.');
    }

    // Seed / Synchronize Admin Account with Hashed Password
    const adminPhone = (process.env.ADMIN_PHONE || '9274288006').trim();
    const adminPassword = (process.env.ADMIN_PASSWORD || '123456789').trim();
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

    const adminExists = await User.findOne({ phone: adminPhone }).select('+passwordHash');
    if (!adminExists) {
      await User.create({
        name: 'કૃષિસેતુ નોડલ એડમિનિસ્ટ્રેટર (GSAMB Director)',
        phone: adminPhone,
        passwordHash: adminPasswordHash,
        role: 'admin',
        isVerified: true,
        district: 'Gandhinagar',
        village: 'Sachivalay',
      });
      console.log(`🛡️ [MongoDB Atlas] Pre-seeded official Admin account (${adminPhone}) with secure password hash.`);
    } else {
      adminExists.role = 'admin';
      adminExists.passwordHash = adminPasswordHash;
      await adminExists.save();
      console.log(`🛡️ [MongoDB Atlas] Synchronized Admin credentials and security hash for (${adminPhone}).`);
    }

    // Seed Demo Farmers
    const farmer1 = await User.findOne({ phone: '9825012345' });
    if (!farmer1) {
      const farmer = await User.create({
        name: 'રમેશભાઈ પટેલ',
        phone: '9825012345',
        role: 'farmer',
        district: 'Bhavnagar',
        village: 'Mahuva',
        isVerified: true,
      });

      await FarmerProfile.create({
        userId: farmer._id,
        farmerCode: 'FAR-9141',
        primaryCrops: ['Onion', 'Cotton', 'Groundnut'],
        totalLandAcres: 8.5,
        fpoAffiliation: 'મહુવા ઓર્ગેનિક એગ્રી પ્રોડ્યુસર કંપની',
        bankDetails: {
          accountNumber: '9182374910293',
          ifscCode: 'SBIN0001234',
          accountHolderName: 'Rameshbhai Patel',
          bankName: 'State Bank of India (Mahuva)',
          upiId: 'rameshbhai@sbi',
        },
        pickupLocation: {
          district: 'Bhavnagar',
          village: 'Mahuva',
          address: 'Mahuva, Bhavnagar District, Gujarat',
        },
      });
      console.log('🚜 [MongoDB] Pre-seeded demo farmer profile (9825012345).');
    }

    const farmer2 = await User.findOne({ phone: '9825143210' });
    if (!farmer2) {
      const farmer = await User.create({
        name: 'Ramesh Patil (रमेश पाटील)',
        phone: '9825143210',
        role: 'farmer',
        district: 'Pune',
        village: 'Baramati Rural',
        isVerified: true,
      });

      const profileExists = await FarmerProfile.findOne({ userId: farmer._id });
      if (!profileExists) {
        await FarmerProfile.create({
          userId: farmer._id,
          farmerCode: 'FAR-9143',
          primaryCrops: ['Soybean', 'Onion', 'Sugarcane', 'Cotton'],
          totalLandAcres: 8.5,
          fpoAffiliation: 'Baramati Agro Farmers Producer Co.',
          pickupLocation: {
            district: 'Pune',
            village: 'Baramati Rural',
            address: 'Gat No. 42, Baramati-Phaltan Road, Baramati',
          },
        });
      }
      console.log('🚜 [MongoDB] Pre-seeded demo farmer profile (9825143210).');
    }

    // Seed Demo Buyer
    const buyer1 = await User.findOne({ phone: '9724012345' });
    if (!buyer1) {
      const buyer = await User.create({
        name: 'Rohan Deshmukh (रोहन देशमुख)',
        phone: '9724012345',
        role: 'buyer',
        district: 'Pune',
        village: 'Hadapsar Industrial Estate',
        isVerified: true,
      });

      await BuyerProfile.create({
        userId: buyer._id,
        buyerCode: 'BUY-5021',
        companyName: 'Chitale Agro & Dairy Foods Ltd',
        businessType: 'Institutional Processor',
        gstin: '27AAACB1234F1Z8',
        panNumber: 'AAACB1234F',
        headquartersDistrict: 'Pune',
      });
      console.log('🏢 [MongoDB] Pre-seeded demo buyer profile (9724012345).');
    }

    // Seed News if empty
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.insertMany([
        {
          titleGu: 'ગુજરાત સરકાર દ્વારા લાલ ડુંગળી અને કપાસના નવા ટેકાના ભાવ (MSP) જાહેર',
          titleEn: 'Gujarat Government Announces New MSP for Red Onion and Cotton',
          summaryGu: 'ખેડૂતોના હિતમાં રાજ્ય સરકાર દ્વારા મહુવા અને ગોંડલ માર્કેટ યાર્ડ માટે લાલ ડુંગળીનો નવો આધારભાવ જાહેર કરાયો છે.',
          summaryEn: 'Government announces higher minimum support price benchmark across Saurashtra APMC yards.',
          contentGu: 'ગુજરાત કૃષિ અને સહકાર વિભાગ દ્વારા વર્ષ ૨૦૨૬-૨૭ માટે લાલ ડુંગળીનો લઘુત્તમ ટેકાનો ભાવ ₹૨,૯૫૦ પ્રતિ ક્વિન્ટલ નક્કી કરવામાં આવ્યો છે.',
          contentEn: 'The Department of Agriculture, Government of Gujarat, has updated procurement benchmarks to protect farmer income.',
          category: 'MSP & Rates',
          publishedBy: 'GSAMB ગાંધીનગર',
          isPinned: true,
          tags: ['MSP', 'Onion', 'Government Scheme'],
        },
      ]);
      console.log('📰 [MongoDB Atlas] Pre-seeded news and announcements.');
    }
  } catch (err: unknown) {
    console.warn('⚠️ [MongoDB Atlas] Auto-seed notice:', (err as Error).message);
  }
}

// Start Server
async function startServer() {
  try {
    await connectToDatabase();
    await seedCatalogIfEmpty();
  } catch (dbErr: any) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ [KrushiSetu Fatal] Cannot start in production without valid MongoDB Atlas connection:', dbErr.message);
      process.exit(1);
    }
    console.warn('⚠️ [KrushiSetu] Database connection unavailable at startup. Server running in degraded mode:', dbErr.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 [KrushiSetu] Server running on http://localhost:${PORT}`);
    console.log(`📊 [MongoDB Atlas Dashboard] Access cloud clusters at https://cloud.mongodb.com/`);
  });
}

// Only start standalone HTTP server when run directly (not as a Vercel Serverless Function)
if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer().catch((err) => {
    console.error('❌ [KrushiSetu] Failed to start server:', err);
  });
}

export default app;
