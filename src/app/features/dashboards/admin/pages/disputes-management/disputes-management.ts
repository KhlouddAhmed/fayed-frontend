import { Component, signal, computed } from '@angular/core';
interface ChatMessage {
  id: string;
  senderRole: 'buyer' | 'seller' | 'admin';
  senderName: string;
  text: string;
  time: string;
}

interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  issueSummary: string;
  status: 'open' | 'investigating' | 'closed';
  messages: ChatMessage[];
  finalDecision?: string;
  settlementDate?: string;
  moderator?: string;
}

@Component({
  selector: 'app-disputes',
  standalone: true,
  templateUrl: './disputes-management.html',
  styleUrls: ['./disputes-management.css']
})
export class DisputesComponent {
  activeTab = signal<'open' | 'investigating' | 'closed'>('open');
  
 
  selectedDispute = signal<Dispute | null>(null);

  
  disputes = signal<Dispute[]>([
    {
      id: 'DIS-102',
      orderId: 'ORD-1048',
      buyerName: 'مصر للإنشاءات',
      sellerName: 'العالمية للحديد',
      issueSummary: 'نقص في الكمية المستلمة بمقدار 2 طن',
      status: 'open',
      messages: [
        { id: 'm1', senderRole: 'buyer', senderName: 'المشتري (مصر للإنشاءات)', text: 'استلمنا الشحنة اليوم ولكن الوزن ناقص بمقدار 2 طن عن المتفق عليه في العرض.', time: '10:30' },
        { id: 'm2', senderRole: 'seller', senderName: 'البائع (العالمية للحديد)', text: 'قمنا بوزن البضاعة قبل خروجها من المصنع وكانت كاملة. ربما هناك مشكلة في الناقل.', time: '11:15' },
        { id: 'm3', senderRole: 'buyer', senderName: 'المشتري (مصر للإنشاءات)', text: 'لدينا بون الوزن من قبان معتمد. الرجاء تعويضنا عن النقص أو تعديل القيمة المالية.', time: '11:45' }
      ]
    },
    {
      id: 'DIS-103',
      orderId: 'ORD-1050',
      buyerName: 'العربية للتعبئة',
      sellerName: 'الورق الوطنية',
      issueSummary: 'جودة الورق غير مطابقة للمواصفات',
      status: 'open',
      messages: []
    },
    {
      id: 'DIS-104',
      orderId: 'ORD-1055',
      buyerName: 'السويدي للكابلات',
      sellerName: 'النحاس المصرية',
      issueSummary: 'تأخير في موعد التسليم لمدة 5 أيام',
      status: 'open',
      messages: []
    },
    {
      id: 'DIS-101', // كررت الـ ID زي الصورة للتوضيح
      orderId: 'ORD-1032',
      buyerName: 'سيراميك الفراعنة',
      sellerName: 'الرمال البيضاء',
      issueSummary: 'شحنة رمل غير مطابقة للمواصفات الفيزيائية',
      status: 'investigating',
      messages: []
    },
    {
      id: 'DIS-101', 
      orderId: 'ORD-1032',
      buyerName: 'سيراميك الفراعنة',
      sellerName: 'الرمال البيضاء',
      issueSummary: 'شحنة رمل غير مطابقة للمواصفات الفيزيائية',
      status: 'investigating',
      messages: []
    },
    {
      id: 'DIS-099',
      orderId: 'ORD-0987',
      buyerName: '', // مش محتاجينها في العرض هنا
      sellerName: '',
      issueSummary: '',
      status: 'closed',
      messages: [],
      finalDecision: 'تمت التسوية المالية',
      settlementDate: '2026-05-28',
      moderator: 'أحمد ممدوح (مشرف)'
    },
    {
      id: 'DIS-099',
      orderId: 'ORD-0987',
      buyerName: '', 
      sellerName: '',
      issueSummary: '',
      status: 'closed',
      messages: [],
      finalDecision: 'تمت التسوية المالية',
      settlementDate: '2026-05-28',
      moderator: 'أحمد ممدوح (مشرف)'
    }
  ]);


  filteredDisputes = computed(() => {
    return this.disputes().filter(d => d.status === this.activeTab());
  });


  setTab(tab: 'open' | 'investigating' | 'closed') {
    this.activeTab.set(tab);
    this.selectedDispute.set(null); // تفريغ الشات عند تغيير التاب
  }


  selectDispute(dispute: Dispute) {
    this.selectedDispute.set(dispute);
  }
}