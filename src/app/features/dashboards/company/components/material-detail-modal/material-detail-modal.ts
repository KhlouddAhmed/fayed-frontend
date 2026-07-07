import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Material } from '../../models/material.model';
import { StatusBadge, StatusBadgeVariant } from '../../../../../shared/components/status-badge/status-badge';

interface MaterialStatusConfig {
  readonly labelKey: string;
  readonly variant: StatusBadgeVariant;
}

const MATERIAL_STATUS_DISPLAY_MAP: Readonly<Record<string, MaterialStatusConfig>> = {
  active: { labelKey: 'نشط', variant: 'success' },
  underReview: { labelKey: 'قيد المراجعة', variant: 'warning' },
  paused: { labelKey: 'متوقف', variant: 'neutral' },
  rejected: { labelKey: 'مرفوض', variant: 'danger' },
};

@Component({
  selector: 'app-material-detail-modal',
  imports: [StatusBadge, DatePipe, NgOptimizedImage],
  templateUrl: './material-detail-modal.html',
  styleUrl: './material-detail-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialDetailModal {
  readonly material = input.required<Material>();

  readonly close = output<void>();
  readonly edit = output<string>();
  readonly delete = output<string>();
  readonly publish = output<string>(); 

  protected readonly statusMap = MATERIAL_STATUS_DISPLAY_MAP;
  protected readonly selectedImageIndex = signal(0);

  protected selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  protected onEditClick(): void {
    this.edit.emit(this.material().id);
  }

  protected onDeleteClick(): void {
    this.delete.emit(this.material().id);
  }


  protected onPublishClick(): void {
    this.publish.emit(this.material().id);
  }
}