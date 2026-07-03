import { Component, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class PaymentComponent {
  // متغيرات الخطوات
  currentStep = signal<'agreement' | 'card' | 'confirm'>('agreement');
  
  // متغيرات الـ Checkboxes
  isAgreed = signal<boolean>(false);
  isDataConfirmed = signal<boolean>(false);
  isTermsAgreed = signal<boolean>(false);
  
  // متغيرات الباك إند والـ Modal
  isProcessing = signal<boolean>(false);
  showSuccessModal = signal<boolean>(false);

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

  submitFinalDeposit() {
    if (this.isDataConfirmed() && this.isTermsAgreed()) {
      this.isProcessing.set(true);
      // محاكاة الاتصال بالباك إند
      setTimeout(() => {
        this.isProcessing.set(false);
        this.showSuccessModal.set(true);
      }, 1500);
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
    console.log('توجيه لصفحة التفاصيل...');
  }

  returnToChat() {
    console.log('العودة للمحادثة...');
  }
}