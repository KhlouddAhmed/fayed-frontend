import { LabCertificate, Material, MaterialDto, MaterialStatus } from '../models/material.model';

const STATUS_MAP: Readonly<Record<string, MaterialStatus>> = {
  active: 'active',
  Active: 'active',
  underReview: 'underReview',
  UnderReview: 'underReview',
  Draft: 'draft',
draft: 'draft',
  paused: 'paused',
  Paused: 'paused',
  
  rejected: 'rejected',
  Rejected: 'rejected',
};

const DEFAULT_STATUS: MaterialStatus = 'active';

function adaptLabCertificate(dto: MaterialDto): LabCertificate | null {
  if (!dto.labCertificateUrl) return null;
  return {
    url: dto.labCertificateUrl,
    fileName: dto.labCertificateFileName ?? '',
    fileSizeKb: dto.labCertificateFileSizeKb ?? 0,
  };
}

export function adaptMaterial(dto: MaterialDto): Material {
  return {
    id: String(dto.id),
    name: dto.title,
    category: dto.categoryName ?? dto.category ?? 'غير محدد',
    categoryId: dto.categoryId,
    status: STATUS_MAP[dto.status] ?? DEFAULT_STATUS,
    description: dto.description ?? '',
    materialType: dto.materialType ?? '',
    condition: (dto.materialCondition as Material['condition']) ?? 'New',
    availableQuantity: dto.quantity ?? 0,
    measureUnit: dto.measureUnit ?? 'طن',
    minPrice: dto.minPrice ?? 0,
    maxPrice: dto.maxPrice ?? 0,
    pricePerUnit: dto.minPrice ?? 0,
    minOrderQuantity: dto.minOrderQuantity ?? 1,
    isNegotiable: dto.isNegotiable ?? true,
    isDivisible: dto.isDivisible ?? false,
    deliveryType: (dto.deliveryType as Material['deliveryType']) ?? 'Both',
    preferPayMethod: (dto.preferPayMethod as Material['preferPayMethod']) ?? 'Escrow',
    expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : new Date(),
    imageUrls: dto.imageUrls?.length
      ? dto.imageUrls
      : dto.mainImageUrl
        ? [dto.mainImageUrl]
        : [],
    videoUrl: dto.videoUrl ?? null,
    labCertificate: adaptLabCertificate(dto),
    publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
    updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date(),
  };
}

export function adaptMaterials(dtos: readonly MaterialDto[]): readonly Material[] {
  return dtos.map(adaptMaterial);
}