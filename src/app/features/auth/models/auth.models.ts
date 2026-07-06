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

// Register
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

// Normalized UI model
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

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  factoryId: string;
  logoUrl: string;
  role: 'Admin' | 'Factory';
  expiresOn: Date;
}