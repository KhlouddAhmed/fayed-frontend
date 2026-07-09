import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';
import {
  ChatDetailsDto,
  ChatDto,
  ChatMessageDto,
  GenerateContractFromChatResponse,
} from '../models/messages.model';

/**
 * المحادثات — mirrors /api/chats on the backend.
 * The negotiation chat is opened automatically when the seller accepts
 * a preliminary offer; the buyer generates the contract from inside it.
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/chats`;

  getChats(): Observable<readonly ChatDto[]> {
    return this.http
      .get<ApiResponseWithData<readonly ChatDto[]>>(this.baseUrl)
      .pipe(map(res => res.data ?? []));
  }

  getChatDetails(chatId: number): Observable<ChatDetailsDto> {
    return this.http
      .get<ApiResponseWithData<ChatDetailsDto>>(`${this.baseUrl}/${chatId}`)
      .pipe(map(res => res.data!));
  }

  sendMessage(chatId: number, content: string): Observable<ChatMessageDto> {
    return this.http
      .post<ApiResponseWithData<ChatMessageDto>>(`${this.baseUrl}/${chatId}/messages`, {
        content,
        messageType: 'Text',
      })
      .pipe(map(res => res.data!));
  }

  markAsRead(chatId: number): Observable<void> {
    return this.http
      .put<ApiResponseWithData<boolean>>(`${this.baseUrl}/${chatId}/read`, {})
      .pipe(map(() => void 0));
  }

  createChat(listingId: number): Observable<ChatDetailsDto> {
    return this.http
      .post<ApiResponseWithData<ChatDetailsDto>>(this.baseUrl, { listingId })
      .pipe(map(res => res.data!));
  }

  /**
   * زر "إنشاء عقد" (يظهر للمشتري فقط داخل المحادثة):
   * ينشئ طلباً جديداً من المحادثة ويرجع رابط التوجيه إلى نموذج العقد.
   */
  generateContract(chatId: number): Observable<GenerateContractFromChatResponse> {
    return this.http
      .post<ApiResponseWithData<GenerateContractFromChatResponse>>(
        `${this.baseUrl}/${chatId}/generate-contract`,
        {}
      )
      .pipe(map(res => res.data!));
  }
}
