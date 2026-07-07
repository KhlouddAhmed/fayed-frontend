import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

// 1. الداتا الخاصة بالجدول
export interface PendingKybData {
  caseId: number;
  requestNumber: string;
  companyName: string;
  commercialRegistryNo: string;
  taxCardNo: string;
  submittedDate: string;
}

// 2. الداتا الخاصة بالتفاصيل (اللي بتتعرض جوه المراجعة)
export interface KybDetailsData {
  caseId: number;
  companyName: string;
  commercialRegistryNo: string;
  taxCardNo: string;
  address: string;
  sector: string;
  documents: { documentType: string; fileUrl: string }[];
  aiConfidenceScore: number;
  aiRecommendation: string;
  aiMismatches: string;
}

@Component({
  selector: 'app-kyb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kyb-verification.html',
  styleUrls: ['./kyb-verification.css']
})
export class KybComponent implements OnInit {
  private http = inject(HttpClient);

  activeTab = signal<'pending' | 'reviewed'>('pending');
  
  // الإشارات الخاصة بالبيانات
  kybRequests = signal<PendingKybData[]>([]);
  selectedDetails = signal<KybDetailsData | null>(null);
  
  // الإشارات الخاصة بحالة التحميل
  isLoadingTable = signal<boolean>(true);
  isLoadingDetails = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  hasError = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchPendingRequests();
  }

  // جلب طلبات الجدول
  fetchPendingRequests(): void {
    this.isLoadingTable.set(true);
    this.hasError.set(false);

    this.http.get<ApiResponseWithData<PendingKybData[]>>(`${environment.apiUrl}/Admin/pending-kyb`)
      .subscribe({
        next: (response) => {
          if (response.IsSuccess && response.Data) {
            this.kybRequests.set(response.Data);
          } else {
            this.hasError.set(true);
          }
          this.isLoadingTable.set(false);
        },
        error: (err) => {
          console.error('فشل في جلب الطلبات:', err);
          this.kybRequests.set([]);
          this.hasError.set(true);
          this.isLoadingTable.set(false);
        }
      });
  }

  // فتح تابة المراجعة وجلب التفاصيل الحقيقية
  reviewRequest(caseId: number) {
    this.activeTab.set('reviewed');
    this.isLoadingDetails.set(true);
    
    this.http.get<ApiResponseWithData<KybDetailsData>>(`${environment.apiUrl}/Admin/kyb-details/${caseId}`)
      .subscribe({
        next: (response) => {
          if (response.IsSuccess && response.Data) {
            this.selectedDetails.set(response.Data);
          }
          this.isLoadingDetails.set(false);
        },
        error: (err) => {
          console.error('فشل في جلب التفاصيل:', err);
          this.isLoadingDetails.set(false);
        }
      });
  }

  // التنقل بين التابات
  setTab(tab: 'pending' | 'reviewed') {
    this.activeTab.set(tab);
    if (tab === 'pending') {
      this.selectedDetails.set(null); // تفريغ الشاشة عند الرجوع للجدول
    }
  }

  // إرسال قرار الأدمن (POST)
// إشارات للتحكم في النافذة المنبثقة للرفض
  showRejectModal = signal<boolean>(false);
  rejectReasonText = signal<string>('');

  // 1. الدالة اللي الزرار بيناديها من الشاشة الرئيسية
  submitDecision(isApproved: boolean) {
    const details = this.selectedDetails();
    if (!details) return;

    if (!isApproved) {
      // لو رفض، نفتح المودال ونوقف التنفيذ هنا
      this.rejectReasonText.set('');
      this.showRejectModal.set(true);
      return;
    }

    // لو قبول، نكمل للباك إند علطول (بدون سبب رفض)
    this.executeDecision(true, '');
  }

  // 2. تحديث نص الرفض أثناء الكتابة
  updateReason(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.rejectReasonText.set(input.value);
  }

  // 3. قفل المودال
  closeRejectModal() {
    this.showRejectModal.set(false);
    this.rejectReasonText.set('');
  }

  // 4. تأكيد الرفض من داخل المودال
  confirmRejection() {
    const reason = this.rejectReasonText().trim();
    if (!reason) {
      alert('يرجى كتابة سبب الرفض ليتمكن المستخدم من تصحيحه.');
      return;
    }
    this.executeDecision(false, reason);
  }

  // 5. التنفيذ الفعلي والاتصال بالباك إند
  private executeDecision(isApproved: boolean, reason: string) {
    const details = this.selectedDetails();
    if (!details) return;

    this.isSubmitting.set(true);
    const payload = { isApproved: isApproved, rejectionReason: reason };

    this.http.post(`${environment.apiUrl}/Admin/kyb-decision/${details.caseId}`, payload)
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          if (!isApproved) this.closeRejectModal(); // نقفل المودال لو كان رفض
          
          this.fetchPendingRequests(); // نحدث الجدول
          this.setTab('pending');      // نرجع لشاشة الجدول
        },
        error: (err) => {
          console.error('خطأ في إرسال القرار:', err);
          this.isSubmitting.set(false);
        }
      });
  }
}