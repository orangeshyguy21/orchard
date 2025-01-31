import { Test, TestingModule } from '@nestjs/testing';
import { CashuMintApiService } from './cashumintapi.service';

describe('CashuMintApiService', () => {
  let service: CashuMintApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashuMintApiService],
    }).compile();

    service = module.get<CashuMintApiService>(CashuMintApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});