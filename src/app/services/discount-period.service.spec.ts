import { TestBed } from '@angular/core/testing';

import { DiscountPeriodService } from './discount-period.service';

describe('DiscountPeriodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiscountPeriodService = TestBed.get(DiscountPeriodService);
    expect(service).toBeTruthy();
  });
});
