import { Router, Response } from 'express';
import { User, FarmerProfile, BuyerProfile, ProfileChangeLog } from '../models';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * 1. Get Single User Profile
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const targetId = req.params.id;

    // Security: standard users can only fetch their own profile; admins can fetch any
    if (req.user?.role !== 'admin' && req.user?.userId !== targetId) {
      res.status(403).json({ error: 'Access denied. You can only view your own profile.' });
      return;
    }

    const user = await User.findById(targetId);
    if (!user) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    let details = null;
    if (user.role === 'farmer') {
      details = await FarmerProfile.findOne({ userId: user._id });
    } else if (user.role === 'buyer') {
      details = await BuyerProfile.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      profile: {
        id: user._id.toString(),
        userId: user._id.toString(),
        name: user.name,
        mobile: user.phone,
        email: user.email,
        role: user.role,
        district: user.district,
        village: user.village,
        state: 'Gujarat',
        verificationStatus: user.isVerified ? 'Verified' : 'Pending KYC',
        crops: details?.primaryCrops || [],
        farmSize: details?.totalLandAcres ? `${details.totalLandAcres} Acres` : undefined,
        fpoName: details?.fpoAffiliation,
        bankDetails: details?.bankDetails,
        company: details?.companyName,
        companyName: details?.companyName,
        gstNumber: details?.gstNumber,
        panNumber: details?.panNumber,
        buyerType: details?.businessType,
        deliveryAddress: details?.officeAddress,
        requiredCommodities: details?.procurementInterests,
        preferredCrops: details?.procurementInterests,
      },
    });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. Update Own Profile (with audit log in ProfileChangeLog)
 */
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const targetId = req.params.id;

    // Security: users can only update their own profile; admins can update any
    if (req.user?.role !== 'admin' && req.user?.userId !== targetId) {
      res.status(403).json({ error: 'Access denied. You can only edit your own profile.' });
      return;
    }

    const updates = req.body;
    const user = await User.findById(targetId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const previousUserValues = {
      name: user.name,
      district: user.district,
      village: user.village,
    };

    if (updates.name) user.name = updates.name;
    if (updates.district) user.district = updates.district;
    if (updates.village) user.village = updates.village;
    await user.save();

    if (user.role === 'farmer') {
      await FarmerProfile.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            fpoAffiliation: updates.fpoName,
            primaryCrops: updates.crops,
            totalLandAcres: updates.farmSize ? parseFloat(updates.farmSize) || 5 : undefined,
            bankDetails: updates.bankDetails,
            'pickupLocation.district': updates.district,
            'pickupLocation.village': updates.village,
            'pickupLocation.address': `${updates.village || user.village}, ${updates.district || user.district}`,
          },
        },
        { upsert: true, new: true }
      );
    } else if (user.role === 'buyer') {
      await BuyerProfile.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            companyName: updates.company || updates.companyName,
            gstNumber: updates.gstNumber,
            panNumber: updates.panNumber,
            businessType: updates.buyerType,
            officeAddress: updates.deliveryAddress || updates.address,
            procurementInterests: updates.requiredCommodities || updates.preferredCrops,
          },
        },
        { upsert: true, new: true }
      );
    }

    // Record Profile Change Log for compliance auditing
    await ProfileChangeLog.create({
      userId: user._id.toString(),
      role: user.role,
      changedFields: Object.keys(updates),
      previousValues: previousUserValues,
      newValues: updates,
      changedBy: req.user?.name || user.name,
      reason: 'User profile self-edit',
    });

    res.json({ success: true, message: 'Profile updated successfully in MongoDB' });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 3. Get All Profiles (Admin Only)
 */
router.get('/', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const farmerProfiles = await FarmerProfile.find();
    const buyerProfiles = await BuyerProfile.find();

    const farmerMap = new Map(farmerProfiles.map((f) => [f.userId.toString(), f]));
    const buyerMap = new Map(buyerProfiles.map((b) => [b.userId.toString(), b]));

    const combined = users.map((u) => {
      const uId = u._id.toString();
      const f = farmerMap.get(uId);
      const b = buyerMap.get(uId);

      return {
        id: uId,
        userId: uId,
        name: u.name,
        mobile: u.phone,
        email: u.email,
        role: u.role,
        district: u.district,
        village: u.village,
        state: 'Gujarat',
        verificationStatus: u.isVerified ? 'Verified' : 'Pending KYC',
        crops: f?.primaryCrops || [],
        farmSize: f?.totalLandAcres ? `${f.totalLandAcres} Acres` : undefined,
        fpoName: f?.fpoAffiliation,
        bankDetails: f?.bankDetails,
        company: b?.companyName,
        companyName: b?.companyName,
        gstNumber: b?.gstNumber,
        panNumber: b?.panNumber,
        buyerType: b?.businessType,
        deliveryAddress: b?.officeAddress,
        requiredCommodities: b?.procurementInterests,
        preferredCrops: b?.procurementInterests,
        createdAt: u.createdAt,
      };
    });

    res.json({ success: true, profiles: combined });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
