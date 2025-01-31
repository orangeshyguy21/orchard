/* Core Dependencies */
import { Test, TestingModule } from '@nestjs/testing';
/* Internal Dependencies */
import { MintKeysetService } from './mintkeyset.service';

describe('MintKeysetService', () => {
  let service: MintKeysetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MintKeysetService],
    }).compile();

    service = module.get<MintKeysetService>(MintKeysetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
