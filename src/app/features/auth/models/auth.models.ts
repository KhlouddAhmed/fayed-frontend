// =============================================
// REQUEST DTOs — match backend PascalCase
// =============================================
export interface LoginRequestDto {
  readonly Email: string;
  readonly Password: string;
}

// =============================================
// RESPONSE DTOs — match backend PascalCase
// =============================================
export interface LoginResponseDto {
  token: string;
  expiresOn: string;
  userName: string;
  email: string;
}

// =============================================
// UI MODELS — camelCase, used in components
// =============================================
export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly factoryId: string;
  readonly logoUrl: string;
  readonly role: 'Admin' | 'Factory';
  readonly expiresOn: Date;
}