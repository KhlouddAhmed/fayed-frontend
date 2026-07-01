import { Injectable } from '@angular/core';
import { OrderDto } from '../models/order.model';
import { OrdersRepository } from './orders-repository.token';

const MOCK_DELAY_MS = 500;

function createMockOrders(): OrderDto[] {
  return [
    {
      Id: 'ord-1',
      Code: 'ORD-632',
      SupplierCode: 'FYD-2847',
      ProductName: 'معاد تدويره PVC',
      Quantity: 20,
      TotalValue: 240000,
      Status: 'PendingShipment',
      Direction: 'Sent',
      OrderDate: '2026-06-02T00:00:00Z',
    },
    {
      Id: 'ord-2',
      Code: 'ORD-631',
      SupplierCode: 'FYD-2847',
      ProductName: 'خام HDPE',
      Quantity: 15,
      TotalValue: 172500,
      Status: 'InPreparation',
      Direction: 'Sent',
      OrderDate: '2026-06-01T00:00:00Z',
    },
    {
      Id: 'ord-3',
      Code: 'ORD-630',
      SupplierCode: 'FYD-2847',
      ProductName: 'PET Flakes',
      Quantity: 10,
      TotalValue: 130000,
      Status: 'Delivered',
      Direction: 'Sent',
      OrderDate: '2026-05-28T00:00:00Z',
    },
    {
      Id: 'ord-4',
      Code: 'ORD-629',
      SupplierCode: 'FYD-2847',
      ProductName: 'PET Flakes',
      Quantity: 10,
      TotalValue: 130000,
      Status: 'Completed',
      Direction: 'Sent',
      OrderDate: '2026-05-20T00:00:00Z',
    },
    {
      Id: 'ord-5',
      Code: 'ORD-205',
      SupplierCode: 'FYD-1234',
      ProductName: 'معاد تدويره PVC',
      Quantity: 20,
      TotalValue: 240000,
      Status: 'PendingShipment',
      Direction: 'Received',
      OrderDate: '2026-06-02T00:00:00Z',
    },
  ];
}

@Injectable()
export class MockOrdersRepository implements OrdersRepository {
  private orders = createMockOrders();

  getAll(): Promise<readonly OrderDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.orders]), MOCK_DELAY_MS);
    });
  }
}