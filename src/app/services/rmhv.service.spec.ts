import { TestBed } from '@angular/core/testing';

import { RmhvService } from './rmhv.service';

describe('RmhvService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RmhvService = TestBed.get(RmhvService);
    expect(service).toBeTruthy();
  });
});
