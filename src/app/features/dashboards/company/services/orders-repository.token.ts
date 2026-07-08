import { InjectionToken } from '@angular/core';
import { OrderDto } from '../models/order.model';

export interface OrdersRepository {
  getPurchases(): Promise<readonly OrderDto[]>;
  getSales(): Promise<readonly OrderDto[]>;
}

export const ORDERS_REPOSITORY = new InjectionToken<OrdersRepository>(
  'ORDERS_REPOSITORY',
);