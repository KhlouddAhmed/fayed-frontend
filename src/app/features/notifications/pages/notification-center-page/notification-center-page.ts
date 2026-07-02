import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Notification, NotificationFilter, NotificationType } from '../../models/notification.model';

// =============================================
// MOCK DATA — استبدل بـ service call حقيقي
// =============================================
const MOCK_NOTIFICATIONS: readonly Notification[] = [
  { id: 'n-1', title: 'عرض جديد لفائض البلاستيك',      body: 'شركة المصانع المتحدة أرسلت عرض سعر لـ 500 كجم من فائض البلاستيك',        timeAgo: 'منذ 6 دقائق',      isUnread: true,  type: 'order'    },
  { id: 'n-2', title: 'تم قبول عرضك',                   body: 'قبلت شركة التدوير الذكي عرضك لفائض المعادن',                              timeAgo: 'منذ 31 دقيقة',     isUnread: true,  type: 'offer'    },
  { id: 'n-3', title: 'تحديث حالة الطلب #4521',          body: 'تم شحن طلبك وسيصل خلال يومين عمل',                                       timeAgo: 'منذ ساعتين تقريباً', isUnread: true,  type: 'shipping' },
  { id: 'n-4', title: 'تأكيد الدفع',                    body: 'تم استلام دفعة بقيمة 105,000 جنيه للطلب #4510',                           timeAgo: 'منذ 4 ساعات تقريباً', isUnread: false, type: 'payment'  },
  { id: 'n-5', title: 'تم توقيع العقد',                  body: 'وقعت شركة الصناعات البيئية على عقد FAID-2025-0784',                       timeAgo: 'منذ 5 ساعات',      isUnread: false, type: 'contract' },
  { id: 'n-6', title: 'تنبيه النظام',                   body: 'تم تحديث سياسة الاستخدام، يرجى المراجعة',                                  timeAgo: 'منذ يوم',          isUnread: false, type: 'system'   },
];

const FILTER_TYPE_MAP: Partial<Record<NotificationFilter, NotificationType>> = {
  orders:   'order',
  offers:   'offer',
  payments: 'payment',
  system:   'system',
};

@Component({
  selector: 'app-notification-center-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './notification-center-page.html',
  styleUrl: './notification-center-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterPage {

  /* =============================================
     STATE
     ============================================= */
  protected readonly searchQuery   = signal('');
  protected readonly activeFilter  = signal<NotificationFilter>('all');
  protected readonly selectedIds   = signal<Set<string>>(new Set());
  protected readonly notifications = signal<Notification[]>([...MOCK_NOTIFICATIONS]);

  /* =============================================
     COMPUTED
     ============================================= */
  protected readonly unreadCount = computed(() =>
    this.notifications().filter(n => n.isUnread).length
  );

  protected readonly filteredNotifications = computed(() => {
    const query  = this.searchQuery().trim().toLowerCase();
    const filter = this.activeFilter();
    const typeFilter = FILTER_TYPE_MAP[filter];

    return this.notifications().filter(n => {
      const matchesFilter = filter === 'all'    ? true
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

  /* =============================================
     FILTER TABS
     ============================================= */
  protected readonly filters: { label: string; value: NotificationFilter }[] = [
    { label: 'الكل',         value: 'all'      },
    { label: 'غير المقروءة', value: 'unread'   },
    { label: 'الطلبات',      value: 'orders'   },
    { label: 'العروض',       value: 'offers'   },
    { label: 'المدفوعات',    value: 'payments' },
    { label: 'النظام',       value: 'system'   },
  ];

  /* =============================================
     ACTIONS
     ============================================= */
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
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(visible.map(n => n.id)));
    }
  }

  protected markAllAsRead(): void {
    this.notifications.update(list =>
      list.map(n => this.selectedIds().has(n.id) ? { ...n, isUnread: false } : n)
    );
    this.selectedIds.set(new Set());
  }

  protected isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  protected hasSelection(): boolean {
    return this.selectedIds().size > 0;
  }
}