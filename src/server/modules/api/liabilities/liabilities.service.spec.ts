import { Test, TestingModule } from '@nestjs/testing';
import { LiabilitiesService } from './liabilities.service';

describe('LiabilitiesService', () => {
  let service: LiabilitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiabilitiesService],
    }).compile();

    service = module.get<LiabilitiesService>(LiabilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
