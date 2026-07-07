import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisputesService, ApiDisputeListItem, ApiDisputeDetails } from './disputes.service';

// الواجهة اللي الـ HTML بيقرا منها عشان مابنغيرش تصميمه
export interface DisputeUI {
  dbId: number;
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  issueSummary: string;
  status: string;
  finalDecision: string;
  settlementDate: string;
  moderator: string;
}

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
  
  // الإشارات الخام من الـ API
  private rawDisputes = signal<ApiDisputeListItem[]>([]);
  private rawSelectedDispute = signal<ApiDisputeDetails | null>(null);

  // إشارات التحميل والنوافذ
  isLoadingList = signal<boolean>(true);
  isLoadingDetails = signal<boolean>(false);
  isResolving = signal<boolean>(false);
  isSendingMessage = signal<boolean>(false);

  showResolveModal = signal<boolean>(false);
  resolveNotesText = signal<string>('');
  pendingDecision = signal<string>('');

  // 1. إعادة تشكيل الداتا (Mapping) لـ List النزاعات
  mappedDisputes = computed(() => {
    return this.rawDisputes().map(d => ({
      dbId: d.disputeId,
      id: d.disputeIdentifier,
      orderId: d.orderIdentifier,
      buyerName: d.buyerName,
      sellerName: d.sellerName,
      issueSummary: d.reason,
      status: d.status,
      finalDecision: d.resolutionDecision,
      settlementDate: d.resolutionDate,
      moderator: d.mediatorName
    }));
  });

  // فلترة حسب التابة النشطة
  filteredDisputes = computed(() => {
    return this.mappedDisputes().filter(d => d.status.toLowerCase() === this.activeTab());
  });

  // 2. إعادة تشكيل تفاصيل النزاع المختار (Chat & Details)
  selectedDispute = computed(() => {
    const details = this.rawSelectedDispute();
    if (!details) return null;
    
    return {
      dbId: details.disputeId,
      id: details.disputeIdentifier,
      orderId: details.orderIdentifier,
      issueSummary: details.description,
      messages: details.chatMessages.map((m, index) => ({
        id: index, 
        senderName: m.senderName,
        senderRole: m.senderRole,
        text: m.messageText,
        time: m.time
      }))
    };
  });

  // حساب أرقام البادجات ديناميكياً
  openCount = computed(() => this.mappedDisputes().filter(d => d.status.toLowerCase() === 'open').length);
  investigatingCount = computed(() => this.mappedDisputes().filter(d => d.status.toLowerCase() === 'investigating').length);
  closedCount = computed(() => this.mappedDisputes().filter(d => d.status.toLowerCase() === 'closed').length);

  ngOnInit(): void {
    this.fetchDisputes();
  }

  fetchDisputes(): void {
    this.isLoadingList.set(true);
    this.disputesService.getAllDisputes().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;
        if (isSuccess && data) {
          this.rawDisputes.set(data);
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
    this.rawSelectedDispute.set(null); // قفل الشات عند تغيير التاب
  }

  selectDispute(dbId: number) {
    this.isLoadingDetails.set(true);
    this.rawSelectedDispute.set(null);
    this.disputesService.getDisputeDetails(dbId).subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;
        if (isSuccess && data) {
          this.rawSelectedDispute.set(data);
        }
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        console.error('فشل جلب تفاصيل النزاع:', err);
        this.isLoadingDetails.set(false);
      }
    });
  }

  submitResolution(decision: string) {
    const active = this.selectedDispute();
    if (!active) return;

    this.pendingDecision.set(decision);
    this.resolveNotesText.set('');
    this.showResolveModal.set(true);
  }

  updateNotes(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.resolveNotesText.set(input.value);
  }

  closeResolveModal() {
    this.showResolveModal.set(false);
    this.pendingDecision.set('');
    this.resolveNotesText.set('');
  }

  confirmResolution() {
    const active = this.selectedDispute();
    const decision = this.pendingDecision();
    if (!active || !decision) return;

    const notes = this.resolveNotesText().trim() || 'تم إنهاء النزاع بناءً على مراجعة الإدارة بدون ملاحظات إضافية.';

    this.isResolving.set(true);
    this.disputesService.resolveDispute(active.dbId, decision, notes).subscribe({
      next: () => {
        this.isResolving.set(false);
        this.closeResolveModal();
        this.fetchDisputes(); 
        this.setTab('closed'); 
      },
      error: (err) => {
        console.error('فشل اتخاذ القرار:', err);
        alert('حدث خطأ أثناء إنهاء النزاع. يرجى مراجعة اتصال الخادم.');
        this.isResolving.set(false);
      }
    });
  }

  sendMessage(inputElement: HTMLInputElement) {
    const text = inputElement.value.trim();
    const active = this.selectedDispute();
    
    if (!text || !active) return;

    this.isSendingMessage.set(true);
    this.disputesService.sendMessage(active.dbId, text).subscribe({
      next: () => {
        inputElement.value = '';
        this.isSendingMessage.set(false);
        this.selectDispute(active.dbId); // ريفريش للشات
      },
      error: (err) => {
        console.error('فشل إرسال الرسالة:', err);
        this.isSendingMessage.set(false);
      }
    });
  }
}