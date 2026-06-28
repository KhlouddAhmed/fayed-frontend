import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrderSummary } from '../../models/overview.model';
import { StatusBadge, StatusBadgeVariant } from '../../../../../shared/components/status-badge/status-badge';

interface OrderStatusConfig {
  readonly labelKey: string;
  readonly variant: StatusBadgeVariant;
}

const ORDER_STATUS_DISPLAY_MAP: Readonly<Record<string, OrderStatusConfig>> = {
  pendingWaiting: { labelKey: 'قيد الانتظار', variant: 'warning' },
  underReview: { labelKey: 'جاري المعالجة', variant: 'info' },
  shipped: { labelKey: 'تم شحنه', variant: 'success' },
  paid: { labelKey: 'مدفوع', variant: 'success' },
  rejected: { labelKey: 'مرفوض', variant: 'danger' },
};

@Component({
  selector: 'app-recent-orders-table',
  imports: [StatusBadge, DatePipe],
  templateUrl: './recent-orders-table.html',
  styleUrl: './recent-orders-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentOrdersTable {
  readonly orders = input.required<readonly OrderSummary[]>();

  protected readonly statusMap = ORDER_STATUS_DISPLAY_MAP;
}
