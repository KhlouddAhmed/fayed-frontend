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