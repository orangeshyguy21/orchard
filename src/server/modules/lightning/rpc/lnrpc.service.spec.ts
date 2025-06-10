import { Test, TestingModule } from '@nestjs/testing';
import { LnRpcService } from './lnrpc.service';

describe('LnRpcService', () => {
  let service: LnRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LnRpcService],
    }).compile();

    service = module.get<LnRpcService>(LnRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
