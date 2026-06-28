import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCenterPage } from './notification-center-page';

describe('NotificationCenterPage', () => {
  let component: NotificationCenterPage;
  let fixture: ComponentFixture<NotificationCenterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCenterPage],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCenterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
