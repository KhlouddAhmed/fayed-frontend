import { LabCertificate, Material, MaterialDto, MaterialStatus } from '../models/material.model';

const MATERIAL_STATUS_MAP: Readonly<Record<string, MaterialStatus>> = {
  Active: 'active',
  UnderReview: 'underReview',
  Paused: 'paused',
  Rejected: 'rejected',
};

const DEFAULT_MATERIAL_STATUS: MaterialStatus = 'active';

function adaptMaterialStatus(rawStatus: string | undefined | null): MaterialStatus {
  if (!rawStatus) {
    return DEFAULT_MATERIAL_STATUS;
  }

  return MATERIAL_STATUS_MAP[rawStatus] ?? DEFAULT_MATERIAL_STATUS;
}

function adaptLabCertificate(dto: MaterialDto): LabCertificate | null {
  if (!dto.LabCertificateUrl) {
    return null;
  }

  return {
    url: dto.LabCertificateUrl,
    fileName: dto.LabCertificateFileName ?? '',
    fileSizeKb: dto.LabCertificateFileSizeKb ?? 0,
  };
}

export function adaptMaterial(dto: MaterialDto): Material {
  return {
    id: dto.Id,
    name: dto.Name,
    category: dto.Category,
    status: adaptMaterialStatus(dto.Status),
    description: dto.Description ?? '',
    availableQuantity: dto.AvailableQuantity ?? 0,
    minOrderQuantity: dto.MinOrderQuantity ?? 0,
    unit: dto.Unit,
    pricePerUnit: dto.PricePerUnit ?? 0,
    imageUrls: dto.ImageUrls ?? [],
    videoUrl: dto.VideoUrl ?? null,
    labCertificate: adaptLabCertificate(dto),
    publishedAt: new Date(dto.PublishedAt),
    updatedAt: new Date(dto.UpdatedAt),
  };
}

export function adaptMaterials(dtos: readonly MaterialDto[]): readonly Material[] {
  return dtos.map(adaptMaterial);
}
