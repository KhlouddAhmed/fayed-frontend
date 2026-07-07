import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

export interface CategoryStat {
  categoryName: string;
  percentage: number;
  color?: string; // للتحكم في لون المؤشر في الواجهة
}

export interface RecentEvent {
  adminName: string;
  actionDescription: string;
  targetEntity: string;
  time: string;
}

export interface DashboardStatsData {
  totalTradingVolume: number;
  volumeGrowthPercentage: number;
  pendingCompanies: number;
  totalUsers: number;
  openDisputes: number;
  categoryStats: CategoryStat[];
  recentEvents: RecentEvent[];
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class OverviewComponent implements OnInit {
  private http = inject(HttpClient);

  dashboardStats = signal<any[]>([]);
  recentEvents = signal<RecentEvent[]>([]);
  categoryStats = signal<CategoryStat[]>([]);
  
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.isLoading.set(true);
    this.http.get<ApiResponseWithData<DashboardStatsData>>(`${environment.apiUrl}/Admin/dashboard`)
      .subscribe({
        next: (response) => {
          if (response.IsSuccess && response.Data) {
            this.mapDataToCards(response.Data);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('خطأ في جلب بيانات الداشبورد:', err);
          this.isLoading.set(false);
        }
      });
  }

  private mapDataToCards(data: DashboardStatsData): void {
    // 1. تظبيط الكروت العلوية
    const volumeText = data.totalTradingVolume >= 1000000
      ? (data.totalTradingVolume / 1000000).toFixed(2) + ' مليون ج.م'
      : data.totalTradingVolume.toLocaleString() + ' ج.م';

    const usersText = data.totalUsers >= 1000
      ? (data.totalUsers / 1000).toFixed(1) + 'k مستخدم'
      : data.totalUsers + ' مستخدم';

    const growthSign = data.volumeGrowthPercentage > 0 ? '+' : '';
    const growthColorClass = data.volumeGrowthPercentage >= 0 ? 'text-success' : 'text-danger';

    this.dashboardStats.set([
      {
        title: 'إجمالي التداول',
        value: volumeText,
        subtitle: `${growthSign}${data.volumeGrowthPercentage}% مقارنة بالشهر الماضي`,
        subtitleClass: growthColorClass,
        icon: 'bi bi-currency-dollar',
        color: '#10B981' 
      },
      {
        title: 'شركات انتظار التوثيق',
        value: `${data.pendingCompanies} شركات`,
        subtitle: 'تحتاج مراجعة فورية',
        subtitleClass: 'text-muted',
        icon: 'bi bi-building',
        color: '#F59E0B' 
      },
      {
        title: 'إجمالي المستخدمين',
        value: usersText,
        subtitle: 'مسجلين بالمنصة', 
        subtitleClass: 'text-muted',
        icon: 'bi bi-people',
        color: '#3B82F6' 
      },
      {
        title: 'نزاعات مفتوحة نشطة',
        value: `${data.openDisputes} نزاع`,
        subtitle: 'قيد الوساطة الإدارية',
        subtitleClass: 'text-muted',
        icon: 'fa-solid fa-scale-balanced',
        color: '#EF4444' 
      }
    ]);

    // 2. ربط آخر الأحداث
    this.recentEvents.set(data.recentEvents || []);

    // 3. ربط الفئات مع توزيع ألوان متناسقة للديزاين
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const mappedCategories = (data.categoryStats || []).map((cat, index) => ({
      ...cat,
      color: colors[index % colors.length]
    }));
    
    this.categoryStats.set(mappedCategories);
  }
}