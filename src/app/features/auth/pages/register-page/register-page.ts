import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RegistrationStepper, RegistrationStepNumber } from '../../components/registration-stepper/registration-stepper';
import { AccountDetailsStep } from './steps/account-details-step/account-details-step';
import { UploadDocumentsStep, DocumentVerificationState } from './steps/upload-documents-step/upload-documents-step';
import { IdentityVerificationStep } from './steps/identity-verification-step/identity-verification-step';
import { VerificationOverlay } from '../../components/verification-overlay/verification-overlay';
import { RegistrationSuccessModal } from '../../components/registration-success-modal/registration-success-modal';
import { RegistrationService } from '../../services/registration';
import { ToastService } from '../../../../core/services/toast.service';
import {
  DocumentStepResult,
  IdentityStepResult,
  AccountDetailsResult,
  ExtractedCompanyData,
  RegisterRequestDto,
  VerificationStatus,
} from '../../models/registration.models';
import { ROUTES } from '../../../../core/constants/routes';

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
  private readonly router = inject(Router);
  private readonly registrationService = inject(RegistrationService);
  private readonly toast = inject(ToastService);

  protected readonly currentStep = signal<RegistrationStepNumber>(1);
  protected readonly showSuccessModal = signal(false);
  protected readonly isSubmitting = signal(false);

  // Step 1 result
  private documentStepResult = signal<DocumentStepResult | null>(null);

  // Step 2 result
  private identityStepResult = signal<IdentityStepResult | null>(null);

  // Verification overlay state
  protected readonly docVerificationStatus = signal<VerificationStatus>('idle');
  protected readonly docExtractedData = signal<ExtractedCompanyData | null>(null);
  protected readonly docRejectionReasons = signal<readonly string[]>([]);

  protected readonly companyData = signal<ExtractedCompanyData | null>(null);

  // Step 1 — documents uploaded + AI extracted
  onDocumentsUploaded(result: DocumentStepResult): void {
    this.documentStepResult.set(result);
    // this.companyData.set(result.extractedCompanyData);
    // this.docVerificationStatus.set('idle');
    // this.currentStep.set(2);
  }

  onVerificationStateChanged(state: DocumentVerificationState): void {
    this.docVerificationStatus.set(state.status);
    this.docExtractedData.set(state.extractedData);
    this.docRejectionReasons.set(state.rejectionReasons);
  }

  // onDocConfirmCorrect(): void {
  //   const data = this.docExtractedData();
  //   if (data) {
  //     this.companyData.set(data);
  //     this.docVerificationStatus.set('idle');
  //     this.currentStep.set(2);
  //   }
  // }
  onDocConfirmCorrect(): void {
    const docResult = this.documentStepResult(); 
    if (docResult) {
      this.companyData.set(docResult.extractedCompanyData);
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

  // Step 2 — identity files collected (pure UI)
  onIdentityConfirmed(result: IdentityStepResult): void {
    this.identityStepResult.set(result);
    this.currentStep.set(3);
  }

  // Step 3 — account details submitted → final register call
  onAccountDetailsCompleted(details: AccountDetailsResult): void {
    const docResult = this.documentStepResult();
    const idResult = this.identityStepResult();

    if (!docResult || !idResult) {
      this.toast.error('بيانات التسجيل غير مكتملة. يرجى البدء من الخطوة الأولى.');
      this.currentStep.set(1);
      return;
    }

    const request: RegisterRequestDto = {
      Email: details.email,
      Password: details.password,
      Name: details.name,
      NationalId: details.nationalId,
      FactoryName: details.factoryName,
      Address: details.address,
      Sector: details.sector,
      CommercialRegistryNo: details.commercialRegistryNo,
      TaxCardNo: details.taxCardNo,
      CommercialRegistryFile: docResult.commercialRegistryFile,
      TaxCardFile: docResult.taxCardFile,
      NationalIdFile: idResult.nationalIdFile,
      SelfieWithIdFile: idResult.selfieWithIdFile,
      ExtractedFields: docResult.kybResult.extractedFields,
      ConfidenceScore: docResult.kybResult.confidenceScore,
      Mismatches: docResult.kybResult.mismatches ?? undefined,
      Recommendation: docResult.kybResult.recommendation,
      ModelVersion: docResult.kybResult.modelVersion,
    };

    this.isSubmitting.set(true);

    this.registrationService.registerFactory(request).subscribe({
      next: response => {
        this.isSubmitting.set(false);
        if (response.isSuccess) { 
          this.showSuccessModal.set(true);
        } else {
          this.toast.error(response.message ?? 'حدث خطأ أثناء التسجيل.'); 
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
      },
    });
  }

  onSuccessModalClosed(): void {
    this.showSuccessModal.set(false);
    this.router.navigateByUrl(`/${ROUTES.AUTH.LOGIN}`);
  }

  goBack(): void {
    if (this.currentStep() === 1) {
      this.router.navigateByUrl(`/${ROUTES.HOME}`);
      return;
    }
    this.currentStep.update(step => (step - 1) as RegistrationStepNumber);
  }
}