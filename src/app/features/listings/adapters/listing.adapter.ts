import { ListingDto, Listing, ListingDetailsDto, ListingMediaDto } from '../models/listing.model';

export function adaptListing(dto: ListingDto): Listing {
  return {
    id: String(dto.id),
    title: dto.title,
    category: dto.categoryName,
    thumbnailUrl: dto.mainImageUrl,
    price: dto.maxPrice,
    minPrice: dto.minPrice,
    quantity: dto.quantity,
    unit: dto.measureUnit,
    governorate: extractGovernorate(dto.factoryAddress),
    postedAgo: formatPostedAgo(dto.createdAt),
    materialTag: dto.materialType,
  };
}

export function adaptListings(dtos: readonly ListingDto[]): Listing[] {
  return dtos.map(adaptListing);
}

export function adaptListingDetails(dto: ListingDetailsDto): any {
  const mainImage = dto.media.find(m => m.isMain)?.mediaUrl || dto.mainImageUrl;

  return {
    id: String(dto.id),
    title: dto.title,
    price: dto.maxPrice,
    quantity: dto.quantity,
    unit: dto.measureUnit,
    governorate: extractGovernorate(dto.factoryAddress),
    publishedAgo: formatPostedAgo(dto.createdAt),
    description: dto.description,
    minOrder: dto.minOrderQuantity,
    isNegotiable: dto.isNegotiable,
    deliveryType: dto.deliveryType,
    images: dto.media
      .filter(m => m.mediaType === 'Image')
      .map(m => m.mediaUrl),
    mainImage,
    specs: [
      { label: 'الحد الأدنى', value: `${dto.minOrderQuantity} ${dto.measureUnit}` },
      { label: 'قابل للتفاوض', value: dto.isNegotiable ? 'نعم' : 'لا' },
      { label: 'طريقة التسليم', value: dto.deliveryType },
    ],
    labFiles: dto.certificateUrl ? [{
      name: 'شهادة الجودة',
      size: 'غير محدد',
      url: dto.certificateUrl
    }] : [],
    company: {
      id: 'FYD-XXXX',
      name: 'الشركة المالكة',
      rating: 4.5
    }
  };
}

function extractGovernorate(address: string): string {
  return address?.split('،')[0]?.trim() ?? address ?? 'غير محدد';
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