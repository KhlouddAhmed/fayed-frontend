import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickActionsBar } from './quick-actions-bar';

describe('QuickActionsBar', () => {
  let component: QuickActionsBar;
  let fixture: ComponentFixture<QuickActionsBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionsBar],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickActionsBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
