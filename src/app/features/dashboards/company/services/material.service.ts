import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MaterialsRepository } from './materials-repository.token';
import { MaterialDto, MaterialFormValue } from '../models/material.model';
import { environment } from '../../../../environments/environment';

interface BaseResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialsService implements MaterialsRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/listings`;

  async getAll(): Promise<readonly MaterialDto[]> {
    const response = await firstValueFrom(
      this.http.get<BaseResponse<MaterialDto[]>>(`${this.baseUrl}/my-listings`)
    );
    return response.data;
  }

  async create(value: MaterialFormValue): Promise<MaterialDto> {
    const formData = this.buildFormData(value);
    const response = await firstValueFrom(
      this.http.post<BaseResponse<MaterialDto>>(this.baseUrl, formData)
    );
    return response.data;
  }

  async update(id: string, value: MaterialFormValue): Promise<MaterialDto> {
    const formData = this.buildFormData(value);
    const response = await firstValueFrom(
      this.http.put<BaseResponse<MaterialDto>>(`${this.baseUrl}/${id}`, formData)
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<BaseResponse<null>>(`${this.baseUrl}/${id}`));
  }

  async publish(id: string): Promise<void> {
    await firstValueFrom(this.http.post<BaseResponse<null>>(`${this.baseUrl}/${id}/publish`, {}));
  }

  private buildFormData(value: MaterialFormValue): FormData {
    const formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('minPrice', value.minPrice.toString());
    formData.append('maxPrice', value.maxPrice.toString());

    formData.append('quantity', value.quantity.toString());
    formData.append('categoryId', value.categoryId.toString());
    formData.append('materialCondition', value.materialCondition);

    if (value.imageFiles && value.imageFiles.length > 0) {
      value.imageFiles.forEach((file: File) => {
        formData.append('images', file);
      });
    }

    return formData;
  }
}