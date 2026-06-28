import { TestBed } from '@angular/core/testing';

import { Kyb } from './kyb';

describe('Kyb', () => {
  let service: Kyb;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Kyb);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
