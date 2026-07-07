import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ListingCardComponent } from '../../components/listing-card/listing-card';
import { ListingFiltersComponent, ListingFiltersValue } from '../../components/listing-filters/listing-filters';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { SmartSearchBarComponent } from '../../../../shared/components/smart-search-bar/smart-search-bar';
import { MarketplaceService } from '../../services/marketplace';
import { Listing } from '../../models/listing.model';
import { NavbarComponent } from "../../../../layout/navbar/navbar";
import { Footer } from "../../../../layout/footer/footer";
import { ChatbotWidget } from "../../../ai/components/chatbot-widget/chatbot-widget";

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
    ChatbotWidget
  ],
  templateUrl: './marketplace-page.html',
  styleUrl: './marketplace-page.css'
})
export class MarketplacePageComponent implements OnInit {
  private readonly marketplaceService = inject(MarketplaceService);

  listings = signal<Listing[]>([]);
  isLoading = signal(true);
  currentViewMode = signal<'grid' | 'list'>('grid');
  currentPage = signal(1);
  totalCount = signal(0);
  currentSort = signal('newest');
  currentFilters = signal<Partial<ListingFiltersValue>>({});

  startItem = computed(() => this.totalCount() > 0 ? (this.currentPage() - 1) * PAGE_SIZE + 1 : 0);
  endItem = computed(() => Math.min(this.currentPage() * PAGE_SIZE, this.totalCount()));
  totalPages = computed(() => Math.ceil(this.totalCount() / PAGE_SIZE));

  ngOnInit(): void {
    this.loadListings();
  }

  onApplyFilters(filters: ListingFiltersValue): void {
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
    this.loadListings();
  }

  // onSmartSearch(query: string): void {
  //   console.log('Smart Search query:', query);
  // }

  onSmartSearch(query: string): void {
  if (!query) return;

  this.isLoading.set(true);
  this.marketplaceService.smartSearch(query, this.currentPage()).subscribe({
    next: (response) => {
      this.listings.set(response.items || []);
      this.totalCount.set(response.totalCount || 0);
      this.isLoading.set(false);
    },
    error: (err) => {
      console.error(err);
      this.isLoading.set(false);
    }
  });
}

  private loadListings(): void {
    this.isLoading.set(true);

    const filters: any = {
      ...this.currentFilters(),
      sortBy: this.currentSort()
    };

    this.marketplaceService.getListings(
      this.currentPage(),
      PAGE_SIZE,
      filters
    ).subscribe({
      next: (response) => {
        this.listings.set(response.items || []);
        this.totalCount.set(response.totalCount || 0);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading listings', err);
        this.isLoading.set(false);
      }
    });
  }
}