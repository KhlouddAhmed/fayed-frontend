import { InjectionToken } from '@angular/core';
import { OrderDto } from '../models/order.model';

export interface OrdersRepository {
  getAll(): Promise<readonly OrderDto[]>;
}

export const ORDERS_REPOSITORY = new InjectionToken<OrdersRepository>(
  'ORDERS_REPOSITORY',
);