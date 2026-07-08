import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService, ApiAdListing } from './moderation.service';

// الواجهة اللي الـ HTML هيقرا منها
export interface AdListingUI {
  dbId: number;          // الـ ID الرقمي للباك إند
  displayId: string;     // المعرف النصي للعرض (زي ORD-123)
  title: string;
  seller: string;
  category: string;
  quantity: string;
  price: string;
  status: 'pending' | 'active' | 'rejected';
}

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listings-moderation.html',
  styleUrls: ['./listings-moderation.css']
})
export class ModerationComponent implements OnInit {
  private moderationService = inject(ModerationService);

  activeTab = signal<'all' | 'pending'>('all');
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);

  adListings = signal<AdListingUI[]>([]);

  // حساب عدد الإعلانات المعلقة للبادج
  pendingCount = computed(() => this.adListings().filter(ad => ad.status === 'pending').length);

  // الفلترة الديناميكية
  filteredAds = computed(() => {
    const tab = this.activeTab();
    const query = this.searchQuery().toLowerCase().trim();
    const ads = this.adListings();

    return ads.filter(ad => {
      const matchesTab = tab === 'all' || ad.status === tab;
      const matchesSearch = !query || 
                            ad.title.toLowerCase().includes(query) || 
                            ad.seller.toLowerCase().includes(query) ||
                            ad.displayId.toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  });

  ngOnInit() {
    this.fetchPendingAds();
  }

  fetchPendingAds() {
    this.isLoading.set(true);
    this.moderationService.getPendingListings().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;

        if (isSuccess && data) {
          const mappedData: AdListingUI[] = data.map((item: ApiAdListing) => ({
            dbId: item.listingId,
            displayId: item.listingIdentifier, // المعرف النصي
            title: item.title,
            seller: item.sellerName,
            category: item.categoryName,
            quantity: item.quantityText,
            price: item.priceText,
            status: 'pending' 
          }));
          this.adListings.set(mappedData);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('فشل جلب الإعلانات المعلقة:', err);
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: 'all' | 'pending') {
    this.activeTab.set(tab);
    this.searchQuery.set('');
  }

  updateSearch(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchQuery.set(input);
  }

  // دالة القرار شغالة مع الزراير ومع الـ Select Dropdown
  changeAdStatus(dbId: number, newStatus: 'active' | 'rejected', event?: Event) {
    if (event) {
      const selectElement = event.target as HTMLSelectElement;
      newStatus = selectElement.value as 'active' | 'rejected';
    }

    const isApproved = newStatus === 'active';
    const payload = { isApproved: isApproved };

    this.moderationService.decideListing(dbId, payload).subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        if (isSuccess) {
          // تحديث الحالة في الواجهة فوراً
          this.adListings.update(ads => 
            ads.map(ad => ad.dbId === dbId ? { ...ad, status: newStatus } : ad)
          );
        }
      },
      error: (err) => {
        console.error('فشل اتخاذ القرار:', err);
      }
    });
  }
}