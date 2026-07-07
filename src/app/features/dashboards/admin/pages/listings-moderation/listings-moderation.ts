import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationService } from './moderation.service';

export interface AdListing {
  id: number;
  listingIdentifier: string;
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

  adListings = signal<AdListing[]>([]);

  // حساب عدد الإعلانات المعلقة بشكل ديناميكي للبادج
  pendingCount = computed(() => this.adListings().filter(ad => ad.status === 'pending').length);

  filteredAds = computed(() => {
    const tab = this.activeTab();
    const query = this.searchQuery().toLowerCase().trim();
    const ads = this.adListings();

    return ads.filter(ad => {
      const matchesTab = tab === 'all' || ad.status === tab;
      const matchesSearch = !query || 
                            ad.title.toLowerCase().includes(query) || 
                            ad.seller.toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  });

  ngOnInit() {
    this.fetchPendingAds();
  }

  fetchPendingAds() {
    this.isLoading.set(true);
    this.moderationService.getPendingListings().subscribe({
      next: (res) => {
        if (res.IsSuccess && res.Data) {
          // تحويل الـ JSON اللي راجع من السيرفر ليتطابق مع واجهة الشاشة
          const mappedData: AdListing[] = res.Data.map(item => ({
            id: item.listingId,
            listingIdentifier: item.listingIdentifier,
            title: item.title,
            seller: item.sellerName,
            category: item.categoryName,
            quantity: item.quantityText,
            price: item.priceText,
            status: 'pending' // كل اللي راجع من الـ API ده بيكون معلق
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

  // دالة لتعديل الحالة وإرسال القرار للسيرفر
  changeAdStatus(id: number, newStatus: 'active' | 'rejected') {
    const isApproved = newStatus === 'active';

    this.moderationService.decideListing(id, isApproved).subscribe({
      next: (res) => {
        if (res.IsSuccess) {
          // تحديث الحالة في الواجهة فوراً بعد نجاح الطلب
          this.adListings.update(ads => 
            ads.map(ad => ad.id === id ? { ...ad, status: newStatus } : ad)
          );
        }
      },
      error: (err) => {
        console.error('فشل اتخاذ القرار:', err);
      }
    });
  }
}