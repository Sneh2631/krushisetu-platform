import { Router, Response } from 'express';
import { BuyerRequirement } from '../models';
import { authenticate, type AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * 1. Get Buyer Requirements
 */
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { buyerId, crop, category } = req.query;
    const filter: Record<string, unknown> = {};

    if (buyerId) filter.buyerId = buyerId;
    if (crop) filter.crop = crop;
    if (category) filter.category = category;

    const reqs = await BuyerRequirement.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, requirements: reqs });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. Create Buyer Requirement
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const newReq = new BuyerRequirement({
      buyerId: req.user?.userId || data.buyerId,
      buyerName: req.user?.name || data.buyerName,
      buyerMobile: data.buyerMobile,
      companyName: data.companyName,
      category: data.category,
      crop: data.crop,
      cropGu: data.cropGu,
      requiredQuantity: data.requiredQuantity,
      unit: data.unit || 'tonne',
      targetPrice: data.targetPrice,
      priceUnit: data.priceUnit || 'quintal',
      preferredGrade: data.preferredGrade,
      deliveryDistrict: data.deliveryDistrict,
      deliveryAddress: data.deliveryAddress,
      deadlineDate: data.deadlineDate,
      notes: data.notes,
      status: 'Active',
    });
    await newReq.save();

    res.status(201).json({ success: true, requirement: newReq });
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
