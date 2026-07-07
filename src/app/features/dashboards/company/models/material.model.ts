export interface MaterialDto {
  readonly Id: string;
  readonly Name: string;
  readonly Category: string;
  readonly CategoryId: number;
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

export type MaterialStatus = 'active' | 'underReview' | 'paused' | 'rejected';

export interface Material {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly categoryId?: number;
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

export interface MaterialFormValue {
  readonly name: string;
  readonly category: string;
  readonly categoryId: number;
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