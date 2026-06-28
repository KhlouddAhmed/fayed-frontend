import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KybVerification } from './kyb-verification';

describe('KybVerification', () => {
  let component: KybVerification;
  let fixture: ComponentFixture<KybVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KybVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(KybVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
