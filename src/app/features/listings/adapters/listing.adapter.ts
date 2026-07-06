import { ListingDto, Listing } from '../models/listing.model';

export function adaptListing(dto: ListingDto): Listing {
  return {
    id: String(dto.Id),
    title: dto.Title,
    category: dto.CategoryName,
    thumbnailUrl: dto.MainImageUrl,
    price: dto.PricePerUnit,
    quantity: dto.Quantity,
    unit: dto.MeasureUnit,
    governorate: extractGovernorat(dto.FactoryAddress),
    postedAgo: formatPostedAgo(dto.CreatedAt),
    materialTag: dto.MaterialType,
  };
}

export function adaptListings(dtos: ListingDto[]): Listing[] {
  return dtos.map(adaptListing);
}

// يستخرج أول جزء من العنوان كمحافظة
function extractGovernorat(address: string): string {
  return address?.split('،')[0]?.trim() ?? address;
}

function formatPostedAgo(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'نشر اليوم';
  if (diffDays === 1) return 'نشر منذ يوم';
  if (diffDays <= 10) return `نشر منذ ${diffDays} أيام`;
  return `نشر منذ ${diffDays} يوم`;
}