import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Notification, NotificationFilter, NotificationType } from '../../models/notification.model';
import { NotificationsService } from '../../services/notifications.service';
import { firstValueFrom } from 'rxjs';

const FILTER_TYPE_MAP: Partial<Record<NotificationFilter, NotificationType>> = {
  orders: 'order', offers: 'offer', payments: 'payment', system: 'system',
};

@Component({
  selector: 'app-notification-center-page',
  imports: [RouterLink],
  templateUrl: './notification-center-page.html',
  styleUrl: './notification-center-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterPage implements OnInit {
  private readonly notificationsService = inject(NotificationsService);

  protected readonly searchQuery  = signal('');
  protected readonly activeFilter = signal<NotificationFilter>('all');
  protected readonly selectedIds  = signal<Set<string>>(new Set());
  protected readonly notifications = signal<Notification[]>([]);
  protected readonly isLoading    = signal(true);

  protected readonly unreadCount = computed(() =>
    this.notifications().filter(n => n.isUnread).length
  );

  protected readonly filteredNotifications = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const filter = this.activeFilter();
    const typeFilter = FILTER_TYPE_MAP[filter];

    return this.notifications().filter(n => {
      const matchesFilter = filter === 'all' ? true
        : filter === 'unread' ? n.isUnread
        : n.type === typeFilter;
      const matchesSearch = !query || n.title.toLowerCase().includes(query) || n.body.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  });

  protected readonly allSelected = computed(() => {
    const visible = this.filteredNotifications();
    return visible.length > 0 && visible.every(n => this.selectedIds().has(n.id));
  });

  protected readonly filters: { label: string; value: NotificationFilter }[] = [
    { label: 'الكل',         value: 'all'      },
    { label: 'غير المقروءة', value: 'unread'   },
    { label: 'الطلبات',      value: 'orders'   },
    { label: 'العروض',       value: 'offers'   },
    { label: 'المدفوعات',    value: 'payments' },
    { label: 'النظام',       value: 'system'   },
  ];

  ngOnInit(): void {
    this.notificationsService.getAll().subscribe({
      next: ({ items }) => { this.notifications.set(items); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  protected onFilterChange(filter: NotificationFilter): void {
    this.activeFilter.set(filter);
    this.selectedIds.set(new Set());
  }

  protected onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected toggleSelect(id: string): void {
    this.selectedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  protected toggleSelectAll(): void {
    const visible = this.filteredNotifications();
    this.selectedIds.set(
      this.allSelected() ? new Set() : new Set(visible.map(n => n.id))
    );
  }

  protected async markAllAsRead(): Promise<void> {
    await firstValueFrom(this.notificationsService.markAllAsRead());
    this.notifications.update(list =>
      list.map(n => this.selectedIds().has(n.id) ? { ...n, isUnread: false } : n)
    );
    this.selectedIds.set(new Set());
  }

  protected isSelected(id: string): boolean { return this.selectedIds().has(id); }
  protected hasSelection(): boolean { return this.selectedIds().size > 0; }
}