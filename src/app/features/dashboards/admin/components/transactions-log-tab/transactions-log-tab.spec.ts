import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsLogTab } from './transactions-log-tab';

describe('TransactionsLogTab', () => {
  let component: TransactionsLogTab;
  let fixture: ComponentFixture<TransactionsLogTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsLogTab],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsLogTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
