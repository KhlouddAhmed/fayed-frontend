import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractStatusScreen } from './contract-status-screen';

describe('ContractStatusScreen', () => {
  let component: ContractStatusScreen;
  let fixture: ComponentFixture<ContractStatusScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractStatusScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(ContractStatusScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
