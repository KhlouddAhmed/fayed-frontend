import { Component, signal, computed } from '@angular/core';

interface AdListing {
  id: string;
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
  templateUrl: './listings-moderation.html',
  styleUrls: ['./listings-moderation.css']
})
export class ModerationComponent {
  // خلينا التاب الافتراضي هو 'pending' عشان تشوف التصميم الجديد أول ما تفتح
  activeTab = signal<'all' | 'pending'>('pending');
  searchQuery = signal<string>('');

  // الداتا تم تحديثها لتطابق الصورة تماماً، مع فصل السعر والكمية
  adListings = signal<AdListing[]>([
    { id: 'LST-502', title: 'خردة كابلات نحاس أحمر صناعي', seller: 'السويدي للكابلات', category: 'معادن', quantity: '2 طن', price: '18,000 ج.م', status: 'pending' },
    { id: 'LST-503', title: 'حبيبات بلاستيك PET معاد تدويرها مغسولة', seller: 'الوطنية للبلاستيك', category: 'بلاستيك', quantity: '10 طن', price: '24,000 ج.م', status: 'pending' },
    { id: 'LST-504', title: 'كرتون مستعمل مضغوط بالية OCC', seller: 'مصر للتعبئة', category: 'ورق وكرتون', quantity: '15 طن', price: '4,200 ج.م', status: 'pending' }
  ]);

  // حساب عدد الإعلانات المعلقة بشكل ديناميكي للبادج اللي في التاب
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

  setTab(tab: 'all' | 'pending') {
    this.activeTab.set(tab);
    this.searchQuery.set(''); // تفريغ البحث عند تغيير التاب
  }

  updateSearch(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchQuery.set(input);
  }

  // دالة لتعديل الحالة (شغالة لزراير القبول/الرفض وللقائمة المنسدلة كمان)
  changeAdStatus(id: string, newStatus: 'pending' | 'active' | 'rejected', event?: Event) {
    const finalStatus = event ? (event.target as HTMLSelectElement).value as 'pending' | 'active' : newStatus;
    
    this.adListings.update(ads => 
      ads.map(ad => ad.id === id ? { ...ad, status: finalStatus } : ad)
    );
  }
}