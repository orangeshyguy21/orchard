/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {TapdService} from '@server/modules/tapass/tapd/tapd.service';
/* Local Dependencies */
import {TaprootAssetsService} from './tapass.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';

describe('TaprootAssetsService', () => {
	let taproot_assets_service: TaprootAssetsService;
	let config_service: jest.Mocked<ConfigService>;
	let tapd_service: jest.Mocked<TapdService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TaprootAssetsService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: TapdService, useValue: {initializeTaprootAssetsClient: jest.fn().mockReturnValue({})}},
			],
		}).compile();

		taproot_assets_service = module.get<TaprootAssetsService>(TaprootAssetsService);
		config_service = module.get(ConfigService);
		tapd_service = module.get(TapdService);
		config_service.get.mockReturnValue('tapd');
		await taproot_assets_service.onModuleInit();
	});

	it('should be defined', () => {
		expect(taproot_assets_service).toBeDefined();
	});

	it('throws connection error when no client initialized', async () => {
		// re-create with missing client
		const module2: TestingModule = await Test.createTestingModule({
			providers: [
				TaprootAssetsService,
				{provide: ConfigService, useValue: {get: jest.fn().mockReturnValue('tapd')}},
				{provide: TapdService, useValue: {initializeTaprootAssetsClient: jest.fn().mockReturnValue(null)}},
			],
		}).compile();
		const svc = module2.get<TaprootAssetsService>(TaprootAssetsService);
		await svc.onModuleInit();
		await expect(svc.getTaprootAssetsInfo()).rejects.toBe(OrchardErrorCode.TaprootAssetsRpcConnectionError);
	});

	it('delegates methods to grpc client and returns responses', async () => {
		const client = {
			GetInfo: jest.fn((req: any, cb: any) => cb(null, {version: 'v'})),
			ListAssets: jest.fn((req: any, cb: any) => cb(null, {assets: []})),
			ListUtxos: jest.fn((req: any, cb: any) => cb(null, {utxos: []})),
		};
		tapd_service.initializeTaprootAssetsClient.mockReturnValue(client as any);
		await taproot_assets_service.onModuleInit();
		await expect(taproot_assets_service.getTaprootAssetsInfo()).resolves.toEqual({version: 'v'});
		await expect(taproot_assets_service.getListTaprootAssets()).resolves.toEqual({assets: []});
		await expect(taproot_assets_service.getListTaprootAssetsUtxos()).resolves.toEqual({utxos: []});
	});

	it('maps UNAVAILABLE error to connection error code', async () => {
		const client = {
			GetInfo: jest.fn((req: any, cb: any) => cb(new Error('14 UNAVAILABLE: upstream down'), null)),
		};
		tapd_service.initializeTaprootAssetsClient.mockReturnValue(client as any);
		await taproot_assets_service.onModuleInit();
		await expect(taproot_assets_service.getTaprootAssetsInfo()).rejects.toBe(OrchardErrorCode.TaprootAssetsRpcConnectionError);
	});

	it('rejects with error for unsupported method', async () => {
		const bad_client = {} as any;
		tapd_service.initializeTaprootAssetsClient.mockReturnValue(bad_client);
		await taproot_assets_service.onModuleInit();
		await expect(taproot_assets_service.getTaprootAssetsInfo()).rejects.toBe(OrchardErrorCode.TaprootAssetsSupportError);
	});
});
