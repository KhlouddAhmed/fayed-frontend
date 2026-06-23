import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsStep } from './account-details-step';

describe('AccountDetailsStep', () => {
  let component: AccountDetailsStep;
  let fixture: ComponentFixture<AccountDetailsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDetailsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountDetailsStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
