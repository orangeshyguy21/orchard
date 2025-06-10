import { Test, TestingModule } from '@nestjs/testing';
import { LndService } from './lnd.service';

describe('LndService', () => {
  let service: LndService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LndService],
    }).compile();

    service = module.get<LndService>(LndService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
