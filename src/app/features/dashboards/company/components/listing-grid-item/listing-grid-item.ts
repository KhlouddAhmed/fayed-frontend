import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
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
  selector: 'app-listing-grid-item',
  imports: [StatusBadge],
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
