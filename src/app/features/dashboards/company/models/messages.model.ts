// =============================================
// API DTOs (.NET 8 — PascalCase)
// =============================================

export interface ConversationDto {
  readonly Id: string;
  readonly ParticipantCode: string;
  readonly ParticipantName: string;
  readonly ParticipantInitial: string;
  readonly ParticipantColor: string;
  readonly LastMessage: string;
  readonly LastMessageAt: string;
  readonly UnreadCount: number;
}

export interface MessageDto {
  readonly Id: string;
  readonly ConversationId: string;
  readonly SenderCode: string;
  readonly Content: string;
  readonly Type: string;
  readonly SentAt: string;
}

export interface ContractDto {
  readonly Id: string;
  readonly Code: string;
  readonly Status: string;
  readonly SellerName: string;
  readonly BuyerName: string;
  readonly DealDate: string;
  readonly MaterialName: string;
  readonly TotalQuantity: number;
  readonly PricePerTon: number;
  readonly TotalValue: number;
  readonly DeliveryTerms: string;
  readonly DeliveryLocation: string;
  readonly EscrowTerms: string;
  readonly QualityNotes: string;
  readonly AdditionalTerms: string | null;
  readonly PendingAmendment: ContractAmendmentDto | null;
  readonly BuyerSignature: ContractSignatureDto | null;
  readonly SellerSignature: ContractSignatureDto | null;
}

export interface ContractAmendmentDto {
  readonly PreviousTerms: string;
  readonly NewTerms: string;
}

export interface ContractSignatureDto {
  readonly PartyCode: string;
  readonly SignedAt: string;
}

// =============================================
// UI Models
// =============================================

export type MessageType = 'text' | 'ai_suggestion' | 'contract_event';

export type ContractStatus =
  | 'draft'
  | 'pending_amendment'
  | 'pending_signatures'
  | 'signed';

export interface Conversation {
  readonly id: string;
  readonly participantCode: string;
  readonly participantName: string;
  readonly participantInitial: string;
  readonly participantColor: string;
  readonly lastMessage: string;
  readonly lastMessageAt: Date;
  readonly unreadCount: number;
}

export interface Message {
  readonly id: string;
  readonly conversationId: string;
  readonly senderCode: string;
  readonly content: string;
  readonly type: MessageType;
  readonly sentAt: Date;
}

export interface ContractAmendment {
  readonly previousTerms: string;
  readonly newTerms: string;
}

export interface ContractSignature {
  readonly partyCode: string;
  readonly signedAt: Date;
}

export interface Contract {
  readonly id: string;
  readonly code: string;
  readonly status: ContractStatus;
  readonly sellerName: string;
  readonly buyerName: string;
  readonly dealDate: string;
  readonly materialName: string;
  readonly totalQuantity: number;
  readonly pricePerTon: number;
  readonly totalValue: number;
  readonly deliveryTerms: string;
  readonly deliveryLocation: string;
  readonly escrowTerms: string;
  readonly qualityNotes: string;
  readonly additionalTerms: string | null;
  readonly pendingAmendment: ContractAmendment | null;
  readonly buyerSignature: ContractSignature | null;
  readonly sellerSignature: ContractSignature | null;
}

export interface ContractSignatureFormValue {
  readonly authorizedName: string;
  readonly signatureDataUrl: string;
}
