import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';
import { OfferDto, Offer } from '../models/rfq-offer.model';
import { adaptOffers, adaptOffer } from '../adapters/rfq-offer.adapter';

@Injectable({ providedIn: 'root' })
export class RfqOfferService {
  private readonly http = inject(HttpClient);

  getSent(): Observable<readonly Offer[]> {
    return this.http
      .get<ApiResponseWithData<readonly OfferDto[]>>(`${environment.apiUrl}/offers/sent`)
      .pipe(map(res => adaptOffers(res.Data ?? [])));
  }

  getReceived(): Observable<readonly Offer[]> {
    return this.http
      .get<ApiResponseWithData<readonly OfferDto[]>>(`${environment.apiUrl}/offers/received`)
      .pipe(map(res => adaptOffers(res.Data ?? [])));
  }

  accept(offerId: string): Observable<Offer> {
    return this.http
      .put<ApiResponseWithData<OfferDto>>(`${environment.apiUrl}/offers/${offerId}/accept`, {})
      .pipe(map(res => adaptOffer(res.Data!)));
  }

  reject(offerId: string): Observable<Offer> {
    return this.http
      .put<ApiResponseWithData<OfferDto>>(`${environment.apiUrl}/offers/${offerId}/reject-or-cancel`, {})
      .pipe(map(res => adaptOffer(res.Data!)));
  }

  withdraw(offerId: string): Observable<Offer> {
    return this.reject(offerId);
  }
}