// =============================================
// API DTOs (.NET 8 — PascalCase)
// =============================================

export interface OrderDto {
  readonly Id: string;
  readonly Code: string;
  readonly SupplierCode: string;
  readonly ProductName: string;
  readonly Quantity: number;
  readonly TotalValue: number;
  readonly Status: string;
  readonly Direction: string;
  readonly OrderDate: string;
}

// =============================================
// UI Models
// =============================================

export type OrderStatus =
  | 'pendingShipment'
  | 'inPreparation'
  | 'delivered'
  | 'completed';

export type OrderDirection = 'sent' | 'received';

export interface Order {
  readonly id: string;
  readonly code: string;
  readonly supplierCode: string;
  readonly productName: string;
  readonly quantity: number;
  readonly totalValue: number;
  readonly status: OrderStatus;
  readonly direction: OrderDirection;
  readonly orderDate: Date;
}