import { Router, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { ProduceListing, ListingImage, Notification, type IProduceListing } from '../models';
import { authenticate, optionalAuthenticate, type AuthRequest } from '../middleware/auth';

const router = Router();

// Zod Validation Schema for Listing Creation
const CreateListingSchema = z.object({
  crop: z.string().min(1, 'Crop name is required'),
  cropGu: z.string().min(1),
  variety: z.string().min(1),
  category: z.enum(['Vegetables', 'Fruits', 'Spices']),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit: z.enum(['kg', 'quintal', 'tonne']),
  minPurchaseQuantity: z.number().positive().default(1),
  grade: z.enum(['Grade A (Export / Super)', 'Grade B (Premium Table)', 'Grade C (Processing / Fair)']),
  harvestDate: z.string(),
  freshnessCondition: z.string().optional(),
  isOrganic: z.boolean().default(false),
  organicCertUrl: z.string().optional(),
  description: z.string().optional(),
  voiceNoteUrl: z.string().optional(),
  expectedPrice: z.number().positive('Price must be greater than 0'),
  priceUnit: z.enum(['kg', 'quintal', 'tonne']).default('quintal'),
  suggestedPriceMin: z.number().optional(),
  suggestedPriceMax: z.number().optional(),
  district: z.string().min(1),
  taluka: z.string().optional(),
  village: z.string().min(1),
  pickupAddress: z.string().min(1),
  pickupReadyDate: z.string().optional(),
  pickupAvailableUntil: z.string().optional(),
  storageAvailable: z.boolean().default(false),
  transportNeeded: z.boolean().default(true),
  photos: z
    .array(
      z.object({
        url: z.string(),
        thumbnailUrl: z.string().optional(),
        isPrimary: z.boolean().default(false),
        name: z.string().optional(),
        sizeBytes: z.number().optional(),
      })
    )
    .optional(),
  isDraft: z.boolean().default(false),
});

/**
 * 1. Get Marketplace Listings (Public / Verified Only)
 */
router.get('/marketplace', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const skip = (page - 1) * limit;

    const { category, crop, district, grade, minPrice, maxPrice, search } = req.query;

    const filter: Record<string, unknown> = {
      status: { $in: ['Published', 'Verified'] },
    };

    if (category && category !== 'All') filter.category = category;
    if (crop && crop !== 'All') filter.crop = crop;
    if (district && district !== 'All') filter.district = new RegExp(`^${district}$`, 'i');
    if (grade && grade !== 'All') {
      filter.$or = [{ grade }, { verifiedGrade: grade }];
    }
    if (minPrice || maxPrice) {
      filter.expectedPrice = {};
      if (minPrice) (filter.expectedPrice as Record<string, number>).$gte = parseFloat(minPrice as string);
      if (maxPrice) (filter.expectedPrice as Record<string, number>).$lte = parseFloat(maxPrice as string);
    }
    if (search) {
      const regex = new RegExp(search as string, 'i');
      filter.$or = [
        { crop: regex },
        { cropGu: regex },
        { variety: regex },
        { district: regex },
        { village: regex },
        { listingCode: regex },
      ];
    }

    const [total, rawListings] = await Promise.all([
      ProduceListing.countDocuments(filter),
      ProduceListing.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    // Data Protection: Mask farmer phone numbers and exact address in public marketplace
    const sanitizedListings = rawListings.map((l) => {
      const maskedPhone = l.farmerPhone
        ? `${l.farmerPhone.slice(0, 2)}******${l.farmerPhone.slice(-2)}`
        : 'Protected';
      return {
        ...l,
        id: l._id.toString(),
        farmerPhone: maskedPhone,
        pickupAddress: `${l.village}, ${l.district}, Gujarat`,
      };
    });

    res.json({
      listings: sanitizedListings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. Get Farmer's Own Listings (All statuses including Drafts, Review, Verified)
 */
router.get('/farmer', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    if (!farmerId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const listings = await ProduceListing.find({
      $or: [
        { farmerId: mongoose.isValidObjectId(farmerId) ? new mongoose.Types.ObjectId(farmerId) : null },
        { farmerId: farmerId },
      ].filter((q) => q.farmerId !== null),
    })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = listings.map((l) => ({
      ...l,
      id: l._id.toString(),
    }));

    res.json({ listings: formatted });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 3. Create Produce Listing
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = CreateListingSchema.parse(req.body);
    const userId = req.user?.userId || 'USER-FAR-9142';
    const userName = req.user?.name || 'ગુજરાતી ખેડૂત';
    const userPhone = req.user?.phone || '9876543210';

    const listingCode = `LOT-${data.crop.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const status = data.isDraft ? 'Draft' : 'Submitted';

    const primaryImage =
      data.photos && data.photos.length > 0
        ? data.photos[0].url
        : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';

    const newListing = new ProduceListing({
      listingCode,
      farmerId: mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : new mongoose.Types.ObjectId(),
      farmerName: userName,
      farmerPhone: userPhone,
      category: data.category,
      crop: data.crop,
      cropGu: data.cropGu,
      variety: data.variety,
      quantity: data.quantity,
      unit: data.unit,
      minPurchaseQuantity: data.minPurchaseQuantity,
      grade: data.grade,
      harvestDate: new Date(data.harvestDate),
      freshnessCondition: data.freshnessCondition,
      isOrganic: data.isOrganic,
      organicCertUrl: data.organicCertUrl,
      description: data.description,
      voiceNoteUrl: data.voiceNoteUrl,
      expectedPrice: data.expectedPrice,
      priceUnit: data.priceUnit,
      suggestedPriceMin: data.suggestedPriceMin,
      suggestedPriceMax: data.suggestedPriceMax,
      district: data.district,
      taluka: data.taluka,
      village: data.village,
      pickupAddress: data.pickupAddress,
      pickupReadyDate: data.pickupReadyDate ? new Date(data.pickupReadyDate) : undefined,
      pickupAvailableUntil: data.pickupAvailableUntil ? new Date(data.pickupAvailableUntil) : undefined,
      storageAvailable: data.storageAvailable,
      transportNeeded: data.transportNeeded,
      status,
      primaryImageUrl: primaryImage,
      offersCount: 0,
    });

    const savedListing = await newListing.save();

    // Save associated listing image records in MongoDB
    if (data.photos && data.photos.length > 0) {
      for (const [idx, p] of data.photos.entries()) {
        await ListingImage.create({
          listingId: savedListing._id,
          uploaderId: savedListing.farmerId,
          storageProvider: 'cloudinary',
          storageKey: `listings/${savedListing._id}/${idx}.jpg`,
          url: p.url,
          thumbnailUrl: p.thumbnailUrl || p.url,
          fileName: p.name || `${data.crop}_photo_${idx + 1}.jpg`,
          fileSizeBytes: p.sizeBytes || 500000,
          mimeType: 'image/jpeg',
          isPrimary: idx === 0,
        });
      }
    }

    // Create system notification for farmer
    if (!data.isDraft) {
      await Notification.create({
        userId: savedListing.farmerId,
        type: 'info_requested',
        titleGu: `તમારો માલ ચકાસણી માટે મોકલાયો (${listingCode})`,
        titleEn: `Listing Submitted for Verification (${listingCode})`,
        messageGu: `તમારો ${data.cropGu} નો લોટ એડમિન ચકાસણી કતારમાં છે. ટૂંક સમયમાં અપ્રૂવલ મળશે.`,
        messageEn: `Your ${data.crop} lot has been queued for verification.`,
        linkTarget: 'listings',
      });
    }

    res.status(201).json({
      success: true,
      listing: {
        ...savedListing.toObject(),
        id: savedListing._id.toString(),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof z.ZodError ? err.errors[0].message : (err as Error).message;
    res.status(400).json({ error: msg });
  }
});

/**
 * 4. Get Listing by ID
 */
router.get('/:id', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let listing: IProduceListing | null = null;

    if (mongoose.isValidObjectId(id)) {
      listing = await ProduceListing.findById(id).lean();
    }
    if (!listing) {
      listing = await ProduceListing.findOne({ listingCode: id }).lean();
    }

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    const images = await ListingImage.find({ listingId: listing._id }).lean();

    // Data protection: mask phone if requester is not the farmer or admin
    const isOwner = req.user?.userId === listing.farmerId.toString();
    const isAdmin = req.user?.role === 'admin';

    const safeListing = {
      ...listing,
      id: listing._id.toString(),
      farmerPhone: isOwner || isAdmin ? listing.farmerPhone : `${listing.farmerPhone.slice(0, 2)}******${listing.farmerPhone.slice(-2)}`,
      images,
    };

    res.json({ listing: safeListing });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
