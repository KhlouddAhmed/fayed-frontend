import { ChangeDetectionStrategy, Component, computed, inject, resource, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { adaptOffers } from '../../adapters/rfq-offer.adapter';
import { RFQ_OFFER_REPOSITORY } from '../../services/rfq-offer-repository.token';
import { OfferRow } from '../../components/offer-row/offer-row';
import { OfferDetailModal } from '../../components/offer-detail-modal/offer-detail-modal';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../../../../core/services/toast.service';

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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  protected readonly offersResource = resource({
    loader: async () => adaptOffers(await this.repository.getAll()),
  });

  protected readonly currentDate = new Date();
  protected readonly activeTab = signal<OfferTab>(
    this.route.snapshot.queryParamMap.get('tab') === 'received' ? 'received' : 'sent'
  );
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

  /** المورد يقبل العرض المبدئي → الباك إند يفتح محادثة التفاوض ويرجع chatId */
  protected async onAccept(offerId: string): Promise<void> {
    this.isSubmitting.set(true);
    try {
      const result = await this.repository.accept(Number(offerId));
      this.toast.success('تم قبول العرض وفتح محادثة التفاوض مع المشتري');
      this.closeModal();
      this.offersResource.reload();
      if (result.chatId != null) {
        await this.router.navigate(['/dashboard/company/messages'], {
          queryParams: { chatId: String(result.chatId) },
        });
      }
    } catch {
      this.toast.error('تعذر قبول العرض. حاول مرة أخرى.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async onReject(offerId: string): Promise<void> {
    this.isSubmitting.set(true);
    try {
      await this.repository.reject(Number(offerId));
      this.toast.success('تم رفض العرض وإخطار المشتري');
      this.closeModal();
      this.offersResource.reload();
    } catch {
      this.toast.error('تعذر رفض العرض. حاول مرة أخرى.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async onWithdraw(offerId: string): Promise<void> {
    this.isSubmitting.set(true);
    try {
      await this.repository.withdraw(Number(offerId));
      this.toast.success('تم سحب العرض بنجاح');
      this.closeModal();
      this.offersResource.reload();
    } catch {
      this.toast.error('تعذر سحب العرض. العروض المعلقة فقط يمكن سحبها.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /** فتح محادثة التفاوض لعرض مقبول */
  protected onOpenChat(chatId: number): void {
    this.router.navigate(['/dashboard/company/messages'], {
      queryParams: { chatId: String(chatId) },
    });
  }
}
