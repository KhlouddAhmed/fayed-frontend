import { Component, inject, resource, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ContractService } from '../dashboards/company/services/contract.service';
import { PaymentChargeResponse } from '../dashboards/company/models/contract.model';
import { ToastService } from '../../core/services/toast.service';

/**
 * صفحة دفع العربون:
 * 1) تجلب ملخص الدفع من GET /api/orders/{orderId}/contract/payment-summary
 * 2) تدفع ببطاقة مباشرة عبر POST /api/payments/charge/{orderId}
 * 3) عند النجاح: حالة الطلب تصبح "قيد التجهيز" ويُخطر المورد بدفع العربون
 */
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class PaymentComponent {
  private readonly contractService = inject(ContractService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  /** رقم الطلب من المسار payment/:contractId (نفس orderId في الباك إند) */
  protected readonly orderId = Number(this.route.snapshot.paramMap.get('contractId'));

  /** ملخص الدفع الحقيقي (قيمة الصفقة، العربون، العمولة...) */
  protected readonly summaryResource = resource({
    loader: async () => firstValueFrom(this.contractService.getPaymentSummary(this.orderId)),
  });

  // متغيرات الخطوات
  currentStep = signal<'agreement' | 'card' | 'confirm'>('agreement');

  // متغيرات الـ Checkboxes
  isAgreed = signal<boolean>(false);
  isDataConfirmed = signal<boolean>(false);
  isTermsAgreed = signal<boolean>(false);

  // متغيرات الباك إند والـ Modal
  isProcessing = signal<boolean>(false);
  showSuccessModal = signal<boolean>(false);
  paymentResult = signal<PaymentChargeResponse | null>(null);

  paymentForm: FormGroup;

  constructor(private fb: FormBuilder, private location: Location, private router: Router) {
    this.paymentForm = this.fb.group({
      // رقم الفيزا: لازم يكون 16 رقم + 3 مسافات (الإجمالي 19)
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
      // اسم الحامل
      cardHolder: ['', [Validators.required, Validators.minLength(3)]],
      // التاريخ: رقمين ثم / ثم رقمين
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      // الـ CVV: من 3 لـ 4 أرقام
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  // ==========================================
  // دوال الفورمات التلقائي (محدثة عشان متضربش)
  // ==========================================

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    // مسح أي حروف أو مسافات قديمة وترك الأرقام فقط
    let value = input.value.replace(/\D/g, '');

    // تقسيم الأرقام لمجموعات رباعية ووضع مسافة بينها
    let formatted = value.replace(/(.{4})/g, '$1 ').trim();

    // التحديث في الفورم وفي الـ View مباشرة عشان الـ Cursor ميبوظش
    this.paymentForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  formatExpiry(event: Event) {
    const input = event.target as HTMLInputElement;
    // مسح أي شيء غير الأرقام
    let value = input.value.replace(/\D/g, '');

    let formatted = value;
    // إضافة الـ / بعد أول رقمين
    if (value.length > 2) {
      formatted = value.substring(0, 2) + '/' + value.substring(2, 4);
    }

    // التحديث السلس
    this.paymentForm.get('expiry')?.setValue(formatted, { emitEvent: false });
    input.value = formatted;
  }

  // ==========================================
  // دوال التحكم والتنقل
  // ==========================================

  // دالة فحص الأخطاء لقلب الحقل للون الأحمر
  isInvalid(controlName: string): boolean {
    const control = this.paymentForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  toggleAgreement(event: Event) {
    this.isAgreed.set((event.target as HTMLInputElement).checked);
  }

  toggleDataConfirm(event: Event) {
    this.isDataConfirmed.set((event.target as HTMLInputElement).checked);
  }

  toggleTermsAgreed(event: Event) {
    this.isTermsAgreed.set((event.target as HTMLInputElement).checked);
  }

  proceedToPayment() {
    if (this.isAgreed()) this.currentStep.set('card');
  }

  confirmPayment() {
    this.paymentForm.markAllAsTouched();
    if (this.paymentForm.valid) {
      this.currentStep.set('confirm');
    }
  }

  /** الدفع الفعلي عبر POST /api/payments/charge/{orderId} */
  async submitFinalDeposit(): Promise<void> {
    const summary = this.summaryResource.value();
    if (!summary || !this.isDataConfirmed() || !this.isTermsAgreed() || this.isProcessing()) {
      return;
    }

    this.isProcessing.set(true);
    try {
      const result = await firstValueFrom(
        this.contractService.chargePayment(this.orderId, {
          cardHolderName: String(this.paymentForm.get('cardHolder')?.value ?? '').trim(),
          // الباك إند يتوقع 16 رقماً بدون مسافات
          cardNumber: String(this.paymentForm.get('cardNumber')?.value ?? '').replace(/\s/g, ''),
          expiryDate: String(this.paymentForm.get('expiry')?.value ?? ''),
          cvv: String(this.paymentForm.get('cvv')?.value ?? ''),
          // المبلغ يجب أن يطابق downPaymentAmount من ملخص الدفع
          amount: summary.downPaymentAmount,
        })
      );
      this.paymentResult.set(result);
      this.showSuccessModal.set(true);
    } catch (err: unknown) {
      const backendMessage = (err as { error?: { message?: string } })?.error?.message;
      this.toast.error(backendMessage || 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  cancelPayment() {
    this.location.back();
  }

  goBack() {
    if (this.currentStep() === 'confirm') this.currentStep.set('card');
    else if (this.currentStep() === 'card') this.currentStep.set('agreement');
    else this.location.back();
  }

  goToOrderDetails() {
    this.router.navigate(['/dashboard/company/orders'], {
      queryParams: { orderId: String(this.orderId) },
    });
  }

  returnToChat() {
    this.router.navigate(['/dashboard/company/messages']);
  }

  openContractPdf() {
    const url = this.paymentResult()?.contractPdfUrl;
    if (url) {
      window.open(url, '_blank', 'noopener');
    }
  }
}
