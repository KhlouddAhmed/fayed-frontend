import { Component, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

import { RegistrationStepper, RegistrationStepNumber } from '../../components/registration-stepper/registration-stepper';
import { AccountDetailsStep } from './steps/account-details-step/account-details-step';
import { UploadDocumentsStep } from './steps/upload-documents-step/upload-documents-step';
import { IdentityVerificationStep } from './steps/identity-verification-step/identity-verification-step';
import { RegisterRequest } from '../../models/registration.models';

@Component({
  imports: [
    NgOptimizedImage,
    RegistrationStepper,
    AccountDetailsStep,
    UploadDocumentsStep,
    IdentityVerificationStep
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private router = inject(Router);

  currentStep = signal<RegistrationStepNumber>(1);
  accountDetails = signal<RegisterRequest | null>(null);

  onDocumentsUploaded(): void { this.currentStep.set(2); }
  onIdentityConfirmed(): void { this.currentStep.set(3); }

  onAccountDetailsCompleted(data: RegisterRequest): void {
    this.accountDetails.set(data);
  }

  goBack(): void {
    if (this.currentStep() === 1) {
      this.router.navigate(['/']);
      return;
    }
    this.currentStep.update((step) => (step - 1) as RegistrationStepNumber);
  }
}