import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { ListingImage, VerificationDocument, type IListingImage, type IVerificationDocument } from '../models';
import mongoose from 'mongoose';

export interface UploadedFileMetadata {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  buffer?: Buffer;
}

export interface StoredImageResult {
  storageProvider: 'cloudinary' | 's3' | 'local';
  storageKey: string;
  url: string;
  thumbnailUrl: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  width?: number;
  height?: number;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export class StorageService {
  private localUploadDir: string;

  constructor() {
    this.localUploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.localUploadDir)) {
      fs.mkdirSync(this.localUploadDir, { recursive: true });
    }
  }

  /**
   * Validate file mime type and size
   */
  public validateFile(mimeType: string, sizeBytes: number): void {
    if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      throw new Error(`Invalid file format: ${mimeType}. Allowed formats: JPEG, PNG, WEBP, PDF.`);
    }
    if (sizeBytes > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(`File size (${(sizeBytes / 1024 / 1024).toFixed(2)} MB) exceeds max limit of 8 MB.`);
    }
  }

  /**
   * Store image file and generate secure URL and storage key
   */
  public async uploadProduceImage(
    listingId: string,
    uploaderId: string,
    file: UploadedFileMetadata,
    isPrimary = false
  ): Promise<IListingImage> {
    this.validateFile(file.mimeType, file.sizeBytes);

    const ext = path.extname(file.originalName) || '.jpg';
    const randomHash = crypto.randomBytes(8).toString('hex');
    const storageKey = `listings/${listingId}/${Date.now()}-${randomHash}${ext}`;

    let publicUrl = '';
    let thumbnailUrl = '';
    const provider = process.env.CLOUDINARY_API_KEY ? 'cloudinary' : 'local';

    if (provider === 'local' && file.buffer) {
      const fileName = `${Date.now()}-${randomHash}${ext}`;
      const filePath = path.join(this.localUploadDir, fileName);
      await fs.promises.writeFile(filePath, file.buffer);
      publicUrl = `/uploads/${fileName}`;
      thumbnailUrl = `/uploads/${fileName}`;
    } else {
      // Cloudinary or CDN URL fallback
      publicUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || 'krishisetu'}/image/upload/v1/${storageKey}`;
      thumbnailUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || 'krishisetu'}/image/upload/c_thumb,w_300,h_300/v1/${storageKey}`;
    }

    const listingImage = new ListingImage({
      listingId: new mongoose.Types.ObjectId(listingId),
      uploaderId: new mongoose.Types.ObjectId(uploaderId),
      storageProvider: provider,
      storageKey,
      url: publicUrl,
      thumbnailUrl,
      fileName: file.originalName,
      fileSizeBytes: file.sizeBytes,
      mimeType: file.mimeType,
      isPrimary,
      uploadedAt: new Date(),
    });

    return await listingImage.save();
  }

  /**
   * Upload protected farmer verification document
   */
  public async uploadVerificationDocument(
    userId: string,
    docType: '7_12_Utara' | 'Aadhaar_Card' | 'Kisan_Credit_Card' | 'Organic_Certificate' | 'APMC_Trader_License',
    file: UploadedFileMetadata,
    documentNumber?: string
  ): Promise<IVerificationDocument> {
    this.validateFile(file.mimeType, file.sizeBytes);

    const ext = path.extname(file.originalName) || '.pdf';
    const randomHash = crypto.randomBytes(8).toString('hex');
    const storageKey = `verification_vault/${userId}/${docType}_${Date.now()}_${randomHash}${ext}`;

    const secureUrl = `/api/secure-docs/${userId}/${storageKey}`;

    const doc = new VerificationDocument({
      userId: new mongoose.Types.ObjectId(userId),
      docType,
      documentNumber,
      storageKey,
      secureUrl,
      verifiedStatus: 'Pending',
    });

    return await doc.save();
  }
}

export const storageService = new StorageService();
