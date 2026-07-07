import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

export interface ApiPendingKyb {
  caseId: number;
  requestNumber: string;
  companyName: string;
  commercialRegistryNo: string;
  taxCardNo: string;
  submittedDate: string;
}

export interface ApiKybDetails {
  caseId: number;
  companyName: string;
  commercialRegistryNo: string;
  taxCardNo: string;
  address: string;
  sector: string;
  documents: { documentType: string; fileUrl: string }[];
  aiConfidenceScore: number;
  aiRecommendation: string;
  aiMismatches: string;
}

@Injectable({
  providedIn: 'root'
})
export class KybService {
  private http = inject(HttpClient);

  getPendingKyb(): Observable<ApiResponseWithData<ApiPendingKyb[]>> {
    return this.http.get<ApiResponseWithData<ApiPendingKyb[]>>(`${environment.apiUrl}/Admin/pending-kyb`);
  }

  getKybDetails(caseId: number): Observable<ApiResponseWithData<ApiKybDetails>> {
    return this.http.get<ApiResponseWithData<ApiKybDetails>>(`${environment.apiUrl}/Admin/kyb-details/${caseId}`);
  }

  // الدالة دي بتحقق الشرط بتاعك في الـ Payload بالظبط
  submitKybDecision(caseId: number, payload: { isApproved: boolean; rejectionReason: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Admin/kyb-decision/${caseId}`, payload);
  }
}