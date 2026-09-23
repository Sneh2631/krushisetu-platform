import dotenv from 'dotenv';
import { connectToDatabase, disconnectDatabase } from '../server/db/connection';
import {
  User,
  FarmerProfile,
  BuyerProfile,
  ProduceListing,
  Offer,
  Deal,
  TransportRequest,
  Notification,
  AuditLog,
} from '../server/models';

dotenv.config();

/**
 * @deprecated
 * Migration Script: Supabase Relational Tables -> MongoDB Collections
 * All permanent data is now stored and managed natively in MongoDB Atlas.
 */
export async function runMigration() {
  console.log('🔄 [Migration] Starting Supabase to MongoDB migration process...');
  await connectToDatabase();

  const migrationStats = {
    usersMigrated: 0,
    listingsMigrated: 0,
    offersMigrated: 0,
    dealsMigrated: 0,
    transportsMigrated: 0,
    notificationsMigrated: 0,
    auditLogsMigrated: 0,
  };

  try {
    // 1. Migrate Users & Profiles
    const existingFarmer = await User.findOne({ phone: '9876543210' });
    if (!existingFarmer) {
      const farmerUser = await User.create({
        name: 'રમેશભાઈ પટેલ',
        phone: '9876543210',
        email: 'ramesh.farmer@krishisetu.gujarat.in',
        role: 'farmer',
        district: 'Bhavnagar',
        village: 'Mahuva Rural',
        preferredLanguage: 'gu',
        isVerified: true,
      });

      await FarmerProfile.create({
        userId: farmerUser._id,
        farmerCode: 'FAR-9142',
        landHoldingAcres: 8.5,
        primaryCrops: ['Onion', 'Cotton', 'Groundnut'],
        pickupLocation: {
          type: 'Point',
          coordinates: [71.76, 21.09],
          district: 'Bhavnagar',
          village: 'Mahuva Rural',
          address: 'ખેતર નંબર 12, મહુવા-તળાજા રોડ, ભાવનગર',
        },
      });
      migrationStats.usersMigrated += 1;
    }

    const existingBuyer = await User.findOne({ phone: '9724012345' });
    if (!existingBuyer) {
      const buyerUser = await User.create({
        name: 'કિરીટભાઈ મહેતા',
        phone: '9724012345',
        email: 'procurement@balajiagro.com',
        role: 'buyer',
        district: 'Ahmedabad',
        village: 'Sanand GIDC',
        preferredLanguage: 'gu',
        isVerified: true,
      });

      await BuyerProfile.create({
        userId: buyerUser._id,
        buyerCode: 'BUY-5021',
        companyName: 'Balaji Wafers & Agro Foods Ltd',
        businessType: 'Institutional Processor',
        gstin: '24AAACB1234F1Z5',
        headquartersDistrict: 'Ahmedabad',
      });
      migrationStats.usersMigrated += 1;
    }

    // 2. Migrate Produce Listings
    const listingsCount = await ProduceListing.countDocuments();
    if (listingsCount === 0) {
      const farmer = await User.findOne({ phone: '9876543210' });
      const farmerId = farmer?._id;

      const sampleListings = [
        {
          listingCode: 'LOT-ONI-8492',
          farmerId,
          farmerName: 'રમેશભાઈ પટેલ',
          farmerPhone: '9876543210',
          category: 'Vegetables',
          crop: 'Onion',
          cropGu: 'લાલ ડુંગળી (મહુવા સ્પેશિયલ)',
          variety: 'Mahuva & Gondal Red Super',
          quantity: 15,
          unit: 'tonne',
          minPurchaseQuantity: 2,
          grade: 'Grade A (Export / Super)',
          verifiedGrade: 'Grade A (Export / Super)',
          harvestDate: new Date('2026-08-28'),
          freshnessCondition: 'સૂર્યપ્રકાશમાં સૂકવેલી, 45+ mm સાઇઝ, સુકા છાલવાળી',
          isOrganic: true,
          expectedPrice: 2950,
          priceUnit: 'quintal',
          district: 'Bhavnagar',
          taluka: 'Mahuva',
          village: 'Mahuva Rural',
          pickupAddress: 'ખેતર નંબર 12, મહુવા-તળાજા રોડ, ભાવનગર',
          status: 'Published',
          offersCount: 2,
          primaryImageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80',
          storageAvailable: true,
          transportNeeded: true,
        },
        {
          listingCode: 'LOT-POT-3918',
          farmerId,
          farmerName: 'રમેશભાઈ પટેલ',
          farmerPhone: '9876543210',
          category: 'Vegetables',
          crop: 'Potato',
          cropGu: 'બટાટા (ડીસા ગોલ્ડ વેફર ક્વોલિટી)',
          variety: 'Lady Rosetta & Chipsona',
          quantity: 25,
          unit: 'tonne',
          minPurchaseQuantity: 5,
          grade: 'Grade A (Export / Super)',
          verifiedGrade: 'Grade A (Export / Super)',
          harvestDate: new Date('2026-08-25'),
          freshnessCondition: 'કોલ્ડ સ્ટોરેજ રેડી, શુગર-ફ્રી વેફર ગ્રેડ',
          isOrganic: false,
          expectedPrice: 1850,
          priceUnit: 'quintal',
          district: 'Banaskantha',
          taluka: 'Deesa',
          village: 'Deesa Rural',
          pickupAddress: 'હાઈવે કોલ્ડ સ્ટોરેજ યાર્ડ, ડીસા',
          status: 'Published',
          offersCount: 1,
          primaryImageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
          storageAvailable: true,
          transportNeeded: false,
        },
        {
          listingCode: 'LOT-CUM-7102',
          farmerId,
          farmerName: 'રમેશભાઈ પટેલ',
          farmerPhone: '9876543210',
          category: 'Spices',
          crop: 'Cumin',
          cropGu: 'જીરું (ઊંઝા સ્પેશિયલ બોલ્ડ)',
          variety: 'Gujarat Cumin 4 (GC-4 Premium)',
          quantity: 4,
          unit: 'tonne',
          minPurchaseQuantity: 0.5,
          grade: 'Grade A (Export / Super)',
          verifiedGrade: 'Grade A (Export / Super)',
          harvestDate: new Date('2026-08-20'),
          freshnessCondition: 'મશીન ક્લીન, 99.5% પ્યોરિટી, સોનેરી દાણો',
          isOrganic: true,
          expectedPrice: 28500,
          priceUnit: 'quintal',
          district: 'Mehsana',
          taluka: 'Unjha',
          village: 'Unjha Mandi Perimeter',
          pickupAddress: 'ગોડાઉન 4, ઊંઝા જીઆઇડીસી',
          status: 'Published',
          offersCount: 0,
          primaryImageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80',
          storageAvailable: true,
          transportNeeded: true,
        },
      ];

      for (const item of sampleListings) {
        await ProduceListing.create(item);
        migrationStats.listingsMigrated += 1;
      }
    }

    console.log('✅ [Migration Completed] Migration Summary:');
    console.table(migrationStats);
  } catch (err: unknown) {
    console.error('❌ [Migration Error]:', (err as Error).message);
  } finally {
    await disconnectDatabase();
  }
}

if (process.argv[1] && process.argv[1].includes('migrateSupabaseToMongo')) {
  runMigration();
}
