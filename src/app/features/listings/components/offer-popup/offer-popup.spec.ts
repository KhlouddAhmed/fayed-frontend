import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPopup } from './offer-popup';

describe('OfferPopup', () => {
  let component: OfferPopup;
  let fixture: ComponentFixture<OfferPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
