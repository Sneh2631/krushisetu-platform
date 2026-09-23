import { Router, Request, Response } from 'express';
import { News } from '../models';
import { authenticate, requireRole, type AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * 1. Get Public News & Advisories
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: Record<string, unknown> = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const items = await News.find(filter).sort({ isPinned: -1, createdAt: -1 }).limit(50);
    res.json({ success: true, news: items });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * 2. Publish News Article (Admin Only)
 */
router.post('/', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const item = new News({
      titleGu: data.titleGu,
      titleEn: data.titleEn,
      summaryGu: data.summaryGu,
      summaryEn: data.summaryEn,
      contentGu: data.contentGu,
      contentEn: data.contentEn,
      category: data.category || 'Market Advisory',
      publishedBy: data.publishedBy || 'GSAMB Directorate',
      isPinned: data.isPinned || false,
      tags: data.tags || [],
      imageUrl: data.imageUrl,
    });
    await item.save();

    res.status(201).json({ success: true, news: item });
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
});

/**
 * 3. Delete News Article (Admin Only)
 */
router.delete('/:id', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'News item deleted' });
  } catch (err: unknown) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
