import { Test, TestingModule } from '@nestjs/testing';
import { TaprootAssetsWalletService } from './tapwallet.service';

describe('TaprootAssetsWalletService', () => {
  let service: TaprootAssetsWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaprootAssetsWalletService],
    }).compile();

    service = module.get<TaprootAssetsWalletService>(TaprootAssetsWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
