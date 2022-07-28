import { TestBed } from '@angular/core/testing';

import { OcrdService } from './ocrd.service';

describe('OcrdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OcrdService = TestBed.get(OcrdService);
    expect(service).toBeTruthy();
  });
});
