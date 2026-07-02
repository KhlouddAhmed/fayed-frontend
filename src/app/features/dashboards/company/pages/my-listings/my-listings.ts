import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import { Material, MaterialFormValue } from '../../models/material.model';
import { adaptMaterials } from '../../adapters/material.adapter';
import { MATERIALS_REPOSITORY } from '../../services/materials-repository.token';
import { ListingGridItem } from '../../components/listing-grid-item/listing-grid-item';
import { MaterialDetailModal } from '../../components/material-detail-modal/material-detail-modal';
import { AddMaterialModal } from '../../components/add-material-modal/add-material-modal';
import { LoadingSkeleton } from '../../../../../shared/components/loading-skeleton/loading-skeleton';
import { ErrorState } from '../../../../../shared/components/error-state/error-state';
import { EmptyState } from '../../../../../shared/components/empty-state/empty-state';
import { DatePipe } from '@angular/common';

type ActiveModal = 'detail' | 'addEdit' | null;

@Component({
  selector: 'app-my-listings',
  imports: [DatePipe, ListingGridItem, MaterialDetailModal, AddMaterialModal, LoadingSkeleton, ErrorState, EmptyState],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyListings {
  private readonly repository = inject(MATERIALS_REPOSITORY);

  protected readonly materialsResource = resource({
    loader: async () => adaptMaterials(await this.repository.getAll()),
  });

  protected readonly currentDate = new Date();

  protected readonly activeModal = signal<ActiveModal>(null);
  protected readonly selectedMaterial = signal<Material | null>(null);
  protected readonly isSubmitting = signal(false);

  protected onAddMaterialClick(): void {
    this.selectedMaterial.set(null);
    this.activeModal.set('addEdit');
  }

  protected onViewDetails(materialId: string): void {
    const material = this.materialsResource.value()?.find((item) => item.id === materialId);
    if (material) {
      this.selectedMaterial.set(material);
      this.activeModal.set('detail');
    }
  }

  protected onEditFromDetail(materialId: string): void {
    const material = this.materialsResource.value()?.find((item) => item.id === materialId);
    if (material) {
      this.selectedMaterial.set(material);
      this.activeModal.set('addEdit');
    }
  }

  protected async onDeleteMaterial(materialId: string): Promise<void> {
    await this.repository.delete(materialId);
    this.activeModal.set(null);
    this.materialsResource.reload();
  }

  protected async onSubmitForm(value: MaterialFormValue): Promise<void> {
  this.isSubmitting.set(true);

  try {
    const editing = this.selectedMaterial();
    if (editing) {
      await this.repository.update(editing.id, value);
    } else {
      await this.repository.create(value);
    }
    this.activeModal.set(null);
    this.materialsResource.reload();
  } finally {
    this.isSubmitting.set(false);
  }
}


protected closeModal(): void {
    this.activeModal.set(null);
  }
}
