/* Core Dependencies */
import { Test, TestingModule } from '@nestjs/testing';
/* Local Dependencies */
import { MintBalanceService } from './mintbalance.service';

describe('MintBalanceService', () => {
  let service: MintBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MintBalanceService],
    }).compile();

    service = module.get<MintBalanceService>(MintBalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
