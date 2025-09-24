/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {TaprootAssetsService} from '@server/modules/tapass/tapass/tapass.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {TaprootAssetsAssetService} from './tapasset.service';

describe('TaprootAssetsAssetService', () => {
	let taproot_assets_asset_service: TaprootAssetsAssetService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TaprootAssetsAssetService,
				{provide: TaprootAssetsService, useValue: {getListTaprootAssets: jest.fn(), getListTaprootAssetsUtxos: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		taproot_assets_asset_service = module.get<TaprootAssetsAssetService>(TaprootAssetsAssetService);
	});

	it('should be defined', () => {
		expect(taproot_assets_asset_service).toBeDefined();
	});
});
