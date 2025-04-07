import { TestBed } from '@angular/core/testing';

import { BitcoinService } from './bitcoin.service';

describe('BitcoinService', () => {
  let service: BitcoinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitcoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
