import { LoginResponseDto, LoginUser } from '../models/auth.models';

// Maps raw backend response (PascalCase) to our internal UI model (camelCase).
// All null/missing field handling lives here — never in the component.
export function adaptLoginResponse(dto: LoginResponseDto): LoginUser {
  return {
    token: dto.Token ?? '',
    companyId: dto.CompanyId ?? '',
    companyName: dto.CompanyName ?? '',
    kybStatus: normalizeKybStatus(dto.KybStatus),
  };
}

function normalizeKybStatus(
  raw: LoginResponseDto['KybStatus'] | undefined | null
): LoginUser['kybStatus'] {
  const map: Record<string, LoginUser['kybStatus']> = {
    Pending: 'pending',
    Verified: 'verified',
    Rejected: 'rejected',
  };
  return map[raw ?? ''] ?? 'pending';
}