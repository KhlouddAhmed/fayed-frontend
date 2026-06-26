// DTOs mirror the .NET backend shape (PascalCase comes in/goes out)
export interface RegisterRequestDto {
  Email: string;
  PhoneNumber: string;
  PasswordHash: string;
}

export interface RegisterResponseDto {
  Success: boolean;
  Message: string;
  CompanyId?: string;
}

// Normalized UI model used inside the Angular app
export interface RegisterRequest {
  email: string;
  phoneNumber: string;
  passwordHash: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  companyId?: string;
}

// =============================================
// FILE UPLOAD CARD TYPES (shared between steps 1 and 2)
// =============================================
export type FileUploadState = 'idle' | 'uploading' | 'unsupported' | 'success';

export interface SelectedFileMeta {
  readonly name: string;
  readonly sizeInMb: number;
}

// =============================================
// KYB DOCUMENT VERIFICATION (Step 1 — FR-07.1/FR-07.2)
// =============================================
export type VerificationStatus = 'idle' | 'pending' | 'success' | 'failed';

export interface ExtractedCompanyDataDto {
  CompanyName: string;
  OwnerName: string;
  RegistryNumber: string;
  TaxNumber: string;
}

export interface ExtractedCompanyData {
  readonly companyName: string;
  readonly ownerName: string;
  readonly registryNumber: string;
  readonly taxNumber: string;
}

export interface DocumentVerificationCaseDto {
  CaseId: string;
  Status: 'Pending' | 'Success' | 'Failed';
  ExtractedData?: ExtractedCompanyDataDto;
  RejectionReasons?: readonly string[];
}

export interface DocumentVerificationCase {
  readonly caseId: string;
  readonly status: VerificationStatus;
  readonly extractedData?: ExtractedCompanyData;
  readonly rejectionReasons?: readonly string[];
}

// =============================================
// IDENTITY VERIFICATION (Step 2)
// =============================================
export interface IdentityVerificationCaseDto {
  CaseId: string;
  Status: 'Pending' | 'Success' | 'Failed';
  RejectionMessage?: string;
}

export interface IdentityVerificationCase {
  readonly caseId: string;
  readonly status: VerificationStatus;
  readonly rejectionMessage?: string;
}