import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';
import {
  CreatePurchaseOfferRequest,
  PurchaseOfferDto,
  PurchaseOfferWithDirection,
  RespondToPurchaseOfferResponse,
} from '../models/rfq-offer.model';

/**
 * عروض الشراء المبدئية — mirrors /api/PurchaseOffers on the backend.
 *
 * Flow: buyer creates an offer → seller gets an offer_received notification →
 * seller responds (accept opens a negotiation chat and returns its chatId,
 * reject notifies the buyer) → the contract is generated later from the chat.
 */
@Injectable({ providedIn: 'root' })
export class PurchaseOfferService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/purchaseoffers`;

  create(payload: CreatePurchaseOfferRequest): Observable<void> {
    return this.http
      .post<ApiResponseWithData<boolean>>(`${this.baseUrl}/create`, payload)
      .pipe(map(() => void 0));
  }

  getSent(): Observable<readonly PurchaseOfferWithDirection[]> {
    return this.http
      .get<ApiResponseWithData<readonly PurchaseOfferDto[]>>(`${this.baseUrl}/my-sent-offers`)
      .pipe(map(res => (res.data ?? []).map(dto => ({ ...dto, direction: 'sent' as const }))));
  }

  getReceived(): Observable<readonly PurchaseOfferWithDirection[]> {
    return this.http
      .get<ApiResponseWithData<readonly PurchaseOfferDto[]>>(`${this.baseUrl}/my-received-offers`)
      .pipe(map(res => (res.data ?? []).map(dto => ({ ...dto, direction: 'received' as const }))));
  }

  /** All offers of the current user, both directions merged (newest first). */
  getAll(): Observable<readonly PurchaseOfferWithDirection[]> {
    return forkJoin([this.getSent(), this.getReceived()]).pipe(
      map(([sent, received]) =>
        [...sent, ...received].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      )
    );
  }

  /** Seller accepts (opens the negotiation chat) or rejects the offer. */
  respond(offerId: number, isAccepted: boolean): Observable<RespondToPurchaseOfferResponse> {
    return this.http
      .put<ApiResponseWithData<RespondToPurchaseOfferResponse>>(
        `${this.baseUrl}/${offerId}/respond?isAccepted=${isAccepted}`,
        {}
      )
      .pipe(map(res => res.data ?? { offerId, isAccepted, chatId: null }));
  }

  /** Buyer withdraws a still-pending offer. */
  withdraw(offerId: number): Observable<void> {
    return this.http
      .put<ApiResponseWithData<boolean>>(`${this.baseUrl}/${offerId}/withdraw`, {})
      .pipe(map(() => void 0));
  }
}
