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
  imports: [OrderRow, LoadingSkeleton, ErrorState, EmptyState, DatePipe, StatusBadge, DecimalPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private readonly repository = inject(ORDERS_REPOSITORY);

  protected readonly purchasesResource = resource({
    loader: async () => adaptOrders(await this.repository.getPurchases()),
  });

  protected readonly salesResource = resource({
    loader: async () => adaptOrders(await this.repository.getSales()),
  });

  protected readonly currentDate = new Date();
  protected readonly activeTab = signal<OrderTab>('sent');
  protected readonly selectedOrder = signal<Order | null>(null);

  protected readonly activeResource = computed(() =>
    this.activeTab() === 'sent' ? this.purchasesResource : this.salesResource
  );

  protected readonly isLoading = computed(() => this.activeResource().isLoading());
  protected readonly hasError = computed(() => this.activeResource().error());
  protected readonly filteredOrders = computed(() => this.activeResource().value() ?? []);

  protected onTabChange(tab: OrderTab): void {
    this.activeTab.set(tab);
  }

  protected onViewDetails(orderId: string): void {
    const order = this.activeResource().value()?.find(o => o.id === orderId) ?? null;
    this.selectedOrder.set(order);
  }

  protected closeModal(): void {
    this.selectedOrder.set(null);
  }

  protected reloadActive(): void {
    this.activeResource().reload();
  }

  protected readonly statusDisplayMap = {
    pendingShipment: { labelKey: 'قيد الشحن', variant: 'warning' as StatusBadgeVariant },
    inPreparation: { labelKey: 'قيد التجهيز', variant: 'warning' as StatusBadgeVariant },
    delivered: { labelKey: 'تم التسليم', variant: 'info' as StatusBadgeVariant },
    completed: { labelKey: 'مكتمل', variant: 'success' as StatusBadgeVariant },
  };

  private readonly STEP_ORDER: readonly OrderStatus[] = [
    'pendingShipment',
    'inPreparation',
    'delivered',
    'completed',
  ];

  protected isStepDone(currentStatus: OrderStatus, step: string): boolean {
    const currentIndex = this.STEP_ORDER.indexOf(currentStatus);
    const stepIndex = this.STEP_ORDER.indexOf(step as OrderStatus);
    return stepIndex <= currentIndex;
  }
}