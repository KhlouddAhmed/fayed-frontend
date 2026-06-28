import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrls: ['./stat-card.css']
})
export class StatCardComponent {

  title = input.required<string>();
  value = input.required<string | number>();
  subtitle = input<string>();
  subtitleClass = input<string>('text-muted'); 
  icon = input.required<string>();
  color = input.required<string>(); 
}

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