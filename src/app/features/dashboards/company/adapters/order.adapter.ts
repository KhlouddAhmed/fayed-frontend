import { Order, OrderDto, OrderStatus } from '../models/order.model';

const ORDER_STATUS_MAP: Readonly<Record<string, OrderStatus>> = {
  'قيد الشحن': 'pendingShipment',
  'قيد التجهيز': 'inPreparation',
  'تم التسليم': 'delivered',
  'مكتمل': 'completed',
};

const DEFAULT_STATUS: OrderStatus = 'pendingShipment';

export function adaptOrder(dto: OrderDto): Order {
  return {
    id: String(dto.orderId),
    code: dto.orderCode,
    sellerCode: dto.sellerCode ?? '',
    productName: dto.productTitle ?? '',
    totalValue: dto.totalValue ?? 0,
    status: ORDER_STATUS_MAP[dto.status] ?? DEFAULT_STATUS,
  };
}

export function adaptOrders(dtos: readonly OrderDto[]): readonly Order[] {
  return dtos.map(adaptOrder);
}