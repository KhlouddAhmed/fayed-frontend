import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService } from '../../features/auth/services/auth';
import { ROUTES } from '../../core/constants/routes';
import { NotificationBell } from '../../features/notifications/components/notification-bell/notification-bell';

interface NavLink {
  readonly label: string;
  readonly route: string;
  readonly fragment?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage, NotificationBell],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  protected readonly authState = inject(AuthStateService);
  private readonly authService = inject(AuthService);

  protected readonly routes = ROUTES;

  protected readonly menuOpen = signal(false);
  protected readonly dropdownOpen = signal(false);
  protected readonly isLogoutModalOpen = signal(false);

  openLogoutModal(): void { this.isLogoutModalOpen.set(true); }
  closeLogoutModal(): void { this.isLogoutModalOpen.set(false); }

  protected readonly isLoggedIn = computed(() => this.authState.isLoggedIn());
  protected readonly userName = computed(() => this.authState.currentUser()?.name ?? '');
  protected readonly userInitial = computed(() =>
    this.authState.currentUser()?.name?.charAt(0)?.toUpperCase() ?? 'م'
  );
  protected readonly factoryId = computed(() => {
    const id = this.authState.currentUser()?.factoryId;
    return id ? `FYD-${id}` : '';
  });

  // dashboard role
  protected readonly dashboardLink = computed(() => {
    const user = this.authState.currentUser();
    if (!user) return '/';
    return user.role === 'Admin' ? '/admin' : '/dashboard/company';
  });

  protected readonly navLinks: readonly NavLink[] = [
    { label: 'الصفحة الرئيسية', route: '/' },
    { label: 'عن فايض', route: '/', fragment: 'how-it-works' },
    { label: 'سوق فايض', route: '/marketplace' },
    { label: 'الاسئلة الشائعة', route: '/', fragment: 'faq-section' },
  ];

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  logout(): void {
    this.closeDropdown();
    this.closeMenu();
    this.authService.logout();
  }

  confirmLogout(): void {
    this.isLogoutModalOpen.set(false);
    this.logout();
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.fayed-user-menu')) {
      this.dropdownOpen.set(false);
    }
  }
}