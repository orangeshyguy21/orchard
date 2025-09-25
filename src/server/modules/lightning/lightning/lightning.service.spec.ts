/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Native Dependencies */
import {LndService} from '@server/modules/lightning/lnd/lnd.service';
import {ClnService} from '@server/modules/lightning/cln/cln.service';
/* Local Dependencies */
import {LightningService} from './lightning.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';

describe('LightningService', () => {
	let lightning_service: LightningService;
	let config_service: jest.Mocked<ConfigService>;
	let lnd_service: jest.Mocked<LndService>;
	let cln_service: jest.Mocked<ClnService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: LndService, useValue: {initializeLightningClient: jest.fn(), mapLndRequest: jest.fn()}},
				{
					provide: ClnService,
					useValue: {
						initializeLightningClient: jest.fn(),
						mapClnInfo: jest.fn(),
						mapClnChannelBalance: jest.fn(),
						mapClnRequest: jest.fn(),
					},
				},
			],
		}).compile();

		lightning_service = module.get<LightningService>(LightningService);
		config_service = module.get(ConfigService) as any;
		lnd_service = module.get(LndService) as any;
		cln_service = module.get(ClnService) as any;
	});

	it('should be defined', () => {
		expect(lightning_service).toBeDefined();
	});

	it('throws connection error when no client initialized', async () => {
		config_service.get.mockReturnValueOnce('lnd');
		await lightning_service.onModuleInit();
		await expect(lightning_service.getLightningInfo()).rejects.toBe(OrchardErrorCode.LightningRpcConnectionError);
	});

	it('delegates to LND when type is lnd', async () => {
		const client = {
			GetInfo: jest.fn((req: any, cb: any) => cb(null, {version: 'v'})),
			DecodePayReq: jest.fn((req: any, cb: any) => cb(null, {valid: true})),
		};
		(lnd_service.initializeLightningClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('lnd');
		await lightning_service.onModuleInit();
		await expect(lightning_service.getLightningInfo()).resolves.toEqual({version: 'v'});
		(lnd_service.mapLndRequest as jest.Mock).mockReturnValue({valid: true});
		const decoded = await lightning_service.getLightningRequest('bolt11');
		expect(decoded).toEqual({valid: true});
	});

	it('delegates to CLN and maps responses', async () => {
		const client = {
			Getinfo: jest.fn((req: any, cb: any) => cb(null, {id: 'aa'})),
			ListFunds: jest.fn((req: any, cb: any) => cb(null, {channels: []})),
			ListPeerChannels: jest.fn((req: any, cb: any) => cb(null, {channels: []})),
			Decode: jest.fn((req: any, cb: any) => cb(null, {valid: true})),
		};
		(cln_service.initializeLightningClient as jest.Mock).mockReturnValue(client);
		(cln_service.mapClnInfo as jest.Mock).mockResolvedValue({version: 'v2'});
		(cln_service.mapClnChannelBalance as jest.Mock).mockResolvedValue({balance: '0'});
		(cln_service.mapClnRequest as jest.Mock).mockReturnValue({valid: true});
		config_service.get.mockReturnValue('cln');
		await lightning_service.onModuleInit();
		await expect(lightning_service.getLightningInfo()).resolves.toEqual({version: 'v2'});
		await expect(lightning_service.getLightningChannelBalance()).resolves.toEqual({balance: '0'});
		await expect(lightning_service.getLightningRequest('str')).resolves.toEqual({valid: true});
	});

	it('maps UNAVAILABLE error to connection code', async () => {
		const client = {GetInfo: jest.fn((req: any, cb: any) => cb(new Error('14 UNAVAILABLE'), null))};
		(lnd_service.initializeLightningClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('lnd');
		await lightning_service.onModuleInit();
		await expect(lightning_service.getLightningInfo()).rejects.toBe(OrchardErrorCode.LightningRpcConnectionError);
	});

	it('unsupported method rejects with support error', async () => {
		const client = {} as any;
		(lnd_service.initializeLightningClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('lnd');
		await lightning_service.onModuleInit();
		await expect(lightning_service.getLightningChannelBalance()).rejects.toBe(OrchardErrorCode.LightningSupportError);
	});
});
