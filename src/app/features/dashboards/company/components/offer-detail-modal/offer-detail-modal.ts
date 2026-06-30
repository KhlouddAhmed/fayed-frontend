import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Offer } from '../../models/rfq-offer.model';
import { StatusBadge, StatusBadgeVariant } from '../../../../../shared/components/status-badge/status-badge';

interface OfferStatusConfig {
  readonly labelKey: string;
  readonly variant: StatusBadgeVariant;
}

const OFFER_STATUS_DISPLAY_MAP: Readonly<Record<string, OfferStatusConfig>> = {
  negotiating: { labelKey: 'قيد التفاوض', variant: 'warning' },
  awaitingResponse: { labelKey: 'بانتظار الرد', variant: 'warning' },
  accepted: { labelKey: 'مقبول', variant: 'info' },
  rejected: { labelKey: 'مرفوض', variant: 'danger' },
  completed: { labelKey: 'مكتمل', variant: 'success' },
};

@Component({
  selector: 'app-offer-detail-modal',
  imports: [StatusBadge, DatePipe],
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
  readonly editOffer = output<string>();

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

  protected onEditClick(): void {
    this.editOffer.emit(this.offer().id);
  }
}
