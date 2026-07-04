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
  return { partyCode: dto.PartyCode, signedAt: new Date(dto.SignedAt) };
}

function adaptAmendment(dto: ContractAmendmentDto | null): ContractAmendment | null {
  if (!dto) return null;
  return { previousTerms: dto.PreviousTerms, newTerms: dto.NewTerms };
}

export function adaptConversation(dto: ConversationDto): Conversation {
  return {
    id: dto.Id,
    participantCode: dto.ParticipantCode,
    participantName: dto.ParticipantName,
    participantInitial: dto.ParticipantInitial,
    participantColor: dto.ParticipantColor,
    lastMessage: dto.LastMessage ?? '',
    lastMessageAt: new Date(dto.LastMessageAt),
    unreadCount: dto.UnreadCount ?? 0,
  };
}

export function adaptMessage(dto: MessageDto): Message {
  return {
    id: dto.Id,
    conversationId: dto.ConversationId,
    senderCode: dto.SenderCode,
    content: dto.Content,
    type: MESSAGE_TYPE_MAP[dto.Type] ?? 'text',
    sentAt: new Date(dto.SentAt),
  };
}

export function adaptContract(dto: ContractDto): Contract {
  return {
    id: dto.Id,
    code: dto.Code,
    status: CONTRACT_STATUS_MAP[dto.Status] ?? 'draft',
    sellerName: dto.SellerName,
    buyerName: dto.BuyerName,
    dealDate: dto.DealDate,
    materialName: dto.MaterialName,
    totalQuantity: dto.TotalQuantity,
    pricePerTon: dto.PricePerTon,
    totalValue: dto.TotalValue,
    deliveryTerms: dto.DeliveryTerms,
    deliveryLocation: dto.DeliveryLocation,
    escrowTerms: dto.EscrowTerms,
    qualityNotes: dto.QualityNotes,
    additionalTerms: dto.AdditionalTerms ?? null,
    pendingAmendment: adaptAmendment(dto.PendingAmendment),
    buyerSignature: adaptSignature(dto.BuyerSignature),
    sellerSignature: adaptSignature(dto.SellerSignature),
  };
}

export function adaptConversations(dtos: readonly ConversationDto[]): readonly Conversation[] {
  return dtos.map(adaptConversation);
}

export function adaptMessages(dtos: readonly MessageDto[]): readonly Message[] {
  return dtos.map(adaptMessage);
}
