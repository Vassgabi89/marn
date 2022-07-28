import { TestBed } from '@angular/core/testing';

import { PruductService } from './pruduct.service';

describe('PruductService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PruductService = TestBed.get(PruductService);
    expect(service).toBeTruthy();
  });
});
