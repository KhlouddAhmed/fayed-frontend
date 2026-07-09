import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Notification } from '../../models/notification.model';
import { NotificationsService } from '../../services/notifications.service';
import { mapRelatedLinkToRoute } from '../../adapters/notification.adapter';

@Component({
  selector: 'app-notification-dropdown-panel',
  templateUrl: './notification-dropdown-panel.html',
  styleUrl: './notification-dropdown-panel.css',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDropdownPanel implements OnInit {
  private readonly notificationsService = inject(NotificationsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly closePanel = output<void>();

  protected readonly notifications = signal<Notification[]>([]);

  ngOnInit(): void {
    this.notificationsService.getAll(1, 5).subscribe({
      next: ({ items }) => this.notifications.set(items),
    });

    // إشعار فوري أثناء فتح القائمة → أضفه في الأعلى
    this.notificationsService.incoming$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(notification => {
        this.notifications.update(list => [notification, ...list].slice(0, 5));
      });
  }

  /**
   * الضغط على الإشعار = تعليمه مقروءاً + الانتقال لصفحة الحدث
   * (مراجعة العقد، دفع العربون، محادثة التفاوض...)
   */
  protected onNotificationClick(item: Notification): void {
    if (item.isUnread) {
      this.notificationsService.markAsRead(item.id).subscribe({ error: () => void 0 });
      this.notifications.update(list =>
        list.map(n => (n.id === item.id ? { ...n, isUnread: false } : n))
      );
    }

    const route = mapRelatedLinkToRoute(item.relatedLink);
    this.router.navigate([route.path], { queryParams: route.queryParams });
    this.closePanel.emit();
  }
}
