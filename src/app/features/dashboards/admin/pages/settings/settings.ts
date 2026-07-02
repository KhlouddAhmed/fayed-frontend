import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

type SettingsTab = 'commissions' | 'gateways' | 'systemLog';

// واجهة بيانات سجل النظام
interface SystemLog {
  time: string;
  user: string;
  action: string;
  ip: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {
  activeTab = signal<SettingsTab>('commissions');
  
  commissionsForm: FormGroup;
  gatewaysForm: FormGroup;

  isSaving = signal<boolean>(false); 
  isSavingGateways = signal<boolean>(false);

  // داتا سجل النظام الوهمية
  systemLogs = signal<SystemLog[]>([
    { time: '[01:01:34]', user: 'أحمد (مشرف):', action: 'تعديل بوابة الدفع: فوري', ip: '197.34.12.98' },
    { time: '[01:01:34]', user: 'أحمد (مشرف):', action: 'تعديل بوابة الدفع: فوري', ip: '197.34.12.98' },
    { time: '[01:01:34]', user: 'أحمد (مشرف):', action: 'تعديل بوابة الدفع: فوري', ip: '197.34.12.98' },
    { time: '[10:15:45]', user: 'النظام:', action: 'إنشاء ملف نزاع تلقائي للطلب 1048-ORD', ip: '127.0.0.1' },
    { time: '[09:58:30]', user: 'خالد (مشرف):', action: 'تعديل قائمة بوابات الدفع - فوري كاش', ip: '197.34.15.22' },
    { time: '[09:12:05]', user: 'أحمد (مشرف):', action: 'إيقاف حساب كريم ممدوح (USR-204)', ip: '197.34.12.98' }
  ]);

  constructor(private fb: FormBuilder) {
    this.commissionsForm = this.fb.group({
      metals: [3.5], plastics: [5], paper: [4], chemicals: [4.5], others: [5]
    });

    this.gatewaysForm = this.fb.group({
      fawryEnabled: [false], fawryMerchantId: ['FAWRY-7829-10'],
      paymobEnabled: [true], paymobSecretKey: ['pk_live_********************'],
      bankName: ['البنك الأهلي المصري'], iban: ['EG1200030000000001234567890']
    });
  }

  ngOnInit() {
    const savedCommissions = localStorage.getItem('mockCommissions');
    if (savedCommissions) this.commissionsForm.patchValue(JSON.parse(savedCommissions));

    const savedGateways = localStorage.getItem('mockGateways');
    if (savedGateways) this.gatewaysForm.patchValue(JSON.parse(savedGateways));
  }

  setTab(tab: SettingsTab) {
    this.activeTab.set(tab);
  }

  saveCommissions() {
    if (this.commissionsForm.valid) {
      this.isSaving.set(true); 
      setTimeout(() => {
        localStorage.setItem('mockCommissions', JSON.stringify(this.commissionsForm.value));
        this.isSaving.set(false); 
      }, 1500);
    }
  }

  saveGateways() {
    if (this.gatewaysForm.valid) {
      this.isSavingGateways.set(true); 
      setTimeout(() => {
        localStorage.setItem('mockGateways', JSON.stringify(this.gatewaysForm.value));
        this.isSavingGateways.set(false); 
      }, 1500);
    }
  }

  // ---------------- دوال سجل النظام ----------------
  clearLogs() {
    this.systemLogs.set([]); // مسح السجل
  }

  downloadLogs() {
    // تجهيز الداتا كملف نصي (TXT)
    const logsText = this.systemLogs().map(log => 
      `${log.time} ${log.user} ${log.action} - IP: ${log.ip}`
    ).join('\n');
    
    const blob = new Blob(['\uFEFF' + logsText], { type: 'text/plain;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `System_Log_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}