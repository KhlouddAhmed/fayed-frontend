import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationFilterBar } from './notification-filter-bar';

describe('NotificationFilterBar', () => {
  let component: NotificationFilterBar;
  let fixture: ComponentFixture<NotificationFilterBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationFilterBar],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationFilterBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
