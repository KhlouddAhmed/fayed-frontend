import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MaterialDto, MaterialFormValue } from '../models/material.model';
import { MaterialsRepository } from './materials-repository.token';

@Injectable({ providedIn: 'root' })
export class RealMaterialsRepository implements MaterialsRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/listings';

  async getAll(): Promise<readonly MaterialDto[]> {
    return firstValueFrom(this.http.get<MaterialDto[]>(`${this.baseUrl}/my-listings`));
  }

  async create(value: MaterialFormValue): Promise<MaterialDto> {
    const formData = this.mapToFormData(value);
    return firstValueFrom(this.http.post<MaterialDto>(this.baseUrl, formData));
  }

  async update(id: string, value: MaterialFormValue): Promise<MaterialDto> {
    const formData = this.mapToFormData(value);
    return firstValueFrom(this.http.put<MaterialDto>(`${this.baseUrl}/${id}`, formData));
  }

  async delete(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
  }

  async publish(id: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/${id}/publish`, {}));
  }

  private mapToFormData(value: MaterialFormValue): FormData {
    const formData = new FormData();
    formData.append('Name', value.name);
    formData.append('Description', value.description);
    formData.append('MaterialType', value.materialType);
    formData.append('Condition', value.condition);
    formData.append('AvailableQuantity', value.availableQuantity.toString());
    formData.append('Unit', value.unit);
    formData.append('PricePerUnit', value.pricePerUnit.toString());
    formData.append('MaxPricePerUnit', value.maxPricePerUnit.toString());
    
 if (value.imageFiles) {
      for (const file of value.imageFiles) {
        formData.append('Images', file);
      }
    }

    if (value.videoFile) formData.append('Video', value.videoFile);
    if (value.labCertificateFile) formData.append('LabCertificate', value.labCertificateFile);
    
    return formData;
  }
}