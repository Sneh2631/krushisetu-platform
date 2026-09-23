import { Router, Response } from 'express';
import { z } from 'zod';
import { Crop, Notification } from '../models';
import { authenticate, optionalAuthenticate, type AuthRequest } from '../middleware/auth';
import { isDatabaseConnected } from '../db/connection';

const router = Router();

// In-memory fallback for local dev & testing when Atlas is temporarily offline/degraded
interface DevCropRecord {
  _id: string;
  cropId: string;
  normalizedName: string;
  nameEn: string;
  nameGu: string;
  nameHi?: string;
  nameMr?: string;
  categoryCode: string;
  variety?: string;
  typicalSeason?: string;
  defaultUnit: 'kg' | 'quintal' | 'tonne';
  marketBenchmarkPrice: number;
  primaryMarket?: string;
  imageUrl?: string;
  farmerNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy?: any;
  reviewedBy?: any;
  rejectionReason?: string;
  createdAt?: string;
}

const devCropsList: DevCropRecord[] = [
  { _id: 'DEV-CROP-001', cropId: 'Onion', normalizedName: 'onion', nameEn: 'Red Onion', nameGu: 'ડુંગળી', categoryCode: 'Vegetables', defaultUnit: 'quintal', marketBenchmarkPrice: 2950, status: 'approved' },
  { _id: 'DEV-CROP-002', cropId: 'Potato', normalizedName: 'potato', nameEn: 'Potato', nameGu: 'બટાટા', categoryCode: 'Vegetables', defaultUnit: 'quintal', marketBenchmarkPrice: 1850, status: 'approved' },
  { _id: 'DEV-CROP-003', cropId: 'Cotton', normalizedName: 'cotton', nameEn: 'Cotton', nameGu: 'કપાસ', categoryCode: 'Cash Crops', defaultUnit: 'quintal', marketBenchmarkPrice: 7200, status: 'approved' },
  { _id: 'DEV-CROP-004', cropId: 'Groundnut', normalizedName: 'groundnut', nameEn: 'Groundnut', nameGu: 'મગફળી', categoryCode: 'Oilseeds & Pulses', defaultUnit: 'quintal', marketBenchmarkPrice: 6400, status: 'approved' },
  { _id: 'DEV-CROP-005', cropId: 'Cumin', normalizedName: 'cumin', nameEn: 'Cumin', nameGu: 'જીરું', categoryCode: 'Spices', defaultUnit: 'quintal', marketBenchmarkPrice: 28500, status: 'approved' },
  { _id: 'DEV-CROP-006', cropId: 'Wheat', normalizedName: 'wheat', nameEn: 'Sharbati Wheat', nameGu: 'ઘઉં', categoryCode: 'Cereals & Grains', defaultUnit: 'quintal', marketBenchmarkPrice: 2450, status: 'approved' },
  { _id: 'DEV-CROP-007', cropId: 'Tomato', normalizedName: 'tomato', nameEn: 'Tomato', nameGu: 'ટામેટા', categoryCode: 'Vegetables', defaultUnit: 'quintal', marketBenchmarkPrice: 1600, status: 'approved' },
];

// Zod Validation Schemas
const RequestCropSchema = z.object({
  nameEn: z.string().min(2, 'English crop name must be at least 2 characters'),
  nameGu: z.string().optional(),
  nameHi: z.string().optional(),
  nameMr: z.string().optional(),
  categoryCode: z.string().min(1, 'Category is required'),
  variety: z.string().optional(),
  typicalSeason: z.string().optional(),
  defaultUnit: z.enum(['kg', 'quintal', 'tonne']).default('quintal'),
  marketBenchmarkPrice: z.number().nonnegative().optional(),
  primaryMarket: z.string().optional(),
  imageUrl: z.string().optional(),
  farmerNotes: z.string().optional(),
});

const ReviewCropSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
  nameEn: z.string().optional(),
  nameGu: z.string().optional(),
  categoryCode: z.string().optional(),
  marketBenchmarkPrice: z.number().optional(),
  defaultUnit: z.enum(['kg', 'quintal', 'tonne']).optional(),
  variety: z.string().optional(),
});

function normalizeCropName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * 1. GET /api/crops
 * List crops with optional status filter (defaults to approved)
 */
router.get('/', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, category, search } = req.query;

    if (isDatabaseConnected()) {
      const query: Record<string, unknown> = {};

      if (status === 'all') {
        if (req.user?.role !== 'admin') {
          query.status = { $in: ['approved', 'pending'] };
        }
      } else if (status === 'pending') {
        query.status = 'pending';
      } else if (status === 'rejected') {
        query.status = 'rejected';
      } else {
        query.status = 'approved';
      }

      if (category && category !== 'All') {
        query.categoryCode = category;
      }

      if (search && typeof search === 'string' && search.trim()) {
        const s = search.trim();
        query.$or = [
          { nameEn: { $regex: s, $options: 'i' } },
          { nameGu: { $regex: s, $options: 'i' } },
          { nameHi: { $regex: s, $options: 'i' } },
          { nameMr: { $regex: s, $options: 'i' } },
          { normalizedName: { $regex: normalizeCropName(s), $options: 'i' } },
        ];
      }

      const crops = await Crop.find(query)
        .sort({ status: 1, nameEn: 1 })
        .populate('createdBy', 'name phone role')
        .populate('reviewedBy', 'name phone')
        .lean();

      res.json({ success: true, count: crops.length, crops });
    } else {
      // Degraded / Offline Dev Fallback
      let filtered = [...devCropsList];
      if (status === 'pending') {
        filtered = filtered.filter((c) => c.status === 'pending');
      } else if (status === 'rejected') {
        filtered = filtered.filter((c) => c.status === 'rejected');
      } else if (status !== 'all') {
        filtered = filtered.filter((c) => c.status === 'approved');
      }

      if (category && category !== 'All') {
        filtered = filtered.filter((c) => c.categoryCode === category);
      }

      if (search && typeof search === 'string' && search.trim()) {
        const s = search.trim().toLowerCase();
        filtered = filtered.filter((c) =>
          c.nameEn.toLowerCase().includes(s) ||
          c.nameGu.includes(s) ||
          c.normalizedName.includes(normalizeCropName(s))
        );
      }

      res.json({ success: true, count: filtered.length, crops: filtered });
    }
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. GET /api/crops/search
 * Search by query string to find exact match or check duplicates
 */
