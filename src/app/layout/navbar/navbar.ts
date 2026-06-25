import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

// Defines the structure for navigation items
interface NavLink {
  readonly label: string;
  readonly route: string;
  readonly fragment?: string; // Optional anchor link for page sections
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class NavbarComponent {
  // Input properties for authentication and loading states
  isLoggedIn = input<boolean>(false);
  isLoading = input<boolean>(false);

  // Emits events to the parent component
  readonly registerClicked = output<void>();

  // Tracks mobile menu visibility
  readonly menuOpen = signal(false);

  // Configuration for navigation items
  readonly navLinks: readonly NavLink[] = [
    { label: 'الصفحة الرئيسية', route: '/' },
    { label: 'عن فايض', route: '/', fragment: 'how-it-works' },
    { label: 'سوق فايض', route: '/marketplace' },
    { label: 'الاسئلة الشائعة', route: '/', fragment: 'faq-section' },
  ] as const;

  // Toggles mobile menu state
  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  // Closes mobile menu
  closeMenu(): void {
    this.menuOpen.set(false);
  }
}