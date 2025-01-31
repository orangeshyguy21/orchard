import { Test, TestingModule } from '@nestjs/testing';
import { CashuMintDatabaseService } from './cashumintdb.service';

describe('CashuMintDatabaseService', () => {
  let service: CashuMintDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashuMintDatabaseService],
    }).compile();

    service = module.get<CashuMintDatabaseService>(CashuMintDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
