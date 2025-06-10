import { Test, TestingModule } from '@nestjs/testing';
import { LightningBalanceService } from './lnbalance.service';

describe('LightningBalanceService', () => {
  let service: LightningBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LightningBalanceService],
    }).compile();

    service = module.get<LightningBalanceService>(LightningBalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
