import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersPayments } from './orders-payments';

describe('OrdersPayments', () => {
  let component: OrdersPayments;
  let fixture: ComponentFixture<OrdersPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersPayments],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
