export interface Listing {
  readonly id: string;
  readonly title: string;
  readonly category: string | null;
  readonly thumbnailUrl: string | null;
  readonly price: number;
  readonly minPrice?: number;
  readonly quantity: number;
  readonly unit: string;
  readonly governorate: string;
  readonly postedAgo: string;
  readonly materialTag: string;
}

// Backend DTOs
export interface ListingDto {
  readonly id: number;
  readonly title: string;
  readonly categoryName: string | null;
  readonly mainImageUrl: string | null;
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly quantity: number;
  readonly measureUnit: string;
  readonly factoryAddress: string;
  readonly materialType: string;
  readonly materialCondition: string;
  readonly status: string;
  readonly createdAt: string;
  readonly publishedAt: string | null;
  readonly expiryDate: string | null;
}


export interface ListingDetailsDto extends ListingDto {
  readonly description: string;
  readonly minOrderQuantity: number;
  readonly isNegotiable: boolean;
  readonly isDivisible: boolean;
  readonly deliveryType: string;
  readonly preferPayMethod: string;
  readonly customCatName?: string;
  readonly videoUrl?: string;
  readonly certificateUrl?: string;
  readonly media: ListingMediaDto[];
}

export interface ListingMediaDto {
  readonly id: number;
  readonly mediaUrl: string;
  readonly mediaType: string;
  readonly isMain: boolean;
}

export interface ListingSearchParams {
  readonly searchTerm?: string;
  readonly categoryId?: number;
  readonly materialType?: string;
  readonly location?: string;
  readonly minQuantity?: number;
  readonly maxQuantity?: number;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly sortBy?: string;
  readonly pageNumber?: number;
  readonly pageSize?: number;
}