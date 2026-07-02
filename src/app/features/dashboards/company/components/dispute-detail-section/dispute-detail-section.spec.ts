import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeDetailSection } from './dispute-detail-section';

describe('DisputeDetailSection', () => {
  let component: DisputeDetailSection;
  let fixture: ComponentFixture<DisputeDetailSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeDetailSection],
    }).compileComponents();

    fixture = TestBed.createComponent(DisputeDetailSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
