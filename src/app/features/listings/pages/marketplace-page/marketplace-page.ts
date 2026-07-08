import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ListingCardComponent } from '../../components/listing-card/listing-card';
import { ListingFiltersComponent, ListingFiltersValue } from '../../components/listing-filters/listing-filters';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { SmartSearchBarComponent } from '../../../../shared/components/smart-search-bar/smart-search-bar';
import { MarketplaceService } from '../../services/marketplace';
import { Listing } from '../../models/listing.model';
import { NavbarComponent } from '../../../../layout/navbar/navbar';
import { Footer } from '../../../../layout/footer/footer';
import { ChatbotWidget } from '../../../ai/components/chatbot-widget/chatbot-widget';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-marketplace-page',
  imports: [
    ListingCardComponent,
    ListingFiltersComponent,
    PaginationComponent,
    SmartSearchBarComponent,
    NavbarComponent,
    Footer,
    ChatbotWidget,
  ],
  templateUrl: './marketplace-page.html',
  styleUrl: './marketplace-page.css',
})
export class MarketplacePageComponent implements OnInit {
  private readonly marketplaceService = inject(MarketplaceService);

  protected readonly listings = signal<Listing[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSmartSearchActive = signal(false);
  protected readonly currentViewMode = signal<'grid' | 'list'>('grid');
  protected readonly currentPage = signal(1);
  protected readonly totalCount = signal(0);
  protected readonly currentSort = signal('newest');
  protected readonly currentFilters = signal<Partial<ListingFiltersValue>>({});

  protected readonly startItem = computed(() =>
    this.totalCount() > 0 ? (this.currentPage() - 1) * PAGE_SIZE + 1 : 0
  );
  protected readonly endItem = computed(() =>
    Math.min(this.currentPage() * PAGE_SIZE, this.totalCount())
  );
  protected readonly totalPages = computed(() =>
    Math.ceil(this.totalCount() / PAGE_SIZE)
  );

  ngOnInit(): void {
    this.loadListings();
  }

  onApplyFilters(filters: ListingFiltersValue): void {
    this.isSmartSearchActive.set(false);
    this.currentFilters.set(filters);
    this.currentPage.set(1);
    this.loadListings();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.currentSort.set(value);
    this.currentPage.set(1);
    this.loadListings();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.currentViewMode.set(mode);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    if (this.isSmartSearchActive()) return;
    this.loadListings();
  }

  onSmartSearch(query: string): void {
    if (!query.trim()) return;

    this.isLoading.set(true);
    this.isSmartSearchActive.set(true);
    this.currentPage.set(1);

    this.marketplaceService.smartSearch(query, this.currentPage(), PAGE_SIZE).subscribe({
      next: response => {
        this.listings.set([...response.items]);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isSmartSearchActive.set(false);
      },
    });
  }

  private loadListings(): void {
    this.isLoading.set(true);

    const filters = {
      ...this.currentFilters(),
      sortBy: this.currentSort(),
    };

    this.marketplaceService
      .getListings(this.currentPage(), PAGE_SIZE, filters)
      .subscribe({
        next: response => {
          this.listings.set([...response.items]);
          this.totalCount.set(response.totalCount);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }
}