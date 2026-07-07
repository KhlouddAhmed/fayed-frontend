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

export interface ListingDetailsDto extends ListingDto {
  readonly Description: string;
  readonly MinOrderQuantity: number;
  readonly IsNegotiable: boolean;
  readonly IsDivisible: boolean;
  readonly DeliveryType: string;
  readonly PreferPayMethod: string;
  readonly CustomCatName?: string;
  readonly VideoUrl?: string;
  readonly CertificateUrl?: string;
  readonly Media: ListingMediaDto[];
}

export interface ListingMediaDto {
  readonly Id: number;
  readonly MediaUrl: string;
  readonly MediaType: string;
  readonly IsMain: boolean;
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