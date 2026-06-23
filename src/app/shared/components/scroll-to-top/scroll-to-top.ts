import { Component, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-scroll-to-top',
  imports: [],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.css',
})
export class ScrollToTop {
  readonly isVisible = signal(true);

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}