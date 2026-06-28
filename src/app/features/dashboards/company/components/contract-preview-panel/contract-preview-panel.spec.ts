import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractPreviewPanel } from './contract-preview-panel';

describe('ContractPreviewPanel', () => {
  let component: ContractPreviewPanel;
  let fixture: ComponentFixture<ContractPreviewPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractPreviewPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractPreviewPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
