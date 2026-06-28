import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiPromoCard } from './ai-promo-card';

describe('AiPromoCard', () => {
  let component: AiPromoCard;
  let fixture: ComponentFixture<AiPromoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiPromoCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AiPromoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
