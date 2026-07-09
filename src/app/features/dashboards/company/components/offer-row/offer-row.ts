import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Offer } from '../../models/rfq-offer.model';
import { StatusBadge, StatusBadgeVariant } from '../../../../../shared/components/status-badge/status-badge';

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
  selector: 'app-offer-row',
  imports: [StatusBadge],
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
