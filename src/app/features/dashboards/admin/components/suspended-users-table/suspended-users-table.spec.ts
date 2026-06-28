import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendedUsersTable } from './suspended-users-table';

describe('SuspendedUsersTable', () => {
  let component: SuspendedUsersTable;
  let fixture: ComponentFixture<SuspendedUsersTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspendedUsersTable],
    }).compileComponents();

    fixture = TestBed.createComponent(SuspendedUsersTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
