import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAmendmentModal } from './contract-amendment-modal';

describe('ContractAmendmentModal', () => {
  let component: ContractAmendmentModal;
  let fixture: ComponentFixture<ContractAmendmentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractAmendmentModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractAmendmentModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
