import { Order, OrderDto, OrderDirection, OrderStatus } from '../models/order.model';

const ORDER_STATUS_MAP: Readonly<Record<string, OrderStatus>> = {
  PendingShipment: 'pendingShipment',
  InPreparation: 'inPreparation',
  Delivered: 'delivered',
  Completed: 'completed',
};

const ORDER_DIRECTION_MAP: Readonly<Record<string, OrderDirection>> = {
  Sent: 'sent',
  Received: 'received',
};

const DEFAULT_STATUS: OrderStatus = 'pendingShipment';
const DEFAULT_DIRECTION: OrderDirection = 'sent';

export function adaptOrder(dto: OrderDto): Order {
  return {
    id: dto.Id,
    code: dto.Code,
    supplierCode: dto.SupplierCode,
    productName: dto.ProductName,
    quantity: dto.Quantity ?? 0,
    totalValue: dto.TotalValue ?? 0,
    status: ORDER_STATUS_MAP[dto.Status] ?? DEFAULT_STATUS,
    direction: ORDER_DIRECTION_MAP[dto.Direction] ?? DEFAULT_DIRECTION,
    orderDate: new Date(dto.OrderDate),
  };
}

export function adaptOrders(dtos: readonly OrderDto[]): readonly Order[] {
  return dtos.map(adaptOrder);
}