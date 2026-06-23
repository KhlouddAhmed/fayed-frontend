import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingFilters } from './listing-filters';

describe('ListingFilters', () => {
  let component: ListingFilters;
  let fixture: ComponentFixture<ListingFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
