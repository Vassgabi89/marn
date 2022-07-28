import { TestBed } from '@angular/core/testing';

import { Rdr1Service } from './rdr1.service';

describe('Rdr1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Rdr1Service = TestBed.get(Rdr1Service);
    expect(service).toBeTruthy();
  });
});
