import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeRow } from './dispute-row';

describe('DisputeRow', () => {
  let component: DisputeRow;
  let fixture: ComponentFixture<DisputeRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeRow],
    }).compileComponents();

    fixture = TestBed.createComponent(DisputeRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
