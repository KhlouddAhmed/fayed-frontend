import { Component, computed, inject, output, signal } from '@angular/core';

import { FileUploadCard } from '../../../../components/file-upload-card/file-upload-card';
import { VerificationOverlay } from '../../../../components/verification-overlay/verification-overlay';
import { RegistrationService } from '../../../../services/registration';
import { VerificationStatus } from '../../../../models/registration.models';

@Component({
  selector: 'app-identity-verification-step',
  imports: [FileUploadCard, VerificationOverlay],
  templateUrl: './identity-verification-step.html',
  styleUrl: './identity-verification-step.css',
})
export class IdentityVerificationStep {
  private registrationService = inject(RegistrationService);

  readonly identityConfirmed = output<void>();

  selfieFile = signal<File | null>(null);
  idCardFile = signal<File | null>(null);

  isNextEnabled = computed(() => this.selfieFile() !== null && this.idCardFile() !== null);

  verificationStatus = signal<VerificationStatus>('idle');
  rejectionMessage = signal<string>('');

  onSelfieAccepted(file: File): void {
    this.selfieFile.set(file);
  }

  onSelfieRemoved(): void {
    this.selfieFile.set(null);
  }

  onIdCardAccepted(file: File): void {
    this.idCardFile.set(file);
  }

  onIdCardRemoved(): void {
    this.idCardFile.set(null);
  }

  // onNext(): void {
  //   const selfie = this.selfieFile();
  //   const idCard = this.idCardFile();
  //   if (!selfie || !idCard) return;

  //   this.verificationStatus.set('pending');

  //   this.registrationService.startIdentityVerification(selfie, idCard).subscribe((startedCase) => {
  //     this.registrationService.verifyIdentityUntilSettled(startedCase.caseId).subscribe((settledCase) => {
  //       this.verificationStatus.set(settledCase.status);
  //       this.rejectionMessage.set(settledCase.rejectionMessage ?? '');
  //     });
  //   });
  // }

  onNext(): void {
    const selfie = this.selfieFile();
    const idCard = this.idCardFile();
    if (!selfie || !idCard) return;

    this.verificationStatus.set('pending');

    this.registrationService.startIdentityVerification(selfie, idCard).subscribe((startedCase) => {
      this.registrationService.verifyIdentityUntilSettled(startedCase.caseId).subscribe((settledCase) => {
        this.verificationStatus.set(settledCase.status);
        this.rejectionMessage.set(settledCase.rejectionMessage ?? '');
        if (settledCase.status === 'success') {
          this.identityConfirmed.emit();
        }
      });
    });
  }

  onConfirmContinue(): void {
    this.identityConfirmed.emit();
  }

  onRetry(): void {
    this.verificationStatus.set('idle');
    this.rejectionMessage.set('');
    this.selfieFile.set(null);
    this.idCardFile.set(null);
  }
}