import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqOffers } from './rfq-offers';

describe('RfqOffers', () => {
  let component: RfqOffers;
  let fixture: ComponentFixture<RfqOffers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfqOffers],
    }).compileComponents();

    fixture = TestBed.createComponent(RfqOffers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
