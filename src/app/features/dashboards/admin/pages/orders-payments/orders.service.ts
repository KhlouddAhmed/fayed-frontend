import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment'; 
import { ApiResponseWithData } from '../../../../../core/models/api-response.model'; 

// 1. واجهة الطلبات والحساب الضامن [cite: 1]
export interface ApiEscrowOrder {
  orderId: number;
  orderIdentifier: string;
  buyerCompanyName: string;
  sellerCompanyName: string;
  contractValue: number;
  contractDate: string;
  deliveryStatus: string;
  escrowStatus: string;
}

// 2. واجهة المستردات والأرباح [cite: 2]
export interface ApiRefundTransaction {
  transactionId: number;
  transactionIdentifier: string;
  beneficiaryName: string;
  transactionType: string;
  amountText: string;
  paymentGateway: string;
}

// 3. واجهة سجل المعاملات [cite: 3]
export interface ApiLedgerRecord {
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

  getEscrowOrders(): Observable<ApiResponseWithData<ApiEscrowOrder[]>> {
    return this.http.get<ApiResponseWithData<ApiEscrowOrder[]>>(`${environment.apiUrl}/Admin/orders-escrow`);
  }

  getRefundsProfits(): Observable<ApiResponseWithData<ApiRefundTransaction[]>> {
    return this.http.get<ApiResponseWithData<ApiRefundTransaction[]>>(`${environment.apiUrl}/Admin/finance/refunds-profits`);
  }

  getLedger(): Observable<ApiResponseWithData<ApiLedgerRecord[]>> {
    return this.http.get<ApiResponseWithData<ApiLedgerRecord[]>>(`${environment.apiUrl}/Admin/finance/ledger`);
  }

  releaseEscrow(orderId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Admin/release-escrow/${orderId}`, {});
  }

  processRefund(transactionId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Admin/process-transaction/${transactionId}`, {});
  }
}