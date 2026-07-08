import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Material } from '../../models/material.model';
import { StatusBadge, StatusBadgeVariant } from '../../../../../shared/components/status-badge/status-badge';

interface MaterialStatusConfig {
  readonly labelKey: string;
  readonly variant: StatusBadgeVariant;
}

const MATERIAL_STATUS_DISPLAY_MAP: Readonly<Record<string, MaterialStatusConfig>> = {
  Draft: { labelKey: 'مسودة', variant: 'neutral' },
  PendingApproval: { labelKey: 'قيد المراجعة', variant: 'warning' },
  Published: { labelKey: 'منشور', variant: 'success' },
  Rejected: { labelKey: 'مرفوض', variant: 'danger' },
  Sold: { labelKey: 'مباع', variant: 'success' },
};

@Component({
  selector: 'app-listing-grid-item',
  imports: [StatusBadge, NgOptimizedImage],
  templateUrl: './listing-grid-item.html',
  styleUrl: './listing-grid-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingGridItem {
  readonly material = input.required<Material>();
  readonly viewDetails = output<string>();

  protected readonly statusMap = MATERIAL_STATUS_DISPLAY_MAP;

  protected onViewDetailsClick(): void {
    this.viewDetails.emit(this.material().id);
  }
}
