import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentOrdersTable } from './recent-orders-table';

describe('RecentOrdersTable', () => {
  let component: RecentOrdersTable;
  let fixture: ComponentFixture<RecentOrdersTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentOrdersTable],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentOrdersTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
