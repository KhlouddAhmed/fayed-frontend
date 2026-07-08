import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Conversation, Message } from '../../models/messages.model';
import { AuthStateService } from '../../../../../core/services/auth-state.service';

@Component({
  selector: 'app-message-thread',
  templateUrl: './message-thread.html',
  styleUrl: './message-thread.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageThread {
  private readonly authState = inject(AuthStateService);

  readonly conversation = input.required<Conversation>();
  readonly messages = input.required<readonly Message[]>();
  readonly isSending = input<boolean>(false);

  readonly sendMessage = output<string>();
  readonly startContract = output<void>();

  protected readonly inputText = signal('');

  protected isOwnMessage(senderCode: string): boolean {
    return senderCode === this.authState.currentUser()?.id;
  }

  protected onSend(): void {
    const content = this.inputText().trim();
    if (!content) return;
    this.sendMessage.emit(content);
    this.inputText.set('');
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSend();
    }
  }
}