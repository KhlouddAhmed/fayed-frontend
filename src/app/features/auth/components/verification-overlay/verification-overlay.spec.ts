import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationOverlay } from './verification-overlay';

describe('VerificationOverlay', () => {
  let component: VerificationOverlay;
  let fixture: ComponentFixture<VerificationOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationOverlay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
