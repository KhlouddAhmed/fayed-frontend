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
  value = input.required<string>();
  subtitle = input<string>(''); // جملة واحدة بس
  icon = input.required<string>();
  color = input.required<string>();
}