import { Test, TestingModule } from '@nestjs/testing';
import { KeysetService } from './keyset.service';

describe('KeysetService', () => {
  let service: KeysetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeysetService],
    }).compile();

    service = module.get<KeysetService>(KeysetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
