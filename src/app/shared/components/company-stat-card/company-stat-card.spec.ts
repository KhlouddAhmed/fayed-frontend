import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyStatCard } from './company-stat-card';

describe('CompanyStatCard', () => {
  let component: CompanyStatCard;
  let fixture: ComponentFixture<CompanyStatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyStatCard],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyStatCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
