import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowAccountTab } from './escrow-account-tab';

describe('EscrowAccountTab', () => {
  let component: EscrowAccountTab;
  let fixture: ComponentFixture<EscrowAccountTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscrowAccountTab],
    }).compileComponents();

    fixture = TestBed.createComponent(EscrowAccountTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
