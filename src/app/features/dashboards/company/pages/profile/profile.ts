// profile.ts
import { ChangeDetectionStrategy, Component, resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CompanyProfile } from '../../models/profile.model';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';

/* =============================================
  MOCK DATA — استبدل بـ service call حقيقي
============================================= */
const MOCK_PROFILE: CompanyProfile = {
  id: 'company-001',
  name: 'شركة النور للبلاستيك',
  initial: 'N',
  code: 'FYD-2586',
  activityType: 'تصنيع البلاستيك',
  foundedYear: 2016,
  location: 'القاهرة',
  registryNumber: 'CR-2026-4587',
  description: 'شركة رائدة في مجال تصنيع وتوريد منتجات البلاستيك عالية الجودة منذ أكثر من 6 سنوات. نلتزم بتقديم أفضل المنتجات والخدمات لعملائنا مع الحفاظ على أعلى معايير الجودة.',
  isVerified: true,
  email: 'info@alnorplast.com',
  phone: '+20 100 123 4567',
  contactPerson: 'أحمد محمد علي',
  website: 'www.alnileplast.com',
  documents: [
    { id: '1', name: 'السجل التجاري', fileName: 'CR-2026-4587.pdf', status: 'approved', url: '#' },
    { id: '2', name: 'البطاقة الضريبية', fileName: 'Tax-58674578.pdf', status: 'approved', url: '#' },
    { id: '3', name: 'شهادة الجودة (COA)', fileName: 'COA-2026.pdf', status: 'approved', url: '#' },
  ],
};

const MOCK_DELAY_MS = 500;

@Component({
  selector: 'app-profile',
  imports: [DatePipe, LoadingSkeleton, ErrorState],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  protected readonly currentDate = new Date();

  protected readonly profileResource = resource({
    loader: () =>
      new Promise<CompanyProfile>((resolve) => {
        setTimeout(() => resolve(MOCK_PROFILE), MOCK_DELAY_MS);
      }),
  });
  
 /* =============================================
     ACTIONS
     ============================================= */
  protected onEditProfile(): void {
    // TODO: فتح modal تعديل البيانات
  console.log('edit profile');
  }

  protected onViewDocument(docId: string): void {
    const doc = this.profileResource.value()?.documents.find((d) => d.id === docId);
    if (doc) window.open(doc.url, '_blank');
  }

  protected onDownloadDocument(docId: string): void {
    const doc = this.profileResource.value()?.documents.find((d) => d.id === docId);
    if (doc) window.open(doc.url, '_blank');
  }

  protected onUploadDocument(): void {
    // TODO: فتح file picker
  console.log('upload document');
  }
}