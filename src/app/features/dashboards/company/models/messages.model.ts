// =============================================
// API DTOs (.NET 8 — PascalCase)
// =============================================

export interface ConversationDto {
  readonly id: string;
  readonly participantCode: string;
  readonly participantName: string;
  readonly participantInitial: string;
  readonly participantColor: string;
  readonly lastMessage: string;
  readonly lastMessageAt: string;
  readonly unreadCount: number;
}

export interface MessageDto {
  readonly id: string;
  readonly conversationId: string;
  readonly senderCode: string;
  readonly content: string;
  readonly type: string;
  readonly sentAt: string;
}

export interface ContractDto {
  readonly id: string;
  readonly code: string;
  readonly status: string;
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
  readonly pendingAmendment: ContractAmendmentDto | null;
  readonly buyerSignature: ContractSignatureDto | null;
  readonly sellerSignature: ContractSignatureDto | null;
}

export interface ContractAmendmentDto {
  readonly previousTerms: string;
  readonly newTerms: string;
}

export interface ContractSignatureDto {
  readonly partyCode: string;
  readonly signedAt: string;
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
