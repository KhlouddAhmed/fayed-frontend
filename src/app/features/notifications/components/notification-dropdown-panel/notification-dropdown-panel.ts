import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Notification } from '../../models/notification.model';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-notification-dropdown-panel',
  templateUrl: './notification-dropdown-panel.html',
  styleUrl: './notification-dropdown-panel.css',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDropdownPanel implements OnInit {
  private readonly notificationsService = inject(NotificationsService);

  readonly closePanel = output<void>();

  protected readonly notifications = signal<Notification[]>([]);

  ngOnInit(): void {
    this.notificationsService.getAll().subscribe({
      next: items => this.notifications.set(items.slice(0, 5)),
    });
  }
}