import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

// واجهة بوابات الدفع (تطابق الـ API)
export interface PaymentSettings {
  isFawryEnabled: boolean;
  fawryMerchantId: string;
  isPaymobEnabled: boolean;
  paymobSecretKey: string;
  bankName: string;
  bankIban: string;
}

// واجهة سجل النظام (تطابق الـ API)
export interface SystemLog {
  logId: number;
  adminName: string;
  action: string;
  targetEntity: string;
  ipAddress: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);

  // -- دوال بوابات الدفع --
  getPaymentSettings(): Observable<ApiResponseWithData<PaymentSettings>> {
    return this.http.get<ApiResponseWithData<PaymentSettings>>(`${environment.apiUrl}/Admin/payment-settings`);
  }

  updatePaymentSettings(settings: PaymentSettings): Observable<ApiResponseWithData<boolean>> {
    return this.http.post<ApiResponseWithData<boolean>>(`${environment.apiUrl}/Admin/payment-settings`, settings);
  }

  // -- دوال سجل النظام --
  getSystemLogs(): Observable<ApiResponseWithData<SystemLog[]>> {
    return this.http.get<ApiResponseWithData<SystemLog[]>>(`${environment.apiUrl}/Admin/system-logs`);
  }

  clearSystemLogs(): Observable<ApiResponseWithData<boolean>> {
    return this.http.delete<ApiResponseWithData<boolean>>(`${environment.apiUrl}/Admin/system-logs/clear`);
  }

  downloadSystemLogs(): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/Admin/system-logs/download`, { responseType: 'blob' });
  }
}