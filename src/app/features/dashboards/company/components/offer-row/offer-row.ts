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
  selector: 'app-offer-row',
  imports: [StatusBadge, DatePipe],
  templateUrl: './offer-row.html',
  styleUrl: './offer-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferRow {
  readonly offer = input.required<Offer>();
  readonly viewDetails = output<string>();

  protected readonly statusMap = OFFER_STATUS_DISPLAY_MAP;

  protected onViewDetailsClick(): void {
    this.viewDetails.emit(this.offer().id);
  }
}
