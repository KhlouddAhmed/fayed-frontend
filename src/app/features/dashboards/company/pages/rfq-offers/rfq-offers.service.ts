import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// 1. الواجهة مطابقة 100% لما تطلبه مكونات الـ UI الخاصة بك
export interface RfqOffer {
  id: string;
  direction: 'sent' | 'received';
  code: string;               // مطلوب في الإيرور
  productName: string;        // مطلوب في الإيرور
  requestedQuantity: number;  // مطلوب في الإيرور
  offeredPrice: number;       // مطلوب في الإيرور
  status: string;             // مطلوب في الإيرور
  date: string;               // مطلوب في الإيرور (بدلاً من sentAt)
  clientCode: string;         // لعرض اسم العميل في الجدول
  [key: string]: any;         // لتمرير أي خصائص إضافية بدون أخطاء
}

export interface RfqOfferDetails {
  orderId: number;
  offerCode: string;
  clientCode: string;
  sentAt: string;
  productTitle: string;
  quantityRequested: number;
  pricePerUnit: number;
  totalValue: number;
  message: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Offers`;

  getAllOffers(): Observable<RfqOffer[]> {
    const sentReq = this.http.get<any>(`${this.baseUrl}/sent`);
    const receivedReq = this.http.get<any>(`${this.baseUrl}/received?Page=1&PageSize=100`);

    return forkJoin({ sent: sentReq, received: receivedReq }).pipe(
      map(({ sent, received }) => {
        
        // دالة مساعدة لعمل الـ Mapping للأسماء اللي الـ HTML والكومبوننتس مستنياها
        const processItems = (items: any[], direction: 'sent' | 'received'): RfqOffer[] => {
          return items.map((item: any) => ({
            ...item,
            id: item.offerCode || item.orderId?.toString(),
            direction: direction,
            
            // الترجمة لأسماء الـ UI:
            code: item.offerCode || 'N/A',
            productName: item.productTitle || 'غير محدد',
            requestedQuantity: item.quantityRequested || 0,
            offeredPrice: item.totalValue || item.pricePerUnit || 0,
            status: item.status || 'قيد التفاوض',
            date: item.sentAt || new Date().toISOString(),
            clientCode: item.clientCode || 'N/A'
          }));
        };

        const sentItems = processItems(sent.data || [], 'sent');
        const receivedItems = processItems(received.data?.items || [], 'received');

        return [...sentItems, ...receivedItems];
      })
    );
  }

  getOfferDetails(id: string): Observable<RfqOfferDetails> {
    return this.http.get<any>(`${this.baseUrl}/${id}/details`).pipe(
      map(res => res.data)
    );
  }

  submitOffer(payload: { listingId: number, quantity: number, pricePerUnit: number, buyerNote: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit`, payload);
  }

  updateOffer(id: string, payload: { newQuantity: number, newPricePerUnit: number, newBuyerNote: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/update`, payload);
  }

  acceptOffer(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/accept`, {});
  }

  rejectOrCancelOffer(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/reject-or-cancel`, {});
  }
}