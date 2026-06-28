import { TestBed } from '@angular/core/testing';

import { RfqOffer } from './rfq-offer';

describe('RfqOffer', () => {
  let service: RfqOffer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RfqOffer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
