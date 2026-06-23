import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-smart-search-bar',
  imports: [],
  templateUrl: './smart-search-bar.html',
  styleUrl: './smart-search-bar.css',
})
export class SmartSearchBarComponent {

  /* =============================================
     SEARCH STATE
     ============================================= */
  readonly searchQuery = signal('');

  readonly suggestions: readonly string[] = [
    'بقايا حديد سكراب',
    'PVC راتنج',
    'ألياف بوليستر',
    'بقايا أسمنت',
  ] as const;

  readonly searchSubmitted = output<string>();

  /* =============================================
     ACTIONS
     ============================================= */
  onInputChange(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onSmartSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.searchSubmitted.emit(query);
    }
  }

  useSuggestion(suggestion: string): void {
    this.searchQuery.set(suggestion);
    this.searchSubmitted.emit(suggestion);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSmartSearch();
    }
  }
}