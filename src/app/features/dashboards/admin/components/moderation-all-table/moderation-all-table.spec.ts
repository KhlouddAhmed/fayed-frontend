import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationAllTable } from './moderation-all-table';

describe('ModerationAllTable', () => {
  let component: ModerationAllTable;
  let fixture: ComponentFixture<ModerationAllTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationAllTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ModerationAllTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
