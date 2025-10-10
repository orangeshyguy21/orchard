/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Native Dependencies */
import {LndService} from '@server/modules/lightning/lnd/lnd.service';
import {ClnService} from '@server/modules/lightning/cln/cln.service';
/* Local Dependencies */
import {LightningWalletKitService} from './lnwalletkit.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';

describe('LightningWalletKitService', () => {
	let lightning_wallet_kit_service: LightningWalletKitService;
	let config_service: jest.Mocked<ConfigService>;
	let lnd_service: jest.Mocked<LndService>;
	let cln_service: jest.Mocked<ClnService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningWalletKitService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: LndService, useValue: {initializeWalletKitClient: jest.fn()}},
				{provide: ClnService, useValue: {initializeWalletKitClient: jest.fn(), mapClnAddresses: jest.fn()}},
			],
		}).compile();

		lightning_wallet_kit_service = module.get<LightningWalletKitService>(LightningWalletKitService);
		config_service = module.get(ConfigService);
		lnd_service = module.get(LndService);
		cln_service = module.get(ClnService);
	});

	it('should be defined', () => {
		expect(lightning_wallet_kit_service).toBeDefined();
	});

	it('throws connection error when no client', async () => {
		config_service.get.mockReturnValue('lnd');
		await lightning_wallet_kit_service.onModuleInit();
		await expect(lightning_wallet_kit_service.getLightningAddresses()).rejects.toBe(OrchardErrorCode.LightningRpcConnectionError);
	});

	it('delegates to LND and returns addresses', async () => {
		const client = {ListAddresses: jest.fn((req: any, cb: any) => cb(null, {account_with_addresses: []}))};
		(lnd_service.initializeWalletKitClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('lnd');
		await lightning_wallet_kit_service.onModuleInit();
		await expect(lightning_wallet_kit_service.getLightningAddresses()).resolves.toEqual({account_with_addresses: []});
	});

	it('delegates to CLN and maps addresses', async () => {
		const client = {ListAddresses: jest.fn((req: any, cb: any) => cb(null, {addresses: []}))};
		(cln_service.initializeWalletKitClient as jest.Mock).mockReturnValue(client);
		(cln_service.mapClnAddresses as jest.Mock).mockReturnValue({account_with_addresses: []});
		config_service.get.mockReturnValue('cln');
		await lightning_wallet_kit_service.onModuleInit();
		await expect(lightning_wallet_kit_service.getLightningAddresses()).resolves.toEqual({account_with_addresses: []});
	});

	it('maps UNAVAILABLE error to connection code', async () => {
		const client = {ListAddresses: jest.fn((req: any, cb: any) => cb(new Error('14 UNAVAILABLE'), null))};
		(lnd_service.initializeWalletKitClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('lnd');
		await lightning_wallet_kit_service.onModuleInit();
		await expect(lightning_wallet_kit_service.getLightningAddresses()).rejects.toBe(OrchardErrorCode.LightningRpcConnectionError);
	});

	it('unsupported method rejects with support error', async () => {
		const client = {} as any;
		(lnd_service.initializeWalletKitClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('lnd');
		await lightning_wallet_kit_service.onModuleInit();
		await expect(lightning_wallet_kit_service.getLightningAddresses()).rejects.toBe(OrchardErrorCode.LightningSupportError);
	});
});
