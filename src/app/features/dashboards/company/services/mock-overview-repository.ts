import { Injectable } from '@angular/core';
import { DashboardSummaryDto } from '../models/overview.model';
import { OverviewRepository } from './overview-repository.token';

const MOCK_SUMMARY: DashboardSummaryDto = {
  CompanyName: 'شركة النور',
  SmartAlertsCount: 1,
  NewOffersCount: 12,
  NewMessagesCount: 3,
  OpenDisputesCount: 2,
  RequiresUrgentAction: true,
  RecentActivities: [
    {
      Id: 'act-1',
      TitleKey: 'overview.activity.newOfferReceived',
      DescriptionKey: 'overview.activity.newOfferReceivedDesc',
      RelatedEntityCode: 'FYD-5224',
      OccurredAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      Id: 'act-2',
      TitleKey: 'overview.activity.offerAccepted',
      DescriptionKey: 'overview.activity.offerAcceptedDesc',
      RelatedEntityCode: '#1258',
      OccurredAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      Id: 'act-3',
      TitleKey: 'overview.activity.newMessage',
      DescriptionKey: 'overview.activity.newMessageDesc',
      RelatedEntityCode: 'FYD-5079',
      OccurredAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      Id: 'act-4',
      TitleKey: 'overview.activity.orderStatusUpdated',
      DescriptionKey: 'overview.activity.orderStatusUpdatedDesc',
      RelatedEntityCode: '#ORD-1245',
      OccurredAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ],
  RecentOrders: [
    {
      OrderCode: '#5893',
      ClientCode: 'FYD-562',
      Quantity: 3,
      Unit: 'طن',
      Status: 'PendingWaiting',
      RequestDate: '2026-06-03',
    },
    {
      OrderCode: '#1112',
      ClientCode: 'FYD-545',
      Quantity: 350,
      Unit: 'كيلو',
      Status: 'UnderReview',
      RequestDate: '2026-06-01',
    },
    {
      OrderCode: '#5289',
      ClientCode: 'FYD-3653',
      Quantity: 2,
      Unit: 'طن',
      Status: 'Shipped',
      RequestDate: '2026-05-26',
    },
    {
      OrderCode: '#5283',
      ClientCode: 'FYD-693',
      Quantity: 100,
      Unit: 'كيلو',
      Status: 'Shipped',
      RequestDate: '2026-05-23',
    },
    {
      OrderCode: '#5692',
      ClientCode: 'FYD-348',
      Quantity: 250,
      Unit: 'كيلو',
      Status: 'Paid',
      RequestDate: '2026-05-16',
    },
    {
      OrderCode: '#1205',
      ClientCode: 'FYD-1254',
      Quantity: 5,
      Unit: 'طن',
      Status: 'Rejected',
      RequestDate: '2026-05-11',
    },
  ],
};

const MOCK_NETWORK_DELAY_MS = 600;

@Injectable()
export class MockOverviewRepository implements OverviewRepository {
  getSummary(): Promise<DashboardSummaryDto> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SUMMARY), MOCK_NETWORK_DELAY_MS);
    });
  }
}
