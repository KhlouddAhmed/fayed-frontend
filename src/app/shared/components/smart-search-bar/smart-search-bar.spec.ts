import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartSearchBar } from './smart-search-bar';

describe('SmartSearchBar', () => {
  let component: SmartSearchBar;
  let fixture: ComponentFixture<SmartSearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartSearchBar],
    }).compileComponents();

    fixture = TestBed.createComponent(SmartSearchBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
