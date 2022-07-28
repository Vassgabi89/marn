import { TestBed } from '@angular/core/testing';

import { OinvService } from './oinv.service';

describe('OinvService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OinvService = TestBed.get(OinvService);
    expect(service).toBeTruthy();
  });
});
