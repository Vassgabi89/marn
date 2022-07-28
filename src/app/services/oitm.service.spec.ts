import { TestBed } from '@angular/core/testing';

import { OitmService } from './oitm.service';

describe('OitmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OitmService = TestBed.get(OitmService);
    expect(service).toBeTruthy();
  });
});
