import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, ApiEscrowOrder, ApiRefundTransaction, ApiLedgerRecord } from './orders.service';

// واجهات العرض (UI Interfaces) لتطابق الـ HTML بالضبط
export interface OrderUI {
  dbId: number;
  id: string; 
  buyer: string;
  seller: string;
  value: string;
  date: string;
  deliveryStatus: string;
  financialStatus: string;
}

export interface TransactionUI {
  dbId: number;
  id: string;
  beneficiary: string;
  type: string;
  amount: string;
  gateway: string;
  isProcessed: boolean;
}

export interface LedgerUI {
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
  imports: [CommonModule],
  templateUrl: './orders-payments.html',
  styleUrls: ['./orders-payments.css']
})
export class OrdersComponent implements OnInit {
  private ordersService = inject(OrdersService);

  activeTab = signal<'all' | 'escrow' | 'refunds' | 'history'>('all');

  // الإشارات اللي هتشيل الداتا المجهزة للـ HTML
  orders = signal<OrderUI[]>([]);
  transactions = signal<TransactionUI[]>([]);
  historyRecords = signal<LedgerUI[]>([]);

  isLoading = signal<boolean>(false);
  isReleasing = signal<boolean>(false);

  ngOnInit() {
    this.fetchOrders(); 
  }

  setTab(tab: 'all' | 'escrow' | 'refunds' | 'history') {
    this.activeTab.set(tab);

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
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;

        if (isSuccess && data) {
          const mappedOrders = data.map((item: ApiEscrowOrder) => ({
            dbId: item.orderId,
            id: item.orderIdentifier,
            buyer: item.buyerCompanyName,
            seller: item.sellerCompanyName,
            value: item.contractValue ? `${item.contractValue.toLocaleString()} ج.م` : '0 ج.م',
            date: item.contractDate,
            deliveryStatus: item.deliveryStatus,
            financialStatus: item.escrowStatus
          }));
          this.orders.set(mappedOrders);
        }
        this.isLoading.set(false);
      },
      error: (err) => { console.error('خطأ:', err); this.isLoading.set(false); }
    });
  }

  fetchRefunds() {
    this.isLoading.set(true);
    this.ordersService.getRefundsProfits().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;

        if (isSuccess && data) {
          const mappedTxns = data.map((item: ApiRefundTransaction) => ({
            dbId: item.transactionId,
            id: item.transactionIdentifier,
            beneficiary: item.beneficiaryName,
            type: item.transactionType,
            amount: item.amountText,
            gateway: item.paymentGateway,
            isProcessed: false // افتراضي لحين تأكيد التحويل
          }));
          this.transactions.set(mappedTxns);
        }
        this.isLoading.set(false);
      },
      error: (err) => { console.error('خطأ:', err); this.isLoading.set(false); }
    });
  }

  fetchLedger() {
    this.isLoading.set(true);
    this.ordersService.getLedger().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;

        if (isSuccess && data) {
          const mappedLedger = data.map((item: ApiLedgerRecord) => ({
            movementId: item.transactionIdentifier,
            orderId: item.orderIdentifier,
            totalValue: item.totalValueText,
            commission: item.commissionText,
            paymentMethod: item.paymentMethod,
            dateTime: item.dateTimeText
          }));
          this.historyRecords.set(mappedLedger);
        }
        this.isLoading.set(false);
      },
      error: (err) => { console.error('خطأ:', err); this.isLoading.set(false); }
    });
  }

  // دالة الإفراج اليدوي (تستخدم المعرف النصي للبحث عن الرقمي)
  releaseFunds(displayId: string) {
    const targetOrder = this.orders().find(o => o.id === displayId);
    if (!targetOrder) return;

    this.isReleasing.set(true);
    this.ordersService.releaseEscrow(targetOrder.dbId).subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        if (isSuccess) {
          this.orders.update(orders => 
            orders.map(o => o.id === displayId ? { ...o, financialStatus: 'released' } : o)
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

  // دالة تأكيد التحويل
  processTransaction(displayId: string) {
    const targetTxn = this.transactions().find(t => t.id === displayId);
    if (!targetTxn) return;

    this.ordersService.processRefund(targetTxn.dbId).subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        if (isSuccess) {
          this.transactions.update(txns => 
            txns.map(t => t.id === displayId ? { ...t, isProcessed: true } : t)
          );
        }
      },
      error: (err) => { console.error('خطأ في المعالجة:', err); }
    });
  }

  getDeliveryStatusText(status: string): string {
    if(!status) return 'غير محدد';
    const statuses: Record<string, string> = { 'shipping': 'قيد الشحن', 'delivered': 'تم التسليم', 'preparing': 'قيد التجهيز', 'dispute': 'نزاع مفتوح' };
    return statuses[status.toLowerCase()] || status;
  }

  getFinancialStatusText(status: string): string {
    if(!status) return 'غير محدد';
    const statuses: Record<string, string> = { 'held': 'محتجز', 'released': 'تم الإفراج', 'suspended': 'معلق' };
    return statuses[status.toLowerCase()] || status;
  }
}