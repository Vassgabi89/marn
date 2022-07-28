import { TestBed } from '@angular/core/testing';

import { RendmodService } from './rendmod.service';

describe('RendmodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RendmodService = TestBed.get(RendmodService);
    expect(service).toBeTruthy();
  });
});
