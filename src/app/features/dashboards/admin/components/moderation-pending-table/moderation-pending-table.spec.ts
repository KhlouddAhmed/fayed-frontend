import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationPendingTable } from './moderation-pending-table';

describe('ModerationPendingTable', () => {
  let component: ModerationPendingTable;
  let fixture: ComponentFixture<ModerationPendingTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationPendingTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ModerationPendingTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
