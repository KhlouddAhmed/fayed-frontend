// =============================================
// API DTOs (.NET 8 — PascalCase as received from backend)
// =============================================

export interface DisputeDto {
  readonly Id: string;
  readonly Code: string;
  readonly OrderReference: string;
  readonly Reason: string;
  readonly ReasonLabel: string;
  readonly Description: string;
  readonly FiledAt: string;
  readonly Status: string;
  readonly ArbitrationStatusLabel: string | null;
}

export interface NegotiationMessageDto {
  readonly Id: string;
  readonly SenderType: string;
  readonly SenderLabel: string;
  readonly Content: string;
  readonly SentAt: string;
}

export interface CreateDisputeRequestDto {
  readonly OrderReference: string;
  readonly Reason: string;
  readonly Description: string;
}

// =============================================
// UI Models (camelCase, normalized, display-ready)
// =============================================

export type DisputeStatus = 'activeOpen' | 'underReview' | 'resolved';

export type DisputeReason =
  | 'productNotAsDescribed'
  | 'lateDelivery'
  | 'quantityShortfall';

export type NegotiationSenderType = 'system' | 'buyer' | 'seller';

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
  readonly orderReference: string;
  readonly reason: DisputeReason;
  readonly description: string;
}