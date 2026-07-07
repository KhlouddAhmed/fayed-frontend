import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MaterialDto, MaterialFormValue } from '../models/material.model';
import { MaterialsRepository } from './materials-repository.token';

@Injectable({ providedIn: 'root' })
export class RealMaterialsRepository implements MaterialsRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/listings'; // تأكد من ضبط الـ Proxy في angular.json

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

  // إضافة دالة النشر المطلوبة
  async publish(id: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/${id}/publish`, {}));
  }

  private mapToFormData(value: MaterialFormValue): FormData {
    const formData = new FormData();
    formData.append('title', value.name);
    formData.append('description', value.description);
    formData.append('materialType', value.materialType);
    formData.append('materialCondition', value.condition);
    formData.append('quantity', value.availableQuantity.toString());
    formData.append('measureUnit', value.unit);
    formData.append('minPrice', value.pricePerUnit.toString());
    formData.append('maxPrice', value.maxPricePerUnit.toString());
    
    if (value.imageFiles) {
      for (const file of value.imageFiles) {
        formData.append('images', file);
      }
    }
    return formData;
  }
}