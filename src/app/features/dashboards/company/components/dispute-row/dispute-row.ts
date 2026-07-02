import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Dispute } from '../../models/dispute.model';
import { StatusBadge } from '../../../../../shared/components/status-badge/status-badge';
import { DISPUTE_STATUS_BADGE_MAP } from '../../adapters/dispute.adapter';

@Component({
  selector: 'app-dispute-row',
  imports: [StatusBadge, DatePipe],
  templateUrl: './dispute-row.html',
  styleUrl: './dispute-row.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisputeRow {

  // INPUTS
  readonly dispute = input.required<Dispute>();
  readonly isActive = input<boolean>(false);

  // OUTPUTS
  readonly viewDetails = output<string>();

  // STATE
  protected readonly statusMap = DISPUTE_STATUS_BADGE_MAP;

  // METHODS
  protected onViewDetailsClick(): void {
    this.viewDetails.emit(this.dispute().id);
  }
}