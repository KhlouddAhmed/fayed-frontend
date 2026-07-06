// DTO shapes — match backend exactly (PascalCase)

export interface KybExtractRequestDto {
  readonly Files: File[];
  readonly LegalName?: string;
  readonly CommercialRegistryNo?: string;
  readonly TaxCardNo?: string;
  readonly Address?: string;
  readonly Sector?: string;
  readonly OwnerName?: string;
  readonly NationalId?: string;
}

export interface AnalyzedFileDto {
  readonly FileName: string;
  readonly ContentType: string;
  readonly SizeBytes: number;
}

export interface KybExtractionResultDto {
  readonly ExtractedFields: string;
  readonly ConfidenceScore: number;
  readonly Mismatches: string | null;
  readonly Recommendation: string;
  readonly ValidityIssues: readonly string[];
  readonly ModelVersion: string;
  readonly Files: readonly AnalyzedFileDto[];
}

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
  readonly ExtractedFields: string;
  readonly ConfidenceScore: number;
  readonly Mismatches: string | null;
  readonly Recommendation: string;
  readonly ModelVersion: string;
}

// UI models — camelCase, used in components

export type VerificationStatus = 'idle' | 'loading' | 'success' | 'rejected' | 'error';

export type FileUploadState = 'idle' | 'uploading' | 'success' | 'unsupported';

export interface SelectedFileMeta {
  readonly name: string;
  readonly sizeInMb: number;
}

export interface KybExtractedData {
  readonly extractedFields: string;
  readonly confidenceScore: number;
  readonly mismatches: string | null;
  readonly recommendation: 'Approve' | 'Review' | 'Reject';
  readonly validityIssues: readonly string[];
  readonly modelVersion: string;
}

export interface RegistrationFormData {
  readonly commercialRegistryFile: File | null;
  readonly taxCardFile: File | null;
  readonly kybResult: KybExtractedData | null;
  readonly nationalIdFile: File | null;
  readonly selfieWithIdFile: File | null;
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

//success modal
export interface ExtractedCompanyData {
  readonly companyName: string;
  readonly ownerName: string;
}