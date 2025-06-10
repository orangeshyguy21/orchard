import { Test, TestingModule } from '@nestjs/testing';
import { LightningInfoService } from './lninfo.service';

describe('LightningInfoService', () => {
  let service: LightningInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LightningInfoService],
    }).compile();

    service = module.get<LightningInfoService>(LightningInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
