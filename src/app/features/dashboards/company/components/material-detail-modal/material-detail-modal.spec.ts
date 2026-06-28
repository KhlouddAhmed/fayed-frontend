import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDetailModal } from './material-detail-modal';

describe('MaterialDetailModal', () => {
  let component: MaterialDetailModal;
  let fixture: ComponentFixture<MaterialDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialDetailModal],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialDetailModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
