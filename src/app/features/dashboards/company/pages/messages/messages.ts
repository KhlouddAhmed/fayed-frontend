import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ChatThreadInfo, Conversation, Message } from '../../models/messages.model';
import {
  adaptConversations,
  adaptMessage,
  adaptMessages,
  adaptThreadInfo,
} from '../../adapters/messages.adapter';
import { ChatService } from '../../services/chat.service';
import { ConversationList } from '../../components/conversation-list/conversation-list';
import { MessageThread } from '../../components/message-thread/message-thread';
import { ContractPromptModal } from '../../components/contract-prompt-modal/contract-prompt-modal';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';
import { AuthStateService } from '../../../../../core/services/auth-state.service';
import { RealtimeService } from '../../../../../core/services/realtime.service';
import { ToastService } from '../../../../../core/services/toast.service';

interface ThreadData {
  readonly info: ChatThreadInfo;
  readonly messages: readonly Message[];
}

@Component({
  selector: 'app-messages',
  imports: [
    DatePipe,
    ConversationList,
    MessageThread,
    ContractPromptModal,
    LoadingSkeleton,
    ErrorState,
    EmptyState,
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Messages implements OnInit {
  private readonly chatService = inject(ChatService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);
  private readonly realtime = inject(RealtimeService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly currentDate = new Date();

  /** معرف المستخدم الحالي من الـ JWT */
  protected readonly currentUserId = computed(() =>
    Number(this.authState.currentUser()?.id ?? 0)
  );

  protected readonly conversationsResource = resource({
    loader: async () => {
      const dtos = await firstValueFrom(this.chatService.getChats());
      return adaptConversations(dtos);
    },
  });

  protected readonly activeConversationId = signal<string | null>(null);
  protected readonly showContractPrompt = signal(false);
  protected readonly isSending = signal(false);
  protected readonly isGeneratingContract = signal(false);

  /** تفاصيل المحادثة المفتوحة (الرسائل + من هو المشتري/المورد) */
  protected readonly threadResource = resource<ThreadData | null, string | null>({
    params: this.activeConversationId,
    loader: async ({ params: id }): Promise<ThreadData | null> => {
      if (!id) return null;
      const dto = await firstValueFrom(this.chatService.getChatDetails(Number(id)));
      return {
        info: adaptThreadInfo(dto),
        messages: adaptMessages(dto.messages, dto.id),
      };
    },
  });

  protected readonly activeConversation = computed<Conversation | null>(() => {
    const id = this.activeConversationId();
    return this.conversationsResource.value()?.find((c) => c.id === id) ?? null;
  });

  protected readonly threadInfo = computed<ChatThreadInfo | null>(
    () => this.threadResource.value()?.info ?? null
  );

  protected readonly threadMessages = computed<readonly Message[]>(
    () => this.threadResource.value()?.messages ?? []
  );

  /**
   * زر "إنشاء عقد" حسب سير العمل: يظهر في واجهة المشتري فقط
   * وطالما المحادثة مفتوحة (POST /api/chats/{id}/generate-contract مقصور على المشتري).
   */
  protected readonly canGenerateContract = computed(() => {
    const info = this.threadInfo();
    return !!info && info.buyerId === this.currentUserId() && info.status === 'Open';
  });

  ngOnInit(): void {
    const chatId = this.route.snapshot.queryParamMap.get('chatId');
    if (chatId) {
      this.onSelectConversation(chatId);
    }

    // رسالة SignalR واردة في المحادثة المفتوحة → أضفها فوراً (مع منع التكرار)
    this.realtime.chatMessageReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(dto => {
        const activeId = this.activeConversationId();
        if (!activeId) return;
        const message = adaptMessage(
          {
            id: dto.id,
            senderId: dto.senderId,
            senderName: dto.senderName,
            content: dto.content,
            messageType: dto.messageType,
            actionUrl: dto.actionUrl,
            attachmentUrl: dto.attachmentUrl,
            isRead: dto.isRead,
            sentAt: dto.sentAt,
          },
          Number(activeId)
        );
        this.appendMessage(message);
      });

    // تحديث قائمة المحادثات عند وصول رسالة في أي محادثة أخرى
    this.realtime.chatListUpdated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.conversationsResource.reload());
  }

  protected onSelectConversation(id: string): void {
    const previous = this.activeConversationId();
    if (previous && previous !== id) {
      this.realtime.leaveChatGroup(Number(previous));
    }

    this.activeConversationId.set(id);
    this.chatService.markAsRead(Number(id)).subscribe({ error: () => void 0 });
    this.realtime.joinChatGroup(Number(id));
  }

  protected async onSendMessage(content: string): Promise<void> {
    const id = this.activeConversationId();
    if (!id) return;
    this.isSending.set(true);
    try {
      const dto = await firstValueFrom(this.chatService.sendMessage(Number(id), content));
      this.appendMessage(adaptMessage(dto, Number(id)));
    } catch {
      this.toast.error('تعذر إرسال الرسالة. حاول مرة أخرى.');
    } finally {
      this.isSending.set(false);
    }
  }

  protected onStartContract(): void {
    this.showContractPrompt.set(true);
  }

  protected onDismissContractPrompt(): void {
    this.showContractPrompt.set(false);
  }

  /**
   * تأكيد إنشاء العقد: ينشئ الباك إند طلباً (Order) من المحادثة
   * ثم نوجه المشتري إلى نموذج العقد لملء الحقول القابلة للتعديل وتقديمه.
   */
  protected async onConfirmCreateContract(): Promise<void> {
    const id = this.activeConversationId();
    if (!id) return;

    this.isGeneratingContract.set(true);
    try {
      const result = await firstValueFrom(this.chatService.generateContract(Number(id)));
      this.showContractPrompt.set(false);
      await this.router.navigate([
        '/dashboard/company/contracts',
        result.orderId,
        'form',
      ]);
    } catch (err: unknown) {
      const backendMessage = (err as { error?: { message?: string } })?.error?.message;
      this.toast.error(backendMessage || 'تعذر إنشاء العقد. حاول مرة أخرى.');
      this.showContractPrompt.set(false);
    } finally {
      this.isGeneratingContract.set(false);
    }
  }

  /** إضافة رسالة لنهاية المحادثة المفتوحة مع منع التكرار (POST + SignalR) */
  private appendMessage(message: Message): void {
    this.threadResource.update(data => {
      if (!data) return data;
      if (data.messages.some(m => m.id === message.id)) return data;
      return { ...data, messages: [...data.messages, message] };
    });
  }
}
