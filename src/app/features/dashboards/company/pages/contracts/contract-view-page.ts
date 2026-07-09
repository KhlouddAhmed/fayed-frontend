import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ContractService } from '../../services/contract.service';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { AuthStateService } from '../../../../../core/services/auth-state.service';
import { ToastService } from '../../../../../core/services/toast.service';

/**
 * صفحة العقد (للطرفين):
 * - المورد أثناء ContractReview: يقبل العقد أو يرفضه مع ذكر السبب.
 * - المشتري بعد قبول المورد (PaymentPending): زر دفع العربون.
 * - عند الرفض يظهر سبب المورد ويمكن للمشتري تعديل العقد وإعادة تقديمه أو مواصلة المحادثة.
 */
@Component({
  selector: 'app-contract-view-page',
  imports: [DatePipe, DecimalPipe, PercentPipe, LoadingSkeleton, ErrorState],
  templateUrl: './contract-view-page.html',
  styleUrl: './contracts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractViewPage {
  private readonly contractService = inject(ContractService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authState = inject(AuthStateService);
  private readonly toast = inject(ToastService);

  protected readonly orderId = Number(this.route.snapshot.paramMap.get('orderId'));

  protected readonly contractResource = resource({
    loader: async () => firstValueFrom(this.contractService.getContract(this.orderId)),
  });

  protected readonly isSubmitting = signal(false);
  protected readonly showDeclineModal = signal(false);
  protected readonly declineReason = signal('');

  private readonly currentUserId = computed(() =>
    Number(this.authState.currentUser()?.id ?? 0)
  );

  protected readonly isBuyer = computed(
    () => this.contractResource.value()?.buyer.userId === this.currentUserId()
  );

  protected readonly isSeller = computed(
    () => this.contractResource.value()?.seller.userId === this.currentUserId()
  );

  /** المورد يراجع العقد المقدَّم (statusCode = ContractReview) */
  protected readonly canReview = computed(() => {
    const contract = this.contractResource.value();
    return !!contract && this.isSeller() && contract.statusCode === 'ContractReview';
  });

  /** المشتري يدفع العربون بعد توقيع المورد (statusCode = PaymentPending) */
  protected readonly canPay = computed(() => {
    const contract = this.contractResource.value();
    return (
      !!contract &&
      this.isBuyer() &&
      contract.statusCode === 'PaymentPending' &&
      !contract.isDownPaymentPaid
    );
  });

  /** العقد مرفوض من المورد والمشتري يستطيع تعديله وإعادة تقديمه */
  protected readonly canEditAfterDecline = computed(() => {
    const contract = this.contractResource.value();
    return (
      !!contract &&
      this.isBuyer() &&
      contract.statusCode === 'InProgress' &&
      !!contract.declineReason
    );
  });

  /** قبول المورد للعقد → PaymentPending + إشعار contract_accepted للمشتري */
  protected async onAccept(): Promise<void> {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    try {
      await firstValueFrom(this.contractService.acceptContract(this.orderId));
      this.toast.success('تم قبول العقد — في انتظار دفع العربون من المشتري');
      this.contractResource.reload();
    } catch (err: unknown) {
      const backendMessage = (err as { error?: { message?: string } })?.error?.message;
      this.toast.error(backendMessage || 'تعذر قبول العقد. حاول مرة أخرى.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected openDeclineModal(): void {
    this.declineReason.set('');
    this.showDeclineModal.set(true);
  }

  protected closeDeclineModal(): void {
    this.showDeclineModal.set(false);
  }

  /** رفض المورد مع السبب → إشعار contract_declined للمشتري ويمكنه التعديل أو مواصلة المحادثة */
  protected async onDecline(): Promise<void> {
    const reason = this.declineReason().trim();
    if (!reason || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    try {
      await firstValueFrom(
        this.contractService.declineContract(this.orderId, { reason })
      );
      this.toast.warning('تم رفض العقد وإخطار المشتري بالسبب');
      this.showDeclineModal.set(false);
      this.contractResource.reload();
    } catch (err: unknown) {
      const backendMessage = (err as { error?: { message?: string } })?.error?.message;
      this.toast.error(backendMessage || 'تعذر رفض العقد. حاول مرة أخرى.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected goToPayment(): void {
    this.router.navigate(['/dashboard/company/payment', this.orderId]);
  }

  protected goToEditForm(): void {
    this.router.navigate(['/dashboard/company/contracts', this.orderId, 'form']);
  }

  protected goToMessages(): void {
    this.router.navigate(['/dashboard/company/messages']);
  }

  protected goToOrders(): void {
    this.router.navigate(['/dashboard/company/orders']);
  }
}
