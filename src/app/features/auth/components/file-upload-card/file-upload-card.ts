import { Component, computed, input, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { FileUploadState, SelectedFileMeta } from '../../models/registration.models';

const SIMULATED_UPLOAD_MS = 900;

@Component({
  selector: 'app-file-upload-card',
  imports: [NgOptimizedImage],
  templateUrl: './file-upload-card.html',
  styleUrl: './file-upload-card.css',
})
export class FileUploadCard {
  label = input.required<string>();
  required = input<boolean>(true);
  acceptedExtensions = input<readonly string[]>(['pdf', 'jpg', 'png']);
  maxSizeMb = input<number>(10);
  iconType = input<'document' | 'upload'>('document');

  readonly fileAccepted = output<File>();
  readonly fileRemoved = output<void>();

  uploadState = signal<FileUploadState>('idle');
  selectedFileMeta = signal<SelectedFileMeta | null>(null);
  uploadProgress = signal(0);

  acceptAttribute = computed(() =>
    this.acceptedExtensions().map((ext) => `.${ext}`).join(',')
  );

  constraintsLabel = computed(() => {
    const types = this.acceptedExtensions().map((ext) => ext.toUpperCase()).join(' , ');
    return `الحد الاقصى لكل ملف ${this.maxSizeMb()} MB بصيغة ${types}`;
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const sizeInMb = file.size / (1024 * 1024);
    const isSupportedType = this.acceptedExtensions().includes(extension);
    const isWithinSizeLimit = sizeInMb <= this.maxSizeMb();

    this.selectedFileMeta.set({ name: file.name, sizeInMb: Math.round(sizeInMb * 10) / 10 });

    if (!isSupportedType || !isWithinSizeLimit) {
      this.uploadState.set('unsupported');
      return;
    }

    this.simulateUpload(file);
  }

  removeFile(): void {
    this.uploadState.set('idle');
    this.selectedFileMeta.set(null);
    this.uploadProgress.set(0);
    this.fileRemoved.emit();
  }

  private simulateUpload(file: File): void {
    this.uploadState.set('uploading');
    this.uploadProgress.set(0);

    const stepIntervalMs = SIMULATED_UPLOAD_MS / 10;
    const progressTimer = setInterval(() => {
      this.uploadProgress.update((value) => Math.min(value + 10, 100));
    }, stepIntervalMs);

    setTimeout(() => {
      clearInterval(progressTimer);
      this.uploadProgress.set(100);
      this.uploadState.set('success');
      this.fileAccepted.emit(file);
    }, SIMULATED_UPLOAD_MS);
  }
}