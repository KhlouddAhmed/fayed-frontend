import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

// --- واجهات مؤشرات الأداء ---
export interface StatItem {
  valueText: string;
  growthText: string;
  isPositive: boolean;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface CategoryRevenue {
  categoryName: string;
  percentage: number;
}

export interface PerformanceData {
  totalRevenue: StatItem;
  activeUsers: StatItem;
  totalTransactions: StatItem;
  activeContracts: StatItem;
  monthlyRevenueChart: MonthlyRevenue[];
  revenueByCategoryChart: CategoryRevenue[];
}

// --- واجهة تقارير المبيعات ---
export interface SalesReportResponse {
  reportName: string;
  period: string;
  formats: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);
  
  getPerformanceStats(): Observable<ApiResponseWithData<PerformanceData>> {
    return this.http.get<ApiResponseWithData<PerformanceData>>(`${environment.apiUrl}/Admin/analytics/performance`);
  }

  getSalesReports(): Observable<ApiResponseWithData<SalesReportResponse[]>> {
    return this.http.get<ApiResponseWithData<SalesReportResponse[]>>(`${environment.apiUrl}/Admin/analytics/sales-reports`);
  }
}