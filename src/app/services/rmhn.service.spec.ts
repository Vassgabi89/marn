import { TestBed } from '@angular/core/testing';

import { RmhnService } from './rmhn.service';

describe('RmhnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RmhnService = TestBed.get(RmhnService);
    expect(service).toBeTruthy();
  });
});
