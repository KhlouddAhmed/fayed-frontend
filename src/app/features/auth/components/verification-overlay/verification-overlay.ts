import { Component, input, output } from '@angular/core';
 
import { ExtractedCompanyData } from '../../models/registration.models';
import { NgOptimizedImage } from '@angular/common';
 
@Component({
  selector: 'app-verification-overlay',
  imports: [NgOptimizedImage],
  templateUrl: './verification-overlay.html',
  styleUrl: './verification-overlay.css',
})
export class VerificationOverlay {
  status = input.required<'pending' | 'success' | 'failed'>();
 
  pendingTitle = input<string>('جار التحقق');
  pendingSubtitle = input<string>('نقوم الان بمراجعة بياناتك');
 
  successTitle = input<string>('تم التحقق بنجاح');
  successSubtitle = input<string>('');
  extractedData = input<ExtractedCompanyData | null>(null);
 
  failedTitle = input<string>('تعذر التحقق');
  failedSubtitle = input<string>('');
  rejectionReasons = input<readonly string[]>([]);
 
  readonly confirmCorrect = output<void>();
  readonly reportIncorrect = output<void>();
  readonly retry = output<void>();
  readonly contactSupport = output<void>();
}