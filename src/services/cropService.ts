/**
 * Crop Directory & Dynamic Crop Registration Service
 * Uses MongoDB Atlas as single source of truth for all permanent crop data.
 */

import { apiClient } from './apiClient';
import type { ProductCatalogItem } from '../data/productCatalog';
import { PRODUCT_CATALOG } from '../data/productCatalog';

export interface MongoCropItem {
  _id?: string;
  cropId: string;
  nameEn: string;
  nameGu: string;
  nameHi?: string;
  nameMr?: string;
  normalizedName: string;
  categoryCode: string;
  variety?: string;
  typicalSeason?: string;
  defaultUnit: 'kg' | 'quintal' | 'tonne';
  marketBenchmarkPrice?: number;
  primaryMarket?: string;
  imageUrl?: string;
  farmerNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy?: {
    _id: string;
    name: string;
    phone: string;
    role: string;
  };
  reviewedBy?: {
    _id: string;
    name: string;
    phone: string;
  };
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewCropRequestPayload {
  nameEn: string;
  nameGu: string;
  nameHi?: string;
  nameMr?: string;
  categoryCode: string;
  variety?: string;
  typicalSeason?: string;
  defaultUnit?: 'kg' | 'quintal' | 'tonne';
  marketBenchmarkPrice?: number;
  primaryMarket?: string;
  imageUrl?: string;
  farmerNotes?: string;
}

export interface CropReviewPayload {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
  nameEn?: string;
  nameGu?: string;
  categoryCode?: string;
  marketBenchmarkPrice?: number;
  defaultUnit?: 'kg' | 'quintal' | 'tonne';
  variety?: string;
}

class CropService {
  /**
   * Fetch crops from MongoDB Atlas
   * @param status 'approved' (default for marketplace) | 'pending' | 'all' (for admin)
   */
  public async getCrops(status: 'approved' | 'pending' | 'rejected' | 'all' = 'approved'): Promise<MongoCropItem[]> {
    const res = await apiClient.get<{ crops: MongoCropItem[] }>('/crops', { status });
    if (res.success && res.data?.crops) {
      return res.data.crops;
    }
    return [];
  }

  /**
   * Search crops by name to suggest matches and check duplicates
   */
  public async searchCrops(query: string): Promise<{
    exists: boolean;
    exactMatch: MongoCropItem | null;
    suggestions: MongoCropItem[];
  }> {
    if (!query.trim()) {
      return { exists: false, exactMatch: null, suggestions: [] };
    }

    const res = await apiClient.get('/crops/search', { q: query.trim() });
    if (res.success && res.data) {
      return {
        exists: Boolean(res.data.exists),
        exactMatch: res.data.exactMatch || null,
        suggestions: res.data.suggestions || [],
      };
    }

    // Local fallback search if offline
    const normalized = query.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const localMatch = PRODUCT_CATALOG.find(
      (c) => c.nameEn.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized
    );

    return {
      exists: Boolean(localMatch),
      exactMatch: localMatch ? (this.catalogItemToMongoCrop(localMatch) as any) : null,
      suggestions: [],
    };
  }

  /**
   * Submit a new crop registration from a farmer or admin
   */
  public async requestNewCrop(payload: NewCropRequestPayload): Promise<{
    success: boolean;
    crop?: MongoCropItem;
    message?: string;
    isDuplicate?: boolean;
    isPending?: boolean;
  }> {
    const res = await apiClient.post<{ crop: MongoCropItem; message?: string; isDuplicate?: boolean; isPending?: boolean }>(
      '/crops/request',
      payload
    );

    if (res.status === 201 || res.status === 200) {
      return {
        success: true,
        crop: res.data?.crop,
        message: res.data?.message,
        isPending: res.data?.isPending,
      };
    }

    if (res.status === 409) {
      return {
        success: false,
        isDuplicate: true,
        message: res.error || 'This crop already exists in the directory.',
      };
    }

    return {
      success: false,
      message: res.error || 'Failed to submit new crop registration.',
    };
  }

  /**
   * Admin: Approve or Reject a crop request
   */
  public async reviewCrop(
    cropId: string,
    review: CropReviewPayload
  ): Promise<{ success: boolean; crop?: MongoCropItem; message?: string }> {
    const res = await apiClient.put<{ crop: MongoCropItem; message?: string }>(`/crops/${cropId}/review`, review);
    if (res.success && res.data) {
      return {
        success: true,
        crop: res.data.crop,
        message: res.data.message,
      };
    }
    return {
      success: false,
      message: res.error || 'Failed to review crop request.',
    };
  }

  /**
   * Convert static catalog item to MongoCropItem structure
   */
  public catalogItemToMongoCrop(item: ProductCatalogItem): MongoCropItem {
    return {
      cropId: item.id,
      nameEn: item.nameEn,
      nameGu: item.nameGu,
      nameHi: item.nameHi,
      nameMr: item.nameMr,
      normalizedName: item.nameEn.toLowerCase().replace(/[^a-z0-9]/g, ''),
      categoryCode: item.category,
      variety: item.defaultVariety,
      typicalSeason: 'Current Season',
      defaultUnit: item.defaultUnit?.toLowerCase() === 'tonne' ? 'tonne' : 'quintal',
      marketBenchmarkPrice: item.typicalPricePerKg ? item.typicalPricePerKg * 100 : 2500,
      primaryMarket: item.typicalYieldDistrict || 'APMC Yard',
      imageUrl: item.image,
      status: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export const cropService = new CropService();
