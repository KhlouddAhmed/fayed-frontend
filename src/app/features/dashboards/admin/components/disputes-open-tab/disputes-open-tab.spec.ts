import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputesOpenTab } from './disputes-open-tab';

describe('DisputesOpenTab', () => {
  let component: DisputesOpenTab;
  let fixture: ComponentFixture<DisputesOpenTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputesOpenTab],
    }).compileComponents();

    fixture = TestBed.createComponent(DisputesOpenTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
