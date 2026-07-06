import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { RegistrationStepper, RegistrationStepNumber } from '../../components/registration-stepper/registration-stepper';
import { AccountDetailsStep } from './steps/account-details-step/account-details-step';
import { UploadDocumentsStep, DocumentVerificationState } from './steps/upload-documents-step/upload-documents-step';
import { IdentityVerificationStep } from './steps/identity-verification-step/identity-verification-step';
import { VerificationOverlay } from '../../components/verification-overlay/verification-overlay';
import { RegistrationSuccessModal } from '../../components/registration-success-modal/registration-success-modal';
import { RegistrationService } from '../../services/registration.service';
import {
  ExtractedCompanyData,
  KybExtractedData,
  RegisterRequestDto,
  VerificationStatus,
} from '../../models/registration.models';

@Component({
  selector: 'app-register-page',
  imports: [
    RouterLink,
    NgOptimizedImage,
    RegistrationStepper,
    AccountDetailsStep,
    UploadDocumentsStep,
    IdentityVerificationStep,
    VerificationOverlay,
    RegistrationSuccessModal,
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private readonly router = inject(Router);
  private readonly registrationService = inject(RegistrationService);

  currentStep      = signal<RegistrationStepNumber>(1);
  kybData          = signal<KybExtractedData | null>(null);
  showSuccessModal = signal(false);
  companyData      = signal<ExtractedCompanyData | null>(null);

  // DOCUMENT VERIFICATION STATE
  docVerificationStatus = signal<VerificationStatus>('idle');
  docExtractedData      = signal<KybExtractedData | null>(null);
  docRejectionReasons   = signal<readonly string[]>([]);

  onVerificationStateChanged(state: DocumentVerificationState): void {
    this.docVerificationStatus.set(state.status);
    this.docExtractedData.set(state.extractedData);
    this.docRejectionReasons.set(state.rejectionReasons);
  }

  onDocConfirmCorrect(): void {
    const data = this.docExtractedData();
    if (data) {
      this.kybData.set(data);
      this.docVerificationStatus.set('idle');
      this.currentStep.set(2);
    }
  }

  onDocReportIncorrect(): void {
    this.docVerificationStatus.set('idle');
  }

  onDocRetry(): void {
    this.docVerificationStatus.set('idle');
  }

  // STEP NAVIGATION
  onDocumentsUploaded(extractedData: KybExtractedData): void {
    this.kybData.set(extractedData);
    this.currentStep.set(2);
  }

  onIdentityConfirmed(): void {
    this.currentStep.set(3);
  }

  onAccountDetailsCompleted(request: RegisterRequestDto): void {
    this.registrationService.registerFactory(request).subscribe({
      next: () => {
        // بناء companyData من الـ request لعرضها في الـ modal
        this.companyData.set({
          companyName: request.FactoryName,
          ownerName: request.Name,
        });
        this.showSuccessModal.set(true);
      },
      error: () => {
        // error state handled inside AccountDetailsStep
      },
    });
  }

  onSuccessModalClosed(): void {
    this.showSuccessModal.set(false);
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    if (this.currentStep() === 1) {
      this.router.navigate(['/']);
      return;
    }
    this.currentStep.update(step => (step - 1) as RegistrationStepNumber);
  }
}