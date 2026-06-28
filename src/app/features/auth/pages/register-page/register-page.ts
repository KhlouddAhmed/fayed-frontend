import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { RegistrationStepper, RegistrationStepNumber } from '../../components/registration-stepper/registration-stepper';
import { AccountDetailsStep } from './steps/account-details-step/account-details-step';
import { UploadDocumentsStep, DocumentVerificationState } from './steps/upload-documents-step/upload-documents-step';
import { IdentityVerificationStep } from './steps/identity-verification-step/identity-verification-step';
import { VerificationOverlay } from '../../components/verification-overlay/verification-overlay';
import { RegistrationService } from '../../services/registration';
import { ExtractedCompanyData, RegisterRequest, VerificationStatus } from '../../models/registration.models';
import { RegistrationSuccessModal } from '../../components/registration-success-modal/registration-success-modal';

@Component({
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
  private router = inject(Router);
  private registrationService = inject(RegistrationService);

  currentStep = signal<RegistrationStepNumber>(1);
  companyData = signal<ExtractedCompanyData | null>(null);
  showSuccessModal = signal(false);

  /* =============================================
     DOCUMENT VERIFICATION STATE — للـ modal
     ============================================= */
  docVerificationStatus = signal<VerificationStatus>('idle');
  docExtractedData      = signal<ExtractedCompanyData | null>(null);
  docRejectionReasons   = signal<readonly string[]>([]);

  onVerificationStateChanged(state: DocumentVerificationState): void {
    this.docVerificationStatus.set(state.status);
    this.docExtractedData.set(state.extractedData);
    this.docRejectionReasons.set(state.rejectionReasons);
  }

  onDocConfirmCorrect(): void {
    const data = this.docExtractedData();
    if (data) {
      this.companyData.set(data);
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

  /* =============================================
     STEP NAVIGATION
     ============================================= */
  onDocumentsUploaded(extractedData: ExtractedCompanyData): void {
    this.companyData.set(extractedData);
    this.currentStep.set(2);
  }

  onIdentityConfirmed(): void {
    this.currentStep.set(3);
  }

  onAccountDetailsCompleted(data: RegisterRequest): void {
    this.registrationService.register(data).subscribe(() => {
      this.showSuccessModal.set(true);
    });
  }

  onSuccessModalClosed(): void {
    this.showSuccessModal.set(false);
  }

  goBack(): void {
    if (this.currentStep() === 1) {
      this.router.navigate(['/']);
      return;
    }
    this.currentStep.update((step) => (step - 1) as RegistrationStepNumber);
  }
}