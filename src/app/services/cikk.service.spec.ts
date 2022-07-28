import { TestBed } from '@angular/core/testing';

import { CikkService } from './cikk.service';

describe('CikkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CikkService = TestBed.get(CikkService);
    expect(service).toBeTruthy();
  });
});
