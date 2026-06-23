import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityVerificationStep } from './identity-verification-step';

describe('IdentityVerificationStep', () => {
  let component: IdentityVerificationStep;
  let fixture: ComponentFixture<IdentityVerificationStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentityVerificationStep],
    }).compileComponents();

    fixture = TestBed.createComponent(IdentityVerificationStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
