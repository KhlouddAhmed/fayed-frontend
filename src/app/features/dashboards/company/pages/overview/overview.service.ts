import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OverviewSummary {
  companyName: string;
  openDisputesCount: number;
  requiresUrgentAction: boolean;
  newMessagesCount: number;
  newOffersCount: number;
  smartAlertsCount: number;
  recentOrders: any[];
  recentActivities: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  private http = inject(HttpClient);

  getSummary(): Observable<OverviewSummary> {
    const overviewReq = this.http.get<any>(`${environment.apiUrl}/Dashboard/overview`);
    const statsReq = this.http.get<any>(`${environment.apiUrl}/Dashboard/stats`);

    return forkJoin({
      overview: overviewReq,
      stats: statsReq
    }).pipe(
      map(({ overview, stats }) => {
        const overviewData = overview.Data || overview.data || { recentOrders: [], recentActivities: [] };
        const statsData = stats.Data || stats.data || { openDisputesCount: 0, unreadMessagesCount: 0, newOffersCount: 0, unreadNotificationsCount: 0 };

        return {
          companyName: 'مصنعك', 
          openDisputesCount: statsData.openDisputesCount || 0,
          requiresUrgentAction: (statsData.openDisputesCount > 0), 
          newMessagesCount: statsData.unreadMessagesCount || 0,
          newOffersCount: statsData.newOffersCount || 0,
          smartAlertsCount: statsData.unreadNotificationsCount || 0,
          recentOrders: overviewData.recentOrders || [],
          recentActivities: overviewData.recentActivities || []
        } as OverviewSummary;
      })
    );
  }

  getRecentNotifications(): Observable<any[]> {
    // استخدمنا Page=1 و PageSize=5 عشان نجلب أحدث 5 إشعارات للوحة التحكم
    return this.http.get<any>(`${environment.apiUrl}/Notifications?Page=1&PageSize=5`).pipe(
      map(res => {
        const items = res.data?.items || [];
        // Mapping: ترجمة حقول الباك إند للحقول اللي الكومبوننت بيقرأها
        return items.map((item: any) => ({
          id: item.id.toString(),
          titleKey: item.title,          // من الـ API
          descriptionKey: item.message,  // من الـ API
          relatedEntityCode: '',         // لو محتاج تعرض نوع الإشعار ممكن تمرر item.type
          occurredAt: new Date(item.createdAt) // من الـ API
        }));
      })
    );
  }
}