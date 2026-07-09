import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { OverviewService, OverviewSummary } from './overview.service'; 

import { AiPromoCard } from '../../components/ai-promo-card/ai-promo-card';
import { RecentActivityFeed } from '../../components/recent-activity-feed/recent-activity-feed';
import { RecentOrdersTable } from '../../components/recent-orders-table/recent-orders-table';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { CompanyStatCard } from '../../../../../shared/components/company-stat-card/company-stat-card';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CompanyStatCard,
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
export class Overview implements OnInit {
  private readonly overviewService = inject(OverviewService);

  // حالات الصفحة للإحصائيات العامة
  isLoading = signal<boolean>(true);
  isError = signal<boolean>(false);
  summaryData = signal<OverviewSummary | null>(null);
  
  // المتغير الخاص بالإشعارات والنشاطات
  activitiesData = signal<any[]>([]);

  //mock data
  protected readonly companyName = 'شركة النور';

  protected readonly mockStats = {
    openDisputesCount: 2,
    newMessagesCount: 5,
    newOffersCount: 3,
    smartAlertsCount: 1,
    requiresUrgentAction: false,
  };
  
  protected readonly currentDate = new Date();

  ngOnInit(): void {
    // 1. جلب بيانات الإحصائيات والطلبات
    this.overviewService.getSummary().subscribe({
      next: (data: OverviewSummary) => {
        this.summaryData.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('خطأ في جلب بيانات الإحصائيات:', err);
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });

    // 2. جلب بيانات الإشعارات (آخر النشاطات)
    this.overviewService.getRecentNotifications().subscribe({
      next: (data) => {
        this.activitiesData.set(data);
      },
      error: (err) => {
        console.error('خطأ في جلب الإشعارات:', err);
      }
    });
  }

  onNavigate(route: string) {
    console.log('Navigating to:', route);
  }

  protected onStartConversation(): void {
    console.log('Starting AI conversation...');
  }
}