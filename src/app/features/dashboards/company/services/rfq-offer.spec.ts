import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PurchaseOfferService } from './rfq-offer';

describe('PurchaseOfferService', () => {
  let service: PurchaseOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PurchaseOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
