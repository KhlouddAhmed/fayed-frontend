import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Contract, Conversation, ContractSignatureFormValue, Message } from '../../models/messages.model';
import { adaptContract, adaptConversations, adaptMessages } from '../../adapters/messages.adapter';
import { MESSAGES_REPOSITORY } from '../../services/messages-repository.token';
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
export class Messages {
  private readonly repository = inject(MESSAGES_REPOSITORY);

  protected readonly currentDate = new Date();

  protected readonly conversationsResource = resource({
    loader: async () => adaptConversations(await this.repository.getConversations()),
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
    return adaptMessages(await this.repository.getMessages(id));
  },
});

  protected readonly activeConversation = computed<Conversation | null>(() => {
    const id = this.activeConversationId();
    return this.conversationsResource.value()?.find((c) => c.id === id) ?? null;
  });

  protected async onSelectConversation(id: string): Promise<void> {
    this.activeConversationId.set(id);
  }

  protected async onSendMessage(content: string): Promise<void> {
    const id = this.activeConversationId();
    if (!id) return;
    this.isSending.set(true);
    await this.repository.sendMessage(id, content);
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
    const dto = await this.repository.createContract(id);
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
    const dto = await this.repository.acceptAmendment(contractId);
    this.activeContract.set(adaptContract(dto));
    this.isContractSubmitting.set(false);
  }

  protected async onRequestAmendment(event: { contractId: string; newTerms: string }): Promise<void> {
    this.isContractSubmitting.set(true);
    const dto = await this.repository.requestAmendment(event.contractId, event.newTerms);
    this.activeContract.set(adaptContract(dto));
    this.isContractSubmitting.set(false);
  }

  protected async onSignContract(value: ContractSignatureFormValue): Promise<void> {
    const contract = this.activeContract();
    if (!contract) return;
    this.isContractSubmitting.set(true);
    const dto = await this.repository.signContract(contract.id, value.authorizedName);
    this.activeContract.set(adaptContract(dto));
    this.isContractSubmitting.set(false);
  }

  protected onProceedToPayment(): void {
    // TODO(escrow): navigate to escrow checkout page
    this.activeModal.set(null);
  }
}
