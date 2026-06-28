import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeThread } from './dispute-thread';

describe('DisputeThread', () => {
  let component: DisputeThread;
  let fixture: ComponentFixture<DisputeThread>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeThread],
    }).compileComponents();

    fixture = TestBed.createComponent(DisputeThread);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
