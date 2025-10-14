/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {TaprootAssetsService} from '@server/modules/tapass/tapass/tapass.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {TaprootAssetsAssetService} from './tapasset.service';
import {OrchardTaprootAssets, OrchardTaprootAssetsUtxo} from './tapasset.model';

describe('TaprootAssetsAssetService', () => {
	let taproot_assets_asset_service: TaprootAssetsAssetService;
	let tap_service: jest.Mocked<TaprootAssetsService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TaprootAssetsAssetService,
				{provide: TaprootAssetsService, useValue: {getListTaprootAssets: jest.fn(), getListTaprootAssetsUtxos: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		taproot_assets_asset_service = module.get<TaprootAssetsAssetService>(TaprootAssetsAssetService);
		tap_service = module.get(TaprootAssetsService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(taproot_assets_asset_service).toBeDefined();
	});

	it('getTaprootAssets returns OrchardTaprootAssets', async () => {
		tap_service.getListTaprootAssets.mockResolvedValue({
			assets: [
				{
					version: 0 as any,
					amount: '0',
					asset_group: null,
					is_spent: false,
					is_burn: false,
					asset_genesis: {
						genesis_point: '0:0',
						name: 'asset',
						asset_id: Buffer.alloc(32),
						asset_type: 0 as any,
						output_index: 0,
					},
					decimal_display: {decimal_display: 0},
				},
			],
			unconfirmed_transfers: '0',
			unconfirmed_mints: '0',
		} as any);
		const result = await taproot_assets_asset_service.getTaprootAssets('TAG');
		expect(result).toBeInstanceOf(OrchardTaprootAssets);
	});

	it('getTaprootAssetsUtxo returns OrchardTaprootAssetsUtxo[]', async () => {
		tap_service.getListTaprootAssetsUtxos.mockResolvedValue({
			managed_utxos: {
				'txid:0': {
					amt_sat: '0',
					assets: [
						{
							version: 0 as any,
							amount: '0',
							asset_group: null,
							is_spent: false,
							is_burn: false,
							asset_genesis: {
								genesis_point: '0:0',
								name: 'asset',
								asset_id: Buffer.alloc(32),
								asset_type: 0 as any,
								output_index: 0,
							},
							decimal_display: {decimal_display: 0},
						},
					],
				},
			},
		} as any);
		const result = await taproot_assets_asset_service.getTaprootAssetsUtxo('TAG');
		expect(Array.isArray(result)).toBe(true);
		expect(result[0]).toBeInstanceOf(OrchardTaprootAssetsUtxo);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		tap_service.getListTaprootAssets.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.TaprootAssetsRpcActionError);
		await expect(taproot_assets_asset_service.getTaprootAssets('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.TaprootAssetsRpcActionError});
	});
});
