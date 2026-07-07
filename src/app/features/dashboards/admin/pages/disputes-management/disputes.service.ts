import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

// 1. هيكل بيانات النزاع في القائمة
export interface ApiDisputeListItem {
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
export interface ApiChatMessage {
  senderName: string;
  senderRole: string; // 'buyer' | 'seller' | 'admin'
  messageText: string;
  time: string;
}

// 3. هيكل تفاصيل النزاع (عند الفتح)
export interface ApiDisputeDetails {
  disputeId: number;
  disputeIdentifier: string;
  orderIdentifier: string;
  buyerName: string;
  sellerName: string;
  description: string;
  status: string;
  chatMessages: ApiChatMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class DisputesService {
  private http = inject(HttpClient);
  
  // التعديل الأول: إضافة /api للمسار الأساسي
  private baseUrl = `${environment.apiUrl}/Admin/disputes`;

  // جلب كل النزاعات
  getAllDisputes(): Observable<ApiResponseWithData<ApiDisputeListItem[]>> {
    return this.http.get<ApiResponseWithData<ApiDisputeListItem[]>>(this.baseUrl);
  }

  // جلب تفاصيل نزاع ومحادثاته
  getDisputeDetails(disputeId: number): Observable<ApiResponseWithData<ApiDisputeDetails>> {
    return this.http.get<ApiResponseWithData<ApiDisputeDetails>>(`${this.baseUrl}/${disputeId}`);
  }

  // إرسال قرار حل النزاع
  resolveDispute(disputeId: number, action: string, notes: string): Observable<any> {
    const payload = { resolutionAction: action, notes: notes };
    return this.http.post(`${this.baseUrl}/${disputeId}/resolve`, payload);
  }

  // إرسال رسالة في الشات الخاص بالنزاع
  sendMessage(disputeId: number, text: string): Observable<any> {
    const payload = { messageText: text };
    // التعديل الثاني: تغيير message إلى messages لتطابق السواجر
    return this.http.post(`${this.baseUrl}/${disputeId}/messages`, payload);
  }
}