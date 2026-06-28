import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../../../layout/sidebar/sidebar';
import { DashboardNavbar } from '../../../../layout/dashboard-navbar/dashboard-navbar';
import { SidebarNavItem } from '../../../../core/models/sidebar-nav-item.model';

const COMPANY_NAV_ITEMS: readonly SidebarNavItem[] = [
  { label: 'الرئيسية', route: '/dashboard/company/overview' },
  { label: 'المنتجات المعروضة', route: '/dashboard/company/my-listings' },
  { label: 'العروض وطلبات الأسعار', route: '/dashboard/company/rfq-offers' },
  { label: 'الطلبات', route: '/dashboard/company/orders' },
  { label: 'الرسائل', route: '/dashboard/company/messages' },
  { label: 'النزاعات', route: '/dashboard/company/disputes' },
  { label: 'التحليلات والإحصائيات', route: '/dashboard/company/analytics' },
  { label: 'الملف الشخصي', route: '/dashboard/company/profile' },
];

@Component({
  selector: 'app-company-layout',
  imports: [RouterOutlet, Sidebar, DashboardNavbar],
  templateUrl: './company-layout.html',
  styleUrl: './company-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyLayout {
  protected readonly navItems = COMPANY_NAV_ITEMS;

  // TODO(auth-mock-layer): replace these static values with
  // authStore.currentUser() once the Auth Mock Layer is built.
  protected readonly companyName = 'شركة النور';
  protected readonly companyCode = 'FYD-2586';
  protected readonly avatarInitial = 'N';
}
