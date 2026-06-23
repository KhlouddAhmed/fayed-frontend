import { Component, computed, input, output } from '@angular/core';

type PageToken = number | 'ellipsis';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class PaginationComponent {

  /* =============================================
     INPUTS / OUTPUTS
     ============================================= */
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  /* =============================================
     DERIVED STATE
     ============================================= */
  pageTokens = computed<PageToken[]>(() =>
    this.buildTokens(this.currentPage(), this.totalPages())
  );

  isFirstPage = computed(() => this.currentPage() <= 1);
  isLastPage = computed(() => this.currentPage() >= this.totalPages());

  /* =============================================
     ACTIONS
     ============================================= */
  onPageClick(page: number): void {
    if (page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  onPrevious(): void {
    if (!this.isFirstPage()) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  onNext(): void {
    if (!this.isLastPage()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  /* =============================================
     HELPERS
     ============================================= */
  private buildTokens(current: number, total: number): PageToken[] {
    const siblingCount = 1;
    const rangeStart = Math.max(2, current - siblingCount);
    const rangeEnd = Math.min(total - 1, current + siblingCount);

    const tokens: PageToken[] = [1];

    if (rangeStart > 2) {
      tokens.push('ellipsis');
    }

    for (let page = rangeStart; page <= rangeEnd; page++) {
      tokens.push(page);
    }

    if (rangeEnd < total - 1) {
      tokens.push('ellipsis');
    }

    if (total > 1) {
      tokens.push(total);
    }

    return tokens;
  }
}