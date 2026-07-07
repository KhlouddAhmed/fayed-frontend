import { Component, computed, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FileUploadCard } from '../../../../components/file-upload-card/file-upload-card';
import { RegistrationService } from '../../../../services/registration';
import { DocumentStepResult, ExtractedCompanyData, VerificationStatus } from '../../../../models/registration.models';
import { parseExtractedCompanyData } from '../../../../adapters/registration.adapter';

export interface DocumentVerificationState {
  readonly status: VerificationStatus;
  readonly extractedData: ExtractedCompanyData | null;
  readonly rejectionReasons: readonly string[];
}

@Component({
  selector: 'app-upload-documents-step',
  imports: [RouterLink, FileUploadCard],
  templateUrl: './upload-documents-step.html',
  styleUrl: './upload-documents-step.css',
})
export class UploadDocumentsStep {
  private readonly registrationService = inject(RegistrationService);

  readonly documentsUploaded = output<DocumentStepResult>();
  readonly verificationStateChanged = output<DocumentVerificationState>();

  protected readonly commercialRegistryFile = signal<File | null>(null);
  protected readonly taxCardFile = signal<File | null>(null);
  protected readonly verificationStatus = signal<VerificationStatus>('idle');
  protected readonly extractedData = signal<ExtractedCompanyData | null>(null);
  protected readonly rejectionReasons = signal<readonly string[]>([]);

  protected readonly isNextEnabled = computed(
    () => this.commercialRegistryFile() !== null && this.taxCardFile() !== null
  );

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
    if (!registry || !taxCard) return;

    this.verificationStatus.set('pending');
    this.emitState();

    this.registrationService.extractDocuments(registry, taxCard).subscribe({
      next: kybResult => {
        const companyData = parseExtractedCompanyData(kybResult.extractedFields);

        // Backend returns lowercase: "reject", "approve", "review"
        const rec = kybResult.recommendation?.toLowerCase() ?? 'review';
        const hasValidityIssues = kybResult.validityIssues.length > 0;
        const isRejected = rec === 'reject' || hasValidityIssues;

        const status: VerificationStatus = isRejected ? 'failed' : 'success';

        this.extractedData.set(companyData);
        this.rejectionReasons.set(kybResult.validityIssues);
        this.verificationStatus.set(status);
        this.emitState();

        // Even on success — we wait for user to confirm in the overlay
        // documentsUploaded is emitted after user clicks "نعم, التالي" in register-page
        if (status === 'success') {
          this.documentsUploaded.emit({
            commercialRegistryFile: registry,
            taxCardFile: taxCard,
            kybResult,
            extractedCompanyData: companyData,
          });
        }
      },
      error: () => {
        this.verificationStatus.set('failed');
        this.rejectionReasons.set(['تعذر التحقق من المستندات. يرجى المحاولة مرة أخرى.']);
        this.emitState();
      },
    });
  }

  onRetry(): void {
    this.resetStep();
  }

  onReportIncorrect(): void {
    this.resetStep();
  }

  private emitState(): void {
    this.verificationStateChanged.emit({
      status: this.verificationStatus(),
      extractedData: this.extractedData(),
      rejectionReasons: this.rejectionReasons(),
    });
  }

  private resetStep(): void {
    this.verificationStatus.set('idle');
    this.extractedData.set(null);
    this.rejectionReasons.set([]);
    this.commercialRegistryFile.set(null);
    this.taxCardFile.set(null);
    this.emitState();
  }
}