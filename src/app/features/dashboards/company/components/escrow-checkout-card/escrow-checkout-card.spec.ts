import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowCheckoutCard } from './escrow-checkout-card';

describe('EscrowCheckoutCard', () => {
  let component: EscrowCheckoutCard;
  let fixture: ComponentFixture<EscrowCheckoutCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscrowCheckoutCard],
    }).compileComponents();

    fixture = TestBed.createComponent(EscrowCheckoutCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