router.get('/search', async (req: AuthRequest, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q || !q.trim()) {
      res.json({ exactMatch: null, suggestions: [] });
      return;
    }

    const normalized = normalizeCropName(q);

    if (isDatabaseConnected()) {
      const exactMatch = await Crop.findOne({ normalizedName: normalized }).lean();
      const suggestions = await Crop.find({
        $or: [
          { nameEn: { $regex: q.trim(), $options: 'i' } },
          { nameGu: { $regex: q.trim(), $options: 'i' } },
          { normalizedName: { $regex: normalized, $options: 'i' } },
        ],
      })
        .limit(5)
        .lean();

      res.json({
        exists: Boolean(exactMatch),
        exactMatch,
        suggestions,
      });
    } else {
      // Degraded / Offline Dev Fallback
      const exactMatch = devCropsList.find((c) => c.normalizedName === normalized) || null;
      const suggestions = devCropsList
        .filter((c) => c.normalizedName.includes(normalized) || c.nameEn.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 5);

      res.json({
        exists: Boolean(exactMatch),
        exactMatch,
        suggestions,
      });
    }
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 3. POST /api/crops/request
 * Farmer (or Admin) submits a new crop registration
 */
router.post('/request', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = RequestCropSchema.parse(req.body);
    const normalized = normalizeCropName(data.nameEn);

    if (!normalized) {
      res.status(400).json({ error: 'Valid English crop name is required' });
      return;
    }

    const isAdmin = req.user?.role === 'admin';
    const cleanCropId = data.nameEn.replace(/[^a-zA-Z0-9]/g, '') || `Crop${Date.now()}`;

    if (isDatabaseConnected()) {
      // Check duplicate
      const existing = await Crop.findOne({ normalizedName: normalized });
      if (existing) {
        if (existing.status === 'approved') {
          res.status(409).json({
            error: `Crop "${existing.nameEn}" is already registered and approved in the directory.`,
            existingCrop: existing,
            isDuplicate: true,
          });
          return;
        } else if (existing.status === 'pending') {
          res.status(409).json({
            error: `Crop "${existing.nameEn}" has already been submitted and is currently pending admin review.`,
            crop: existing,
            isPending: true,
          });
          return;
        }
      }

      const newCrop = new Crop({
        cropId: cleanCropId,
        nameEn: data.nameEn.trim(),
        nameGu: (data.nameGu || data.nameEn).trim(),
        nameHi: data.nameHi?.trim() || '',
        nameMr: data.nameMr?.trim() || '',
        normalizedName: normalized,
        categoryCode: data.categoryCode,
        variety: data.variety || '',
        typicalSeason: data.typicalSeason || 'Year Round',
        defaultUnit: data.defaultUnit,
        marketBenchmarkPrice: data.marketBenchmarkPrice || 2000,
        primaryMarket: data.primaryMarket || 'General APMC',
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1596720426673-e4e14290f0cc?w=600&auto=format&fit=crop&q=80',
        farmerNotes: data.farmerNotes || '',
        status: isAdmin ? 'approved' : 'pending',
        createdBy: req.user?.id,
      });

      await newCrop.save();

      // If submitted by farmer, notify administrators
      if (!isAdmin) {
        await Notification.create({
          userId: req.user?.id,
          type: 'general',
          titleGu: 'નવા પાકની નોંધણી અરજી સબમિટ થઈ',
          titleEn: 'New Crop Approval Request Submitted',
          messageGu: `તમે "${newCrop.nameGu} (${newCrop.nameEn})" ની નોંધણી માટે અરજી કરી છે. વહીવટી મંજૂરી બાદ તે તમામ માટે ઉપલબ્ધ થશે. તમે આ પાક સાથે તરત લોટ લિસ્ટ કરી શકો છો.`,
          messageEn: `Your request to add "${newCrop.nameEn}" has been submitted for admin review. You can create listings with this crop immediately.`,
          linkTarget: 'crop-directory',
        });
      }

      res.status(201).json({
        success: true,
        message: isAdmin ? 'Crop added and approved immediately.' : 'Crop registered successfully and submitted for admin review. You can list it immediately.',
        crop: newCrop,
      });
    } else {
      // Degraded / Offline Dev Store
      const existing = devCropsList.find((c) => c.normalizedName === normalized);
      if (existing) {
        res.status(409).json({
          error: `Crop "${existing.nameEn}" is already registered.`,
          existingCrop: existing,
          isDuplicate: true,
        });
        return;
      }

      const devCrop: DevCropRecord = {
        _id: `DEV-CROP-${Date.now()}`,
        cropId: cleanCropId,
        normalizedName: normalized,
        nameEn: data.nameEn.trim(),
        nameGu: (data.nameGu || data.nameEn).trim(),
        categoryCode: data.categoryCode,
        variety: data.variety,
        typicalSeason: data.typicalSeason || 'Year Round',
        defaultUnit: data.defaultUnit,
        marketBenchmarkPrice: data.marketBenchmarkPrice || 2000,
        primaryMarket: data.primaryMarket || 'Local APMC',
        imageUrl: data.imageUrl,
        farmerNotes: data.farmerNotes,
        status: isAdmin ? 'approved' : 'pending',
        createdBy: req.user?.id || 'Farmer',
        createdAt: new Date().toISOString(),
      };
      devCropsList.unshift(devCrop);

      res.status(201).json({
        success: true,
        message: isAdmin ? 'Crop added and approved immediately.' : 'Crop registered successfully and submitted for admin review.',
        crop: devCrop,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof z.ZodError ? (err.errors?.[0]?.message || 'Validation error') : (err as Error).message;
    res.status(400).json({ error: msg });
  }
});

/**
 * 4. PUT /api/crops/:id/review
 * Admin reviews, approves, edits, or rejects a crop
 */
router.put('/:id/review', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, nameEn, nameGu, categoryCode, marketBenchmarkPrice, defaultUnit, variety } =
      ReviewCropSchema.parse(req.body);

    if (isDatabaseConnected()) {
      const crop = await Crop.findById(id);
      if (!crop) {
        res.status(404).json({ error: 'Crop request not found' });
        return;
      }

      crop.status = status;
      crop.reviewedBy = req.user?.id as any;
      if (rejectionReason) crop.rejectionReason = rejectionReason;
      if (nameEn) {
        crop.nameEn = nameEn.trim();
        crop.normalizedName = normalizeCropName(nameEn);
      }
      if (nameGu) crop.nameGu = nameGu.trim();
      if (categoryCode) crop.categoryCode = categoryCode;
      if (marketBenchmarkPrice) crop.marketBenchmarkPrice = marketBenchmarkPrice;
      if (defaultUnit) crop.defaultUnit = defaultUnit;
      if (variety) crop.variety = variety;

      await crop.save();

      // Notify submitting farmer if applicable
      if (crop.createdBy) {
        try {
          await Notification.create({
            userId: crop.createdBy,
            type: status === 'approved' ? 'listing_approved' : 'listing_rejected',
            titleGu: status === 'approved' ? 'નવા પાકને મંજૂરી મળી ગઈ!' : 'નવા પાકની અરજી નામંજૂર થઈ',
            titleEn: status === 'approved' ? 'New Crop Approved by Admin!' : 'New Crop Request Rejected',
            messageGu:
              status === 'approved'
                ? `તમારા દ્વારા સૂચવેલ પાક "${crop.nameGu} (${crop.nameEn})" ને એડમિન દ્વારા મંજૂર કરવામાં આવ્યો છે અને હવે સમગ્ર ડાયરેક્ટરીમાં ઉપલબ્ધ છે.`
                : `તમારી પાક "${crop.nameEn}" ની અરજી નામંજૂર થઈ છે. કારણ: ${rejectionReason || 'માપદંડ પૂર્ણ નથી'}`,
            messageEn:
              status === 'approved'
                ? `Your proposed crop "${crop.nameEn}" has been approved and is now available to all farmers & buyers in the KrushiSetu directory.`
                : `Your crop proposal for "${crop.nameEn}" was rejected. Reason: ${rejectionReason || 'Does not meet directory criteria'}`,
            linkTarget: 'crop-directory',
          });
        } catch {
          // ignore notification failure in dev/test
        }
      }

      res.json({
        success: true,
        message: `Crop "${crop.nameEn}" successfully updated to "${status}".`,
        crop,
      });
    } else {
      // Degraded / Offline Dev Fallback
      const crop = devCropsList.find((c) => c._id === id || c.cropId === id);
      if (!crop) {
        res.status(404).json({ error: 'Crop request not found' });
        return;
      }

      crop.status = status;
      if (rejectionReason) crop.rejectionReason = rejectionReason;
      if (marketBenchmarkPrice) crop.marketBenchmarkPrice = marketBenchmarkPrice;
      if (defaultUnit) crop.defaultUnit = defaultUnit;
      if (variety) crop.variety = variety;

      res.json({
        success: true,
        message: `Crop "${crop.nameEn}" successfully updated to "${status}".`,
        crop,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof z.ZodError ? (err.errors?.[0]?.message || 'Validation error') : (err as Error).message;
    res.status(400).json({ error: msg });
  }
});

export default router;
