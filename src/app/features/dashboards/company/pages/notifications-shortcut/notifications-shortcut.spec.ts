import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsShortcut } from './notifications-shortcut';

describe('NotificationsShortcut', () => {
  let component: NotificationsShortcut;
  let fixture: ComponentFixture<NotificationsShortcut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsShortcut],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsShortcut);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
