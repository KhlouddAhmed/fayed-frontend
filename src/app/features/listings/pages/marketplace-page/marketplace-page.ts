import { Component, computed, inject, signal } from '@angular/core';
import { ListingCardComponent } from '../../components/listing-card/listing-card';
import { ListingFiltersComponent } from '../../components/listing-filters/listing-filters';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { SmartSearchBarComponent } from '../../../../shared/components/smart-search-bar/smart-search-bar';
import { MarketplaceService } from '../../services/marketplace';
import { Listing } from '../../models/listing.model';
import { NavbarComponent } from "../../../../layout/navbar/navbar";
import { Footer } from "../../../../layout/footer/footer";

const PAGE_SIZE = 6;

@Component({
  selector: 'app-marketplace-page',
  imports: [
    ListingCardComponent,
    ListingFiltersComponent,
    PaginationComponent,
    SmartSearchBarComponent,
    NavbarComponent,
    Footer
],
  templateUrl: './marketplace-page.html',
  styleUrl: './marketplace-page.css'
})
export class MarketplacePageComponent {
  private readonly marketplaceService = inject(MarketplaceService);

  //LISTINGS STATE
  listings = signal<Listing[]>([]);
  isLoading = signal(true);
  currentViewMode = signal<'grid' | 'list'>('grid');
  currentPage = signal(1);
  totalCount = signal(0);
  currentSort = signal('newest');

  //DERIVED STATE
  startItem = computed(() => this.totalCount() > 0 ? (this.currentPage() - 1) * PAGE_SIZE + 1 : 0);
  endItem = computed(() => Math.min(this.currentPage() * PAGE_SIZE, this.totalCount()));
  totalPages = computed(() => Math.ceil(this.totalCount() / PAGE_SIZE));

  constructor() {
    this.loadListings();
  }

  //ACTIONS
  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadListings();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.currentViewMode.set(mode);
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.currentSort.set(selectElement.value);
    this.currentPage.set(1);
    this.loadListings();
  }

  onSmartSearch(query: string): void {
    // TODO: wire to AI Prompt Search (FR-04) once the backend/AI service is ready.
    // For now this just confirms the binding works end-to-end.
  }

  onApplyFilters(): void {}

  //DATA LOADING
  private loadListings(): void {
    this.isLoading.set(true);

    this.marketplaceService.getListings(
      this.currentPage(),
      PAGE_SIZE,
      this.currentSort()
    ).subscribe({
      next: (response) => {
        this.listings.set(response.items);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}