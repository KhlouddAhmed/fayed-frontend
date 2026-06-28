import { Injectable } from '@angular/core';
import { OfferDto } from '../models/rfq-offer.model';
import { RfqOfferRepository } from './rfq-offer-repository.token';

const MOCK_NETWORK_DELAY_MS = 500;

function createMockOffers(): OfferDto[] {
  return [
    {
      Id: 'off-405',
      Code: 'OFF-405',
      ClientCode: 'FYD-2847',
      ProductName: 'معاد تدويره PVC',
      RequestedQuantity: 20,
      Unit: 'طن',
      PricePerUnit: 12000,
      TotalValue: 240000,
      Status: 'Negotiating',
      Direction: 'Sent',
      Message: 'مرحباً، نرغب في شراء الكمية المطلوبة بالكامل أعلاه. يرجى التواصل لتأكيد إمكانية الشحن في أقرب وقت. شكراً لكم.',
      SentAt: '2026-06-02T10:00:00Z',
    },
    {
      Id: 'off-404',
      Code: 'OFF-404',
      ClientCode: 'FYD-2844',
      ProductName: 'خام HDPE',
      RequestedQuantity: 15,
      Unit: 'طن',
      PricePerUnit: 13200,
      TotalValue: 172500,
      Status: 'AwaitingResponse',
      Direction: 'Sent',
      Message: 'مرحباً، نرغب في شراء الكمية المطلوبة بالكامل أعلاه. يرجى التواصل لتأكيد إمكانية الشحن في أقرب وقت. شكراً لكم.',
      SentAt: '2026-06-05T10:00:00Z',
    },
    {
      Id: 'off-403',
      Code: 'OFF-403',
      ClientCode: 'FYD-2847',
      ProductName: 'PET Flakes',
      RequestedQuantity: 10,
      Unit: 'طن',
      PricePerUnit: 13000,
      TotalValue: 130000,
      Status: 'Accepted',
      Direction: 'Sent',
      Message: null,
      SentAt: '2026-05-28T10:00:00Z',
    },
    {
      Id: 'off-402',
      Code: 'OFF-402',
      ClientCode: 'FYD-2847',
      ProductName: 'خام PP',
      RequestedQuantity: 18,
      Unit: 'طن',
      PricePerUnit: 12000,
      TotalValue: 216000,
      Status: 'Rejected',
      Direction: 'Sent',
      Message: null,
      SentAt: '2026-05-20T10:00:00Z',
    },
    {
      Id: 'off-205',
      Code: 'OFF-205',
      ClientCode: 'FYD-2847',
      ProductName: 'معاد تدويره PVC (درجة أولى)',
      RequestedQuantity: 20,
      Unit: 'طن',
      PricePerUnit: 11500,
      TotalValue: 230000,
      Status: 'AwaitingResponse',
      Direction: 'Received',
      Message: 'مرحباً، نرغب في شراء الكمية المطلوبة بالكامل أعلاه. يرجى التواصل لتأكيد إمكانية الشحن في أقرب وقت. شكراً لكم.',
      SentAt: '2026-06-02T10:00:00Z',
    },
    {
      Id: 'off-203',
      Code: 'OFF-203',
      ClientCode: 'FYD-2847',
      ProductName: 'PET Flakes',
      RequestedQuantity: 10,
      Unit: 'طن',
      PricePerUnit: 13000,
      TotalValue: 130000,
      Status: 'AwaitingResponse',
      Direction: 'Received',
      Message: 'نرغب في معاينة عينة قبل تأكيد الطلب الكامل.',
      SentAt: '2026-05-30T10:00:00Z',
    },
  ];
}

@Injectable()
export class MockRfqOfferRepository implements RfqOfferRepository {
  private offers = createMockOffers();

  getAll(): Promise<readonly OfferDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.offers]), MOCK_NETWORK_DELAY_MS);
    });
  }

  accept(id: string): Promise<OfferDto> {
    return this.updateStatus(id, 'Accepted');
  }

  reject(id: string): Promise<OfferDto> {
    return this.updateStatus(id, 'Rejected');
  }

  withdraw(id: string): Promise<OfferDto> {
    return this.updateStatus(id, 'Rejected');
  }

  private updateStatus(id: string, status: string): Promise<OfferDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.offers.findIndex((offer) => offer.Id === id);

        if (index === -1) {
          reject(new Error(`Offer with id ${id} not found`));
          return;
        }

        const updated: OfferDto = { ...this.offers[index], Status: status };

        this.offers = [
          ...this.offers.slice(0, index),
          updated,
          ...this.offers.slice(index + 1),
        ];

        resolve(updated);
      }, MOCK_NETWORK_DELAY_MS);
    });
  }
}
