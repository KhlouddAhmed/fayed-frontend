import { Component, computed, inject, output, signal } from '@angular/core';

import { FileUploadCard } from '../../../../components/file-upload-card/file-upload-card';
import { VerificationOverlay } from '../../../../components/verification-overlay/verification-overlay';
import { RegistrationService } from '../../../../services/registration';
import { ExtractedCompanyData, VerificationStatus } from '../../../../models/registration.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-upload-documents-step',
  imports: [RouterLink,FileUploadCard, VerificationOverlay],
  templateUrl: './upload-documents-step.html',
  styleUrl: './upload-documents-step.css',
})
export class UploadDocumentsStep {
  private registrationService = inject(RegistrationService);

  readonly documentsUploaded = output<void>();

  commercialRegistryFile = signal<File | null>(null);
  taxCardFile = signal<File | null>(null);

  isNextEnabled = computed(() => this.commercialRegistryFile() !== null && this.taxCardFile() !== null);

  verificationStatus = signal<VerificationStatus>('idle');
  extractedData = signal<ExtractedCompanyData | null>(null);
  rejectionReasons = signal<readonly string[]>([]);

  onCommercialRegistryAccepted(file: File): void {
    this.commercialRegistryFile.set(file);
  }

  onCommercialRegistryRemoved(): void {
    this.commercialRegistryFile.set(null);
  }

  onTaxCardAccepted(file: File): void {
    this.taxCardFile.set(file);
  }

  onTaxCardRemoved(): void {
    this.taxCardFile.set(null);
  }

  onNext(): void {
    const registry = this.commercialRegistryFile();
    const taxCard = this.taxCardFile();
    if (!registry || !taxCard) {
      return;
    }

    this.verificationStatus.set('pending');

    this.registrationService.startDocumentVerification(registry, taxCard).subscribe((startedCase) => {
      this.registrationService.verifyDocumentsUntilSettled(startedCase.caseId).subscribe((settledCase) => {
        this.verificationStatus.set(settledCase.status);
        this.extractedData.set(settledCase.extractedData ?? null);
        this.rejectionReasons.set(settledCase.rejectionReasons ?? []);
      });
    });
  }

  onConfirmCorrect(): void {
    this.documentsUploaded.emit();
  }

  onReportIncorrect(): void {
    this.resetStep();
  }

  onRetry(): void {
    this.resetStep();
  }

  private resetStep(): void {
    this.verificationStatus.set('idle');
    this.extractedData.set(null);
    this.rejectionReasons.set([]);
    this.commercialRegistryFile.set(null);
    this.taxCardFile.set(null);
  }
}