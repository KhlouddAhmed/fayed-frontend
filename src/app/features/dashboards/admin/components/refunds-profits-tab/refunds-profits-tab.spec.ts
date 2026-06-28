import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundsProfitsTab } from './refunds-profits-tab';

describe('RefundsProfitsTab', () => {
  let component: RefundsProfitsTab;
  let fixture: ComponentFixture<RefundsProfitsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundsProfitsTab],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundsProfitsTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
