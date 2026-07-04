import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageThread } from './message-thread';

describe('MessageThread', () => {
  let component: MessageThread;
  let fixture: ComponentFixture<MessageThread>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageThread],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageThread);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
