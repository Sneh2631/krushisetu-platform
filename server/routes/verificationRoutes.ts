import { Router, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import {
  ProduceListing,
  ListingVerification,
  AuditLog,
  Notification,
  type ListingStatusType,
  type QualityGradeType,
} from '../models';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';

const router = Router();

const VerificationDecisionSchema = z.object({
  status: z.enum([
    'Draft',
    'Submitted',
    'Under Review',
    'More Information Required',
    'Verified',
    'Rejected',
    'Published',
    'Reserved',
    'Sold',
    'Completed',
    'Expired',
  ]),
  verifiedGrade: z.enum(['Grade A (Export / Super)', 'Grade B (Premium Table)', 'Grade C (Processing / Fair)']).optional(),
  inspectionNotes: z.string().optional(),
  correctionsRequested: z.string().optional(),
});

/**
 * 1. Get Admin Verification Queue
 */
router.get('/queue', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    const listings = await ProduceListing.find(filter)
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
 * 2. Process Verification Decision for a Produce Lot
 */
router.post('/:listingId/decision', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { listingId } = req.params;
    const data = VerificationDecisionSchema.parse(req.body);

    const adminId = req.user?.userId;
    const adminName = req.user?.name || 'GSAMB Government Officer';

    let listing = null;
    if (mongoose.isValidObjectId(listingId)) {
      listing = await ProduceListing.findById(listingId);
    }
    if (!listing) {
      listing = await ProduceListing.findOne({ listingCode: listingId });
    }

    if (!listing) {
      res.status(404).json({ error: 'Listing not found.' });
      return;
    }

    const previousStatus = listing.status;
    listing.status = data.status as ListingStatusType;
    if (data.verifiedGrade) {
      listing.verifiedGrade = data.verifiedGrade as QualityGradeType;
    }
    listing.adminInspectionNotes = data.inspectionNotes;
    listing.correctionsRequested = data.correctionsRequested;
    listing.verifiedBy = mongoose.isValidObjectId(adminId) ? new mongoose.Types.ObjectId(adminId) : undefined;
    listing.verifiedAt = new Date();

    const updatedListing = await listing.save();

    // 1. Create Listing Verification Record
    await ListingVerification.create({
      listingId: updatedListing._id,
      adminId: mongoose.isValidObjectId(adminId) ? new mongoose.Types.ObjectId(adminId) : new mongoose.Types.ObjectId(),
      adminName,
      previousStatus,
      newStatus: data.status,
      verifiedGrade: data.verifiedGrade || listing.grade,
      inspectionNotes: data.inspectionNotes,
      correctionsRequested: data.correctionsRequested,
    });

    // 2. Create Audit Log for compliance
    await AuditLog.create({
      action: `Listing status changed from ${previousStatus} to ${data.status}`,
      targetType: 'listing',
      targetId: updatedListing._id.toString(),
      targetCode: updatedListing.listingCode,
      adminId: mongoose.isValidObjectId(adminId) ? new mongoose.Types.ObjectId(adminId) : new mongoose.Types.ObjectId(),
      adminName,
      details: {
        decision: data,
        previousStatus,
      },
      ipAddress: req.ip,
    });

    // 3. Notify the Farmer
    const isApproved = data.status === 'Verified' || data.status === 'Published';
    const isMoreInfo = data.status === 'More Information Required';

    await Notification.create({
      userId: updatedListing.farmerId,
      type: isApproved ? 'listing_approved' : isMoreInfo ? 'info_requested' : 'listing_rejected',
      titleGu: isApproved
        ? `માલ અપ્રૂવ થયો! (${updatedListing.listingCode})`
        : isMoreInfo
        ? `વધારાની વિગત જરૂરી છે (${updatedListing.listingCode})`
        : `ચકાસણી સ્થગિત (${updatedListing.listingCode})`,
      titleEn: isApproved
        ? `Listing Approved (${updatedListing.listingCode})`
        : isMoreInfo
        ? `Information Requested (${updatedListing.listingCode})`
        : `Listing Rejected (${updatedListing.listingCode})`,
      messageGu: isApproved
        ? `તમારો ${updatedListing.cropGu} નો લોટ હવે ખરીદદાર બજારમાં લાઈવ છે.`
        : data.correctionsRequested || data.inspectionNotes || 'વિગત તપાસવા માટે ક્લિક કરો.',
      messageEn: isApproved
        ? `Your ${updatedListing.crop} lot is now live in the marketplace.`
        : data.correctionsRequested || data.inspectionNotes || 'Please check requested info.',
      linkTarget: 'listings',
    });

    res.json({
      success: true,
      listing: {
        ...updatedListing.toObject(),
        id: updatedListing._id.toString(),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof z.ZodError ? err.errors[0].message : (err as Error).message;
    res.status(400).json({ error: msg });
  }
});

/**
 * 3. Get Admin Audit Logs
 */
router.get('/audit-logs', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
    const formatted = logs.map((l) => ({
      ...l,
      id: l._id.toString(),
    }));
    res.json({ logs: formatted });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
