/* Core Dependencies */
import { Test, TestingModule } from '@nestjs/testing';
/* Internal Dependencies */
import { MintDatabaseService } from './mintdatabase.service'; 

describe('MintDatabaseService', () => {
  let service: MintDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MintDatabaseService],
    }).compile();

    service = module.get<MintDatabaseService>(MintDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
