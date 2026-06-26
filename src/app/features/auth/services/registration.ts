import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, concat, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  RegisterRequest,
  RegisterResponse,
  RegisterResponseDto,
  DocumentVerificationCase,
  DocumentVerificationCaseDto,
  IdentityVerificationCase,
  IdentityVerificationCaseDto,
} from '../models/registration.models';
import {
  adaptRegisterRequest,
  adaptRegisterResponse,
  adaptDocumentVerificationCase,
  adaptIdentityVerificationCase,
} from '../adapters/registration.adapter';

const MOCK_VERIFICATION_DELAY_MS = 5000;

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private http = inject(HttpClient);

  register(data: RegisterRequest): Observable<RegisterResponse> {
    const payload = adaptRegisterRequest(data);

    // Switch this to the real call once your .NET API endpoint is ready:
    // return this.http.post<RegisterResponseDto>(`${environment.apiUrl}/auth/register`, payload)
    //   .pipe(map(adaptRegisterResponse));

    const mockResponse: RegisterResponseDto = {
      Success: true,
      Message: 'تم التسجيل بنجاح',
      CompanyId: 'new-company-002',
    };

    return of(mockResponse).pipe(
      delay(800),
      map(adaptRegisterResponse)
    );
  }

  // =============================================
  // STEP 1 — KYB DOCUMENT VERIFICATION (FR-07.1 / FR-07.2)
  // =============================================
  startDocumentVerification(commercialRegistry: File, taxCard: File): Observable<DocumentVerificationCase> {
    // Real implementation: upload both files via multipart/form-data, backend returns a caseId immediately
    // return this.http.post<DocumentVerificationCaseDto>(`${environment.apiUrl}/kyb/documents/start`, formData)
    //   .pipe(map(adaptDocumentVerificationCase));

    const mockPendingResponse: DocumentVerificationCaseDto = {
      CaseId: 'doc-case-001',
      Status: 'Pending',
    };

    return of(mockPendingResponse).pipe(
      delay(300),
      map(adaptDocumentVerificationCase)
    );
  }

  // Emits the pending state once, then emits the final settled state after a simulated delay.
  // Real implementation replaces the timer() with an interval() + switchMap polling a GET status endpoint.
  verifyDocumentsUntilSettled(caseId: string): Observable<DocumentVerificationCase> {
    const pendingCase: DocumentVerificationCase = { caseId, status: 'pending' };

    // To demo the failure UI manually, swap mockFinalResponse below for the failed variant.
    const mockFinalResponseDto: DocumentVerificationCaseDto = {
      CaseId: caseId,
      Status: 'Success',
      ExtractedData: {
        CompanyName: 'شركة النور للبلاستيك',
        OwnerName: 'احمد محمد علي',
        RegistryNumber: '12345678',
        TaxNumber: '12345678',
      },
    };

    // const mockFinalResponseDto: DocumentVerificationCaseDto = {
    //   CaseId: caseId,
    //   Status: 'Failed',
    //   RejectionReasons: [
    //     'السجل التجاري منتهي الصلاحية أو غير واضح',
    //     'البطاقة الضريبية لا تطابق بيانات الحساب',
    //   ],
    // };

    return concat(
      of(pendingCase),
      timer(MOCK_VERIFICATION_DELAY_MS).pipe(map(() => adaptDocumentVerificationCase(mockFinalResponseDto)))
    );
  }

  // =============================================
  // STEP 2 — IDENTITY VERIFICATION
  // =============================================
  startIdentityVerification(selfie: File, idCard: File): Observable<IdentityVerificationCase> {
    // Real implementation: upload both images, backend returns a caseId immediately
    // return this.http.post<IdentityVerificationCaseDto>(`${environment.apiUrl}/kyb/identity/start`, formData)
    //   .pipe(map(adaptIdentityVerificationCase));

    const mockPendingResponse: IdentityVerificationCaseDto = {
      CaseId: 'identity-case-001',
      Status: 'Pending',
    };

    return of(mockPendingResponse).pipe(
      delay(300),
      map(adaptIdentityVerificationCase)
    );
  }

  verifyIdentityUntilSettled(caseId: string): Observable<IdentityVerificationCase> {
    const pendingCase: IdentityVerificationCase = { caseId, status: 'pending' };

    const mockFinalResponseDto: IdentityVerificationCaseDto = {
      CaseId: caseId,
      Status: 'Success',
    };

    // const mockFinalResponseDto: IdentityVerificationCaseDto = {
    //   CaseId: caseId,
    //   Status: 'Failed',
    //   RejectionMessage: 'الصورة غير واضحة يرجى المحاولة مرة اخرى',
    // };

    return concat(
      of(pendingCase),
      timer(MOCK_VERIFICATION_DELAY_MS).pipe(map(() => adaptIdentityVerificationCase(mockFinalResponseDto)))
    );
  }
}