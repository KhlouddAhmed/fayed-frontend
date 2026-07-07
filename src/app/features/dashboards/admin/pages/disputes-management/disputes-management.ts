import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisputesService, DisputeListItem, DisputeDetails } from './disputes.service';

@Component({
  selector: 'app-disputes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disputes-management.html',
  styleUrls: ['./disputes-management.css']
})
export class DisputesComponent implements OnInit {
  private disputesService = inject(DisputesService);

  activeTab = signal<'open' | 'investigating' | 'closed'>('open');
  
  // الإشارات الخاصة بالبيانات
  allDisputes = signal<DisputeListItem[]>([]);
  selectedDispute = signal<DisputeDetails | null>(null);

  // حالات التحميل
  isLoadingList = signal<boolean>(true);
  isLoadingDetails = signal<boolean>(false);
  isResolving = signal<boolean>(false);
  isSendingMessage = signal<boolean>(false);

  // إشارات للتحكم في نافذة إنهاء النزاع (Modal)
  showResolveModal = signal<boolean>(false);
  resolveNotesText = signal<string>('');
  pendingDecision = signal<string>('');

  // حساب عدد القضايا لكل تابة ديناميكياً
  openCount = computed(() => this.allDisputes().filter(d => d.status.toLowerCase() === 'open').length);
  investigatingCount = computed(() => this.allDisputes().filter(d => d.status.toLowerCase() === 'investigating').length);
  closedCount = computed(() => this.allDisputes().filter(d => d.status.toLowerCase() === 'closed').length);

  // فلترة القضايا المعروضة بناءً على التابة النشطة
  filteredDisputes = computed(() => {
    return this.allDisputes().filter(d => d.status.toLowerCase() === this.activeTab());
  });

  ngOnInit(): void {
    this.fetchDisputes();
  }

  fetchDisputes(): void {
    this.isLoadingList.set(true);
    this.disputesService.getAllDisputes().subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Data) {
          this.allDisputes.set(res.Data);
        }
        this.isLoadingList.set(false);
      },
      error: (err) => {
        console.error('فشل جلب النزاعات:', err);
        this.isLoadingList.set(false);
      }
    });
  }

  setTab(tab: 'open' | 'investigating' | 'closed') {
    this.activeTab.set(tab);
    this.selectedDispute.set(null); // تفريغ الشات عند تغيير التاب
  }

  selectDispute(disputeId: number) {
    this.isLoadingDetails.set(true);
    this.selectedDispute.set(null);

    this.disputesService.getDisputeDetails(disputeId).subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Data) {
          this.selectedDispute.set(res.Data);
        }
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        console.error('فشل جلب تفاصيل النزاع:', err);
        this.isLoadingDetails.set(false);
      }
    });
  }

  // -----------------------------------------------------
  // دوال إنهاء النزاع (Modal Logic)
  // -----------------------------------------------------

  // الدالة اللي الزرار بيناديها لفتح المودال وتخزين القرار مؤقتاً
  submitResolution(decision: string) {
    const active = this.selectedDispute();
    if (!active) return;

    this.pendingDecision.set(decision);
    this.resolveNotesText.set('');
    this.showResolveModal.set(true);
  }

  // تحديث الملاحظات أثناء الكتابة
  updateNotes(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.resolveNotesText.set(input.value);
  }

  // قفل المودال
  closeResolveModal() {
    this.showResolveModal.set(false);
    this.pendingDecision.set('');
    this.resolveNotesText.set('');
  }

  // تأكيد القرار من داخل المودال والاتصال بالخادم
  confirmResolution() {
    const active = this.selectedDispute();
    const decision = this.pendingDecision();
    if (!active || !decision) return;

    // لو الأدمن مكتبش ملاحظات، نبعت جملة افتراضية عشان الباك إند ميزعلش
    const notes = this.resolveNotesText().trim() || 'تم إنهاء النزاع بناءً على مراجعة الإدارة بدون ملاحظات إضافية.';

    this.isResolving.set(true);
    
    // إرسال القرار والملاحظات للسيرفر
    this.disputesService.resolveDispute(active.disputeId, decision, notes).subscribe({
      next: () => {
        this.isResolving.set(false);
        this.closeResolveModal(); // قفل المودال
        this.fetchDisputes();     // تحديث الجدول
        this.setTab('closed');    // نقل الأدمن لتابة المنتهية
      },
      error: (err) => {
        console.error('فشل اتخاذ القرار:', err);
        alert('حدث خطأ أثناء إنهاء النزاع. يرجى مراجعة اتصال الخادم.');
        this.isResolving.set(false);
      }
    });
  }

  // -----------------------------------------------------
  // دالة إرسال رسالة في الشات
  // -----------------------------------------------------

  sendMessage(inputElement: HTMLInputElement) {
    const text = inputElement.value.trim();
    const active = this.selectedDispute();
    
    if (!text || !active) return;

    this.isSendingMessage.set(true);
    this.disputesService.sendMessage(active.disputeId, text).subscribe({
      next: () => {
        // تفريغ مربع النص بعد الإرسال بنجاح
        inputElement.value = '';
        this.isSendingMessage.set(false);
        
        // إعادة جلب تفاصيل النزاع عشان الشات يتعمل له Refresh وتظهر رسالتك الجديدة فوراً
        this.selectDispute(active.disputeId); 
      },
      error: (err) => {
        console.error('فشل إرسال الرسالة:', err);
        this.isSendingMessage.set(false);
      }
    });
  }
}