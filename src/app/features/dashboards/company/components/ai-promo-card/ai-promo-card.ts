import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-ai-promo-card',
  imports: [NgOptimizedImage],
  templateUrl: './ai-promo-card.html',
  styleUrl: './ai-promo-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiPromoCard {
  readonly startConversation = output<void>();

  protected onStartConversationClick(): void {
    this.startConversation.emit();
  }
}
