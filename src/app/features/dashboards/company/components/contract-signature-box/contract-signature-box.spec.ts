import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractSignatureBox } from './contract-signature-box';

describe('ContractSignatureBox', () => {
  let component: ContractSignatureBox;
  let fixture: ComponentFixture<ContractSignatureBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractSignatureBox],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractSignatureBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
