import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SidebarNavItem } from '../../../../core/models/sidebar-nav-item.model';
import { NgOptimizedImage } from '@angular/common';
import { NotificationBell } from '../../../notifications/components/notification-bell/notification-bell';


const COMPANY_NAV_ITEMS: readonly SidebarNavItem[] = [
  { label: 'الرئيسية', route: '/dashboard/company/overview' },
  { label: 'المنتجات المعروضة', route: '/dashboard/company/my-listings' },
  { label: 'العروض وطلبات الأسعار', route: '/dashboard/company/rfq-offers' },
  { label: 'الطلبات النشطة', route: '/dashboard/company/orders' },
  { label: 'الرسائل', route: '/dashboard/company/messages' },
  { label: 'النزاعات', route: '/dashboard/company/disputes' },
  // { label: 'التحليلات والإحصائيات', route: '/dashboard/company/analytics' },
  { label: 'الملف الشخصي', route: '/dashboard/company/profile' },
];

@Component({
  selector: 'app-company-layout',
  standalone: true,
imports: [RouterOutlet, RouterLink, RouterLinkActive, NgOptimizedImage, NotificationBell],
  templateUrl: './company-layout.html',
  styleUrl: './company-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyLayout {
  protected readonly navItems = COMPANY_NAV_ITEMS;
  private readonly router = inject(Router);

  // State for logout modal
  protected readonly isLogoutModalOpen = signal(false);

  protected readonly companyName = 'شركة النور';
  protected readonly companyCode = 'FYD-2586';
  protected readonly avatarInitial = 'N';

  // Toggle modal visibility
  protected openLogoutModal(): void {
    this.isLogoutModalOpen.set(true);
  }

  protected closeLogoutModal(): void {
    this.isLogoutModalOpen.set(false);
  }

  protected confirmLogout(): void {
    this.isLogoutModalOpen.set(false);
    // Perform logout logic and redirect
    this.router.navigate(['/']);
  }
}