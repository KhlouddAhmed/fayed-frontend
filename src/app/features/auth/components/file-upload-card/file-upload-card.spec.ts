import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadCard } from './file-upload-card';

describe('FileUploadCard', () => {
  let component: FileUploadCard;
  let fixture: ComponentFixture<FileUploadCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadCard],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
