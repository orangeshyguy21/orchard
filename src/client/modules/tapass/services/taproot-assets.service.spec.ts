import { TestBed } from '@angular/core/testing';

import { TaprootAssetsService } from './taproot-assets.service';

describe('TaprootAssetsService', () => {
  let service: TaprootAssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaprootAssetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
