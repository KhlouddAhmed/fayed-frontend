import { ApiResponseWithData } from '../../../core/models/api-response.model';
import { AuthUser, LoginResponseDto } from '../models/auth.models';

interface JwtPayload {
  readonly 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  readonly 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  readonly 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  readonly FullName: string;
  readonly FactoryId: string;
  readonly LogoUrl: string;
  readonly exp: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1])) as JwtPayload;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function adaptLoginResponse(
  response: ApiResponseWithData<LoginResponseDto>
): AuthUser | null {
  const dto = response.Data;
  if (!dto?.Token) return null;

  const payload = decodeJwt(dto.Token);
  if (!payload) return null;

  const role =
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  return {
    id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
    email: dto.Email,
    name: dto.UserName,
    factoryId: payload.FactoryId ?? '',
    logoUrl: payload.LogoUrl ?? '',
    role: role === 'Admin' ? 'Admin' : 'Factory',
    expiresOn: new Date(dto.ExpiresOn),
  };
}