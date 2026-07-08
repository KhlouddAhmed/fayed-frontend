export interface OrderDto {
  readonly orderId: number;
  readonly orderCode: string;
  readonly sellerCode: string;
  readonly productTitle: string;
  readonly totalValue: number;
  readonly status: string;
}

export type OrderStatus =
  | 'pendingShipment'
  | 'inPreparation'
  | 'delivered'
  | 'completed';

export interface Order {
  readonly id: string;
  readonly code: string;
  readonly sellerCode: string;
  readonly productName: string;
  readonly totalValue: number;
  readonly status: OrderStatus;
}