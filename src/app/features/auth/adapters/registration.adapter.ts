import { KybExtractionResultDto, KybExtractedData, RegisterRequestDto } from '../models/registration.models';

export function adaptKybExtractionResult(dto: KybExtractionResultDto): KybExtractedData {
  return {
    extractedFields: dto.ExtractedFields ?? '{}',
    confidenceScore: dto.ConfidenceScore ?? 0,
    mismatches: dto.Mismatches ?? null,
    recommendation: normalizeRecommendation(dto.Recommendation),
    validityIssues: dto.ValidityIssues ?? [],
    modelVersion: dto.ModelVersion ?? '',
  };
}

export function buildExtractFormData(
  commercialRegistryFile: File,
  taxCardFile: File,
  declared?: {
    legalName?: string;
    commercialRegistryNo?: string;
    taxCardNo?: string;
    address?: string;
    sector?: string;
    ownerName?: string;
    nationalId?: string;
  }
): FormData {
  const fd = new FormData();
  fd.append('Files', commercialRegistryFile);
  fd.append('Files', taxCardFile);

  if (declared?.legalName) fd.append('LegalName', declared.legalName);
  if (declared?.commercialRegistryNo) fd.append('CommercialRegistryNo', declared.commercialRegistryNo);
  if (declared?.taxCardNo) fd.append('TaxCardNo', declared.taxCardNo);
  if (declared?.address) fd.append('Address', declared.address);
  if (declared?.sector) fd.append('Sector', declared.sector);
  if (declared?.ownerName) fd.append('OwnerName', declared.ownerName);
  if (declared?.nationalId) fd.append('NationalId', declared.nationalId);

  return fd;
}

export function buildRegisterFormData(request: RegisterRequestDto): FormData {
  const fd = new FormData();

  fd.append('Email', request.Email);
  fd.append('Password', request.Password);
  fd.append('Name', request.Name);
  fd.append('NationalId', request.NationalId);
  fd.append('FactoryName', request.FactoryName);
  fd.append('Address', request.Address);
  fd.append('Sector', request.Sector);
  fd.append('CommercialRegistryNo', request.CommercialRegistryNo);
  fd.append('TaxCardNo', request.TaxCardNo);

  fd.append('CommercialRegistryFile', request.CommercialRegistryFile);
  fd.append('TaxCardFile', request.TaxCardFile);
  fd.append('NationalIdFile', request.NationalIdFile);
  fd.append('SelfieWithIdFile', request.SelfieWithIdFile);

  fd.append('ExtractedFields', request.ExtractedFields);
  fd.append('ConfidenceScore', String(request.ConfidenceScore));
  fd.append('Recommendation', request.Recommendation);
  fd.append('ModelVersion', request.ModelVersion);

  if (request.Mismatches) {
    fd.append('Mismatches', request.Mismatches);
  }

  return fd;
}

function normalizeRecommendation(value: string): 'Approve' | 'Review' | 'Reject' {
  if (value === 'Approve' || value === 'Review' || value === 'Reject') return value;
  return 'Review';
}