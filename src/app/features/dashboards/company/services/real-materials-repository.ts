import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MaterialDto, MaterialFormValue } from '../models/material.model';
import { MaterialsRepository } from './materials-repository.token';
import { environment } from '../../../../environments/environment';
import { AuthStateService } from '../../../../core/services/auth-state.service';
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
  private readonly authState = inject(AuthStateService);
  private readonly baseUrl = `${environment.apiUrl}/listings`;

  async getAll(): Promise<readonly MaterialDto[]> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<MaterialDto[]>>(`${this.baseUrl}/my-listings`)
    );
    return res.data;
  }

  async create(value: MaterialFormValue): Promise<MaterialDto> {
    const formData = this.mapToFormData(value);
    const res = await firstValueFrom(
      this.http.post<BaseResponse<MaterialDto>>(this.baseUrl, formData)
    );
    return res.data;
  }

  async update(id: string, value: MaterialFormValue): Promise<MaterialDto> {
    const formData = this.mapToFormData(value);
    const res = await firstValueFrom(
      this.http.put<BaseResponse<MaterialDto>>(`${this.baseUrl}/${id}`, formData)
    );
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<BaseResponse<null>>(`${this.baseUrl}/${id}`)
    );
  }

  async publish(id: string): Promise<void> {
    await firstValueFrom(
      this.http.post<BaseResponse<null>>(`${this.baseUrl}/${id}/publish`, {})
    );
  }

  private mapToFormData(value: MaterialFormValue): FormData {
    const formData = new FormData();

    const user = this.authState.currentUser();
formData.append('factoryId', user?.factoryId ?? '');

    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('materialType', value.materialType);
    formData.append('materialCondition', value.materialCondition);
    formData.append('quantity', value.quantity.toString());
    formData.append('measureUnit', value.measureUnit);
    formData.append('minPrice', value.minPrice.toString());
    formData.append('maxPrice', value.maxPrice.toString());
    formData.append('minOrderQuantity', value.minOrderQuantity.toString());
    formData.append('isNegotiable', value.isNegotiable.toString());
    formData.append('isDivisible', value.isDivisible.toString());
    formData.append('deliveryType', value.deliveryType);
    formData.append('preferPayMethod', value.preferPayMethod);
    formData.append('categoryId', value.categoryId.toString());

    const expiryDate = new Date(value.expiryDate).toISOString();
    formData.append('expiryDate', expiryDate);

    if (value.imageFiles && value.imageFiles.length > 0) {
      for (const file of value.imageFiles) {
        formData.append('images', file);
      }
    }

    if (value.videoFile) {
      formData.append('video', value.videoFile);
    }

    if (value.certificateFile) {
      formData.append('certificate', value.certificateFile);
    }

    return formData;
  }
}