/* Core Dependencies */
import { Test, TestingModule } from '@nestjs/testing';
/* Local Dependencies */
import { MintInfoService } from './mintinfo.service';

describe('MintInfoService', () => {
  let service: MintInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MintInfoService],
    }).compile();

    service = module.get<MintInfoService>(MintInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
