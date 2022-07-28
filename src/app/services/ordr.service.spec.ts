import { TestBed } from '@angular/core/testing';

import { OrdrService } from './ordr.service';

describe('OrdrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrdrService = TestBed.get(OrdrService);
    expect(service).toBeTruthy();
  });
});
