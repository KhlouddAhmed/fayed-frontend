import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractPromptModal } from './contract-prompt-modal';

describe('ContractPromptModal', () => {
  let component: ContractPromptModal;
  let fixture: ComponentFixture<ContractPromptModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractPromptModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractPromptModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
