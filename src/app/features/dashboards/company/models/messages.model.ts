// =============================================
// API DTOs — mirror BLL/DTOs/Chat/* on the backend (camelCase JSON)
// =============================================

/** Matches backend ChatDto (list item from GET /api/chats) */
export interface ChatDto {
  readonly id: number;
  readonly listingId: number;
  readonly listingTitle: string;
  readonly otherParticipantId: number;
  readonly otherParticipantCode: string;
  readonly lastMessage: string | null;
  readonly lastMessageAt: string | null;
  readonly unreadCount: number;
  /** Open | Closed | Archived */
  readonly status: string;
}

/** Matches backend MessageDto */
export interface ChatMessageDto {
  readonly id: number;
  readonly senderId: number;
  readonly senderName: string;
  readonly content: string | null;
  /** Text | Offer | System */
  readonly messageType: string;
  readonly actionUrl: string | null;
  readonly attachmentUrl: string | null;
  readonly isRead: boolean;
  readonly sentAt: string;
}

/** Matches backend ChatDetailsDto (GET /api/chats/{id}) */
export interface ChatDetailsDto {
  readonly id: number;
  readonly listingId: number;
  readonly listingTitle: string;
  readonly buyerId: number;
  readonly buyerName: string;
  readonly sellerId: number;
  readonly sellerName: string;
  readonly status: string;
  readonly startedAt: string;
  readonly messages: readonly ChatMessageDto[];
}

/** Matches backend GenerateContractFromChatResponseDto */
export interface GenerateContractFromChatResponse {
  readonly orderId: number;
  readonly chatId: number;
  readonly redirectUrl: string;
}

// =============================================
// UI Models
// =============================================

export type MessageType = 'text' | 'offer' | 'system';

export interface Conversation {
  readonly id: string;
  readonly listingId: number;
  readonly participantCode: string;
  readonly participantName: string;
  readonly participantInitial: string;
  readonly participantColor: string;
  readonly lastMessage: string;
  readonly lastMessageAt: Date;
  readonly unreadCount: number;
  readonly status: string;
}

export interface Message {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: number;
  readonly senderName: string;
  readonly content: string;
  readonly type: MessageType;
  readonly sentAt: Date;
}

/** Details of the open chat needed for flow logic (who is the buyer?) */
export interface ChatThreadInfo {
  readonly chatId: number;
  readonly listingId: number;
  readonly listingTitle: string;
  readonly buyerId: number;
  readonly buyerName: string;
  readonly sellerId: number;
  readonly sellerName: string;
  readonly status: string;
}
