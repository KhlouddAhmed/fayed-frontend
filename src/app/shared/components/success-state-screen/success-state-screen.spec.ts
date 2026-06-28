import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessStateScreen } from './success-state-screen';

describe('SuccessStateScreen', () => {
  let component: SuccessStateScreen;
  let fixture: ComponentFixture<SuccessStateScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessStateScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessStateScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
