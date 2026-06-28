import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiStatCard } from './kpi-stat-card';

describe('KpiStatCard', () => {
  let component: KpiStatCard;
  let fixture: ComponentFixture<KpiStatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiStatCard],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiStatCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
