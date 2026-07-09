export type MaterialStatus = 'active' | 'underReview' | 'paused' | 'rejected' | 'draft';
export type MaterialCondition = 'New' | 'Used' | 'Scrap' | 'ByProduct';
export type DeliveryType = 'Pickup' | 'Delivery' | 'Both';
export type PaymentMethod = 'Cash' | 'BankTransfer' | 'Escrow';

export interface MaterialDto {
  readonly id: string | number;
  readonly title: string;
  readonly category?: string;
  readonly categoryName?: string;
  readonly categoryId: number;
  readonly status: string;
  readonly description: string;
  readonly materialType: string;
  readonly materialCondition: string;
  readonly quantity: number;
  readonly measureUnit: string;
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly minOrderQuantity: number;
  readonly isNegotiable: boolean;
  readonly isDivisible: boolean;
  readonly deliveryType: string;
  readonly preferPayMethod: string;
  readonly expiryDate: string;
  readonly imageUrls?: readonly string[];
  readonly mainImageUrl?: string;
  readonly videoUrl: string | null;
  readonly labCertificateUrl: string | null;
  readonly labCertificateFileName: string | null;
  readonly labCertificateFileSizeKb: number | null;
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly createdAt?: string;
  readonly price?: number;
}

export interface Material {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly categoryId?: number;
  readonly status: MaterialStatus;
  readonly description: string;
  readonly materialType: string;
  readonly condition: MaterialCondition;
  readonly availableQuantity: number;
  readonly measureUnit: string;
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly pricePerUnit: number;
  readonly minOrderQuantity: number;
  readonly isNegotiable: boolean;
  readonly isDivisible: boolean;
  readonly deliveryType: DeliveryType;
  readonly preferPayMethod: PaymentMethod;
  readonly expiryDate: Date;
  readonly imageUrls: readonly string[];
  readonly videoUrl: string | null;
  readonly labCertificate: LabCertificate | null;
  readonly publishedAt: Date;
  readonly updatedAt: Date;
}

export interface LabCertificate {
  readonly url: string;
  readonly fileName: string;
  readonly fileSizeKb: number;
}

export interface MaterialFormValue {
  title: string;
  description: string;
  categoryId: number;
  materialType: string;
  materialCondition: MaterialCondition;
  quantity: number;
  measureUnit: string;
  minPrice: number;
  maxPrice: number;
  minOrderQuantity: number;
  isNegotiable: boolean;
  isDivisible: boolean;
  deliveryType: DeliveryType;
  preferPayMethod: PaymentMethod;
  expiryDate: string;
  imageFiles?: File[];
  videoFile?: File | null;
  certificateFile?: File | null;
}