import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card';

Chart.register(...registerables);

// ------------- واجهات البيانات -------------
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
export class AnalyticsComponent implements AfterViewInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;

  activeTab = signal<TabType>('performance' as TabType);

  // الداتا الوهمية (Mock Data)
  dashboardData = signal<DashboardData>({
    stats: [
      { title: 'العقود النشطة', value: '324 عقدًا', subtitle: '+7.2% مقارنة بالشهر الماضي', icon: 'bi-file-earmark-text', color: '#F59E0B' },
      { title: 'إجمالي المعاملات', value: '1,248', subtitle: '+8% مقارنة بالشهر الماضي', icon: 'bi-arrow-left-right', color: '#8B5CF6' },
      { title: 'المستخدمون النشطون', value: '14k مستخدم', subtitle: 'قيد الوساطة الإدارية', icon: 'bi-people', color: '#3B82F6' },
      { title: 'إجمالي الإيرادات', value: '2,450,720 جم', subtitle: '+8% مقارنة بالشهر الماضي', icon: 'bi-currency-dollar', color: '#10B981' }
    ],
    revenueGrowthChart: {
      labels: ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو'],
      data: [0.9, 1.35, 1.7, 1.55, 2.3, 3.2]
    },
    revenueDistributionChart: {
      labels: ['حديد', 'بلاستيك', 'ورق', 'زجاج', 'نحاس', 'أخرى'],
      data: [38, 22, 15, 10, 8, 7] 
    },
    salesReports: [
      { name: 'تقرير التداول الشهري للبائعين', period: '1 مايو 2026 - 31 مايو 2026', format: 'PDF / EXCEL' },
      { name: 'تقرير التداول الشهري للبائعين', period: '1 مايو 2026 - 31 مايو 2026', format: 'PDF / EXCEL' },
      { name: 'تقرير التداول الشهري للبائعين', period: '1 مايو 2026 - 31 مايو 2026', format: 'PDF / EXCEL' }
    ],
    activityLogs: [
      { entityName: 'مصر للألومنيوم', actionType: 'تسجيل دخول ناجح', device: 'Windows 11 - Chrome', datetime: '2026-06-07 10:14', ipAddress: '197.43.90.12' },
      { entityName: 'أحمد (مشرف)', actionType: 'مراجعة مستندات شركة النصر للمنسوجات', device: '—', datetime: '10:24:12', ipAddress: '197.34.12.98' },
      { entityName: 'النظام', actionType: 'إنشاء ملف نزاع تلقائي للطلب 1048-ORD', device: '—', datetime: '10:15:45', ipAddress: '127.0.0.1' },
      { entityName: 'مصر للألومنيوم', actionType: 'تسجيل دخول ناجح', device: 'Windows 11 - Chrome', datetime: '2026-06-07 10:14', ipAddress: '197.43.90.12' },
      { entityName: 'مصر للألومنيوم', actionType: 'تسجيل دخول ناجح', device: 'Windows 11 - Chrome', datetime: '2026-06-07 10:14', ipAddress: '197.43.90.12' }
    ]
  });

  ngAfterViewInit() {
    this.renderLineChart();
    this.renderPieChart();
  }

  setTab(tab: TabType) {
    this.activeTab.set(tab);
    if (tab === 'performance') {
      setTimeout(() => {
        this.renderLineChart();
        this.renderPieChart();
      }, 0);
    }
  }

  // دالة تحميل التقرير (CSV مؤقتاً)
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

  renderLineChart() {
    if (!this.lineChartRef) return;
    const ctx = this.lineChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
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
            max: 3.5,
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
    new Chart(ctx, {
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