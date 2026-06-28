import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailModal } from './offer-detail-modal';

describe('OfferDetailModal', () => {
  let component: OfferDetailModal;
  let fixture: ComponentFixture<OfferDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferDetailModal],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
