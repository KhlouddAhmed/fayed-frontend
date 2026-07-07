import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KybService, ApiPendingKyb, ApiKybDetails } from './kyb.service';

@Component({
  selector: 'app-kyb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kyb-verification.html',
  styleUrls: ['./kyb-verification.css']
})
export class KybComponent implements OnInit {
  private kybService = inject(KybService);
  
  activeTab = signal<'pending' | 'reviewed'>('pending');
  
  private rawKybRequests = signal<ApiPendingKyb[]>([]);
  private rawSelectedDetails = signal<ApiKybDetails | null>(null);

  isLoadingTable = signal<boolean>(true);
  isLoadingDetails = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // إعداد بيانات الجدول
  kybRequests = computed(() => {
    return this.rawKybRequests().map(req => ({
      id: req.requestNumber,
      caseId: req.caseId,
      companyName: req.companyName,
      commercialRecord: req.commercialRegistryNo,
      taxNumber: req.taxCardNo,
      submissionDate: req.submittedDate
    }));
  });

  // إعداد بيانات التفاصيل (المراجعة)
  selectedRequest = computed(() => {
    const details = this.rawSelectedDetails();
    if (!details) return null;
    
    return {
      caseId: details.caseId,
      companyName: details.companyName,
      commercialRecord: details.commercialRegistryNo,
      taxNumber: details.taxCardNo,
      aiConfidenceScore: details.aiConfidenceScore,
      aiMismatches: details.aiMismatches, 
      documents: details.documents
    };
  });

  ngOnInit(): void {
    this.fetchPendingRequests();
  }

  fetchPendingRequests(): void {
    this.isLoadingTable.set(true);
    this.kybService.getPendingKyb().subscribe({
      next: (response: any) => {
        const isSuccess = response.IsSuccess ?? response.isSuccess;
        const data = response.Data ?? response.data;
        if (isSuccess && data) {
          this.rawKybRequests.set(data);
        }
        this.isLoadingTable.set(false);
      },
      error: (err) => {
        console.error('فشل في جلب الطلبات:', err);
        this.rawKybRequests.set([]);
        this.isLoadingTable.set(false);
      }
    });
  }

  reviewRequest(request: any) {
    this.activeTab.set('reviewed');
    this.isLoadingDetails.set(true);
    
    this.kybService.getKybDetails(request.caseId).subscribe({
      next: (response: any) => {
        const isSuccess = response.IsSuccess ?? response.isSuccess;
        const data = response.Data ?? response.data;
        if (isSuccess && data) {
          this.rawSelectedDetails.set(data);
        }
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        console.error('فشل في جلب التفاصيل:', err);
        this.isLoadingDetails.set(false);
      }
    });
  }

  setTab(tab: 'pending' | 'reviewed') {
    this.activeTab.set(tab);
    if (tab === 'pending') {
      this.rawSelectedDetails.set(null);
    }
  }

  // دالة تحميل المستند
  downloadDocument(fileUrl: string) {
    if (!fileUrl) {
      alert('رابط الملف غير متوفر');
      return;
    }
    window.open(fileUrl, '_blank');
  }

  // دالة إرسال القرار (القبول أو الرفض)
  submitDecision(isApproved: boolean) {
    const details = this.selectedRequest();
    if (!details) return;

    let rejectionReason = "";

    // لو القرار رفض، بنطلب من الأدمن يدخل السبب
    if (!isApproved) {
      const reasonInput = prompt('يرجى إدخال سبب الرفض:');
      if (reasonInput === null) return; // لو داس Cancel نوقف العملية
      if (reasonInput.trim() === '') {
        alert('يجب كتابة سبب الرفض لتوضيحه للمستخدم.');
        return;
      }
      rejectionReason = reasonInput.trim();
    }

    this.isSubmitting.set(true);
    
    // بناء الـ Payload المطابق لطلبك
    const payload = { 
      isApproved: isApproved, 
      rejectionReason: rejectionReason 
    };
    
    this.kybService.submitKybDecision(details.caseId, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.fetchPendingRequests(); // تحديث الجدول
        this.setTab('pending');      // العودة لصفحة الطلبات
      },
      error: (err) => {
        console.error('خطأ في إرسال القرار:', err);
        this.isSubmitting.set(false);
      }
    });
  }
}