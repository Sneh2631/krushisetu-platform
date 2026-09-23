import { Router, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { TransportRequest, Deal } from '../models';
import { authenticate, type AuthRequest } from '../middleware/auth';

const router = Router();

const UpdateTransportSchema = z.object({
  driverName: z.string().min(1),
  driverPhone: z.string().min(10),
  vehicleNumber: z.string().min(4),
  vehicleType: z.enum(['Pickup (1.5T)', 'Eicher (4T)', 'Heavy Truck (10T)', 'Cold Van (3T)']),
  estimatedFreightINR: z.number().optional(),
  currentMilestoneNotes: z.string().optional(),
});

/**
 * 1. Get Transport Request by Deal ID
 */
router.get('/deal/:dealId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { dealId } = req.params;
    let deal = null;

    if (mongoose.isValidObjectId(dealId)) {
      deal = await Deal.findById(dealId);
    }
    if (!deal) {
      deal = await Deal.findOne({ dealCode: dealId });
    }

    if (!deal) {
      res.status(404).json({ error: 'Deal not found' });
      return;
    }

    const transport = await TransportRequest.findOne({ dealId: deal._id }).lean();
    if (!transport) {
      res.status(404).json({ error: 'Transport details not found' });
      return;
    }

    res.json({
      transport: {
        ...transport,
        id: transport._id.toString(),
      },
    });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. Assign / Update Transport Request
 */
router.post('/deal/:dealId/assign', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { dealId } = req.params;
    const data = UpdateTransportSchema.parse(req.body);

    let deal = null;
    if (mongoose.isValidObjectId(dealId)) {
      deal = await Deal.findById(dealId);
    }
    if (!deal) {
      deal = await Deal.findOne({ dealCode: dealId });
    }

    if (!deal) {
      res.status(404).json({ error: 'Deal not found' });
      return;
    }

    const transport = await TransportRequest.findOneAndUpdate(
      { dealId: deal._id },
      {
        driverName: data.driverName,
        driverPhone: data.driverPhone,
        vehicleNumber: data.vehicleNumber,
        vehicleType: data.vehicleType,
        estimatedFreightINR: data.estimatedFreightINR || 8500,
        currentMilestoneNotes: data.currentMilestoneNotes,
        status: 'Vehicle Assigned',
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      transport: {
        ...transport.toObject(),
        id: transport._id.toString(),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof z.ZodError ? err.errors[0].message : (err as Error).message;
    res.status(400).json({ error: msg });
  }
});

export default router;
