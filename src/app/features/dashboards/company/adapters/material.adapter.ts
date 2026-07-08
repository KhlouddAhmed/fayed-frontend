import { Material, MaterialDto } from '../models/material.model';

export function adaptMaterial(dto: MaterialDto): Material {
  return {
    id: dto.id.toString(),
    name: dto.title,
    category: dto.categoryName || 'غير محدد',
    categoryId: dto.categoryId,
    status: dto.status,
    description: dto.description || '',
    availableQuantity: dto.quantity || 0,
    unit: dto.measureUnit || 'كجم',
    pricePerUnit: dto.price || dto.minPrice || 0,
    imageUrls: dto.imageUrls?.length ? dto.imageUrls : (dto.mainImageUrl ? [dto.mainImageUrl] : []),
    publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null,
    updatedAt: new Date(dto.createdAt),
    condition: dto.materialCondition || 'New'
  };
}

export function adaptMaterials(dtos: readonly MaterialDto[]): readonly Material[] {
  return dtos.map(adaptMaterial);
}