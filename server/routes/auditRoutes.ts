import { Router, Response } from 'express';
import { AuditLog, ProfileChangeLog } from '../models';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * 1. Get Admin Action Audit Logs (Admin Only)
 */
router.get('/actions', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. Get Profile Change Logs (Admin Only)
 */
router.get('/profile-changes', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const logs = await ProfileChangeLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
