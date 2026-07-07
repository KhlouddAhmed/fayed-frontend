import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

export interface PendingListing {
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
  
  // جلب الإعلانات المعلقة
  getPendingListings(): Observable<ApiResponseWithData<PendingListing[]>> {
    return this.http.get<ApiResponseWithData<PendingListing[]>>(`${environment.apiUrl}/Admin/pending-listings`);
  }

  // اتخاذ قرار (قبول أو رفض)
  decideListing(listingId: number, isApproved: boolean): Observable<ApiResponseWithData<boolean>> {
    // السواجر طالب الـ isApproved كـ Query Parameter
    const params = new HttpParams().set('isApproved', isApproved.toString());
    
    // بنبعت null في الـ body لأن الـ API مش طالب Payload
    return this.http.post<ApiResponseWithData<boolean>>(`${environment.apiUrl}/Admin/listings/${listingId}/decide`, null, { params });
  }
}