import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ContractService } from '../../services/contract.service';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { ToastService } from '../../../../../core/services/toast.service';

/**
 * نموذج العقد (للمشتري):
 * الحقول الثابتة (بيانات الطرفين + البنود الجزائية + النسب المالية) تأتي من الباك إند،
 * والحقول القابلة للتعديل (الكمية، سعر الوحدة، تاريخ التسليم، عنوان التسليم) يعدلها المشتري
 * ثم يقدم العقد لمراجعة المورد.
 */
@Component({
  selector: 'app-contract-form-page',
  imports: [DecimalPipe, PercentPipe, LoadingSkeleton, ErrorState],
  templateUrl: './contract-form-page.html',
  styleUrl: './contracts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContractFormPage {
  private readonly contractService = inject(ContractService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly orderId = Number(this.route.snapshot.paramMap.get('orderId'));

  protected readonly formResource = resource({
    loader: async () => firstValueFrom(this.contractService.getForm(this.orderId)),
  });

  // الحقول القابلة للتعديل
  protected readonly quantity = signal<number>(0);
  protected readonly pricePerUnit = signal<number>(0);
  protected readonly deliveryDate = signal<string>('');
  protected readonly deliveryAddress = signal<string>('');

  protected readonly isSubmitting = signal(false);

  constructor() {
    // تعبئة الحقول من قيم الباك إند (المأخوذة من العرض المبدئي المقبول)
    effect(() => {
      const form = this.formResource.value();
      if (!form) return;
      this.quantity.set(form.agreedQuantity);
      this.pricePerUnit.set(form.agreedPricePerUnit);
      this.deliveryDate.set(form.deliveryDate?.substring(0, 10) ?? '');
      this.deliveryAddress.set(form.deliveryAddress ?? '');
    });
  }

  // الحسابات المالية تتغير مباشرة مع تعديل الكمية/السعر
  protected readonly totalPrice = computed(() => this.quantity() * this.pricePerUnit());

  protected readonly downPayment = computed(() => {
    const form = this.formResource.value();
    return form ? this.totalPrice() * form.downPaymentPercentage : 0;
  });

  protected readonly platformCommission = computed(() => {
    const form = this.formResource.value();
    return form ? this.totalPrice() * form.commissionRate : 0;
  });

  protected readonly sellerPayout = computed(
    () => this.downPayment() - this.platformCommission()
  );

  protected readonly isFormValid = computed(
    () =>
      this.quantity() > 0 &&
      this.pricePerUnit() > 0 &&
      !!this.deliveryDate() &&
      this.deliveryAddress().trim().length > 0
  );

  /** تقديم العقد → ContractReview → إشعار contract_generated للمورد لمراجعته */
  protected async onSubmit(): Promise<void> {
    if (!this.isFormValid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    try {
      await firstValueFrom(
        this.contractService.submitContract(this.orderId, {
          agreedQuantity: this.quantity(),
          agreedPricePerUnit: this.pricePerUnit(),
          deliveryDate: new Date(this.deliveryDate()).toISOString(),
          deliveryAddress: this.deliveryAddress().trim(),
        })
      );
      this.toast.success('تم تقديم العقد بنجاح — في انتظار مراجعة المورد');
      await this.router.navigate(['/dashboard/company/contracts', this.orderId]);
    } catch (err: unknown) {
      const backendMessage = (err as { error?: { message?: string } })?.error?.message;
      this.toast.error(backendMessage || 'تعذر تقديم العقد. حاول مرة أخرى.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/dashboard/company/messages']);
  }
}
