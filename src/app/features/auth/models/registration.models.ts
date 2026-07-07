// =============================================
// FILE UPLOAD UI TYPES
// =============================================
export type FileUploadState = 'idle' | 'uploading' | 'unsupported' | 'success';
export type VerificationStatus = 'idle' | 'pending' | 'success' | 'failed' | 'loading' | 'rejected' | 'error';

export interface SelectedFileMeta {
  readonly name: string;
  readonly sizeInMb: number;
}

// =============================================
// KYB EXTRACTION — supports both camelCase (actual) and PascalCase (assumed)
// Backend confirmed returns camelCase
// =============================================
export interface KybExtractionResultDto {
  // camelCase — actual backend response
  readonly extractedFields?: string;
  readonly confidenceScore?: number;
  readonly mismatches?: string | null;
  readonly recommendation?: string;
  readonly validityIssues?: readonly string[];
  readonly modelVersion?: string;
  // PascalCase — fallback
  readonly ExtractedFields?: string;
  readonly ConfidenceScore?: number;
  readonly Mismatches?: string | null;
  readonly Recommendation?: string;
  readonly ValidityIssues?: readonly string[];
  readonly ModelVersion?: string;
}

export interface KybExtractedData {
  readonly extractedFields: string;
  readonly confidenceScore: number;
  readonly mismatches: string | null;
  readonly recommendation: string;
  readonly validityIssues: readonly string[];
  readonly modelVersion: string;
}

// =============================================
// EXTRACTED COMPANY DATA — parsed from extractedFields JSON
// Keys match actual AI response (camelCase)
// =============================================
export interface ExtractedCompanyData {
  readonly companyName?: string;
  readonly ownerName?: string;
  readonly registryNumber?: string;
  readonly taxNumber?: string;
}

// =============================================
// STEP 1 OUTPUT
// =============================================
export interface DocumentStepResult {
  readonly commercialRegistryFile: File;
  readonly taxCardFile: File;
  readonly kybResult: KybExtractedData;
  readonly extractedCompanyData: ExtractedCompanyData;
}

// =============================================
// STEP 2 OUTPUT
// =============================================
export interface IdentityStepResult {
  readonly nationalIdFile: File;
  readonly selfieWithIdFile: File;
}

// =============================================
// STEP 3 OUTPUT
// =============================================
export interface AccountDetailsResult {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly nationalId: string;
  readonly factoryName: string;
  readonly address: string;
  readonly sector: string;
  readonly commercialRegistryNo: string;
  readonly taxCardNo: string;
}

// =============================================
// FINAL REGISTER REQUEST DTO — matches FayedRegisterFactoryRequest.cs
// =============================================
export interface RegisterRequestDto {
  readonly Email: string;
  readonly Password: string;
  readonly Name: string;
  readonly NationalId: string;
  readonly FactoryName: string;
  readonly Address: string;
  readonly Sector: string;
  readonly CommercialRegistryNo: string;
  readonly TaxCardNo: string;
  readonly CommercialRegistryFile: File;
  readonly TaxCardFile: File;
  readonly NationalIdFile: File;
  readonly SelfieWithIdFile: File;
  readonly ExtractedFields?: string;
  readonly ConfidenceScore?: number;
  readonly Mismatches?: string | null;
  readonly Recommendation?: string;
  readonly ModelVersion?: string;
}