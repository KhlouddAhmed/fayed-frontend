import { Component, signal } from '@angular/core';

// 1. واجهة الطلبات (للتاب الأول والثاني)
interface Order {
  id: string;
  buyer: string;
  seller: string;
  value: string;
  date: string;
  deliveryStatus: 'shipping' | 'delivered' | 'preparing' | 'dispute';
  financialStatus: 'held' | 'released' | 'suspended';
}

// 2. واجهة المعاملات المالية (للتاب الثالث)
interface Transaction {
  id: string;
  beneficiary: string;
  type: 'profit' | 'refund';
  amount: string;
  gateway: string;
  isProcessed: boolean;
}

// 3. واجهة سجل المعاملات (للتاب الرابع الجديد)
interface HistoryRecord {
  movementId: string;
  orderId: string;
  totalValue: string;
  commission: string;
  paymentMethod: string;
  dateTime: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders-payments.html',
  styleUrls: ['./orders-payments.css']
})
export class OrdersComponent {
  activeTab = signal<'all' | 'escrow' | 'refunds' | 'history'>('history');


  orders = signal<Order[]>([
    { id: 'ORD-1045', buyer: 'السويدي للمحولات', seller: 'النحاس المصرية', value: '36,000 ج.م', date: '2026-06-01', deliveryStatus: 'shipping', financialStatus: 'held' },
    { id: 'ORD-1046', buyer: 'الصناعات الغذائية الحديثة', seller: 'بلاستيك الإسكندرية', value: '48,000 ج.م', date: '2026-06-03', deliveryStatus: 'delivered', financialStatus: 'released' },
    { id: 'ORD-1047', buyer: 'العربية للتعبئة', seller: 'الورق الوطنية', value: '84,000 ج.م', date: '2026-06-04', deliveryStatus: 'preparing', financialStatus: 'held' },
    { id: 'ORD-1048', buyer: 'مصر للإنشاءات', seller: 'العالمية للحديد', value: '120,000 ج.م', date: '2026-06-06', deliveryStatus: 'dispute', financialStatus: 'suspended' }
  ]);


  transactions = signal<Transaction[]>([
    { id: 'TXN-9021', beneficiary: 'مصنع مصر للبلاستيك', type: 'profit', amount: '24,000 ج.م', gateway: 'كارت ائتمان البنك الأهلي', isProcessed: false },
    { id: 'TXN-9022', beneficiary: 'مصنع مصر للبلاستيك', type: 'refund', amount: '24,000 ج.م', gateway: 'كارت ائتمان البنك الأهلي', isProcessed: false }, 
    { id: 'TXN-9023', beneficiary: 'مصنع مصر للبلاستيك', type: 'profit', amount: '24,000 ج.م', gateway: 'كارت ائتمان البنك الأهلي', isProcessed: false }
  ]);


  historyRecords = signal<HistoryRecord[]>([
    { movementId: 'PAY-7829-AB', orderId: 'ORD-1042', totalValue: '15,000 ج.م', commission: '750 ج.م (5.0%)', paymentMethod: 'تحويل مباشر', dateTime: '2026-06-02 09:30' },
    { movementId: 'PAY-7829-AB', orderId: 'ORD-1042', totalValue: '15,000 ج.م', commission: '750 ج.م (5.0%)', paymentMethod: 'تحويل مباشر', dateTime: '2026-06-02 09:30' },
    { movementId: 'PAY-7829-AB', orderId: 'ORD-1042', totalValue: '15,000 ج.م', commission: '750 ج.م (5.0%)', paymentMethod: 'تحويل مباشر', dateTime: '2026-06-02 09:30' },
    { movementId: 'PAY-7829-AB', orderId: 'ORD-1042', totalValue: '15,000 ج.م', commission: '750 ج.م (5.0%)', paymentMethod: 'تحويل مباشر', dateTime: '2026-06-02 09:30' }
  ]);

  setTab(tab: 'all' | 'escrow' | 'refunds' | 'history') {
    this.activeTab.set(tab);
  }

  getDeliveryStatusText(status: string): string {
    const statuses: Record<string, string> = { 'shipping': 'قيد الشحن', 'delivered': 'تم التسليم', 'preparing': 'قيد التجهيز', 'dispute': 'نزاع مفتوح' };
    return statuses[status] || status;
  }

  getFinancialStatusText(status: string): string {
    const statuses: Record<string, string> = { 'held': 'محتجز', 'released': 'تم الإفراج', 'suspended': 'معلق' };
    return statuses[status] || status;
  }

  releaseFunds(id: string) {
    this.orders.update(orders => orders.map(o => o.id === id ? { ...o, financialStatus: 'released' } : o));
  }

  processTransaction(id: string) {
    this.transactions.update(txns => txns.map(t => t.id === id ? { ...t, isProcessed: true } : t));
  }
}