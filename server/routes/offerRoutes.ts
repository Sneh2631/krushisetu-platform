import { Router, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import {
  Offer,
  Deal,
  ProduceListing,
  TransportRequest,
  Notification,
  type IOffer,
} from '../models';
import { authenticate, type AuthRequest } from '../middleware/auth';

const router = Router();

const CreateOfferSchema = z.object({
  listingId: z.string().min(1),
  requiredQuantity: z.number().positive('Quantity must be greater than 0'),
  offeredPrice: z.number().positive('Price must be greater than 0'),
  preferredPickupDate: z.string(),
  transportResponsibility: z.enum(['Buyer Organized', 'Farmer Arranged', 'KrushiSetu Pooled Logistics']),
  message: z.string().optional(),
});

const RespondOfferSchema = z.object({
  action: z.enum(['accept', 'reject', 'counter']),
  counterPrice: z.number().positive().optional(),
  counterNotes: z.string().optional(),
});

/**
 * 1. Get Offers (Filtered by farmerId or buyerId)
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const filter: Record<string, unknown> = {};

    if (role === 'farmer') {
      filter.$or = [
        { farmerId: mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : null },
        { farmerId: userId },
      ].filter((q) => q.farmerId !== null);
    } else if (role === 'buyer') {
      filter.$or = [
        { buyerId: mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : null },
        { buyerId: userId },
      ].filter((q) => q.buyerId !== null);
    }

    const rawOffers = await Offer.find(filter).sort({ createdAt: -1 }).lean();
    const formatted = rawOffers.map((o) => ({
      ...o,
      id: o._id.toString(),
    }));

    res.json({ offers: formatted });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. Create Buyer Offer
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = CreateOfferSchema.parse(req.body);
    const buyerId = req.user?.userId || 'USER-BUY-5021';
    const buyerName = req.user?.name || 'Agro Food Processor';
    const buyerPhone = req.user?.phone || '9724012345';

    let listing = null;
    if (mongoose.isValidObjectId(data.listingId)) {
      listing = await ProduceListing.findById(data.listingId);
    }
    if (!listing) {
      listing = await ProduceListing.findOne({ listingCode: data.listingId });
    }

    if (!listing) {
      res.status(404).json({ error: 'Produce listing not found.' });
      return;
    }

    // Check for duplicate pending offer
    const existingOffer = await Offer.findOne({
      listingId: listing._id,
      buyerId: mongoose.isValidObjectId(buyerId) ? new mongoose.Types.ObjectId(buyerId) : null,
      status: 'Pending',
    });

    if (existingOffer) {
      res.status(400).json({ error: 'You already have an active pending offer for this lot.' });
      return;
    }

    const offerCode = `OFF-${Date.now().toString().slice(-4)}`;
    const newOffer = new Offer({
      offerCode,
      listingId: listing._id,
      listingCode: listing.listingCode,
      crop: listing.crop,
      cropGu: listing.cropGu,
      variety: listing.variety,
      buyerId: mongoose.isValidObjectId(buyerId) ? new mongoose.Types.ObjectId(buyerId) : new mongoose.Types.ObjectId(),
      buyerName,
      buyerCompany: 'Gujarat Agro Processor Ltd',
      buyerPhone,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      farmerPhone: listing.farmerPhone,
      requiredQuantity: data.requiredQuantity,
      unit: listing.unit,
      offeredPrice: data.offeredPrice,
      priceUnit: listing.priceUnit,
      preferredPickupDate: new Date(data.preferredPickupDate),
      transportResponsibility: data.transportResponsibility,
      message: data.message,
      status: 'Pending',
      escrowReady: true,
      validUntil: new Date(Date.now() + 86400000 * 3), // 3 days validity
    });

    const savedOffer = await newOffer.save();

    // Increment offer counter on listing
    listing.offersCount += 1;
    await listing.save();

    // Notify farmer of incoming buyer offer
    await Notification.create({
      userId: listing.farmerId,
      type: 'new_offer',
      titleGu: `નવી ખરીદ ઓફર આવી! (${listing.cropGu})`,
      titleEn: `New Purchase Offer for ${listing.crop}`,
      messageGu: `${buyerName} તરફથી ₹${data.offeredPrice}/${listing.priceUnit} ના ભાવે ${data.requiredQuantity} ${listing.unit} માટે ઓફર આવી છે.`,
      messageEn: `Offer received from ${buyerName} at ₹${data.offeredPrice}/${listing.priceUnit}.`,
      linkTarget: 'offers',
    });

    res.status(201).json({
      success: true,
      offer: {
        ...savedOffer.toObject(),
        id: savedOffer._id.toString(),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof z.ZodError ? err.errors[0].message : (err as Error).message;
    res.status(400).json({ error: msg });
  }
});

/**
 * 3. Respond to Offer (Farmer Action: Accept, Reject, Counter)
 */
router.post('/:offerId/respond', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { offerId } = req.params;
    const data = RespondOfferSchema.parse(req.body);

    let offer: IOffer | null = null;
    if (mongoose.isValidObjectId(offerId)) {
      offer = await Offer.findById(offerId);
    }
    if (!offer) {
      offer = await Offer.findOne({ offerCode: offerId });
    }

    if (!offer) {
      res.status(404).json({ error: 'Offer not found.' });
      return;
    }

    if (data.action === 'accept') {
      offer.status = 'Accepted';
      await offer.save();

      // Find listing for location and pickup details
      const listing = await ProduceListing.findById(offer.listingId);

      // Critical Fix: Use negotiated counterPrice if offer was countered, else offeredPrice
      const agreedPrice = (offer.counterPrice && offer.counterPrice > 0) ? offer.counterPrice : offer.offeredPrice;
      const agreedQuantity = (offer.counterQuantity && offer.counterQuantity > 0) ? offer.counterQuantity : offer.requiredQuantity;

      // Create Deal document with UNLOCKED contact numbers
      const dealCode = `DEAL-2026-${Date.now().toString().slice(-4)}`;
      const totalAmountINR = agreedPrice * (offer.unit === 'tonne' ? agreedQuantity * 10 : agreedQuantity);

      const newDeal = new Deal({
        dealCode,
        offerId: offer._id,
        listingId: offer.listingId,
        farmerId: offer.farmerId,
        farmerName: offer.farmerName,
        farmerPhone: offer.farmerPhone, // Unlocked
        farmerVillage: listing?.village || 'Mahuva',
        farmerDistrict: listing?.district || 'Bhavnagar',
        pickupAddress: listing?.pickupAddress || 'Farm Gate',
        buyerId: offer.buyerId,
        buyerName: offer.buyerName,
        buyerCompany: offer.buyerCompany,
        buyerPhone: offer.buyerPhone, // Unlocked
        crop: offer.crop,
        cropGu: offer.cropGu,
        variety: offer.variety,
        agreedQuantity,
        unit: offer.unit,
        agreedPrice,
        priceUnit: offer.priceUnit,
        totalAmountINR,
        escrowStatus: 'Funds Deposited',
        status: 'Offer Accepted',
        pickupDate: offer.preferredPickupDate,
        transportResponsibility: offer.transportResponsibility,
      });

      const savedDeal = await newDeal.save();

      // Create Transport Request in MongoDB
      await TransportRequest.create({
        dealId: savedDeal._id,
        pickupLocation: {
          address: listing?.pickupAddress || 'Farm Gate, Mahuva',
          village: listing?.village || 'Mahuva',
          district: listing?.district || 'Bhavnagar',
        },
        dropLocation: {
          companyName: offer.buyerCompany,
          address: 'Sanand Agro Processing Park, Phase-2',
          district: 'Ahmedabad',
        },
        crop: offer.crop,
        quantityTonne: offer.unit === 'tonne' ? agreedQuantity : agreedQuantity / 10,
        scheduledPickupTime: offer.preferredPickupDate,
        status: 'Pending',
        vehicleType: 'Heavy Truck (10T)',
        estimatedFreightINR: 9500,
      });

      // Update ProduceListing status to Reserved
      if (listing) {
        listing.status = 'Reserved';
        await listing.save();
      }

      // Notify Buyer
      await Notification.create({
        userId: offer.buyerId,
        type: 'offer_accepted',
        titleGu: `ઓફર સ્વીકારાઈ! સોદો કન્ફર્મ (${dealCode})`,
        titleEn: `Offer Accepted for Deal ${dealCode}`,
        messageGu: `સોદો ₹${agreedPrice}/${offer.priceUnit} ના ભાવે કન્ફર્મ થયો છે. સંપર્ક વિગતો અનલૉક થઈ છે.`,
        messageEn: `Deal confirmed at ₹${agreedPrice}/${offer.priceUnit}. Contact unlocked.`,
        linkTarget: 'deals',
      });

      // Also Notify Farmer
      await Notification.create({
        userId: offer.farmerId,
        type: 'offer_accepted',
        titleGu: `સોદો કન્ફર્મ થયો! (${dealCode})`,
        titleEn: `Deal Confirmed (${dealCode})`,
        messageGu: `ખરીદદાર ${offer.buyerName} સાથે ₹${agreedPrice}/${offer.priceUnit} ના ભાવે સોદો કન્ફર્મ થયો છે.`,
        messageEn: `Deal confirmed with buyer ${offer.buyerName} at ₹${agreedPrice}/${offer.priceUnit}.`,
        linkTarget: 'deals',
      });

      res.json({
        success: true,
        action: 'accept',
        deal: {
          ...savedDeal.toObject(),
          id: savedDeal._id.toString(),
        },
      });
    } else if (data.action === 'counter') {
      offer.status = 'Countered';
      offer.counterPrice = data.counterPrice;
      offer.counterNotes = data.counterNotes;
      await offer.save();

      // Notify Buyer of counter offer
      await Notification.create({
        userId: offer.buyerId,
        type: 'counter_offer',
        titleGu: `ખેડૂત તરફથી કાઉન્ટર ઓફર (${offer.cropGu})`,
        titleEn: `Counter Offer for ${offer.crop}`,
        messageGu: `ખેડૂતે ₹${data.counterPrice}/${offer.priceUnit} નો વળતો ભાવ સૂચવ્યો છે.`,
        messageEn: `Farmer countered with ₹${data.counterPrice}/${offer.priceUnit}.`,
        linkTarget: 'offers',
      });

      res.json({ success: true, action: 'counter', offer });
    } else {
      offer.status = 'Rejected';
      await offer.save();
      res.json({ success: true, action: 'reject', offer });
    }
  } catch (err: unknown) {
    const msg = err instanceof z.ZodError ? err.errors[0].message : (err as Error).message;
    res.status(400).json({ error: msg });
  }
});

export default router;
