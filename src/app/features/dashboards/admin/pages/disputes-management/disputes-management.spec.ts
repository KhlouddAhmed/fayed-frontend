import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputesManagement } from './disputes-management';

describe('DisputesManagement', () => {
  let component: DisputesManagement;
  let fixture: ComponentFixture<DisputesManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputesManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(DisputesManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
