import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { DISPUTE_REPOSITORY } from '../../services/dispute-repository.token';
import { adaptDisputes, adaptNegotiationMessages, adaptCreateDisputeRequest } from '../../adapters/dispute.adapter';
import { CreateDisputeRequest } from '../../models/dispute.model';
import { DisputeRow } from '../../components/dispute-row/dispute-row';
import { DisputeDetailSection } from '../../components/dispute-detail-section/dispute-detail-section';
import { DisputeCreateModal } from '../../components/dispute-create-modal/dispute-create-modal';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-disputes',
  imports: [ DatePipe, DisputeRow, DisputeDetailSection, DisputeCreateModal, LoadingSkeleton, ErrorState, EmptyState],
  templateUrl: './disputes.html',
  styleUrl: './disputes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Disputes {
  private readonly repository = inject(DISPUTE_REPOSITORY);

  protected readonly disputesResource = resource({
    loader: async () => adaptDisputes(await this.repository.getAll()),
  });

  protected readonly currentDate = new Date();

  protected readonly selectedDisputeId = signal<string | null>(null);
  protected readonly isCreateModalOpen = signal(false);
  protected readonly isSubmittingDispute = signal(false);

  protected readonly negotiationLogResource = resource({
    params: () => this.selectedDisputeId() ?? undefined,
    loader: async ({ params: disputeId }) =>
      adaptNegotiationMessages(await this.repository.getNegotiationLog(disputeId)),
  });

  protected readonly disputes = computed(() => this.disputesResource.value() ?? []);

  protected readonly selectedDispute = computed(() => {
    const id = this.selectedDisputeId();
    return this.disputes().find((dispute) => dispute.id === id) ?? null;
  });

  protected onToggleDetails(disputeId: string): void {
    this.selectedDisputeId.update((current) => (current === disputeId ? null : disputeId));
  }

  protected onOpenCreateModal(): void {
    this.isCreateModalOpen.set(true);
  }

  protected onCloseCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  protected async onCreateDispute(request: CreateDisputeRequest): Promise<void> {
    this.isSubmittingDispute.set(true);
    await this.repository.create(adaptCreateDisputeRequest(request));
    this.isSubmittingDispute.set(false);
    this.isCreateModalOpen.set(false);
    this.disputesResource.reload();
  }
}