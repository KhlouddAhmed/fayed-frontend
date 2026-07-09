import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PurchaseOfferService } from './rfq-offer';
import { RfqOfferRepository } from './rfq-offer-repository.token';
import {
  PurchaseOfferWithDirection,
  RespondToPurchaseOfferResponse,
} from '../models/rfq-offer.model';

/** Real implementation backed by /api/PurchaseOffers. */
@Injectable({ providedIn: 'root' })
export class RealRfqOfferRepository implements RfqOfferRepository {
  private readonly service = inject(PurchaseOfferService);

  getAll(): Promise<readonly PurchaseOfferWithDirection[]> {
    return firstValueFrom(this.service.getAll());
  }

  accept(id: number): Promise<RespondToPurchaseOfferResponse> {
    return firstValueFrom(this.service.respond(id, true));
  }

  reject(id: number): Promise<RespondToPurchaseOfferResponse> {
    return firstValueFrom(this.service.respond(id, false));
  }

  withdraw(id: number): Promise<void> {
    return firstValueFrom(this.service.withdraw(id));
  }
}
