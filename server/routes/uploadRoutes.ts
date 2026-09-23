import { Router, Response } from 'express';
import multer from 'multer';
import { storageService } from '../services/storageService';
import { authenticate, type AuthRequest } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
});

/**
 * 1. Upload Produce Image
 */
router.post('/produce-image', authenticate, upload.single('photo'), async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No image file uploaded.' });
      return;
    }

    const listingId = (req.body.listingId as string) || `TEMP-${Date.now()}`;
    const uploaderId = req.user?.userId || 'USER-FAR-9142';
    const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;

    const savedImage = await storageService.uploadProduceImage(
      listingId,
      uploaderId,
      {
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        buffer: file.buffer,
      },
      isPrimary
    );

    res.json({
      success: true,
      image: {
        id: savedImage._id.toString(),
        url: savedImage.url,
        thumbnailUrl: savedImage.thumbnailUrl,
        fileName: savedImage.fileName,
        sizeBytes: savedImage.fileSizeBytes,
        isPrimary: savedImage.isPrimary,
      },
    });
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
});

/**
 * 2. Upload Farmer Verification Document
 */
router.post('/verification-doc', authenticate, upload.single('document'), async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No document file uploaded.' });
      return;
    }

    const userId = req.user?.userId || 'USER-FAR-9142';
    const docType = req.body.docType || '7_12_Utara';
    const docNumber = req.body.documentNumber;

    const savedDoc = await storageService.uploadVerificationDocument(
      userId,
      docType,
      {
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        buffer: file.buffer,
      },
      docNumber
    );

    res.json({
      success: true,
      document: {
        id: savedDoc._id.toString(),
        docType: savedDoc.docType,
        secureUrl: savedDoc.secureUrl,
        status: savedDoc.verifiedStatus,
      },
    });
  } catch (err: unknown) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
