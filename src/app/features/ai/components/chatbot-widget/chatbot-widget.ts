import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { timer } from 'rxjs';

interface ChatMessage {
  readonly text: string;
  readonly sender: 'bot' | 'user';
  readonly time: string;
}

@Component({
  selector: 'app-chatbot-widget',
  imports: [NgOptimizedImage],
  templateUrl: './chatbot-widget.html',
  styleUrl: './chatbot-widget.css',
})
export class ChatbotWidget {

  /* =============================================
     STATE
     ============================================= */
  readonly isOpen = signal(false);
  readonly userInput = signal('');

  readonly suggestedQuestions: readonly string[] = [
    'كيف بإمكاني بيع فائضي؟',
    'كيفية البحث عن خامة؟',
    'كيف تتم عملية التعاقد؟',
  ] as const;

  readonly messages = signal<ChatMessage[]>([
    {
      text: 'مرحباً! 👋\nأنا مساعد فايض الذكي، هنا لمساعدتك في أي استفسار حول البيع والشراء والدفع والعقود في فايض.\nاختر من الأسئلة الشائعة أو اكتب سؤالك.',
      sender: 'bot',
      time: this.getCurrentTime(),
    },
  ]);

  /* =============================================
     WINDOW ACTIONS
     ============================================= */
  toggleChat(): void {
    this.isOpen.update(v => !v);
  }

  closeChat(): void {
    this.isOpen.set(false);
  }

  /* =============================================
     MESSAGE ACTIONS
     ============================================= */
  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.userInput.set(value);
  }

  sendMessage(text?: string): void {
    const messageText = text ?? this.userInput();
    if (!messageText.trim()) return;

    this.messages.update(msgs => [
      ...msgs,
      { text: messageText, sender: 'user', time: this.getCurrentTime() },
    ]);

    this.userInput.set('');

    timer(800).subscribe(() => {
      this.messages.update(msgs => [
        ...msgs,
        {
          text: 'شكراً على سؤالك! سيتم الرد عليك قريباً من فريق الدعم.',
          sender: 'bot',
          time: this.getCurrentTime(),
        },
      ]);
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  /* =============================================
     HELPERS
     ============================================= */
  private getCurrentTime(): string {
    return new Date().toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}