import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService, SystemLog } from './settings.service';

type SettingsTab = 'commissions' | 'gateways' | 'systemLog';

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

  activeTab = signal<SettingsTab>('commissions');
  
  commissionsForm: FormGroup;
  gatewaysForm: FormGroup;

  isSaving = signal<boolean>(false); 
  isSavingGateways = signal<boolean>(false);
  isLoadingLogs = signal<boolean>(false);
  
  systemLogs = signal<SystemLog[]>([]);

  constructor() {
    this.commissionsForm = this.fb.group({
      metals: [3.5], plastics: [5], paper: [4], chemicals: [4.5], others: [5]
    });

    this.gatewaysForm = this.fb.group({
      isFawryEnabled: [false], fawryMerchantId: [''],
      isPaymobEnabled: [false], paymobSecretKey: [''],
      bankName: [''], bankIban: ['']
    });
  }

  ngOnInit() {
    // استرجاع العمولات من اللوكال ستوريدج (لحين توفر API)
    const savedCommissions = localStorage.getItem('mockCommissions');
    if (savedCommissions) this.commissionsForm.patchValue(JSON.parse(savedCommissions));
  }

  setTab(tab: SettingsTab) {
    this.activeTab.set(tab);
    
    // جلب الداتا الخاصة بالتاب عند فتحه
    if (tab === 'gateways') {
      this.fetchGateways();
    } else if (tab === 'systemLog' && this.systemLogs().length === 0) {
      this.fetchSystemLogs();
    }
  }

  // ---------------- دوال بوابات الدفع ----------------
  fetchGateways() {
    this.settingsService.getPaymentSettings().subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Data) {
          this.gatewaysForm.patchValue(res.Data);
        }
      },
      error: (err) => console.error('خطأ في جلب بوابات الدفع:', err)
    });
  }

  saveGateways() {
    if (this.gatewaysForm.valid) {
      this.isSavingGateways.set(true);
      this.settingsService.updatePaymentSettings(this.gatewaysForm.value).subscribe({
        next: (res) => {
          if (res.IsSuccess) alert('تم حفظ إعدادات الدفع بنجاح!');
          this.isSavingGateways.set(false);
        },
        error: (err) => {
          console.error('خطأ في الحفظ:', err);
          this.isSavingGateways.set(false);
        }
      });
    }
  }

  saveCommissions() {
    if (this.commissionsForm.valid) {
      this.isSaving.set(true);
      setTimeout(() => {
        localStorage.setItem('mockCommissions', JSON.stringify(this.commissionsForm.value));
        this.isSaving.set(false); 
      }, 1000);
    }
  }

  // ---------------- دوال سجل النظام ----------------
  fetchSystemLogs() {
    this.isLoadingLogs.set(true);
    this.settingsService.getSystemLogs().subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Data) this.systemLogs.set(res.Data);
        this.isLoadingLogs.set(false);
      },
      error: (err) => { console.error('خطأ في جلب السجلات:', err); this.isLoadingLogs.set(false); }
    });
  }

  clearLogs() {
    if(confirm('هل أنت متأكد من مسح جميع سجلات النظام؟')) {
      this.settingsService.clearSystemLogs().subscribe({
        next: (res) => {
          if (res.IsSuccess) this.systemLogs.set([]);
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