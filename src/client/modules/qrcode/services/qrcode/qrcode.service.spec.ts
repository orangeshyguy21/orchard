import { TestBed } from '@angular/core/testing';

import { QrcodeService } from './qrcode.service';

describe('QrcodeService', () => {
  let service: QrcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
