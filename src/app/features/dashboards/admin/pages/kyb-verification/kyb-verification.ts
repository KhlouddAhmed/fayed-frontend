import { Component, signal } from '@angular/core';

interface KybRequest {
  id: string;
  companyName: string;
  commercialRecord: string;
  taxNumber: string;
  submissionDate: string;
}

@Component({
  selector: 'app-kyb',
  standalone: true,
  templateUrl: './kyb-verification.html',
  styleUrls: ['./kyb-verification.css']
})
export class KybComponent {
  activeTab = signal<'pending' | 'reviewed'>('pending');
  
  // 1. Signal لتخزين الشركة اللي تم اختيارها للمراجعة
  selectedRequest = signal<KybRequest | null>(null);

  kybRequests = signal<KybRequest[]>([
    { id: 'ORD-789', companyName: 'النصر للمنسوجات', commercialRecord: '101034829', taxNumber: '492-384-291', submissionDate: '2026-06-05' },
    { id: 'ORD-790', companyName: 'مصر للألومنيوم', commercialRecord: '101089201', taxNumber: '782-192-302', submissionDate: '2026-06-06' },
    { id: 'ORD-791', companyName: 'الشرقية للورق', commercialRecord: '101072938', taxNumber: '109-382-482', submissionDate: '2026-06-07' }
  ]);

  setTab(tab: 'pending' | 'reviewed') {
    this.activeTab.set(tab);
    // اختياري: لو رجعت للطلبات المعلقة، ممكن تفضي الشركة المختارة أو تسيبها زي ما تحب
    if (tab === 'pending') {
      this.selectedRequest.set(null); 
    }
  }

  // 2. دالة لاستقبال الشركة والانتقال لتاب المراجعة
  reviewRequest(request: KybRequest) {
    this.selectedRequest.set(request);
    this.activeTab.set('reviewed');
  }
}