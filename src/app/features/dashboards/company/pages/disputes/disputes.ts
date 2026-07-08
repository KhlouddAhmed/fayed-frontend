import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DisputeService } from '../../services/dispute.service';
import { adaptCreateDisputeRequest } from '../../adapters/dispute.adapter';
import { CreateDisputeRequest, Dispute, NegotiationMessage } from '../../models/dispute.model';
import { DisputeRow } from '../../components/dispute-row/dispute-row';
import { DisputeDetailSection } from '../../components/dispute-detail-section/dispute-detail-section';
import { DisputeCreateModal } from '../../components/dispute-create-modal/dispute-create-modal';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-disputes',
  imports: [DatePipe, DisputeRow, DisputeDetailSection, DisputeCreateModal, LoadingSkeleton, ErrorState, EmptyState],
  templateUrl: './disputes.html',
  styleUrl: './disputes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Disputes {
  private readonly disputeService = inject(DisputeService);

  protected readonly currentDate = new Date();
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly disputes = signal<readonly Dispute[]>([]);
  protected readonly selectedDisputeId = signal<string | null>(null);
  protected readonly isCreateModalOpen = signal(false);
  protected readonly isSubmittingDispute = signal(false);

  // Signals لتغطية سجل المحادثات والمفاوضات الخاصة بالنزاع المفتوح
  protected readonly negotiationMessages = signal<readonly NegotiationMessage[]>([]);
  protected readonly isNegotiationLoading = signal(false);
  protected readonly negotiationError = signal(false);

  protected readonly selectedDispute = computed(() => {
    const id = this.selectedDisputeId();
    return this.disputes().find(d => d.id === id) ?? null;
  });

  constructor() {
    this.loadDisputes();
  }

  protected onToggleDetails(disputeId: string): void {
    this.selectedDisputeId.update(current => current === disputeId ? null : disputeId);
  }

  protected onOpenCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  protected onCloseCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  protected onCreateDispute(request: CreateDisputeRequest): void {
    this.isSubmittingDispute.set(true);
    const dto = adaptCreateDisputeRequest(request);

    this.disputeService.create(dto).subscribe({
      next: () => {
        this.isSubmittingDispute.set(false);
        this.isCreateModalOpen.set(false);
        this.loadDisputes();
      },
      error: () => {
        this.isSubmittingDispute.set(false);
      },
    });
  }

  protected reload(): void {
    this.loadDisputes();
  }

  private loadDisputes(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.disputeService.getAll().subscribe({
      next: (dtos) => {
        this.disputes.set(dtos); 
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}