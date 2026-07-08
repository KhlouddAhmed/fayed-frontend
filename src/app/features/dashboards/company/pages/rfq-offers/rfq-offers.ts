import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { OffersService, RfqOffer } from './rfq-offers.service'; // تأكد إن ده اسم ملف السيرفيس بتاعك
import { OfferRow } from '../../components/offer-row/offer-row';
import { OfferDetailModal } from '../../components/offer-detail-modal/offer-detail-modal';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';

type OfferTab = 'sent' | 'received';

@Component({
  selector: 'app-rfq-offers',
  standalone: true,
  imports: [DatePipe, OfferRow, OfferDetailModal, LoadingSkeleton, ErrorState, EmptyState],
  templateUrl: './rfq-offers.html',
  styleUrl: './rfq-offers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfqOffers implements OnInit {
  private readonly offersService = inject(OffersService);

  // حالات الصفحة المستقرة
  isLoading = signal<boolean>(true);
  isError = signal<boolean>(false);
  offersData = signal<RfqOffer[]>([]);

  protected readonly currentDate = new Date();
  protected readonly activeTab = signal<OfferTab>('sent');
  protected readonly selectedOfferId = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);

  ngOnInit(): void {
    this.loadOffers();
  }

  // دالة جلب البيانات (بنناديها في البداية وبعد كل أكشن)
  loadOffers(): void {
    this.isLoading.set(true);
    this.isError.set(false);
    
    this.offersService.getAllOffers().subscribe({
      next: (data: RfqOffer[]) => {
        this.offersData.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('API Error:', err);
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  protected readonly filteredOffers = computed(() => {
    return this.offersData().filter((offer) => offer.direction === this.activeTab()) as any[];
  });

  
  protected readonly selectedOffer = computed(() => {
    const id = this.selectedOfferId();
    return (this.offersData().find((offer) => offer.id === id) as any) ?? null;
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

  protected onAccept(offerId: string): void {
    this.runAction(() => this.offersService.acceptOffer(offerId));
  }

  protected onReject(offerId: string): void {
    this.runAction(() => this.offersService.rejectOrCancelOffer(offerId));
  }

  protected onWithdraw(offerId: string): void {
    this.runAction(() => this.offersService.rejectOrCancelOffer(offerId));
  }

  protected onEditOffer(offerId: string): void {
    console.log('Navigate to edit offer:', offerId);
  }

  private runAction(actionObservable: () => any): void {
    this.isSubmitting.set(true);
    actionObservable().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        if (isSuccess || res.statusCode === 0) {
          this.closeModal();
          this.loadOffers(); // تحديث الجدول
        } else {
          alert(res.message || 'حدث خطأ أثناء تنفيذ العملية');
        }
        this.isSubmitting.set(false);
      },
      error: (err: any) => {
        console.error('API Error:', err);
        alert(err.error?.message || 'خطأ في الاتصال بالخادم');
        this.isSubmitting.set(false);
      }
    });
  }
}