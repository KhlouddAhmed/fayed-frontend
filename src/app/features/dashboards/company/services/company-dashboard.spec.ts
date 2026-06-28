import { TestBed } from '@angular/core/testing';

import { CompanyDashboard } from './company-dashboard';

describe('CompanyDashboard', () => {
  let service: CompanyDashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyDashboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
