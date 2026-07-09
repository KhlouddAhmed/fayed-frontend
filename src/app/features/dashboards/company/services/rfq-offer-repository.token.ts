import { InjectionToken } from '@angular/core';
import {
  PurchaseOfferWithDirection,
  RespondToPurchaseOfferResponse,
} from '../models/rfq-offer.model';

export interface RfqOfferRepository {
  getAll(): Promise<readonly PurchaseOfferWithDirection[]>;
  /** Seller accepts → the backend opens a negotiation chat and returns its id. */
  accept(id: number): Promise<RespondToPurchaseOfferResponse>;
  reject(id: number): Promise<RespondToPurchaseOfferResponse>;
  /** Buyer withdraws a pending offer. */
  withdraw(id: number): Promise<void>;
}

export const RFQ_OFFER_REPOSITORY = new InjectionToken<RfqOfferRepository>(
  'RFQ_OFFER_REPOSITORY',
);
