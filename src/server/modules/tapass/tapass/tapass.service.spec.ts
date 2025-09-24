/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {TapdService} from '@server/modules/tapass/tapd/tapd.service';
/* Local Dependencies */
import {TaprootAssetsService} from './tapass.service';

describe('TaprootAssetsService', () => {
	let taproot_assets_service: TaprootAssetsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TaprootAssetsService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: TapdService, useValue: {initializeTaprootAssetsClient: jest.fn().mockReturnValue({})}},
			],
		}).compile();

		taproot_assets_service = module.get<TaprootAssetsService>(TaprootAssetsService);
	});

	it('should be defined', () => {
		expect(taproot_assets_service).toBeDefined();
	});
});
