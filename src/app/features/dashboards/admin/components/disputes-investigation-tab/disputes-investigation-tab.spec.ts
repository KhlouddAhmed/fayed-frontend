import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputesInvestigationTab } from './disputes-investigation-tab';

describe('DisputesInvestigationTab', () => {
  let component: DisputesInvestigationTab;
  let fixture: ComponentFixture<DisputesInvestigationTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputesInvestigationTab],
    }).compileComponents();

    fixture = TestBed.createComponent(DisputesInvestigationTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
