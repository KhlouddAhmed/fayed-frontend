import {
  ChatDetailsDto,
  ChatDto,
  ChatMessageDto,
  ChatThreadInfo,
  Conversation,
  Message,
  MessageType,
} from '../models/messages.model';

const MESSAGE_TYPE_MAP: Readonly<Record<string, MessageType>> = {
  Text: 'text',
  Offer: 'offer',
  System: 'system',
};

const PARTICIPANT_COLORS = [
  '#F87171', '#FBBF24', '#34D399', '#A78BFA', '#EF4444',
  '#60A5FA', '#F472B6', '#FB923C',
];

function colorFromId(id: number): string {
  return PARTICIPANT_COLORS[Math.abs(id) % PARTICIPANT_COLORS.length];
}

function initialFromName(name: string): string {
  return name?.trim()?.[0]?.toUpperCase() ?? '?';
}

export function adaptConversation(dto: ChatDto): Conversation {
  return {
    id: String(dto.id),
    listingId: dto.listingId,
    participantCode: dto.otherParticipantCode,
    participantName: dto.listingTitle,
    participantInitial: initialFromName(dto.listingTitle),
    participantColor: colorFromId(dto.otherParticipantId),
    lastMessage: dto.lastMessage ?? '',
    lastMessageAt: dto.lastMessageAt ? new Date(dto.lastMessageAt) : new Date(),
    unreadCount: dto.unreadCount ?? 0,
    status: dto.status,
  };
}

export function adaptMessage(dto: ChatMessageDto, chatId: number): Message {
  return {
    id: String(dto.id),
    conversationId: String(chatId),
    senderId: dto.senderId,
    senderName: dto.senderName,
    content: dto.content ?? '',
    type: MESSAGE_TYPE_MAP[dto.messageType] ?? 'text',
    sentAt: new Date(dto.sentAt),
  };
}

export function adaptThreadInfo(dto: ChatDetailsDto): ChatThreadInfo {
  return {
    chatId: dto.id,
    listingId: dto.listingId,
    listingTitle: dto.listingTitle,
    buyerId: dto.buyerId,
    buyerName: dto.buyerName,
    sellerId: dto.sellerId,
    sellerName: dto.sellerName,
    status: dto.status,
  };
}

export function adaptConversations(dtos: readonly ChatDto[]): readonly Conversation[] {
  return dtos.map(adaptConversation);
}

export function adaptMessages(dtos: readonly ChatMessageDto[], chatId: number): readonly Message[] {
  return dtos.map(dto => adaptMessage(dto, chatId));
}
