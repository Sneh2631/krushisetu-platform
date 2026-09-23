import { Router, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import {
  Deal,
  Review,
  StatusHistory,
  Notification,
  type IDeal,
  type DealStatusType,
} from '../models';
import { authenticate, type AuthRequest } from '../middleware/auth';

const router = Router();

const UpdateDealStatusSchema = z.object({
  status: z.enum([
    'Discussion Started',
    'Offer Accepted',
    'Pickup Scheduled',
    'Product Collected',
    'In Transit',
    'Delivered',
    'Payment Pending',
    'Completed',
    'Cancelled',
    'Disputed',
  ]),
  notes: z.string().optional(),
});

const RateDealSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
  ratedBy: z.enum(['buyer', 'farmer']).default('buyer'),
});

/**
 * 1. Get Deals for Authenticated User
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

    const deals = await Deal.find(filter).sort({ createdAt: -1 }).lean();
    const formatted = deals.map((d) => ({
      ...d,
      id: d._id.toString(),
    }));

    res.json({ deals: formatted });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. Get Single Deal by ID (Full Unlocked Contacts)
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let deal: IDeal | null = null;

    if (mongoose.isValidObjectId(id)) {
      deal = await Deal.findById(id).lean();
    }
    if (!deal) {
      deal = await Deal.findOne({ dealCode: id }).lean();
    }

    if (!deal) {
      res.status(404).json({ error: 'Deal record not found.' });
      return;
    }

    res.json({
      deal: {
        ...deal,
        id: deal._id.toString(),
      },
    });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 3. Update Deal Milestone Status
 */
router.patch('/:id/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = UpdateDealStatusSchema.parse(req.body);

    let deal = null;
    if (mongoose.isValidObjectId(id)) {
      deal = await Deal.findById(id);
    }
    if (!deal) {
      deal = await Deal.findOne({ dealCode: id });
    }

    if (!deal) {
      res.status(404).json({ error: 'Deal record not found.' });
      return;
    }

    const previousStatus = deal.status;
    deal.status = data.status as DealStatusType;
    if (data.notes) {
      deal.notes = `${deal.notes || ''} [${data.status}: ${data.notes}]`;
    }
    if (data.status === 'Completed') {
      deal.escrowStatus = 'Released to Farmer';
      deal.deliveryDate = new Date();
    }

    const savedDeal = await deal.save();

    // Create Status History Audit Record
    await StatusHistory.create({
      entityType: 'deal',
      entityId: savedDeal._id,
      previousStatus,
      newStatus: data.status,
      changedBy: mongoose.isValidObjectId(req.user?.userId) ? new mongoose.Types.ObjectId(req.user?.userId) : savedDeal.buyerId,
      changedByRole: req.user?.role || 'buyer',
      reason: data.notes,
    });

    // Notify Deal Counterparty
    const targetUserId = req.user?.role === 'farmer' ? savedDeal.buyerId : savedDeal.farmerId;
    await Notification.create({
      userId: targetUserId,
      type: data.status === 'Completed' ? 'payment_released' : 'pickup_scheduled',
      titleGu: `સોદા અપડેટ: ${data.status} (${savedDeal.dealCode})`,
      titleEn: `Deal Milestone Update: ${data.status}`,
      messageGu: `સોદા ${savedDeal.dealCode} નું સ્ટેટસ બદલાઈને '${data.status}' થયું છે.`,
      messageEn: `Deal ${savedDeal.dealCode} status updated to '${data.status}'.`,
      linkTarget: 'deals',
    });

    res.json({
      success: true,
      deal: {
        ...savedDeal.toObject(),
        id: savedDeal._id.toString(),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof z.ZodError ? err.errors[0].message : (err as Error).message;
    res.status(400).json({ error: msg });
  }
});

/**
 * 4. Rate Deal (Creates Review Document in MongoDB)
 */
router.post('/:id/rate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = RateDealSchema.parse(req.body);

    let deal = null;
    if (mongoose.isValidObjectId(id)) {
      deal = await Deal.findById(id);
    }
    if (!deal) {
      deal = await Deal.findOne({ dealCode: id });
    }

    if (!deal) {
      res.status(404).json({ error: 'Deal record not found.' });
      return;
    }

    if (data.ratedBy === 'buyer') {
      deal.ratingGivenByBuyer = data.rating;
    } else {
      deal.ratingGivenByFarmer = data.rating;
    }

    await deal.save();

    // Create Review document
    await Review.findOneAndUpdate(
      {
        dealId: deal._id,
        reviewerRole: data.ratedBy,
      },
      {
        reviewerId: mongoose.isValidObjectId(req.user?.userId) ? new mongoose.Types.ObjectId(req.user?.userId) : deal.buyerId,
        targetUserId: data.ratedBy === 'buyer' ? deal.farmerId : deal.buyerId,
        rating: data.rating,
        feedback: data.feedback,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Rating and review submitted successfully.' });
  } catch (err: unknown) {
    const msg = err instanceof z.ZodError ? err.errors[0].message : (err as Error).message;
    res.status(400).json({ error: msg });
  }
});

export default router;
