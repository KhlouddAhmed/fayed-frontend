export interface Listing {
  readonly id: string;
  readonly title: string;
  readonly category: string | null;
  readonly thumbnailUrl: string | null;
  readonly price: number;
  readonly quantity: number;
  readonly unit: string;
  readonly governorate: string;
  readonly postedAgo: string;
  readonly materialTag: string;
}

// DTO shape
export interface ListingDto {
  readonly Id: number;
  readonly Title: string;
  readonly CategoryName: string | null;
  readonly MainImageUrl: string | null;
  readonly MinPrice: number;
  readonly MaxPrice: number; 
  readonly Quantity: number;
  readonly MeasureUnit: string;
  readonly FactoryAddress: string;
  readonly MaterialType: string;
  readonly CreatedAt: string;
}

export interface ListingSearchParams {
  readonly searchTerm?: string;
  readonly categoryId?: number;
  readonly location?: string;
  readonly minQuantity?: number;
  readonly maxQuantity?: number;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly sortBy?: string;
  readonly pageNumber?: number;
  readonly pageSize?: number;
}