/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {TaprootAssetsService} from '@server/modules/tapass/tapass/tapass.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {TaprootAssetsInfoService} from './tapinfo.service';

describe('TaprootAssetsInfoService', () => {
	let taproot_assets_info_service: TaprootAssetsInfoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TaprootAssetsInfoService,
				{provide: TaprootAssetsService, useValue: {getTaprootAssetsInfo: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		taproot_assets_info_service = module.get<TaprootAssetsInfoService>(TaprootAssetsInfoService);
	});

	it('should be defined', () => {
		expect(taproot_assets_info_service).toBeDefined();
	});
});
