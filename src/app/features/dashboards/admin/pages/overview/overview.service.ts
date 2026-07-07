import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment'; // تأكد من المسار
import { ApiResponseWithData } from '../../../../../core/models/api-response.model'; // تأكد من المسار

export interface CategoryStat {
  categoryName: string;
  percentage: number;
  color?: string;
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

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  private http = inject(HttpClient);

  getDashboardStats(): Observable<ApiResponseWithData<DashboardStatsData>> {
    return this.http.get<ApiResponseWithData<DashboardStatsData>>(`${environment.apiUrl}/Admin/dashboard`);
  }
}