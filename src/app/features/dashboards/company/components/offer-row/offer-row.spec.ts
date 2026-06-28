import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRow } from './offer-row';

describe('OfferRow', () => {
  let component: OfferRow;
  let fixture: ComponentFixture<OfferRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferRow],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
