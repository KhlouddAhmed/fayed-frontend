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
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly phoneNumber: string | null;
  readonly nationalId: string | null;
  readonly userVerificationStatus: string;
  readonly factoryId: number | null;
  readonly factoryName: string | null;
  readonly commercialRegistryNo: string | null;
  readonly taxCardNo: string | null;
  readonly address: string | null;
  readonly sector: string | null;
  readonly logoUrl: string | null;
  readonly factoryVerificationStatus: string;
  readonly documents: readonly {
    readonly id: number;
    readonly documentType: string;
    readonly fileUrl: string;
    readonly uploadedAt: string;
  }[];
}

// =============================================
// Adapter — DTO → UI Model
// =============================================
function adaptProfile(dto: ProfileDto): CompanyProfile {
  return {
    id: String(dto.factoryId ?? dto.id),
    name: dto.factoryName ?? dto.name,
    initial: (dto.factoryName ?? dto.name).charAt(0).toUpperCase(),
    code: 'FYD-' + String(dto.factoryId ?? dto.id).padStart(4, '0'),
    activityType: dto.sector ?? 'غير محدد',
    foundedYear: 2020,
    location: dto.address ?? 'غير محدد',
    registryNumber: dto.commercialRegistryNo ?? 'غير محدد',
    description: 'لا يوجد وصف متاح',
    isVerified: dto.factoryVerificationStatus === 'Verified',
    email: dto.email,
    phone: dto.phoneNumber ?? 'غير محدد',
    contactPerson: dto.name,
    website: 'غير محدد',
    documents: dto.documents.map((doc) => ({
      id: String(doc.id),
      name: doc.documentType,
      fileName: doc.fileUrl.split('/').pop() ?? doc.documentType,
      status: 'approved' as const,
      url: doc.fileUrl,
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
  const response = await firstValueFrom(
    this.http.get<{ data: ProfileDto }>(`${environment.apiUrl}/profile`)
  );
  return adaptProfile(response.data);
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