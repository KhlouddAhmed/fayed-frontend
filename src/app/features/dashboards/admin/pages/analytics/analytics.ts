import { Component, signal, ViewChild, ElementRef, AfterViewInit, OnInit, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';

// نفس مسار الكارت بتاعك الأصلي بالظبط
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card';

// استدعاء الخدمات الخاصة بالـ APIs
import { AnalyticsService } from './analytics.service';
import { SettingsService } from '../settings/settings.service';

Chart.register(...registerables);

// ------------- واجهات البيانات (نفسها الأصلية بتاعتك بدون أي تعديل) -------------
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

// ------------- مكون الصفحة -------------
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [StatCardComponent], 
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css']
})
export class AnalyticsComponent implements AfterViewInit, OnInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;

  // حقن الخدمات
  private analyticsService = inject(AnalyticsService);
  private settingsService = inject(SettingsService);

  activeTab = signal<TabType>('performance' as TabType);

  // إعداد المتغير الأصلي بتاعك فارغاً لحين وصول بيانات الـ API
  dashboardData = signal<DashboardData>({
    stats: [],
    revenueGrowthChart: { labels: [], data: [] },
    revenueDistributionChart: { labels: [], data: [] },
    salesReports: [],
    activityLogs: []
  });

  // مراجع للرسوم البيانية لتفادي خطأ الـ Canvas عند التنقل بين التابات
  private lineChartInstance: Chart | null = null;
  private pieChartInstance: Chart | null = null;

  ngOnInit() {
    // جلب بيانات مؤشرات الأداء عند فتح الشاشة
    this.fetchPerformanceStats();
  }

  ngAfterViewInit() {
    // الرسم بيتم بعد وصول الداتا
  }

  setTab(tab: TabType) {
    this.activeTab.set(tab);
    
    // Lazy Loading لجلب البيانات فقط عند الحاجة
    if (tab === 'performance') {
      if (this.dashboardData().stats.length === 0) this.fetchPerformanceStats();
      else {
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

  // 1. جلب مؤشرات الأداء وتسكينها في المتغيرات الأصلية
  fetchPerformanceStats() {
    this.analyticsService.getPerformanceStats().subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.data) {
          this.dashboardData.update(current => {
            current.stats = [
              { title: 'العقود النشطة', value: res.data.activeContracts?.valueText || '0', subtitle: res.data.activeContracts?.growthText || '', icon: 'bi-file-earmark-text', color: '#F59E0B' },
              { title: 'إجمالي المعاملات', value: res.data.totalTransactions?.valueText || '0', subtitle: res.data.totalTransactions?.growthText || '', icon: 'bi-arrow-left-right', color: '#8B5CF6' },
              { title: 'المستخدمون النشطون', value: res.data.activeUsers?.valueText || '0', subtitle: res.data.activeUsers?.growthText || '', icon: 'bi-people', color: '#3B82F6' },
              { title: 'إجمالي الإيرادات', value: res.data.totalRevenue?.valueText || '0', subtitle: res.data.totalRevenue?.growthText || '', icon: 'bi-currency-dollar', color: '#10B981' }
            ];
            current.revenueGrowthChart = {
              labels: res.data.monthlyRevenueChart?.map((x: any) => x.month) || [],
              data: res.data.monthlyRevenueChart?.map((x: any) => x.revenue) || []
            };
            current.revenueDistributionChart = {
              labels: res.data.revenueByCategoryChart?.map((x: any) => x.categoryName) || [],
              data: res.data.revenueByCategoryChart?.map((x: any) => x.percentage) || []
            };
            return current;
          });
          
          setTimeout(() => {
            this.renderLineChart();
            this.renderPieChart();
          }, 0);
        }
      }
    });
  }

  // 2. جلب تقارير المبيعات وتسكينها في المتغيرات الأصلية
  fetchSalesReports() {
    this.analyticsService.getSalesReports().subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.data) {
          this.dashboardData.update(current => {
            current.salesReports = res.data.map((r: any) => ({
              name: r.reportName,
              period: r.period,
              format: r.formats
            }));
            return current;
          });
        }
      }
    });
  }

  // 3. جلب سجل النشاط وتسكينه في المتغيرات الأصلية
  fetchActivityLogs() {
    this.settingsService.getSystemLogs().subscribe({
      next: (res: any) => {
        if (res.isSuccess && res.data) {
          this.dashboardData.update(current => {
            current.activityLogs = res.data.map((l: any) => ({
              entityName: l.targetEntity,
              actionType: l.action,
              device: '—', // الجهاز غير متوفر في الـ API فتم وضع شرطة كما في الـ Mock
              datetime: l.time,
              ipAddress: l.ipAddress
            }));
            return current;
          });
        }
      }
    });
  }

  // دالة تحميل التقرير (CSV مؤقتاً) - نفسها الأصلية بدون تعديل
  exportReport(report: SalesReport) {
    const csvHeader = "اسم التقرير,الفترة الزمنية,تنسيق التحميل\n";
    const csvRow = `${report.name},${report.period},${report.format}\n`;
    const csvData = csvHeader + csvRow;
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

  // دوال الرسم - نفسها الأصلية مع إضافة التدمير (destroy) لمنع تداخل الرسوم
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
            max: 3.5, // يفضل أن تجعلها ديناميكية لاحقاً
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