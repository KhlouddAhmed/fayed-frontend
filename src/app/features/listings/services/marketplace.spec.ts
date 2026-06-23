import { TestBed } from '@angular/core/testing';

import { Marketplace } from './marketplace';

describe('Marketplace', () => {
  let service: Marketplace;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Marketplace);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
