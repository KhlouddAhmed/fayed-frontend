import { Component, computed, output, signal } from '@angular/core';
import { FileUploadCard } from '../../../../components/file-upload-card/file-upload-card';
import { IdentityStepResult } from '../../../../models/registration.models';

@Component({
  selector: 'app-identity-verification-step',
  imports: [FileUploadCard],
  templateUrl: './identity-verification-step.html',
  styleUrl: './identity-verification-step.css',
})
export class IdentityVerificationStep {
  readonly identityConfirmed = output<IdentityStepResult>();

  protected readonly selfieFile = signal<File | null>(null);
  protected readonly idCardFile = signal<File | null>(null);

  protected readonly isNextEnabled = computed(
    () => this.selfieFile() !== null && this.idCardFile() !== null
  );

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

  onNext(): void {
    const selfie = this.selfieFile();
    const idCard = this.idCardFile();
    if (!selfie || !idCard) return;

    this.identityConfirmed.emit({
      nationalIdFile: idCard,
      selfieWithIdFile: selfie,
    });
  }
}