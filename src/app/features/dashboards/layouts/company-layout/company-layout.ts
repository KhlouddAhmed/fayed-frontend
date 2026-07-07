import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
// import { SidebarNavItem } from '../../../../core/models/sidebar-nav-item.model';
import { NgOptimizedImage } from '@angular/common';
import { NotificationBell } from '../../../notifications/components/notification-bell/notification-bell';
import { AuthService } from '../../../auth/services/auth';

const COMPANY_NAV_ITEMS: readonly SidebarNavItem[] = [
  { label: 'الرئيسية', route: '/dashboard/company/overview', icon: 'assets/icons/dashboard/layout/home.svg' },
  { label: 'المنتجات المعروضة', route: '/dashboard/company/my-listings', icon: 'assets/icons/dashboard/layout/box.svg' },
  { label: 'العروض وطلبات الأسعار', route: '/dashboard/company/rfq-offers', icon: 'assets/icons/dashboard/layout/receipt.svg' },
  { label: 'الطلبات النشطة', route: '/dashboard/company/orders', icon: 'assets/icons/dashboard/layout/group.svg' },
  { label: 'الرسائل', route: '/dashboard/company/messages', icon: 'assets/icons/dashboard/layout/messages.svg' },
  { label: 'النزاعات', route: '/dashboard/company/disputes', icon: 'assets/icons/dashboard/layout/disputes.svg' },
  // { label: 'التحليلات والإحصائيات', route: '/dashboard/company/analytics' },
  { label: 'الملف الشخصي', route: '/dashboard/company/profile', icon: 'assets/icons/dashboard/layout/profile.svg' },
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
  // private readonly router = inject(Router);

  //for logout
  private readonly authService = inject(AuthService);

  // State for sidebar and modal
  protected readonly sidebarOpen = signal(false);
  protected readonly isLogoutModalOpen = signal(false);

  protected readonly companyName = 'شركة النور';
  protected readonly companyCode = 'FYD-2586';
  protected readonly avatarInitial = 'N';

  // Toggle sidebar
  protected toggleSidebar(): void {
    this.sidebarOpen.update(value => !value);
  }

  // Toggle modal visibility
  protected openLogoutModal(): void {
    this.isLogoutModalOpen.set(true);
  }

  protected closeLogoutModal(): void {
    this.isLogoutModalOpen.set(false);
  }

  protected confirmLogout(): void {
    // this.isLogoutModalOpen.set(false);
    // // Perform logout logic and redirect
    // this.router.navigate(['/']);
    this.isLogoutModalOpen.set(false);
    this.authService.logout();
  }
}