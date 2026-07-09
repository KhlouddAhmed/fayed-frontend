// =============================================
// API DTOs — mirror BLL/DTOs/Offers/* on the backend (camelCase JSON)
// =============================================

/** Matches backend PurchaseOfferDto */
export interface PurchaseOfferDto {
  readonly id: number;
  readonly listingId: number;
  readonly listingTitle: string;
  readonly buyerId: number;
  readonly requestedQuantity: number;
  readonly offeredPricePerTon: number;
  readonly totalValue: number;
  readonly buyerMessage: string | null;
  /** Pending | Accepted | Rejected | Withdrawn */
  readonly status: string;
  /** كود الطرف الآخر (للمشتري: كود المورد — للمورد: كود المشتري) */
  readonly counterpartyCode: string;
  readonly createdAt: string;
  /** معرف محادثة التفاوض إن وُجدت (تظهر بعد قبول العرض) */
  readonly chatId: number | null;
}

/** Matches backend CreatePurchaseOfferDto */
export interface CreatePurchaseOfferRequest {
  readonly listingId: number;
  readonly requestedQuantity: number;
  readonly offeredPricePerTon: number;
  readonly buyerMessage?: string | null;
}

/** Matches backend RespondToPurchaseOfferResponseDto */
export interface RespondToPurchaseOfferResponse {
  readonly offerId: number;
  readonly isAccepted: boolean;
  readonly chatId: number | null;
}

/** DTO tagged with the endpoint it came from (sent = my-sent-offers, received = my-received-offers) */
export interface PurchaseOfferWithDirection extends PurchaseOfferDto {
  readonly direction: OfferDirection;
}

// =============================================
// UI Models (normalized, display-ready)
// =============================================

export type OfferDirection = 'sent' | 'received';

export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface Offer {
  readonly id: string;
  readonly code: string;
  readonly listingId: number;
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
  readonly chatId: number | null;
}
