import { TestBed } from '@angular/core/testing';

import { MintService } from './mint.service';

describe('MintService', () => {
  let service: MintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
