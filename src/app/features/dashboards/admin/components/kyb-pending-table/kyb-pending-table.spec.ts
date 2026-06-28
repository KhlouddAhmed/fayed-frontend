import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KybPendingTable } from './kyb-pending-table';

describe('KybPendingTable', () => {
  let component: KybPendingTable;
  let fixture: ComponentFixture<KybPendingTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KybPendingTable],
    }).compileComponents();

    fixture = TestBed.createComponent(KybPendingTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
