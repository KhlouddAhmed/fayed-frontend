import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

// 1. هيكل بيانات الطلبات والضمان
export interface EscrowOrder {
  orderId: number;
  orderIdentifier: string;
  buyerCompanyName: string;
  sellerCompanyName: string;
  contractValue: number;
  contractDate: string;
  deliveryStatus: string;
  escrowStatus: string;
}

// 2. هيكل بيانات المستردات والأرباح
export interface RefundProfitTransaction {
  transactionId: number;
  transactionIdentifier: string;
  beneficiaryName: string;
  transactionType: string;
  amountText: string;
  paymentGateway: string;
}

// 3. هيكل بيانات سجل المعاملات (دفتر الأستاذ)
export interface LedgerRecord {
  transactionIdentifier: string;
  orderIdentifier: string;
  totalValueText: string;
  commissionText: string;
  paymentMethod: string;
  dateTimeText: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);
  
  // جلب الطلبات (للتاب الأول والثاني)
  getEscrowOrders(): Observable<ApiResponseWithData<EscrowOrder[]>> {
    return this.http.get<ApiResponseWithData<EscrowOrder[]>>(`${environment.apiUrl}/Admin/orders-escrow`);
  }

  // جلب المستردات والأرباح
  getRefundsProfits(): Observable<ApiResponseWithData<RefundProfitTransaction[]>> {
    return this.http.get<ApiResponseWithData<RefundProfitTransaction[]>>(`${environment.apiUrl}/Admin/finance/refunds-profits`);
  }

  // جلب سجل المعاملات
  getLedger(): Observable<ApiResponseWithData<LedgerRecord[]>> {
    return this.http.get<ApiResponseWithData<LedgerRecord[]>>(`${environment.apiUrl}/Admin/finance/ledger`);
  }

  // الإفراج عن الفلوس للبائع (بياخد الـ ID في الرابط بس زي ما قولت)
  releaseEscrow(orderId: number): Observable<ApiResponseWithData<boolean>> {
    return this.http.post<ApiResponseWithData<boolean>>(`${environment.apiUrl}/Admin/finance/escrow/${orderId}/release`, null);
  }
}