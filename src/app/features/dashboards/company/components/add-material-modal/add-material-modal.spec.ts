import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialModal } from './add-material-modal';

describe('AddMaterialModal', () => {
  let component: AddMaterialModal;
  let fixture: ComponentFixture<AddMaterialModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMaterialModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMaterialModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
