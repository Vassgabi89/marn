import { TestBed } from '@angular/core/testing';

import { BaseserviceService } from './baseservice.service';

describe('BaseserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseserviceService = TestBed.get(BaseserviceService);
    expect(service).toBeTruthy();
  });
});
