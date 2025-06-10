import { Test, TestingModule } from '@nestjs/testing';
import { LightningService } from './lightning.service';

describe('LightningService', () => {
  let service: LightningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LightningService],
    }).compile();

    service = module.get<LightningService>(LightningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
