import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OverviewService } from '../../services/overview';

import { AiPromoCard } from '../../components/ai-promo-card/ai-promo-card';
import { RecentActivityFeed } from '../../components/recent-activity-feed/recent-activity-feed';
import { RecentOrdersTable } from '../../components/recent-orders-table/recent-orders-table';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { CompanyStatCard } from '../../../../../shared/components/company-stat-card/company-stat-card';

@Component({
  selector: 'app-overview',
  imports: [CompanyStatCard,
    StatCardComponent,
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
}
