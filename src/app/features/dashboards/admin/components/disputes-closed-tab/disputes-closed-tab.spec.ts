import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputesClosedTab } from './disputes-closed-tab';

describe('DisputesClosedTab', () => {
  let component: DisputesClosedTab;
  let fixture: ComponentFixture<DisputesClosedTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputesClosedTab],
    }).compileComponents();

    fixture = TestBed.createComponent(DisputesClosedTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
