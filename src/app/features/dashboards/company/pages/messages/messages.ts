import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  Contract,
  Conversation,
  ContractSignatureFormValue,
  Message,
} from '../../models/messages.model';
import { adaptContract } from '../../adapters/messages.adapter';
import { ChatService } from '../../services/chat.service';
import { ConversationList } from '../../components/conversation-list/conversation-list';
import { MessageThread } from '../../components/message-thread/message-thread';
import { ContractPromptModal } from '../../components/contract-prompt-modal/contract-prompt-modal';
import { ContractPanel } from '../../components/contract-panel/contract-panel';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';

type ActiveModal = 'contract_prompt' | 'contract_panel' | null;

@Component({
  selector: 'app-messages',
  imports: [
    DatePipe,
    ConversationList,
    MessageThread,
    ContractPromptModal,
    ContractPanel,
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

  protected readonly currentDate = new Date();

  protected readonly conversationsResource = resource({
    loader: async () => firstValueFrom(this.chatService.getConversations()),
  });

  protected readonly activeConversationId = signal<string | null>(null);
  protected readonly activeModal = signal<ActiveModal>(null);
  protected readonly activeContract = signal<Contract | null>(null);
  protected readonly isSending = signal(false);
  protected readonly isContractLoading = signal(false);
  protected readonly isContractSubmitting = signal(false);

  protected readonly messagesResource = resource<readonly Message[], string | null>({
    params: this.activeConversationId,
    loader: async ({ params: id }): Promise<readonly Message[]> => {
      if (!id) return [];
      return firstValueFrom(this.chatService.getMessages(id));
    },
  });

  protected readonly activeConversation = computed<Conversation | null>(() => {
    const id = this.activeConversationId();
    return this.conversationsResource.value()?.find((c) => c.id === id) ?? null;
  });

  ngOnInit(): void {
    const chatId = this.route.snapshot.queryParamMap.get('chatId');
    if (chatId) {
      this.onSelectConversation(chatId);
    }
  }

  protected onSelectConversation(id: string): void {
    this.activeConversationId.set(id);
    this.chatService.markAsRead(id).subscribe();
  }

  protected async onSendMessage(content: string): Promise<void> {
    const id = this.activeConversationId();
    if (!id) return;
    this.isSending.set(true);
    await firstValueFrom(this.chatService.sendMessage(id, content));
    this.isSending.set(false);
    this.messagesResource.reload();
  }

  protected onStartContract(): void {
    this.activeModal.set('contract_prompt');
  }

  protected async onConfirmCreateContract(): Promise<void> {
    const id = this.activeConversationId();
    if (!id) return;
    this.isContractLoading.set(true);
    const dto = await firstValueFrom(this.chatService.createContract(id));
    this.activeContract.set(adaptContract(dto));
    this.isContractLoading.set(false);
    this.activeModal.set('contract_panel');
  }

  protected onDismissContractPrompt(): void {
    this.activeModal.set(null);
  }

  protected closeContractPanel(): void {
    this.activeModal.set(null);
  }

  protected async onAcceptAmendment(contractId: string): Promise<void> {
    this.isContractSubmitting.set(true);
    const dto = await firstValueFrom(this.chatService.acceptAmendment(contractId));
    this.activeContract.set(adaptContract(dto));
    this.isContractSubmitting.set(false);
  }

  protected async onRequestAmendment(event: {
    contractId: string;
    newTerms: string;
  }): Promise<void> {
    this.isContractSubmitting.set(true);
    const dto = await firstValueFrom(this.chatService.declineAmendment(event.contractId));
    this.activeContract.set(adaptContract(dto));
    this.isContractSubmitting.set(false);
  }

  protected onSignContract(_value: ContractSignatureFormValue): void {
    // TODO: wire when backend confirms sign endpoint
  }

  protected onProceedToPayment(_contractId: string): void {
    this.activeModal.set(null);
  }
}