import {Test, TestingModule} from '@nestjs/testing';
import {TaprootAssetsAssetService} from './tapasset.service';

describe('TaprootAssetsAssetService', () => {
	let service: TaprootAssetsAssetService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TaprootAssetsAssetService],
		}).compile();

		service = module.get<TaprootAssetsAssetService>(TaprootAssetsAssetService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
