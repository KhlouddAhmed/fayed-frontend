import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUsersTable } from './all-users-table';

describe('AllUsersTable', () => {
  let component: AllUsersTable;
  let fixture: ComponentFixture<AllUsersTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUsersTable],
    }).compileComponents();

    fixture = TestBed.createComponent(AllUsersTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
