import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';
import { OrderDto, Order } from '../models/order.model';
import { adaptOrders } from '../adapters/order.adapter';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  getMyPurchases(): Observable<readonly Order[]> {
    return this.http
      .get<ApiResponseWithData<readonly OrderDto[]>>(`${environment.apiUrl}/orders/my-purchases`)
      .pipe(map(res => adaptOrders(res.data ?? [])));
  }

  getMySales(): Observable<readonly Order[]> {
    return this.http
      .get<ApiResponseWithData<readonly OrderDto[]>>(`${environment.apiUrl}/orders/my-sales`)
      .pipe(map(res => adaptOrders(res.data ?? [])));
  }

  complete(orderId: string): Observable<void> {
    return this.http
      .put<void>(`${environment.apiUrl}/orders/${orderId}/complete`, {});
  }

  cancel(orderId: string): Observable<void> {
    return this.http
      .put<void>(`${environment.apiUrl}/orders/${orderId}/cancel`, {});
  }
}