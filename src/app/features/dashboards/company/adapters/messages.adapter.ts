import {
  Contract,
  ContractAmendment,
  ContractAmendmentDto,
  ContractDto,
  ContractSignature,
  ContractSignatureDto,
  ContractStatus,
  Conversation,
  ConversationDto,
  Message,
  MessageDto,
  MessageType,
} from '../models/messages.model';

const CONTRACT_STATUS_MAP: Readonly<Record<string, ContractStatus>> = {
  Draft: 'draft',
  PendingAmendment: 'pending_amendment',
  PendingSignatures: 'pending_signatures',
  Signed: 'signed',
};

const MESSAGE_TYPE_MAP: Readonly<Record<string, MessageType>> = {
  Text: 'text',
  AiSuggestion: 'ai_suggestion',
  ContractEvent: 'contract_event',
};

function adaptSignature(dto: ContractSignatureDto | null): ContractSignature | null {
  if (!dto) return null;
  return { partyCode: dto.partyCode, signedAt: new Date(dto.signedAt) };
}

function adaptAmendment(dto: ContractAmendmentDto | null): ContractAmendment | null {
  if (!dto) return null;
  return { previousTerms: dto.previousTerms, newTerms: dto.newTerms };
}

export function adaptConversation(dto: ConversationDto): Conversation {
  return {
    id: dto.id,
    participantCode: dto.participantCode,
    participantName: dto.participantName,
    participantInitial: dto.participantInitial,
    participantColor: dto.participantColor,
    lastMessage: dto.lastMessage ?? '',
    lastMessageAt: dto.lastMessageAt ? new Date(dto.lastMessageAt) : new Date(),
    unreadCount: dto.unreadCount ?? 0,
  };
}

export function adaptMessage(dto: MessageDto): Message {
  return {
    id: dto.id,
    conversationId: dto.conversationId,
    senderCode: dto.senderCode,
    content: dto.content,
    type: MESSAGE_TYPE_MAP[dto.type] ?? 'text',
    sentAt: new Date(dto.sentAt),
  };
}

export function adaptContract(dto: ContractDto): Contract {
  return {
    id: dto.id,
    code: dto.code,
    status: CONTRACT_STATUS_MAP[dto.status] ?? 'draft',
    sellerName: dto.sellerName,
    buyerName: dto.buyerName,
    dealDate: dto.dealDate,
    materialName: dto.materialName,
    totalQuantity: dto.totalQuantity,
    pricePerTon: dto.pricePerTon,
    totalValue: dto.totalValue,
    deliveryTerms: dto.deliveryTerms,
    deliveryLocation: dto.deliveryLocation,
    escrowTerms: dto.escrowTerms,
    qualityNotes: dto.qualityNotes,
    additionalTerms: dto.additionalTerms ?? null,
    pendingAmendment: adaptAmendment(dto.pendingAmendment),
    buyerSignature: adaptSignature(dto.buyerSignature),
    sellerSignature: adaptSignature(dto.sellerSignature),
  };
}

export function adaptConversations(dtos: readonly ConversationDto[]): readonly Conversation[] {
  return dtos.map(adaptConversation);
}

export function adaptMessages(dtos: readonly MessageDto[]): readonly Message[] {
  return dtos.map(adaptMessage);
}