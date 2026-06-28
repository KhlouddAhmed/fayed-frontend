// =============================================
// API DTOs (.NET 8 — PascalCase as received from backend)
// =============================================

export interface OfferDto {
  readonly Id: string;
  readonly Code: string;
  readonly ClientCode: string;
  readonly ProductName: string;
  readonly RequestedQuantity: number;
  readonly Unit: string;
  readonly PricePerUnit: number;
  readonly TotalValue: number;
  readonly Status: string;
  readonly Direction: string;
  readonly Message: string | null;
  readonly SentAt: string;
}

// =============================================
// UI Models (camelCase, normalized, display-ready)
// =============================================

export type OfferDirection = 'sent' | 'received';

export type OfferStatus =
  | 'negotiating'
  | 'awaitingResponse'
  | 'accepted'
  | 'rejected'
  | 'completed';

export interface Offer {
  readonly id: string;
  readonly code: string;
  readonly clientCode: string;
  readonly productName: string;
  readonly requestedQuantity: number;
  readonly unit: string;
  readonly pricePerUnit: number;
  readonly totalValue: number;
  readonly status: OfferStatus;
  readonly direction: OfferDirection;
  readonly message: string | null;
  readonly sentAt: Date;
}
