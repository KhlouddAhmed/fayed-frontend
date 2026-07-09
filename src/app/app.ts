import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStateService } from './core/services/auth-state.service';
import { RealtimeService } from './core/services/realtime.service';
import { ToastService } from './core/services/toast.service';
import { NotificationsService } from './features/notifications/services/notifications.service';
import { mapRelatedLinkToRoute } from './features/notifications/adapters/notification.adapter';
import { ToastContainer } from './shared/components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fayed-frontend');

  private readonly authState = inject(AuthStateService);
  private readonly realtime = inject(RealtimeService);
  private readonly toast = inject(ToastService);
  private readonly notifications = inject(NotificationsService);
  private readonly router = inject(Router);

  constructor() {
    // إشعار فوري (SignalR) → تحديث العداد + توست قابل للنقر ينقل لصفحة الحدث
    this.realtime.notificationReceived$.subscribe(dto => {
      this.notifications.handleRealtimeNotification(dto);
      const route = mapRelatedLinkToRoute(dto.relatedLink);
      this.toast.notification(dto.title, dto.message, () => {
        this.notifications.markAsRead(String(dto.id)).subscribe({ error: () => void 0 });
        this.router.navigate([route.path], { queryParams: route.queryParams });
      });
    });

    // بدء/إيقاف اتصالات SignalR مع حالة تسجيل الدخول
    effect(() => {
      if (this.authState.isLoggedIn()) {
        this.realtime.startNotifications();
        this.realtime.startChat();
        this.notifications.refreshUnreadCount();
      } else {
        this.realtime.stopAll();
      }
    });
  }
}
