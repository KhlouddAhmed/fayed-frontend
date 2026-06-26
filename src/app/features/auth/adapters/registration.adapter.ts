import {
  RegisterRequest,
  RegisterRequestDto,
  RegisterResponse,
  RegisterResponseDto,
  ExtractedCompanyData,
  ExtractedCompanyDataDto,
  DocumentVerificationCase,
  DocumentVerificationCaseDto,
  IdentityVerificationCase,
  IdentityVerificationCaseDto,
  VerificationStatus,
} from '../models/registration.models';

// Maps our internal UI model to the PascalCase expected by the .NET backend
export function adaptRegisterRequest(data: RegisterRequest): RegisterRequestDto {
  return {
    Email: data.email,
    PhoneNumber: data.phoneNumber,
    PasswordHash: data.passwordHash,
  };
}

// Maps the backend response back to our internal UI model
export function adaptRegisterResponse(dto: RegisterResponseDto): RegisterResponse {
  return {
    success: dto.Success ?? false,
    message: dto.Message ?? '',
    companyId: dto.CompanyId,
  };
}

function normalizeStatus(raw: 'Pending' | 'Success' | 'Failed' | undefined | null): VerificationStatus {
  const map: Record<string, VerificationStatus> = {
    Pending: 'pending',
    Success: 'success',
    Failed: 'failed',
  };
  return map[raw ?? ''] ?? 'pending';
}

function adaptExtractedCompanyData(dto: ExtractedCompanyDataDto | undefined): ExtractedCompanyData | undefined {
  if (!dto) {
    return undefined;
  }
  return {
    companyName: dto.CompanyName ?? '',
    ownerName: dto.OwnerName ?? '',
    registryNumber: dto.RegistryNumber ?? '',
    taxNumber: dto.TaxNumber ?? '',
  };
}

export function adaptDocumentVerificationCase(dto: DocumentVerificationCaseDto): DocumentVerificationCase {
  return {
    caseId: dto.CaseId ?? '',
    status: normalizeStatus(dto.Status),
    extractedData: adaptExtractedCompanyData(dto.ExtractedData),
    rejectionReasons: dto.RejectionReasons ?? [],
  };
}

export function adaptIdentityVerificationCase(dto: IdentityVerificationCaseDto): IdentityVerificationCase {
  return {
    caseId: dto.CaseId ?? '',
    status: normalizeStatus(dto.Status),
    rejectionMessage: dto.RejectionMessage ?? '',
  };
}