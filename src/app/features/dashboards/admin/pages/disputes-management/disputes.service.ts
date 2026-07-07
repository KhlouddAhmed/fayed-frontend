import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

// 1. هيكل بيانات النزاع في القائمة
export interface DisputeListItem {
  disputeId: number;
  disputeIdentifier: string;
  orderIdentifier: string;
  buyerName: string;
  sellerName: string;
  reason: string;
  status: string;
  statusArabic: string;
  resolutionDecision: string;
  resolutionDate: string;
  mediatorName: string;
}

// 2. هيكل بيانات الرسائل
export interface ChatMessage {
  senderName: string;
  senderRole: string; // 'buyer' | 'seller' | 'admin'
  messageText: string;
  time: string;
}

// 3. هيكل تفاصيل النزاع (عند الفتح)
export interface DisputeDetails {
  disputeId: number;
  disputeIdentifier: string;
  orderIdentifier: string;
  buyerName: string;
  sellerName: string;
  description: string;
  status: string;
  chatMessages: ChatMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class DisputesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Admin/disputes`;

  // جلب كل النزاعات
  getAllDisputes(): Observable<ApiResponseWithData<DisputeListItem[]>> {
    return this.http.get<ApiResponseWithData<DisputeListItem[]>>(this.baseUrl);
  }

  // جلب تفاصيل نزاع ومحادثاته
  getDisputeDetails(disputeId: number): Observable<ApiResponseWithData<DisputeDetails>> {
    return this.http.get<ApiResponseWithData<DisputeDetails>>(`${this.baseUrl}/${disputeId}`);
  }

  // إرسال قرار حل النزاع
  resolveDispute(disputeId: number, action: string, notes: string): Observable<ApiResponseWithData<boolean>> {
    // تم تعديل أسماء المتغيرات لتتطابق 100% مع الـ JSON الخاص بالسواجر
    const payload = { 
      resolutionAction: action, 
      notes: notes 
    };
    return this.http.post<ApiResponseWithData<boolean>>(`${this.baseUrl}/${disputeId}/resolve`, payload);
  }

  // إرسال رسالة في الشات الخاص بالنزاع
  sendMessage(disputeId: number, text: string): Observable<ApiResponseWithData<boolean>> {
    const payload = { messageText: text };
    return this.http.post<ApiResponseWithData<boolean>>(`${this.baseUrl}/${disputeId}/message`, payload);
  }
}