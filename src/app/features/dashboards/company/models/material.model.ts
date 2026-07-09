export type MaterialStatus = 'Draft' | 'PendingApproval' | 'Published' | 'Rejected' | 'Sold';

export interface MaterialDto {
  readonly id: number;
  readonly title: string;
  readonly categoryName?: string;
  readonly categoryId?: number;
  readonly status: MaterialStatus;
  readonly description?: string;
  readonly quantity: number;
  readonly measureUnit?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly price?: number;
  readonly mainImageUrl?: string;
  readonly imageUrls?: string[];
  readonly publishedAt?: string;
  readonly createdAt: string;
  readonly materialCondition?: string;
}

export interface Material {
  readonly id: string;
  readonly name: string; 
  readonly category: string;
  readonly categoryId?: number;
  readonly status: MaterialStatus;
  readonly description: string;
  readonly availableQuantity: number;
  readonly unit: string;
  readonly pricePerUnit: number;
  readonly imageUrls: readonly string[];
  readonly publishedAt: Date | null;
  readonly updatedAt: Date;
  readonly condition: string;
}

export interface MaterialFormValue {
  title: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  materialCondition: string;
  mediaFiles?: File[];
}