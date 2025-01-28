import { Test, TestingModule } from '@nestjs/testing';
import { CashuService } from './cashu.service';

describe('CashuService', () => {
  let service: CashuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashuService],
    }).compile();

    service = module.get<CashuService>(CashuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
