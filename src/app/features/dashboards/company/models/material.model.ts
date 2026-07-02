// =============================================
// API DTOs (.NET 8 — PascalCase as received from backend)
// =============================================

export interface MaterialDto {
  readonly Id: string;
  readonly Name: string;
  readonly Category: string;
  readonly Status: string;
  readonly Description: string;
  readonly AvailableQuantity: number;
  readonly MinOrderQuantity: number;
  readonly Unit: string;
  readonly PricePerUnit: number;
  readonly ImageUrls: readonly string[];
  readonly VideoUrl: string | null;
  readonly LabCertificateUrl: string | null;
  readonly LabCertificateFileName: string | null;
  readonly LabCertificateFileSizeKb: number | null;
  readonly PublishedAt: string;
  readonly UpdatedAt: string;
}

// =============================================
// UI Models (camelCase, normalized, display-ready)
// =============================================

export type MaterialStatus = 'active' | 'underReview' | 'paused' | 'rejected';

export interface Material {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly status: MaterialStatus;
  readonly description: string;
  readonly availableQuantity: number;
  readonly minOrderQuantity: number;
  readonly unit: string;
  readonly pricePerUnit: number;
  readonly imageUrls: readonly string[];
  readonly videoUrl: string | null;
  readonly labCertificate: LabCertificate | null;
  readonly publishedAt: Date;
  readonly updatedAt: Date;
  materialType?: string;
  condition?: string;
  maxPricePerUnit?: number;
}

export interface LabCertificate {
  readonly url: string;
  readonly fileName: string;
  readonly fileSizeKb: number;
}

// =============================================
// Form model — used by AddMaterialModal for both create and edit
// =============================================

export interface MaterialFormValue {
  readonly name: string;
  readonly category: string;
  readonly status: MaterialStatus;
  readonly description: string;
  readonly availableQuantity: number;
  readonly minOrderQuantity: number;
  readonly unit: string;
  readonly pricePerUnit: number;
  materialType: string;
  condition: string;
  maxPricePerUnit: number;
  imageFiles?: File[];
  videoFile?: File | null;
  labCertificateFile?: File | null;
}
