import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  imports: [NgOptimizedImage],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly illustrationSrc = input<string>('/images/illustrations/empty-state/no-listings.svg');
  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  readonly actionLabel = input<string | null>(null);

  readonly actionClick = output<void>();
}
