import {Test, TestingModule} from '@nestjs/testing';
import {TaprootAssetsService} from './tapass.service';

describe('TaprootAssetsService', () => {
	let service: TaprootAssetsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TaprootAssetsService],
		}).compile();

		service = module.get<TaprootAssetsService>(TaprootAssetsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
