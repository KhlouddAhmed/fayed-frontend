import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';
import { ConversationDto, MessageDto, ContractDto } from '../models/messages.model';
import { AuthStateService } from '../../../../core/services/auth-state.service';

// Backend DTOs
interface ChatDto {
  readonly Id: number;
  readonly ListingId: number;
  readonly ListingTitle: string;
  readonly OtherParticipantId: number;
  readonly OtherParticipantCode: string;
  readonly LastMessage: string | null;
  readonly LastMessageAt: string | null;
  readonly UnreadCount: number;
  readonly Status: string;
}

interface BackendMessageDto {
  readonly Id: number;
  readonly SenderId: number;
  readonly SenderName: string;
  readonly Content: string | null;
  readonly MessageType: string;
  readonly ActionUrl: string | null;
  readonly AttachmentUrl: string | null;
  readonly IsRead: boolean;
  readonly SentAt: string;
}

interface ChatDetailsDto {
  readonly Id: number;
  readonly ListingId: number;
  readonly ListingTitle: string;
  readonly BuyerId: number;
  readonly BuyerName: string;
  readonly SellerId: number;
  readonly SellerName: string;
  readonly Status: string;
  readonly StartedAt: string;
  readonly Messages: readonly BackendMessageDto[];
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

function adaptChatToConversation(chat: ChatDto): ConversationDto {
  return {
    Id: String(chat.Id),
    ParticipantCode: chat.OtherParticipantCode,
    ParticipantName: chat.OtherParticipantCode,
    ParticipantInitial: initialFromName(chat.ListingTitle),
    ParticipantColor: colorFromId(chat.OtherParticipantId),
    LastMessage: chat.LastMessage ?? '',
    LastMessageAt: chat.LastMessageAt ?? new Date().toISOString(),
    UnreadCount: chat.UnreadCount,
  };
}

function adaptBackendMessage(msg: BackendMessageDto, chatId: number): MessageDto {
  return {
    Id: String(msg.Id),
    ConversationId: String(chatId),
    SenderCode: String(msg.SenderId),
    Content: msg.Content ?? '',
    Type: msg.MessageType === 'Text' ? 'Text' : 'Text',
    SentAt: msg.SentAt,
  };
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);

  getConversations(): Observable<readonly ConversationDto[]> {
    return this.http
      .get<ApiResponseWithData<readonly ChatDto[]>>(`${environment.apiUrl}/chats`)
      .pipe(map(res => (res.data ?? []).map(adaptChatToConversation)));
  }

  getMessages(chatId: string): Observable<readonly MessageDto[]> {
    return this.http
      .get<ApiResponseWithData<ChatDetailsDto>>(`${environment.apiUrl}/chats/${chatId}`)
      .pipe(
        map(res => (res.data?.Messages ?? []).map(msg =>
          adaptBackendMessage(msg, res.data!.Id)
        ))
      );
  }

  sendMessage(chatId: string, content: string): Observable<MessageDto> {
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

  createChat(listingId: number): Observable<ConversationDto> {
    return this.http
      .post<ApiResponseWithData<ChatDto>>(`${environment.apiUrl}/chats`, { ListingId: listingId })
      .pipe(map(res => adaptChatToConversation(res.data!)));
  }

  // Contract endpoints
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