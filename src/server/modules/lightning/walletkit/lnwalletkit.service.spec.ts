import { Test, TestingModule } from '@nestjs/testing';
import { LightningWalletKitService } from './lnwalletkit.service';

describe('LightningWalletKitService', () => {
  let service: LightningWalletKitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LightningWalletKitService],
    }).compile();

    service = module.get<LightningWalletKitService>(LightningWalletKitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
