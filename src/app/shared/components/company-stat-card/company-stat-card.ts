import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-company-stat-card',
  imports: [],
  templateUrl: './company-stat-card.html',
  styleUrl: './company-stat-card.css',
})
export class CompanyStatCard {

  // INPUTS
  icon = input.required<string>();
  label = input.required<string>();
  value = input.required<number>();
  accent = input<'yellow' | 'green' | 'blue' | 'red'>('blue');
  unit = input<string>('');
  linkText = input<string | null>(null);
  badgeText = input<string | null>(null);

  // OUTPUTS
  readonly linkClicked = output<void>();

  // METHODS
  onLinkClick(): void {
    this.linkClicked.emit();
  }

  getAccentColor(): string {
    switch (this.accent()) {
      case 'blue': return '#155DFC';
      case 'green': return '#10B981';
      case 'red': return '#EF4444';
      case 'yellow': return '#FBBF24';
      default: return '#667085';
    }
  }
}