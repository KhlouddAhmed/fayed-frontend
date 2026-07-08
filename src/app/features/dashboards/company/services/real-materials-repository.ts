import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MaterialDto, MaterialFormValue } from '../models/material.model';
import { MaterialsRepository } from './materials-repository.token';

interface BaseResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

@Injectable({ providedIn: 'root' })
export class RealMaterialsRepository implements MaterialsRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/listings';

  async getAll(): Promise<readonly MaterialDto[]> {
    const res = await firstValueFrom(this.http.get<BaseResponse<MaterialDto[]>>(`${this.baseUrl}/my-listings`));
    return res.data;
  }

  async create(value: MaterialFormValue): Promise<MaterialDto> {
    const formData = this.mapToFormData(value);
    const res = await firstValueFrom(this.http.post<BaseResponse<MaterialDto>>(this.baseUrl, formData));
    return res.data;
  }

  async update(id: string, value: MaterialFormValue): Promise<MaterialDto> {
    const formData = this.mapToFormData(value);
    const res = await firstValueFrom(this.http.put<BaseResponse<MaterialDto>>(`${this.baseUrl}/${id}`, formData));
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<BaseResponse<null>>(`${this.baseUrl}/${id}`));
  }

  async publish(id: string): Promise<void> {
    await firstValueFrom(this.http.post<BaseResponse<null>>(`${this.baseUrl}/${id}/publish`, {}));
  }

  private mapToFormData(value: MaterialFormValue): FormData {
    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('price', value.price.toString());
    formData.append('quantity', value.quantity.toString());
    formData.append('categoryId', value.categoryId.toString());
    formData.append('materialCondition', value.materialCondition);
    
    if (value.mediaFiles && value.mediaFiles.length > 0) {
      for (const file of value.mediaFiles) {
        formData.append('mediaFiles', file);
      }
    }
    
    return formData;
  }
}