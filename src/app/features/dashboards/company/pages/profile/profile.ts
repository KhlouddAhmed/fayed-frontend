import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CompanyProfile } from '../../models/profile.model';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { environment } from '../../../../../environments/environment';

// =============================================
// DTO — mirrors ProfileDto.cs exactly
// =============================================
interface ProfileDto {
  readonly Id: number;
  readonly Name: string;
  readonly Email: string;
  readonly PhoneNumber: string | null;
  readonly NationalId: string | null;
  readonly UserVerificationStatus: string;
  readonly FactoryId: number | null;
  readonly FactoryName: string | null;
  readonly CommercialRegistryNo: string | null;
  readonly TaxCardNo: string | null;
  readonly Address: string | null;
  readonly Sector: string | null;
  readonly LogoUrl: string | null;
  readonly FactoryVerificationStatus: string;
  readonly Documents: readonly {
    readonly Id: number;
    readonly Name: string;
    readonly Url: string;
    readonly Status: string;
  }[];
}

// =============================================
// Adapter — DTO → UI Model
// =============================================
function adaptProfile(dto: ProfileDto): CompanyProfile {
  return {
    id: String(dto.FactoryId ?? dto.Id),
    name: dto.FactoryName ?? dto.Name,
    initial: (dto.FactoryName ?? dto.Name).charAt(0).toUpperCase(),
    code: 'FYD-' + String(dto.FactoryId ?? dto.Id).padStart(4, '0'),
    activityType: dto.Sector ?? 'غير محدد',
    foundedYear: 2020,                          // mock — مش في الـ DTO
    location: dto.Address ?? 'غير محدد',
    registryNumber: dto.CommercialRegistryNo ?? 'غير محدد',
    description: 'لا يوجد وصف متاح',           // mock — مش في الـ DTO
    isVerified: dto.FactoryVerificationStatus === 'Verified',
    email: dto.Email,
    phone: dto.PhoneNumber ?? 'غير محدد',
    contactPerson: dto.Name,
    website: 'غير محدد',                        // mock — مش في الـ DTO
    documents: dto.Documents.map((doc) => ({
      id: String(doc.Id),
      name: doc.Name,
      fileName: doc.Url.split('/').pop() ?? doc.Name,
      status: doc.Status.toLowerCase() === 'approved' ? 'approved' : 'pending',
      url: doc.Url,
    })),
  };
}

@Component({
  selector: 'app-profile',
  imports: [DatePipe, LoadingSkeleton, ErrorState],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private readonly http = inject(HttpClient);
  protected readonly currentDate = new Date();

  protected readonly profileResource = resource({
    loader: async () => {
      const dto = await firstValueFrom(
        this.http.get<ProfileDto>(`${environment.apiUrl}/profile`)
      );
      return adaptProfile(dto);
    },
  });

  protected onEditProfile(): void {
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
    console.log('upload document');
  }
}