import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Order } from '../../models/order.model';
import { DecimalPipe } from '@angular/common';
import { StatusBadge, StatusBadgeVariant } from '../../../../../shared/components/status-badge/status-badge';

interface OrderStatusConfig {
  readonly labelKey: string;
  readonly variant: StatusBadgeVariant;
}

const ORDER_STATUS_DISPLAY_MAP: Readonly<Record<string, OrderStatusConfig>> = {
  pendingShipment: { labelKey: 'قيد الشحن', variant: 'warning' },
  inPreparation: { labelKey: 'قيد التجهيز', variant: 'warning' },
  delivered: { labelKey: 'تم التسليم', variant: 'info' },
  completed: { labelKey: 'مكتمل', variant: 'success' },
};

@Component({
  selector: 'app-order-row',
  imports: [StatusBadge, DecimalPipe],
  templateUrl: './order-row.html',
  styleUrl: './order-row.css',
})
export class OrderRow {
  readonly order = input.required<Order>();
  readonly viewDetails = output<string>();

  protected readonly statusMap = ORDER_STATUS_DISPLAY_MAP;

  protected onViewDetailsClick(): void {
    this.viewDetails.emit(this.order().id);
  }
}