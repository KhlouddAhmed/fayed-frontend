import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentsStep } from './upload-documents-step';

describe('UploadDocumentsStep', () => {
  let component: UploadDocumentsStep;
  let fixture: ComponentFixture<UploadDocumentsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDocumentsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadDocumentsStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
