import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';
import { ContractDto, Conversation, Message } from '../models/messages.model';
import { AuthStateService } from '../../../../core/services/auth-state.service';

interface ChatDto {
  readonly id: number;
  readonly listingId: number;
  readonly listingTitle: string;
  readonly otherParticipantId: number;
  readonly otherParticipantCode: string;
  readonly lastMessage: string | null;
  readonly lastMessageAt: string | null;
  readonly unreadCount: number;
  readonly status: string;
}

interface BackendMessageDto {
  readonly id: number;
  readonly senderId: number;
  readonly senderName: string;
  readonly content: string | null;
  readonly messageType: string;
  readonly actionUrl: string | null;
  readonly attachmentUrl: string | null;
  readonly isRead: boolean;
  readonly sentAt: string;
}

interface ChatDetailsDto {
  readonly id: number;
  readonly listingId: number;
  readonly listingTitle: string;
  readonly buyerId: number;
  readonly buyerName: string;
  readonly sellerId: number;
  readonly sellerName: string;
  readonly status: string;
  readonly startedAt: string;
  readonly messages: readonly BackendMessageDto[];
}

const PARTICIPANT_COLORS = [
  '#F87171', '#FBBF24', '#34D399', '#A78BFA', '#EF4444',
  '#60A5FA', '#F472B6', '#FB923C',
];

function colorFromId(id: number): string {
  return PARTICIPANT_COLORS[id % PARTICIPANT_COLORS.length];
}

function initialFromName(name: string): string {
  return name?.trim()?.[0]?.toUpperCase() ?? '?';
}

function adaptChatToConversation(chat: ChatDto): Conversation {
  return {
    id: String(chat.id),
    participantCode: chat.otherParticipantCode,
    participantName: chat.otherParticipantCode,
    participantInitial: initialFromName(chat.listingTitle),
    participantColor: colorFromId(chat.otherParticipantId),
    lastMessage: chat.lastMessage ?? '',
    lastMessageAt: chat.lastMessageAt ? new Date(chat.lastMessageAt) : new Date(),
    unreadCount: chat.unreadCount,
  };
}

function adaptBackendMessage(msg: BackendMessageDto, chatId: number): Message {
  return {
    id: String(msg.id),
    conversationId: String(chatId),
    senderCode: String(msg.senderId),
    content: msg.content ?? '',
    type: msg.messageType === 'Text' ? 'text' : 'text',
    sentAt: new Date(msg.sentAt),
  };
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);

  getConversations(): Observable<readonly Conversation[]> {
    return this.http
      .get<ApiResponseWithData<readonly ChatDto[]>>(`${environment.apiUrl}/chats`)
      .pipe(map(res => (res.data ?? []).map(adaptChatToConversation)));
  }

  getMessages(chatId: string): Observable<readonly Message[]> {
    return this.http
      .get<ApiResponseWithData<ChatDetailsDto>>(`${environment.apiUrl}/chats/${chatId}`)
      .pipe(
        map(res => (res.data?.messages ?? []).map(msg =>
          adaptBackendMessage(msg, res.data!.id)
        ))
      );
  }

  sendMessage(chatId: string, content: string): Observable<Message> {
    return this.http
      .post<ApiResponseWithData<BackendMessageDto>>(
        `${environment.apiUrl}/chats/${chatId}/messages`,
        { content }
      )
      .pipe(map(res => adaptBackendMessage(res.data!, Number(chatId))));
  }

  markAsRead(chatId: string): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/chats/${chatId}/read`, {});
  }

  createChat(listingId: number): Observable<Conversation> {
    return this.http
      .post<ApiResponseWithData<ChatDto>>(`${environment.apiUrl}/chats`, { listingId })
      .pipe(map(res => adaptChatToConversation(res.data!)));
  }

  getContract(orderId: string): Observable<ContractDto | null> {
    return this.http
      .get<ApiResponseWithData<ContractDto>>(`${environment.apiUrl}/orders/${orderId}/contract`)
      .pipe(map(res => res.data ?? null));
  }

  createContract(orderId: string): Observable<ContractDto> {
    return this.http
      .get<ApiResponseWithData<ContractDto>>(`${environment.apiUrl}/orders/${orderId}/contract/form`)
      .pipe(map(res => res.data!));
  }

  acceptAmendment(orderId: string): Observable<ContractDto> {
    return this.http
      .put<ApiResponseWithData<ContractDto>>(`${environment.apiUrl}/orders/${orderId}/contract/accept`, {})
      .pipe(map(res => res.data!));
  }

  declineAmendment(orderId: string): Observable<ContractDto> {
    return this.http
      .put<ApiResponseWithData<ContractDto>>(`${environment.apiUrl}/orders/${orderId}/contract/decline`, {})
      .pipe(map(res => res.data!));
  }
}