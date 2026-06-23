// DTOs mirror the .NET backend shape (PascalCase comes in, adapter normalizes it)
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Raw shape from .NET backend — PascalCase as .NET sends it by default
export interface LoginResponseDto {
  Token: string;
  CompanyId: string;
  CompanyName: string;
  KybStatus: 'Pending' | 'Verified' | 'Rejected';
}

// Normalized UI model used inside the app
export interface LoginUser {
  token: string;
  companyId: string;
  companyName: string;
  kybStatus: 'pending' | 'verified' | 'rejected';
}

//sgin up
export interface RegisterStepOneRequestDto {
  email: string;
  phoneNumber: string;
  passwordHash: string;
}

