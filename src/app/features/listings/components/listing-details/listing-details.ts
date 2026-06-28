import { Component, inject, signal, OnInit } from '@angular/core';
import { NgOptimizedImage, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferPopup } from '../offer-popup/offer-popup';
import { NavbarComponent } from "../../../../layout/navbar/navbar";
import { ChatbotWidget } from "../../../ai/components/chatbot-widget/chatbot-widget";

export interface ListingSpec {
  label: string;
  value: string;
}

export interface LabFile {
  name: string;
  size: string;
  url: string;
}

export interface ListingDetail {
  id: string;
  title: string;
  price: number;
  governorate: string;
  quantity: number;
  publishedAgo: string;
  mainImage: string;
  images: string[];
  description: string;
  specs: ListingSpec[];
  labFiles: LabFile[];
  company: {
    id: string;
    name: string;
    rating: number;
  };
}

// بيانات ثابتة لكل منتج — مرتبطة بالـ id الأصلي من الـ service
const LISTINGS_DETAILS: Record<string, ListingDetail> = {
  '1': {
    id: '1',
    title: 'بولي إيثيلين منخفض الكثافة LDPE',
    price: 16800,
    governorate: 'القاهرة',
    quantity: 5,
    publishedAgo: 'نُشر منذ يوم',
    mainImage: '/assets/images/market/plastic-ldpe-pellets.jpg',
    images: [
      '/assets/images/market/plastic-ldpe-pellets.jpg',
      '/assets/images/market/plastic-ldpe-pellets.jpg',
      '/assets/images/market/plastic-ldpe-pellets.jpg',
      '/assets/images/market/plastic-ldpe-pellets.jpg',
    ],
    description: 'بولي إيثيلين منخفض الكثافة LDPE فائض إنتاج، جاهز للشحن. مواصفات عالية الجودة ومناسب لصناعات التعبئة والتغليف.',
    specs: [
      { label: 'النوع', value: 'LDPE' },
      { label: 'الحالة', value: 'جديد' },
      { label: 'الحد الأدنى', value: '1 طن' },
      { label: 'طريقة التسليم', value: 'FOB القاهرة' },
    ],
    labFiles: [
      { name: 'Lab_Analysis.pdf', size: '245 KB', url: '#' },
      { name: 'Quality_Certificate.pdf', size: '120 KB', url: '#' },
    ],
    company: { id: 'FYD-2586', name: 'شركة النور', rating: 4.5 },
  },
  '2': {
    id: '2',
    title: 'حديد تسليح',
    price: 21500,
    governorate: 'الإسكندرية',
    quantity: 30,
    publishedAgo: 'نُشر منذ 3 أيام',
    mainImage: '/assets/images/market/metal-rebar-steel.jpg',
    images: [
      '/assets/images/market/metal-rebar-steel.jpg',
      '/assets/images/market/metal-rebar-steel.jpg',
      '/assets/images/market/metal-rebar-steel.jpg',
      '/assets/images/market/metal-rebar-steel.jpg',
    ],
    description: 'حديد تسليح درجة 2 HMS 1&2 مختلط، تم فرزه وتجهيزه للشحن. يتوفر تقرير فحص معتمد. الكمية جاهزة في ساحة التخزين.',
    specs: [
      { label: 'التصنيف', value: 'HMS 1&2' },
      { label: 'نسبة الشوائب', value: '< 2%' },
      { label: 'الرطوبة', value: '< 1%' },
      { label: 'الحد الأدنى', value: '10 طن' },
      { label: 'طريقة التسليم', value: 'FOB الإسكندرية' },
    ],
    labFiles: [
      { name: 'Lab_Analysis.pdf', size: '245 KB', url: '#' },
      { name: 'Composition_Report.pdf', size: '320 KB', url: '#' },
      { name: 'Quality_Certificate.pdf', size: '120 KB', url: '#' },
    ],
    company: { id: 'FYD-2847', name: 'مصنع حديد - الإسكندرية', rating: 4.8 },
  },
  '3': {
    id: '3',
    title: 'خيوط بوليستر معاد تدويرها',
    price: 9200,
    governorate: 'الغربية',
    quantity: 3,
    publishedAgo: 'نُشر منذ 3 أيام',
    mainImage: '/assets/images/market/textile-polyester-thread.jpg',
    images: [
      '/assets/images/market/textile-polyester-thread.jpg',
      '/assets/images/market/textile-polyester-thread.jpg',
      '/assets/images/market/textile-polyester-thread.jpg',
      '/assets/images/market/textile-polyester-thread.jpg',
    ],
    description: 'خيوط بوليستر معاد تدويرها بجودة عالية، مناسبة لصناعات النسيج والملابس. متوفرة بكميات محدودة.',
    specs: [
      { label: 'النوع', value: 'بوليستر معاد تدويره' },
      { label: 'الحد الأدنى', value: '1 طن' },
      { label: 'طريقة التسليم', value: 'FOB الغربية' },
    ],
    labFiles: [
      { name: 'Quality_Certificate.pdf', size: '120 KB', url: '#' },
    ],
    company: { id: 'FYD-1122', name: 'مصنع الغربية للنسيج', rating: 4.2 },
  },
  '4': {
    id: '4',
    title: 'أسمنت بورتلاندي فائض',
    price: 2800,
    governorate: 'دمياط',
    quantity: 50,
    publishedAgo: 'نُشر منذ يوم',
    mainImage: '/assets/images/market/building-cement-portland.jpg',
    images: [
      '/assets/images/market/building-cement-portland.jpg',
      '/assets/images/market/building-cement-portland.jpg',
      '/assets/images/market/building-cement-portland.jpg',
      '/assets/images/market/building-cement-portland.jpg',
    ],
    description: 'أسمنت بورتلاندي فائض عن الحاجة، مخزن في ظروف جيدة. مناسب لمشاريع البناء والتشييد.',
    specs: [
      { label: 'النوع', value: 'بورتلاندي عادي' },
      { label: 'الحد الأدنى', value: '10 طن' },
      { label: 'طريقة التسليم', value: 'FOB دمياط' },
    ],
    labFiles: [
      { name: 'Lab_Analysis.pdf', size: '200 KB', url: '#' },
      { name: 'Quality_Certificate.pdf', size: '115 KB', url: '#' },
    ],
    company: { id: 'FYD-3310', name: 'شركة دمياط للمواد', rating: 4.0 },
  },
  '5': {
    id: '5',
    title: 'كرتون مضغوط OCC',
    price: 4500,
    governorate: 'العاصمة الإدارية',
    quantity: 15,
    publishedAgo: 'نُشر منذ 4 أيام',
    mainImage: '/assets/images/market/paper-occ-recycled-carton.jpg',
    images: [
      '/assets/images/market/paper-occ-recycled-carton.jpg',
      '/assets/images/market/paper-occ-recycled-carton.jpg',
      '/assets/images/market/paper-occ-recycled-carton.jpg',
      '/assets/images/market/paper-occ-recycled-carton.jpg',
    ],
    description: 'كرتون مضغوط OCC معاد تدويره، مناسب لمصانع الورق والكرتون. نظيف وجاف وجاهز للشحن.',
    specs: [
      { label: 'النوع', value: 'OCC' },
      { label: 'الحد الأدنى', value: '5 طن' },
      { label: 'طريقة التسليم', value: 'FOB العاصمة الإدارية' },
    ],
    labFiles: [
      { name: 'Quality_Certificate.pdf', size: '98 KB', url: '#' },
    ],
    company: { id: 'FYD-4455', name: 'شركة الورق الحديثة', rating: 4.3 },
  },
  '6': {
    id: '6',
    title: 'خام PVC',
    price: 12500,
    governorate: 'المنوفية',
    quantity: 5,
    publishedAgo: 'نُشر منذ يومين',
    mainImage: '/assets/images/market/plastic-pvc-raw-material.jpg',
    images: [
      '/assets/images/market/plastic-pvc-raw-material.jpg',
      '/assets/images/market/plastic-pvc-raw-material.jpg',
      '/assets/images/market/plastic-pvc-raw-material.jpg',
      '/assets/images/market/plastic-pvc-raw-material.jpg',
    ],
    description: 'خام PVC عالي الجودة، مناسب لصناعات الأنابيب والبروفيلات. متوفر بكميات محدودة.',
    specs: [
      { label: 'النوع', value: 'PVC خام' },
      { label: 'الحد الأدنى', value: '1 طن' },
      { label: 'طريقة التسليم', value: 'FOB المنوفية' },
    ],
    labFiles: [
      { name: 'Lab_Analysis.pdf', size: '180 KB', url: '#' },
      { name: 'Quality_Certificate.pdf', size: '110 KB', url: '#' },
    ],
    company: { id: 'FYD-5566', name: 'مصنع المنوفية للبلاستيك', rating: 4.6 },
  },
};

