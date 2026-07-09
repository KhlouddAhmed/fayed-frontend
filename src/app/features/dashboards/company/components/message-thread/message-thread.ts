import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Conversation, Message } from '../../models/messages.model';

@Component({
  selector: 'app-message-thread',
  templateUrl: './message-thread.html',
  styleUrl: './message-thread.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageThread {
  readonly conversation = input.required<Conversation>();
  readonly messages = input.required<readonly Message[]>();
  readonly isSending = input<boolean>(false);

  /** معرف المستخدم الحالي — لتمييز رسائلي عن رسائل الطرف الآخر */
  readonly currentUserId = input.required<number>();

  /** يظهر زر "إنشاء عقد" للمشتري فقط (بحسب buyerId في تفاصيل المحادثة) وطالما المحادثة مفتوحة */
  readonly canGenerateContract = input<boolean>(false);

  readonly sendMessage = output<string>();
  readonly startContract = output<void>();

  protected readonly inputText = signal('');

  protected isOwnMessage(senderId: number): boolean {
    return senderId === this.currentUserId();
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
