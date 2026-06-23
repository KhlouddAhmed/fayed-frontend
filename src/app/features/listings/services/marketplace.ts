import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Listing } from '../models/listing.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

const MOCK_TOTAL_COUNT = 127;

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  private readonly mockListings: Listing[] = [
    {
      id: '1',
      title: 'بولي إيثيلين منخفض الكثافة LDPE',
      category: 'بلاستيك',
      thumbnailUrl: '/assets/images/market/plastic-ldpe-pellets.jpg',
      price: 16800,
      quantity: 5,
      unit: 'طن',
      location: 'القاهرة',
      governorate: 'القاهرة',
      postedAgo: 'نشر منذ يوم',
      materialTag: 'بلاستيك'
    },
    {
      id: '2',
      title: 'حديد تسليح',
      category: 'معادن',
      thumbnailUrl: '/assets/images/market/metal-rebar-steel.jpg',
      price: 21500,
      quantity: 30,
      unit: 'طن',
      location: 'الإسكندرية',
      governorate: 'الإسكندرية',
      postedAgo: 'نشر منذ 3 أيام',
      materialTag: 'معادن'
    },
    {
      id: '3',
      title: 'خيوط بوليستر معاد تدويرها',
      category: 'ألياف ونسيج',
      thumbnailUrl: '/assets/images/market/textile-polyester-thread.jpg',
      price: 9200,
      quantity: 3,
      unit: 'طن',
      location: 'الغربية',
      governorate: 'الغربية',
      postedAgo: 'نشر منذ 3 أيام',
      materialTag: 'ألياف ونسيج'
    },
    {
      id: '4',
      title: 'أسمنت بورتلاندي فائض',
      category: 'مواد بناء',
      thumbnailUrl: '/assets/images/market/building-cement-portland.jpg',
      price: 2800,
      quantity: 50,
      unit: 'طن',
      location: 'دمياط',
      governorate: 'دمياط',
      postedAgo: 'نشر منذ يوم',
      materialTag: 'مواد بناء'
    },
    {
      id: '5',
      title: 'كرتون مضغوط OCC',
      category: 'ورق وكرتون',
      thumbnailUrl: '/assets/images/market/paper-occ-recycled-carton.jpg',
      price: 4500,
      quantity: 15,
      unit: 'طن',
      location: 'العاصمة الإدارية',
      governorate: 'العاصمة الإدارية',
      postedAgo: 'نشر منذ 4 أيام',
      materialTag: 'ورق وكرتون'
    },
    {
      id: '6',
      title: 'خام PVC',
      category: 'بلاستيك',
      thumbnailUrl: '/assets/images/market/plastic-pvc-raw-material.jpg',
      price: 12500,
      quantity: 5,
      unit: 'طن',
      location: 'المنوفية',
      governorate: 'المنوفية',
      postedAgo: 'نشر منذ يومين',
      materialTag: 'بلاستيك'
    },
  ];

  // تم تحديث الدالة لاستقبال الـ sort
  getListings(page: number, pageSize: number, sort: string = 'newest'): Observable<PaginatedResponse<Listing>> {

    // إنشاء نسخة من البيانات للترتيب
    let dataToDisplay = [...this.mockListings];

    // تطبيق منطق الترتيب
    if (sort === 'price_asc') {
      dataToDisplay.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      dataToDisplay.sort((a, b) => b.price - a.price);
    }
    // يمكنك إضافة منطق إضافي لـ 'newest' أو 'oldest' هنا

    const items = this.buildPageItems(page, pageSize, dataToDisplay);

    const response: PaginatedResponse<Listing> = {
      items,
      totalCount: MOCK_TOTAL_COUNT,
      page,
      pageSize
    };

    return of(response).pipe(delay(600));
  }

  // تم تحديث الدالة لاستقبال البيانات المرتبة
  private buildPageItems(page: number, pageSize: number, data: Listing[]): Listing[] {
    const startIndex = (page - 1) * pageSize;
    const items: Listing[] = [];

    for (let i = 0; i < pageSize; i++) {
      const sourceIndex = (startIndex + i) % data.length;
      const baseItem = data[sourceIndex];
      items.push({
        ...baseItem,
        id: `${baseItem.id}-p${page}i${i}`
      });
    }

    return items;
  }
}