@Component({
  selector: 'app-listing-details',
  imports: [NgOptimizedImage, DecimalPipe, OfferPopup, NavbarComponent, ChatbotWidget],
  templateUrl: './listing-details.html',
  styleUrl: './listing-details.css',
})
export class ListingDetailsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  //  STATE SIGNALS
  selectedImage = signal(0);
  listing = signal<ListingDetail | null>(null);
  notFound = signal(false);
  isPopupOpen = signal<boolean>(false); // ➕ إضافة الـ Signal الخاص بحالة فتح الـ Pop-up

  ngOnInit(): void {
    const rawId = this.route.snapshot.params['id'] as string;
    const baseId = rawId.split('-p')[0];

    const found = LISTINGS_DETAILS[baseId];
    if (found) {
      this.listing.set(found);
    } else {
      this.notFound.set(true);
    }
  }

  selectImage(index: number): void {
    this.selectedImage.set(index);
  }

  goBack(): void {
    this.router.navigate(['/marketplace']);
  }

  // ➕ POPUP ACTIONS (إضافة الدوال الجديدة للتحكم في العرض بدون تعديل القديم)
  onSendOffer(): void {
    this.isPopupOpen.set(true); // لفتح الـ Pop-up عند الضغط على الزر
  }

  onClosePopup(): void {
    this.isPopupOpen.set(false); // لإغلاق الـ Pop-up
  }

  onSubmitOffer(offerData: { quantity: number; price: number; message: string }): void {
    console.log('Offer Data Received from Popup:', offerData);
    // هنا يتم التعامل مع البيانات المرسلة أو ربطها بالـ API الخاص بكِ لاحقاً
    this.isPopupOpen.set(false); // إغلاق المودال بعد الإرسال بنجاح
  }

  onContactSeller(): void {
    console.log('Contact seller clicked');
    // دالة فارغة مضافة فقط لكي لا يحدث خطأ مجمع مع زر "مراسلة البائع" الموجود في الـ HTML
  }


  getPopupListing(item: ListingDetail): any {
    return {
      ...item,
      thumbnailUrl: item.mainImage,
      unit: 'طن',
      postedAgo: item.publishedAgo,
      minOrder: 1
    };
  }
}