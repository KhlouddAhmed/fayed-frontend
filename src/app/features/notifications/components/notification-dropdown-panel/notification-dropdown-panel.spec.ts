import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDropdownPanel } from './notification-dropdown-panel';

describe('NotificationDropdownPanel', () => {
  let component: NotificationDropdownPanel;
  let fixture: ComponentFixture<NotificationDropdownPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationDropdownPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationDropdownPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
