import { InjectionToken } from '@angular/core';
import { OfferDto } from '../models/rfq-offer.model';

export interface RfqOfferRepository {
  getAll(): Promise<readonly OfferDto[]>;
  accept(id: string): Promise<OfferDto>;
  reject(id: string): Promise<OfferDto>;
  withdraw(id: string): Promise<OfferDto>;
}

export const RFQ_OFFER_REPOSITORY = new InjectionToken<RfqOfferRepository>(
  'RFQ_OFFER_REPOSITORY',
);
