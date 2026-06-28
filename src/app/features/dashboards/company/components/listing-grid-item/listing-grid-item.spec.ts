import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingGridItem } from './listing-grid-item';

describe('ListingGridItem', () => {
  let component: ListingGridItem;
  let fixture: ComponentFixture<ListingGridItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingGridItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingGridItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
