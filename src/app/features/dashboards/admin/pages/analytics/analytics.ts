import { Component, signal, ViewChild, ElementRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card';
import { AnalyticsService } from './analytics.service';
import { SettingsService } from '../settings/settings.service'; // تأكد من مسار السيرفيس

Chart.register(...registerables);

interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
}

interface SalesReport {
  name: string;
  period: string;
  format: string;
}

interface ActivityLog {
  entityName: string;
  actionType: string;
  device: string;
  datetime: string;
  ipAddress: string;
}

interface DashboardData {
  stats: StatCard[];
  revenueGrowthChart: { labels: string[]; data: number[] };
  revenueDistributionChart: { labels: string[]; data: number[] };
  salesReports: SalesReport[];
  activityLogs: ActivityLog[];
}

type TabType = 'performance' | 'sales' | 'activity';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, StatCardComponent], 
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;

  private analyticsService = inject(AnalyticsService);
  private settingsService = inject(SettingsService);

  activeTab = signal<TabType>('performance');
  
  dashboardData = signal<DashboardData>({
    stats: [],
    revenueGrowthChart: { labels: [], data: [] },
    revenueDistributionChart: { labels: [], data: [] },
    salesReports: [],
    activityLogs: []
  });

  private lineChartInstance: Chart | null = null;
  private pieChartInstance: Chart | null = null;

  ngOnInit() {
    this.fetchPerformanceStats();
  }

  setTab(tab: TabType) {
    this.activeTab.set(tab);
    
    // Lazy Loading للبيانات
    if (tab === 'performance') {
      if (this.dashboardData().stats.length === 0) {
        this.fetchPerformanceStats();
      } else {
        setTimeout(() => {
          this.renderLineChart();
          this.renderPieChart();
        }, 0);
      }
    } else if (tab === 'sales') {
      if (this.dashboardData().salesReports.length === 0) this.fetchSalesReports();
    } else if (tab === 'activity') {
      if (this.dashboardData().activityLogs.length === 0) this.fetchActivityLogs();
    }
  }

  fetchPerformanceStats() {
    this.analyticsService.getPerformanceStats().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;
        if (isSuccess && data) {
          this.dashboardData.update(current => {
            current.stats = [
              { title: 'العقود النشطة', value: data.activeContracts?.valueText || '0', subtitle: data.activeContracts?.growthText || '', icon: 'bi-file-earmark-text', color: '#F59E0B' },
              { title: 'إجمالي المعاملات', value: data.totalTransactions?.valueText || '0', subtitle: data.totalTransactions?.growthText || '', icon: 'bi-arrow-left-right', color: '#8B5CF6' },
              { title: 'المستخدمون النشطون', value: data.activeUsers?.valueText || '0', subtitle: data.activeUsers?.growthText || '', icon: 'bi-people', color: '#3B82F6' },
              { title: 'إجمالي الإيرادات', value: data.totalRevenue?.valueText || '0', subtitle: data.totalRevenue?.growthText || '', icon: 'bi-currency-dollar', color: '#10B981' }
            ];
            
            current.revenueGrowthChart = {
              labels: data.monthlyRevenueChart?.map((x: any) => x.month) || [],
              data: data.monthlyRevenueChart?.map((x: any) => x.revenue) || []
            };
            
            current.revenueDistributionChart = {
              labels: data.revenueByCategoryChart?.map((x: any) => x.categoryName) || [],
              data: data.revenueByCategoryChart?.map((x: any) => x.percentage) || []
            };
            
            return current;
          });
          
          setTimeout(() => {
            this.renderLineChart();
            this.renderPieChart();
          }, 0);
        }
      },
      error: (err) => console.error('خطأ في جلب مؤشرات الأداء:', err)
    });
  }

  fetchSalesReports() {
    this.analyticsService.getSalesReports().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;
        if (isSuccess && data) {
          this.dashboardData.update(current => {
            current.salesReports = data.map((r: any) => ({
              name: r.reportName,
              period: r.period,
              format: r.formats
            }));
            return current;
          });
        }
      },
      error: (err) => console.error('خطأ في جلب التقارير:', err)
    });
  }

  fetchActivityLogs() {
    this.settingsService.getSystemLogs().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;
        if (isSuccess && data) {
          this.dashboardData.update(current => {
            current.activityLogs = data.map((l: any) => ({
              entityName: l.targetEntity,
              actionType: l.action,
              device: '—', // بناءً على التصميم
              datetime: l.time,
              ipAddress: l.ipAddress
            }));
            return current;
          });
        }
      },
      error: (err) => console.error('خطأ في جلب سجل النشاط:', err)
    });
  }

  exportReport(report: SalesReport) {
    const csvHeader = "اسم التقرير,الفترة الزمنية,تنسيق التحميل\n";
    const csvRow = `${report.name},${report.period},${report.format}\n`;
    const csvData = csvHeader + csvRow;
    
    // إضافة BOM لدعم اللغة العربية في الإكسيل
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `تقرير_مبيعات_${new Date().getTime()}.csv`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  renderLineChart() {
    if (!this.lineChartRef) return;
    const ctx = this.lineChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    
    if (this.lineChartInstance) this.lineChartInstance.destroy();
    
    this.lineChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.dashboardData().revenueGrowthChart.labels,
        datasets: [{
          label: '2026',
          data: this.dashboardData().revenueGrowthChart.data,
          borderColor: '#93C5FD',
          backgroundColor: 'rgba(147, 197, 253, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#93C5FD',
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { family: 'Cairo' } } } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (value: number | string) => 'M ' + value, font: { family: 'Cairo' } },
            border: { dash: [5, 5] },
            grid: { color: '#F1F5F9' }
          },
          x: { grid: { display: false }, ticks: { font: { family: 'Cairo' } } }
        }
      }
    });
  }

  renderPieChart() {
    if (!this.pieChartRef) return;
    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.pieChartInstance) this.pieChartInstance.destroy();
    
    this.pieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.dashboardData().revenueDistributionChart.labels,
        datasets: [{
          data: this.dashboardData().revenueDistributionChart.data,
          backgroundColor: ['#8B5CF6', '#F43F5E', '#06B6D4', '#F59E0B', '#3B82F6', '#E2E8F0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { family: 'Cairo', size: 12 } } }
        }
      }
    });
  }
}