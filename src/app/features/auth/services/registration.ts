import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ApiResponseWithData } from '../../../core/models/api-response.model';
import { KybExtractionResultDto, KybExtractedData, RegisterRequestDto } from '../models/registration.models';
import { adaptKybExtractionResult, buildExtractFormData, buildRegisterFormData } from '../adapters/registration.adapter';

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
      .post<ApiResponseWithData<KybExtractionResultDto>>(
        `${environment.apiUrl}/verification/extract`,
        formData
      )
      .pipe(map(response => adaptKybExtractionResult(response.Data!)));
  }

  registerFactory(request: RegisterRequestDto): Observable<ApiResponse> {
    const formData = buildRegisterFormData(request);

    return this.http.post<ApiResponse>(
      `${environment.apiUrl}/auth/register-factory`,
      formData
    );
  }
}