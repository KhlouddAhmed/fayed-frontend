// DTO shapes — match backend exactly (PascalCase)
export interface LoginRequestDto {
  readonly Email: string;
  readonly Password: string;
}

export interface LoginResponseDto {
  readonly Token: string;
  readonly ExpiresOn: string;
  readonly UserName: string;
  readonly Email: string;
}

// UI model — camelCase, used in components
export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly factoryId: string;
  readonly logoUrl: string;
  readonly role: 'Admin' | 'Factory';
  readonly expiresOn: Date;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}