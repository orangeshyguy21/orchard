import { TestBed } from '@angular/core/testing';

import { LightningService } from './lightning.service';

describe('LightningService', () => {
  let service: LightningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LightningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
