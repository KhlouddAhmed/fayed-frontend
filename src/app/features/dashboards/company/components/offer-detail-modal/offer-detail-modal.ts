import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Offer } from '../../models/rfq-offer.model';
import { StatusBadgeVariant } from '../../../../../shared/components/status-badge/status-badge';

interface OfferStatusConfig {
  readonly labelKey: string;
  readonly variant: StatusBadgeVariant;
}

const OFFER_STATUS_DISPLAY_MAP: Readonly<Record<string, OfferStatusConfig>> = {
  pending: { labelKey: 'بانتظار الرد', variant: 'warning' },
  accepted: { labelKey: 'مقبول', variant: 'success' },
  rejected: { labelKey: 'مرفوض', variant: 'danger' },
  withdrawn: { labelKey: 'مسحوب', variant: 'info' },
};

@Component({
  selector: 'app-offer-detail-modal',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './offer-detail-modal.html',
  styleUrl: './offer-detail-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferDetailModal {
  readonly offer = input.required<Offer>();
  readonly isSubmitting = input<boolean>(false);

  readonly close = output<void>();
  readonly accept = output<string>();
  readonly reject = output<string>();
  readonly withdraw = output<string>();
  readonly openChat = output<number>();

  protected readonly statusMap = OFFER_STATUS_DISPLAY_MAP;

  protected onAcceptClick(): void {
    this.accept.emit(this.offer().id);
  }

  protected onRejectClick(): void {
    this.reject.emit(this.offer().id);
  }

  protected onWithdrawClick(): void {
    this.withdraw.emit(this.offer().id);
  }

  protected onOpenChatClick(): void {
    const chatId = this.offer().chatId;
    if (chatId != null) {
      this.openChat.emit(chatId);
    }
  }
}
