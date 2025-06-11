import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinInfoService } from './btcinfo.service';

describe('BitcoinInfoService', () => {
  let service: BitcoinInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BitcoinInfoService],
    }).compile();

    service = module.get<BitcoinInfoService>(BitcoinInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
