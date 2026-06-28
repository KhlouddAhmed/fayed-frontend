import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSuccessModal } from './registration-success-modal';

describe('RegistrationSuccessModal', () => {
  let component: RegistrationSuccessModal;
  let fixture: ComponentFixture<RegistrationSuccessModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationSuccessModal],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationSuccessModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
