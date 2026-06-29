import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';

// NOTIFICATION ITEM INTERFACE
interface NotificationItem {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly timeAgo: string;
  readonly isUnread: boolean;
  readonly icon: 'order' | 'offer' | 'shipping' | 'payment';
}

// MOCK DATA
const MOCK_NOTIFICATIONS: readonly NotificationItem[] = [
  {
    id: 'n-1',
    title: 'عرض جديد للنفايات البلاستيكية',
    body: 'شركة المصانع المتحدة أرسلت عرض سعر لـ 500 كجم من النفايات البلاستيكية',
    timeAgo: 'منذ 5 دقائق',
    isUnread: true,
    icon: 'order',
  },
  {
    id: 'n-2',
    title: 'تم قبول عرضك',
    body: 'قبلت شركة التدوير الذكي عرضك لفائض المعادن',
    timeAgo: 'منذ 30 دقيقة',
    isUnread: true,
    icon: 'offer',
  },
  {
    id: 'n-3',
    title: 'تحديث حالة الطلب #4521',
    body: 'تم شحن طلبك وسيصل خلال يومين عمل',
    timeAgo: 'منذ ساعتين تقريباً',
    isUnread: true,
    icon: 'shipping',
  },
  {
    id: 'n-4',
    title: 'تأكيد الدفع',
    body: 'تم استلام دفعة بقيمة 105,000 جنيه للطلب',
    timeAgo: 'منذ 3 ساعات',
    isUnread: false,
    icon: 'payment',
  },
];

// NOTIFICATION DROPDOWN PANEL COMPONENT
@Component({
  selector: 'app-notification-dropdown-panel',
  templateUrl: './notification-dropdown-panel.html',
  styleUrl: './notification-dropdown-panel.css',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDropdownPanel {
  // OUTPUTS
  readonly closePanel = output<void>();

  // STATE
  protected readonly notifications = MOCK_NOTIFICATIONS;

}