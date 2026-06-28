import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type StatusBadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeConfig {
  readonly labelKey: string;
  readonly variant: StatusBadgeVariant;
}

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  readonly statusMap = input.required<Readonly<Record<string, StatusBadgeConfig>>>();
  readonly status = input.required<string>();

  protected readonly config = computed<StatusBadgeConfig>(() => {
    const map = this.statusMap();
    const key = this.status();
    return map[key] ?? { labelKey: key, variant: 'neutral' };
  });
}
