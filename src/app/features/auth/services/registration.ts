import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponseWithData, ApiResponse } from '../../../core/models/api-response.model';
import { KybExtractionResultDto, KybExtractedData, RegisterRequestDto } from '../models/registration.models';
import { adaptKybExtractionResult, buildExtractFormData, buildRegisterFormData } from '../adapters/registration.adapter';

// Backend returns camelCase — matches actual response shape
interface RawKybResponse {
  readonly data?: KybExtractionResultDto;
  readonly Data?: KybExtractionResultDto;
  readonly statusCode?: number;
  readonly isSuccess?: boolean;
  readonly message?: string;
  readonly errors?: string[] | null;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly http = inject(HttpClient);

  extractDocuments(
    commercialRegistryFile: File,
    taxCardFile: File,
    declared?: {
      legalName?: string;
      commercialRegistryNo?: string;
      taxCardNo?: string;
      address?: string;
      sector?: string;
      ownerName?: string;
      nationalId?: string;
    }
  ): Observable<KybExtractedData> {
    const formData = buildExtractFormData(commercialRegistryFile, taxCardFile, declared);

    return this.http
      .post<RawKybResponse>(
        `${environment.apiUrl}/verification/extract`,
        formData
      )
      .pipe(
        map(response => {
          // Handle both camelCase (actual) and PascalCase (assumed)
          const dto = response.data ?? response.Data;
          if (!dto) throw new Error('No data in KYB response');
          return adaptKybExtractionResult(dto);
        })
      );
  }

  registerFactory(request: RegisterRequestDto): Observable<ApiResponse> {
    const formData = buildRegisterFormData(request);

    return this.http.post<ApiResponse>(
      `${environment.apiUrl}/auth/register-factory`,
      formData
    );
  }
}