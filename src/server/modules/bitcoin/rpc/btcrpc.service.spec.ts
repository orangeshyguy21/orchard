import { Test, TestingModule } from '@nestjs/testing';
import { BitcoinRpcService } from './btcrpc.service';

describe('BitcoinRpcService', () => {
  let service: BitcoinRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BitcoinRpcService],
    }).compile();

    service = module.get<BitcoinRpcService>(BitcoinRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
