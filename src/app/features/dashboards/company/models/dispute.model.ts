// =============================================
// API DTOs — matches actual backend response (camelCase)
// =============================================

export interface DisputeDto {
  // camelCase (actual)
  readonly id?: number;
  readonly orderId?: number;
  readonly reason?: string;
  readonly description?: string;
  readonly status?: string;
  readonly createdAt?: string;
  readonly resolvedAt?: string | null;
  readonly resolutionNotes?: string | null;
  // PascalCase (fallback)
  readonly Id?: number;
  readonly OrderId?: number;
  readonly Reason?: string;
  readonly Description?: string;
  readonly Status?: string;
  readonly CreatedAt?: string;
}

export interface NegotiationMessageDto {
  readonly id?: string;
  readonly Id?: string;
  readonly SenderType?: string;
  readonly senderType?: string;
  readonly SenderLabel?: string;
  readonly senderLabel?: string;
  readonly Content?: string;
  readonly content?: string;
  readonly SentAt?: string;
  readonly sentAt?: string;
}

export interface CreateDisputeRequestDto {
  readonly orderId: number;
  readonly reason: string;
  readonly description: string;
}

// =============================================
// UI Models
// =============================================

export type DisputeStatus = 'activeOpen' | 'underReview' | 'resolved' | 'cancelled';
export type DisputeReason =
  | 'productNotAsDescribed'
  | 'lateDelivery'
  | 'quantityShortfall'
  | 'delay'
  | 'nonPayment'
  | 'other';
export type NegotiationSenderType = 'system' | 'buyer' | 'seller' | 'admin';

export interface Dispute {
  readonly id: string;
  readonly code: string;
  readonly orderReference: string;
  readonly reason: DisputeReason;
  readonly reasonLabel: string;
  readonly description: string;
  readonly filedAt: Date;
  readonly status: DisputeStatus;
  readonly arbitrationStatusLabel: string | null;
}

export interface NegotiationMessage {
  readonly id: string;
  readonly senderType: NegotiationSenderType;
  readonly senderLabel: string;
  readonly content: string;
  readonly sentAt: Date;
}

export interface CreateDisputeRequest {
  readonly orderId: number;
  readonly reason: DisputeReason;
  readonly description: string;
}