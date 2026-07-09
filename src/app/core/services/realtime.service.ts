import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { AuthStateService } from './auth-state.service';
import { NotificationDto } from '../../features/notifications/models/notification.model';

/** رسالة SignalR القادمة من هَب المحادثات (MessageDto من الباك إند) */
export interface RealtimeChatMessage {
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

export interface ChatListUpdate {
  readonly chatId: number;
  readonly lastMessage: RealtimeChatMessage | null;
}

/** Hub base = apiUrl without the trailing /api segment */
function hubsBaseUrl(): string {
  return environment.apiUrl.replace(/\/api\/?$/, '');
}

/**
 * SignalR real-time layer:
 * - /hubs/notifications → ReceiveNotification (toast + unread badge + عناصر القائمة)
 * - /hubs/chat → ReceiveMessage (داخل غرفة chat_{id}) و ChatListUpdated (لمجموعة user_{id})
 *
 * Connections start after login and stop on logout.
 */
@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private readonly authState = inject(AuthStateService);

  private notificationsConnection: HubConnection | null = null;
  private chatConnection: HubConnection | null = null;

  private readonly _notificationReceived = new Subject<NotificationDto>();
  private readonly _chatMessageReceived = new Subject<RealtimeChatMessage>();
  private readonly _chatListUpdated = new Subject<ChatListUpdate>();

  /** إشعار جديد وصل عبر SignalR */
  readonly notificationReceived$ = this._notificationReceived.asObservable();
  /** رسالة جديدة في المحادثة المفتوحة حالياً */
  readonly chatMessageReceived$ = this._chatMessageReceived.asObservable();
  /** تغيّرت قائمة المحادثات (رسالة جديدة في أي محادثة) */
  readonly chatListUpdated$ = this._chatListUpdated.asObservable();

  async startNotifications(): Promise<void> {
    if (this.notificationsConnection) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${hubsBaseUrl()}/hubs/notifications`, {
        accessTokenFactory: () => this.authState.token() ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on('ReceiveNotification', (notification: NotificationDto) => {
      this._notificationReceived.next(notification);
    });

    this.notificationsConnection = connection;

    try {
      await connection.start();
    } catch {
      // ستُعاد المحاولة عبر withAutomaticReconnect عند أول نشاط؛
      // فشل الاتصال الفوري لا يجب أن يكسر التطبيق (يبقى polling الـ REST يعمل)
    }
  }

  async startChat(): Promise<void> {
    if (this.chatConnection) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${hubsBaseUrl()}/hubs/chat`, {
        accessTokenFactory: () => this.authState.token() ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on('ReceiveMessage', (message: RealtimeChatMessage) => {
      this._chatMessageReceived.next(message);
    });

    connection.on('ChatListUpdated', (payload: ChatListUpdate) => {
      this._chatListUpdated.next(payload);
    });

    this.chatConnection = connection;

    try {
      await connection.start();
    } catch {
      // fallback: الرسائل تُجلب عبر REST عند إعادة التحميل
    }
  }

  async joinChatGroup(chatId: number): Promise<void> {
    await this.startChat();
    if (this.chatConnection?.state === HubConnectionState.Connected) {
      try {
        await this.chatConnection.invoke('JoinChatGroup', chatId);
      } catch {
        // الانضمام للغرفة اختياري — الرسائل تصل عند التحديث اليدوي
      }
    }
  }

  async leaveChatGroup(chatId: number): Promise<void> {
    if (this.chatConnection?.state === HubConnectionState.Connected) {
      try {
        await this.chatConnection.invoke('LeaveChatGroup', chatId);
      } catch {
        // تجاهل — قطع الاتصال سيخرجنا من الغرفة على أي حال
      }
    }
  }

  async stopAll(): Promise<void> {
    const connections = [this.notificationsConnection, this.chatConnection];
    this.notificationsConnection = null;
    this.chatConnection = null;

    for (const connection of connections) {
      if (connection) {
        try {
          await connection.stop();
        } catch {
          // ignore
        }
      }
    }
  }
}
