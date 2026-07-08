import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NotificationBell } from '../../../notifications/components/notification-bell/notification-bell';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../../auth/services/auth';
import { AuthStateService } from '../../../../core/services/auth-state.service';

interface AdminNavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
}

const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { label: 'الرئيسية',               route: '/admin/overview',   icon: 'bi bi-house' },
  { label: 'التحقق من الهوية',       route: '/admin/kyb',        icon: 'bi bi-person-check' },
  { label: 'إدارة الإعلانات',        route: '/admin/moderation', icon: 'bi bi-clipboard-check' },
  { label: 'الطلبات والمدفوعات',     route: '/admin/orders',     icon: 'bi bi-inbox' },
  { label: 'إدارة النزاعات',         route: '/admin/disputes',   icon: 'bi bi-exclamation-triangle' },
  { label: 'إدارة المستخدمين',       route: '/admin/users',      icon: 'bi bi-people' },
  { label: 'التحليلات والإحصائيات',  route: '/admin/analytics',  icon: 'bi bi-bar-chart-line' },
  { label: 'إعدادات المنصة',         route: '/admin/settings',   icon: 'bi bi-gear' },
] as const;

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NotificationBell, NgOptimizedImage],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  private readonly router = inject(Router);
  
  //for logout
  private readonly authState = inject(AuthStateService);
  private readonly authService = inject(AuthService);

  protected readonly navItems = ADMIN_NAV_ITEMS;
  protected readonly isSidebarOpen = signal(false);
  protected readonly isLogoutModalOpen = signal(false);

  protected readonly currentUser = signal({
    name: 'أحمد ممدوح',
    role: 'مسؤول',
    avatarUrl: 'assets/icons/logo-icon.png',
  });

  protected toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }

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