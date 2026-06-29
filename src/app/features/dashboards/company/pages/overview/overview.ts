import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OverviewService } from '../../services/overview';

import { AiPromoCard } from '../../components/ai-promo-card/ai-promo-card';
import { RecentActivityFeed } from '../../components/recent-activity-feed/recent-activity-feed';
import { RecentOrdersTable } from '../../components/recent-orders-table/recent-orders-table';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { CompanyStatCard } from '../../../../../shared/components/company-stat-card/company-stat-card';

@Component({
  selector: 'app-overview',
  imports: [CompanyStatCard,
    AiPromoCard,
    RecentActivityFeed,
    RecentOrdersTable,
    LoadingSkeleton,
    ErrorState,
    DatePipe,
  ],
  providers: [OverviewService],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  onNavigate(arg0: string) {
    throw new Error('Method not implemented.');
  }
  private readonly overviewService = inject(OverviewService);

  protected readonly summaryResource = resource({
    loader: () => this.overviewService.getSummary(),
  });

  protected readonly currentDate = new Date();

  protected onStartConversation(): void {
    // TODO(ai-promo): wire to chatbot-widget open() or navigate to full assistant page
    // once the AI Assistant Card relationship to ChatbotWidget is confirmed.
  }

  // mock data for development purposes
  protected readonly mockActivities = [
    {
      id: '1',
      titleKey: 'تم استلام عرض جديد',
      descriptionKey: 'عرض على فائض',
      relatedEntityCode: 'PVC',
      occurredAt: new Date()
    },
    {
      id: '2',
      titleKey: 'تم تحديث حالة الطلب',
      descriptionKey: 'طلب رقم',
      relatedEntityCode: '#4567',
      occurredAt: new Date(new Date().getTime() - (60 * 60 * 1000))
    },
    {
      id: '3',
      titleKey: 'رسالة جديدة من العميل',
      descriptionKey: 'بخصوص',
      relatedEntityCode: 'Aluminum Pipes',
      occurredAt: new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000))
    }
    ,
    {
      id: '4',
      titleKey: 'تم إرسال رسالة جديدة',
      descriptionKey: 'بخصوص',
      relatedEntityCode: 'Aluminum Pipes',
      occurredAt: new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000))
    }
    ,
    {
      id: '5',
      titleKey: 'تم تحديث حالة الطلب 1245-ORD#',
      descriptionKey: 'بخصوص',
      relatedEntityCode: 'Aluminum Pipes',
occurredAt: new Date(new Date().getTime() - (5 * 24 * 60 * 60 * 1000))    }
  ];
}
