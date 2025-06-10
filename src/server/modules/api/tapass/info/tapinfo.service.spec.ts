import { Test, TestingModule } from '@nestjs/testing';
import { TaprootAssetsInfoService } from './tapinfo.service';

describe('TaprootAssetsInfoService', () => {
  let service: TaprootAssetsInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaprootAssetsInfoService],
    }).compile();

    service = module.get<TaprootAssetsInfoService>(TaprootAssetsInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
