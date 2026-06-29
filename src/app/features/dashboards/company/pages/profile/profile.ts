import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CompanyProfile } from '../../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  protected readonly currentDate = new Date();

  /* =============================================
     MOCK DATA — استبدل بـ service call حقيقي
     ============================================= */
  protected readonly profile = signal<CompanyProfile>({
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
      { id: '1', name: 'السجل التجاري',    fileName: 'CR-2026-4587.pdf',  status: 'approved', url: '#' },
      { id: '2', name: 'البطاقة الضريبية', fileName: 'Tax-58674578.pdf',  status: 'approved', url: '#' },
      { id: '3', name: 'شهادة الجودة (COA)', fileName: 'COA-2026.pdf',   status: 'approved', url: '#' },
    ],
  });

  /* =============================================
     ACTIONS
     ============================================= */
  protected onEditProfile(): void {
    // TODO: فتح modal تعديل البيانات
    console.log('edit profile');
  }

  protected onViewDocument(docId: string): void {
    const doc = this.profile().documents.find(d => d.id === docId);
    if (doc) window.open(doc.url, '_blank');
  }

  protected onDownloadDocument(docId: string): void {
    const doc = this.profile().documents.find(d => d.id === docId);
    if (doc) window.open(doc.url, '_blank');
  }

  protected onUploadDocument(): void {
    // TODO: فتح file picker
    console.log('upload document');
  }
}