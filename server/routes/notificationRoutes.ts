import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { Notification } from '../models';
import { authenticate, type AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * 1. Get Notifications for Authenticated User
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const filter = {
      $or: [
        { userId: mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : null },
        { userId: userId },
      ].filter((q) => q.userId !== null),
    };

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).limit(30).lean(),
      Notification.countDocuments({ ...filter, isRead: false }),
    ]);

    const formatted = notifications.map((n) => ({
      ...n,
      id: n._id.toString(),
    }));

    res.json({
      notifications: formatted,
      unreadCount,
    });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. Mark Notification as Read
 */
router.patch('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (mongoose.isValidObjectId(id)) {
      await Notification.findByIdAndUpdate(id, { isRead: true });
    }
    res.json({ success: true });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 3. Mark All Notifications as Read
 */
router.post('/mark-all-read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (userId) {
      await Notification.updateMany(
        {
          $or: [
            { userId: mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : null },
            { userId: userId },
          ].filter((q) => q.userId !== null),
        },
        { isRead: true }
      );
    }
    res.json({ success: true });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
