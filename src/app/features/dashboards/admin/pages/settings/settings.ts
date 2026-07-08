import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from './settings.service';

// تم إزالة 'commissions'
type SettingsTab = 'gateways' | 'systemLog';

export interface SystemLogUI {
  logId: number;
  user: string;
  action: string;
  ip: string;
  time: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  // تم تعيين بوابات الدفع لتكون التابة الافتراضية
  activeTab = signal<SettingsTab>('gateways');
  
  gatewaysForm: FormGroup;

  isSavingGateways = signal<boolean>(false);
  isLoadingLogs = signal<boolean>(false);
  
  systemLogs = signal<SystemLogUI[]>([]);

  constructor() {
    this.gatewaysForm = this.fb.group({
      fawryEnabled: [false], fawryMerchantId: [''],
      paymobEnabled: [false], paymobSecretKey: [''],
      bankName: [''], iban: ['']
    });
  }

  ngOnInit() {
    // جلب بيانات بوابات الدفع فور فتح الصفحة
    this.fetchGateways();
  }

  setTab(tab: SettingsTab) {
    this.activeTab.set(tab);
    
    if (tab === 'gateways') {
      this.fetchGateways();
    } else if (tab === 'systemLog' && this.systemLogs().length === 0) {
      this.fetchSystemLogs();
    }
  }

  // ---------------- دوال بوابات الدفع ----------------
  fetchGateways() {
    this.settingsService.getPaymentSettings().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;
        if (isSuccess && data) {
          this.gatewaysForm.patchValue({
            fawryEnabled: data.isFawryEnabled,
            fawryMerchantId: data.fawryMerchantId,
            paymobEnabled: data.isPaymobEnabled,
            paymobSecretKey: data.paymobSecretKey,
            bankName: data.bankName,
            iban: data.bankIban
          });
        }
      },
      error: (err) => console.error('خطأ في جلب بوابات الدفع:', err)
    });
  }

  saveGateways() {
    if (this.gatewaysForm.valid) {
      this.isSavingGateways.set(true);
      
      const formVal = this.gatewaysForm.value;
      const payload = {
        isFawryEnabled: formVal.fawryEnabled,
        fawryMerchantId: formVal.fawryMerchantId,
        isPaymobEnabled: formVal.paymobEnabled,
        paymobSecretKey: formVal.paymobSecretKey,
        bankName: formVal.bankName,
        bankIban: formVal.iban
      };

      this.settingsService.updatePaymentSettings(payload).subscribe({
        next: (res: any) => {
          const isSuccess = res.IsSuccess ?? res.isSuccess;
          if (isSuccess) alert('تم حفظ إعدادات الدفع بنجاح!');
          this.isSavingGateways.set(false);
        },
        error: (err) => {
          console.error('خطأ في الحفظ:', err);
          this.isSavingGateways.set(false);
        }
      });
    }
  }

  // ---------------- دوال سجل النظام ----------------
  fetchSystemLogs() {
    this.isLoadingLogs.set(true);
    this.settingsService.getSystemLogs().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;
        if (isSuccess && data) {
          const mappedLogs = data.map((log: any) => ({
            logId: log.logId,
            user: log.adminName,
            action: log.action,
            ip: log.ipAddress,
            time: log.time
          }));
          this.systemLogs.set(mappedLogs);
        }
        this.isLoadingLogs.set(false);
      },
      error: (err) => { console.error('خطأ في جلب السجلات:', err); this.isLoadingLogs.set(false); }
    });
  }

  clearLogs() {
    if(confirm('هل أنت متأكد من مسح جميع سجلات النظام؟')) {
      this.settingsService.clearSystemLogs().subscribe({
        next: (res: any) => {
          const isSuccess = res.IsSuccess ?? res.isSuccess;
          if (isSuccess) this.systemLogs.set([]);
        },
        error: (err) => alert('الباك إند حالياً يواجه مشكلة 500 في هذه الخدمة.')
      });
    }
  }

  downloadLogs() {
    this.settingsService.downloadSystemLogs().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `System_Logs_${new Date().getTime()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => alert('الباك إند حالياً يواجه مشكلة 500 في هذه الخدمة.')
    });
  }
}