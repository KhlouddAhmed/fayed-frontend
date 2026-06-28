import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisputeCreateModal } from './dispute-create-modal';

describe('DisputeCreateModal', () => {
  let component: DisputeCreateModal;
  let fixture: ComponentFixture<DisputeCreateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisputeCreateModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DisputeCreateModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
