import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationStepper } from './registration-stepper';

describe('RegistrationStepper', () => {
  let component: RegistrationStepper;
  let fixture: ComponentFixture<RegistrationStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationStepper],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationStepper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
