import { Test, TestingModule } from '@nestjs/testing';
import { CashuMintRpcService } from './cashumintrpc.service';

describe('CashuMintRpcService', () => {
  let service: CashuMintRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashuMintRpcService],
    }).compile();

    service = module.get<CashuMintRpcService>(CashuMintRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
