import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, EscrowOrder, RefundProfitTransaction, LedgerRecord } from './orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-payments.html',
  styleUrls: ['./orders-payments.css']
})
export class OrdersComponent implements OnInit {
  private ordersService = inject(OrdersService);

  // تم التعديل لتفتح على 'all' بشكل افتراضي
  activeTab = signal<'all' | 'escrow' | 'refunds' | 'history'>('all');

  // الإشارات اللي هتشيل الداتا
  orders = signal<EscrowOrder[]>([]);
  transactions = signal<RefundProfitTransaction[]>([]);
  historyRecords = signal<LedgerRecord[]>([]);

  isLoading = signal<boolean>(false);
  isReleasing = signal<boolean>(false);

  ngOnInit() {
    this.fetchOrders(); // جلب الطلبات أول ما الشاشة تفتح
  }

  setTab(tab: 'all' | 'escrow' | 'refunds' | 'history') {
    this.activeTab.set(tab);
    
    // جلب الداتا ديناميكياً حسب التابة
    if ((tab === 'all' || tab === 'escrow') && this.orders().length === 0) {
      this.fetchOrders();
    } else if (tab === 'refunds' && this.transactions().length === 0) {
      this.fetchRefunds();
    } else if (tab === 'history' && this.historyRecords().length === 0) {
      this.fetchLedger();
    }
  }

  fetchOrders() {
    this.isLoading.set(true);
    this.ordersService.getEscrowOrders().subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Data) this.orders.set(res.Data);
        this.isLoading.set(false);
      },
      error: (err) => { console.error('خطأ:', err); this.isLoading.set(false); }
    });
  }

  fetchRefunds() {
    this.isLoading.set(true);
    this.ordersService.getRefundsProfits().subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Data) this.transactions.set(res.Data);
        this.isLoading.set(false);
      },
      error: (err) => { console.error('خطأ:', err); this.isLoading.set(false); }
    });
  }

  fetchLedger() {
    this.isLoading.set(true);
    this.ordersService.getLedger().subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Data) this.historyRecords.set(res.Data);
        this.isLoading.set(false);
      },
      error: (err) => { console.error('خطأ:', err); this.isLoading.set(false); }
    });
  }

  releaseFunds(orderId: number) {
    this.isReleasing.set(true);
    this.ordersService.releaseEscrow(orderId).subscribe({
      next: (res) => {
        if (res.IsSuccess) {
          // تحديث حالة الطلب في الشاشة بدون ريفريش
          this.orders.update(orders => 
            orders.map(o => o.orderId === orderId ? { ...o, escrowStatus: 'released' } : o)
          );
        }
        this.isReleasing.set(false);
      },
      error: (err) => {
        console.error('خطأ في الإفراج:', err);
        this.isReleasing.set(false);
      }
    });
  }

  // دوال مساعدة لترجمة الحالات
  getDeliveryStatusText(status: string): string {
    const statuses: Record<string, string> = { 'shipping': 'قيد الشحن', 'delivered': 'تم التسليم', 'preparing': 'قيد التجهيز', 'dispute': 'نزاع مفتوح' };
    return statuses[status.toLowerCase()] || status;
  }

  getFinancialStatusText(status: string): string {
    const statuses: Record<string, string> = { 'held': 'محتجز', 'released': 'تم الإفراج', 'suspended': 'معلق' };
    return statuses[status.toLowerCase()] || status;
  }
}