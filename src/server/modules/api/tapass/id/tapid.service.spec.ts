import {Test, TestingModule} from '@nestjs/testing';
import {TaprootAssetsIdService} from './tapid.service';

describe('TapIdService', () => {
	let service: TaprootAssetsIdService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TaprootAssetsIdService],
		}).compile();

		service = module.get<TaprootAssetsIdService>(TaprootAssetsIdService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
