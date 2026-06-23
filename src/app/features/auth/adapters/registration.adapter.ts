import { RegisterRequest, RegisterRequestDto, RegisterResponse, RegisterResponseDto } from '../models/registration.models';

// Maps our internal UI model to the PascalCase expected by the .NET backend
export function adaptRegisterRequest(data: RegisterRequest): RegisterRequestDto {
  return {
    Email: data.email,
    PhoneNumber: data.phoneNumber,
    PasswordHash: data.passwordHash,
  };
}

// Maps the backend response back to our internal UI model
export function adaptRegisterResponse(dto: RegisterResponseDto): RegisterResponse {
  return {
    success: dto.Success ?? false,
    message: dto.Message ?? '',
    companyId: dto.CompanyId,
  };
}