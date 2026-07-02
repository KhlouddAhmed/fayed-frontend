import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { adaptOffers } from '../../adapters/rfq-offer.adapter';
import { RFQ_OFFER_REPOSITORY } from '../../services/rfq-offer-repository.token';
import { OfferRow } from '../../components/offer-row/offer-row';
import { OfferDetailModal } from '../../components/offer-detail-modal/offer-detail-modal';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';
import { DatePipe } from '@angular/common';

type OfferTab = 'sent' | 'received';

@Component({
  selector: 'app-rfq-offers',
  imports: [DatePipe, OfferRow, OfferDetailModal, LoadingSkeleton, ErrorState, EmptyState],
  templateUrl: './rfq-offers.html',
  styleUrl: './rfq-offers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfqOffers {
  private readonly repository = inject(RFQ_OFFER_REPOSITORY);

  protected readonly offersResource = resource({
    loader: async () => adaptOffers(await this.repository.getAll()),
  });

  protected readonly currentDate = new Date();
  protected readonly activeTab = signal<OfferTab>('sent');
  protected readonly selectedOfferId = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly filteredOffers = computed(() => {
    const offers = this.offersResource.value() ?? [];
    return offers.filter((offer) => offer.direction === this.activeTab());
  });

  protected readonly selectedOffer = computed(() => {
    const id = this.selectedOfferId();
    return this.offersResource.value()?.find((offer) => offer.id === id) ?? null;
  });

  protected onTabChange(tab: OfferTab): void {
    this.activeTab.set(tab);
  }

  protected onViewDetails(offerId: string): void {
    this.selectedOfferId.set(offerId);
  }

  protected closeModal(): void {
    this.selectedOfferId.set(null);
  }

  protected async onAccept(offerId: string): Promise<void> {
    await this.runAction(() => this.repository.accept(offerId));
  }

  protected async onReject(offerId: string): Promise<void> {
    await this.runAction(() => this.repository.reject(offerId));
  }

  protected async onWithdraw(offerId: string): Promise<void> {
    await this.runAction(() => this.repository.withdraw(offerId));
  }

  protected onEditOffer(offerId: string): void {
    // TODO(rfq-offers): navigate to an edit-offer flow once that page/modal is defined.
  }

  private async runAction(action: () => Promise<unknown>): Promise<void> {
    this.isSubmitting.set(true);
    await action();
    this.isSubmitting.set(false);
    this.closeModal();
    this.offersResource.reload();
  }
}
