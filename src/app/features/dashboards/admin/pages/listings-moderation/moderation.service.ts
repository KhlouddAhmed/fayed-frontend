import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment'; // تأكد من المسار
import { ApiResponseWithData } from '../../../../../core/models/api-response.model'; // تأكد من المسار

export interface ApiAdListing {
  listingId: number;
  listingIdentifier: string;
  title: string;
  sellerName: string;
  categoryName: string;
  quantityText: string;
  priceText: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModerationService {
  private http = inject(HttpClient);

  // 1. جلب الإعلانات المعلقة (GET)
  getPendingListings(): Observable<ApiResponseWithData<ApiAdListing[]>> {
    return this.http.get<ApiResponseWithData<ApiAdListing[]>>(`${environment.apiUrl}/Admin/pending-listings`);
  }

  // 2. إرسال قرار القبول أو الرفض (POST)
  decideListing(listingId: number, payload: { isApproved: boolean }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/Admin/listings/${listingId}/decide`, payload);
  }
}