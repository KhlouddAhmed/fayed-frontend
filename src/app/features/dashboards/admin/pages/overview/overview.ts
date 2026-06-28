import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../../../../shared/components/stat-card/stat-card';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class OverviewComponent implements OnInit {
  

  dashboardStats = signal<any[]>([]);

ngOnInit(): void {
    this.dashboardStats.set([
      {
        title: 'إجمالي التداول',
        value: '3.18 مليون ج.م',
        subtitle: '+14.2% مقارنة بالشهر الماضي',
        subtitleClass: 'text-muted', 
        icon: 'bi bi-currency-dollar',
        color: '#10B981' 
      },

      {
        title: 'شركات انتظار التوثيق',
        value: '3 شركات',
        subtitle: 'تحتاج مراجعة فورية',
        subtitleClass: 'text-muted',
        icon: 'bi bi-building',
        color: '#F59E0B' 
      },

      {
        title: 'إجمالي المستخدمين',
        value: '14k مستخدم',
        subtitle: 'قيد الوساطة الإدارية',
        subtitleClass: 'text-muted',
        icon: 'bi bi-people',
        color: '#3B82F6' 
      },

      {
        title: 'نزاعات مفتوحة نشطة',
        value: '1 نزاع',
        subtitle: 'قيد الوساطة الإدارية',
        subtitleClass: 'text-muted',
        icon: 'fa-solid fa-scale-balanced',
        color: '#EF4444' 
      }
    ]);
  }
}