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

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    console.error('خطأ أثناء فك التوكن (JWT Decode Error):', error);
    return null;
  }
}

export function adaptLoginResponse(
  response: any 
): AuthUser | null {
  const dto = response.data; 
  if (!dto?.token) return null;

  const payload = decodeJwt(dto.token);
  if (!payload) return null;

  const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  return {
    id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
    email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
    name: payload.FullName ?? dto.userName, 
    factoryId: payload.FactoryId ?? '',
    logoUrl: payload.LogoUrl ?? '',
    role: role === 'Admin' ? 'Admin' : 'Factory',
    expiresOn: new Date(dto.expiresOn),
  };
}