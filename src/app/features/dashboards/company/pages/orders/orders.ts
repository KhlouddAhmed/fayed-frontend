import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { adaptOrders } from '../../adapters/order.adapter';
import { ORDERS_REPOSITORY } from '../../services/orders-repository.token';
import { OrderRow } from '../../components/order-row/order-row';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';
import { Order, OrderStatus } from '../../models/order.model';
import { StatusBadge, StatusBadgeVariant } from '../../../../../shared/components/status-badge/status-badge';

type OrderTab = 'sent' | 'received';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrderRow, LoadingSkeleton, ErrorState, EmptyState, DatePipe, StatusBadge, DecimalPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orders {
  private readonly repository = inject(ORDERS_REPOSITORY);

  // جلب كافة الطلبات من الـ API عبر الـ Repository Token الخاص بك
  protected readonly ordersResource = resource({
    loader: async () => {
      const data = await this.repository.getAll();
      return adaptOrders(data);
    },
  });

  protected readonly currentDate = new Date();
  protected readonly activeTab = signal<OrderTab>('sent');
  protected readonly selectedOrder = signal<Order | null>(null);

  // فلترة الطلبات بشكل ريأكتف بناءً على التبويب النشط
  protected readonly filteredOrders = computed(() => {
    const orders = this.ordersResource.value() ?? [];
    return orders.filter((order) => order.direction === this.activeTab());
  });

  protected onTabChange(tab: OrderTab): void {
    this.activeTab.set(tab);
  }

  protected onViewDetails(orderId: string): void {
    const order = this.ordersResource.value()?.find((o) => o.id === orderId) ?? null;
    this.selectedOrder.set(order);
  }

  protected closeModal(): void {
    this.selectedOrder.set(null);
  }

  // خريطة الحالات المتوافقة مع الكومبوننت الخاص بك Shared StatusBadge
  protected readonly statusDisplayMap = {
    pendingShipment: { labelKey: 'قيد الشحن', variant: 'warning' as StatusBadgeVariant },
    inPreparation: { labelKey: 'قيد التجهيز', variant: 'warning' as StatusBadgeVariant },
    delivered: { labelKey: 'تم التسليم', variant: 'info' as StatusBadgeVariant },
    completed: { labelKey: 'مكتمل', variant: 'success' as StatusBadgeVariant },
  };

  // مصفوفة تتبع خطوات الطلب مطابقة لترتيب الستاتس الأصلي بالملفات
  protected readonly STEP_ORDER: readonly OrderStatus[] = [
    'pendingShipment',
    'inPreparation',
    'delivered',
    'completed',
  ];

  protected isStepDone(currentStatus: OrderStatus, step: OrderStatus): boolean {
    const currentIndex = this.STEP_ORDER.indexOf(currentStatus);
    const stepIndex = this.STEP_ORDER.indexOf(step);
    return currentIndex >= stepIndex;
  }
}