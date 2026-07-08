import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { OrderDto } from '../models/order.model';
import { OrdersRepository } from './orders-repository.token';

export interface BaseResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

@Injectable({ providedIn: 'root' })
export class OrderService implements OrdersRepository {
  private readonly http = inject(HttpClient);

  getPurchases(): Promise<readonly OrderDto[]> {
    return firstValueFrom(
      this.http.get<BaseResponse<readonly OrderDto[]>>('/api/orders/my-purchases').pipe(
        map(res => {
          if (res.isSuccess && res.data) return res.data;
          throw new Error(res.message || 'فشل في تحميل المشتريات');
        })
      )
    );
  }

  getSales(): Promise<readonly OrderDto[]> {
    return firstValueFrom(
      this.http.get<BaseResponse<readonly OrderDto[]>>('/api/orders/my-sales').pipe(
        map(res => {
          if (res.isSuccess && res.data) return res.data;
          throw new Error(res.message || 'فشل في تحميل المبيعات');
        })
      )
    );
  }
}