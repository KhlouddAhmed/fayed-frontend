import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsModeration } from './listings-moderation';

describe('ListingsModeration', () => {
  let component: ListingsModeration;
  let fixture: ComponentFixture<ListingsModeration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingsModeration],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingsModeration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
