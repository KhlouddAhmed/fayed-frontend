import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyFayed } from './why-fayed';

describe('WhyFayed', () => {
  let component: WhyFayed;
  let fixture: ComponentFixture<WhyFayed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyFayed],
    }).compileComponents();

    fixture = TestBed.createComponent(WhyFayed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
