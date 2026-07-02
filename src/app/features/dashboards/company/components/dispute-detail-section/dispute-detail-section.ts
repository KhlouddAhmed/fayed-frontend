import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Dispute, NegotiationMessage } from '../../models/dispute.model';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-dispute-detail-section',
  imports: [DatePipe, LoadingSkeleton, ErrorState, EmptyState],
  templateUrl: './dispute-detail-section.html',
  styleUrl: './dispute-detail-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisputeDetailSection {
  readonly dispute = input.required<Dispute>();
  readonly negotiationMessages = input<readonly NegotiationMessage[]>([]);
  readonly isLogLoading = input<boolean>(false);
  readonly logError = input<boolean>(false);
}