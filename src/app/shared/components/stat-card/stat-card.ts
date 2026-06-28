import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  icon      = input.required<string>();
  label     = input.required<string>();
  value     = input.required<number>();
  accent    = input<'yellow' | 'green' | 'blue' | 'red'>('blue');
  unit      = input<string>('');
  linkText  = input<string | null>(null);
  badgeText = input<string | null>(null);

  readonly linkClicked = output<void>();

  onLinkClick(): void {
    this.linkClicked.emit();
  }
}