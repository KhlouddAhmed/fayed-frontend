import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KybDocumentReviewPanel } from './kyb-document-review-panel';

describe('KybDocumentReviewPanel', () => {
  let component: KybDocumentReviewPanel;
  let fixture: ComponentFixture<KybDocumentReviewPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KybDocumentReviewPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(KybDocumentReviewPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
