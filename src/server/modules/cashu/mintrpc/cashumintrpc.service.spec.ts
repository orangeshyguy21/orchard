/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Native Dependencies */
import {Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {CdkService} from '@server/modules/cashu/cdk/cdk.service';
import {NutshellService} from '@server/modules/cashu/nutshell/nutshell.service';
/* Local Dependencies */
import {CashuMintRpcService} from './cashumintrpc.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';

describe('CashuMintRpcService', () => {
	let cashu_mint_rpc_service: CashuMintRpcService;
	let config_service: jest.Mocked<ConfigService>;
	let cdk_service: jest.Mocked<CdkService>;
	let nutshell_service: jest.Mocked<NutshellService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CashuMintRpcService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CdkService, useValue: {initializeGrpcClient: jest.fn()}},
				{provide: NutshellService, useValue: {initializeGrpcClient: jest.fn()}},
			],
		}).compile();

		cashu_mint_rpc_service = module.get<CashuMintRpcService>(CashuMintRpcService);
		config_service = module.get(ConfigService) as any;
		cdk_service = module.get(CdkService) as any;
		nutshell_service = module.get(NutshellService) as any;
	});

	it('should be defined', () => {
		expect(cashu_mint_rpc_service).toBeDefined();
	});

	it('throws connection error when no client initialized', async () => {
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await expect(cashu_mint_rpc_service.getMintInfo()).rejects.toBe(OrchardErrorCode.MintRpcConnectionError);
	});

	it('delegates to CDK and maps getMintInfo', async () => {
		const client = {GetInfo: jest.fn((req: any, cb: any) => cb(null, {long_description: 'L'}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		const out = await cashu_mint_rpc_service.getMintInfo();
		expect(out.description_long).toBe('L');
	});

	it('initializes nutshell client when type is nutshell', async () => {
		const client = {GetInfo: jest.fn((req: any, cb: any) => cb(null, {long_description: 'X'}))};
		(nutshell_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('nutshell');
		await cashu_mint_rpc_service.onModuleInit();
		const out = await cashu_mint_rpc_service.getMintInfo();
		expect(nutshell_service.initializeGrpcClient).toHaveBeenCalledTimes(1);
		expect(out.description_long).toBe('X');
	});

	it('unknown type yields connection error', async () => {
		config_service.get.mockReturnValue('unknown');
		await cashu_mint_rpc_service.onModuleInit();
		await expect(cashu_mint_rpc_service.getMintInfo()).rejects.toBe(OrchardErrorCode.MintRpcConnectionError);
	});

	it('maps UNAVAILABLE and INTERNAL errors correctly', async () => {
		const client = {
			GetInfo: jest.fn((req: any, cb: any) => cb(new Error('14 UNAVAILABLE'), null)),
		};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await expect(cashu_mint_rpc_service.getMintInfo()).rejects.toBe(OrchardErrorCode.MintRpcConnectionError);

		client.GetInfo.mockImplementationOnce((req: any, cb: any) => cb(new Error('13 INTERNAL'), null));
		await expect(cashu_mint_rpc_service.getMintInfo()).rejects.toBe(OrchardErrorCode.MintRpcInternalError);
	});

	it('maps UNIMPLEMENTED to MintSupportError and logs', async () => {
		const debug_spy = jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
		const client = {
			GetInfo: jest.fn((req: any, cb: any) => cb(new Error('12 UNIMPLEMENTED'), null)),
		};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await expect(cashu_mint_rpc_service.getMintInfo()).rejects.toBe(OrchardErrorCode.MintSupportError);
		expect(debug_spy).toHaveBeenCalled();
		debug_spy.mockRestore();
	});

	it('passes through unknown errors', async () => {
		const err = new Error('boom');
		const client = {GetInfo: jest.fn((req: any, cb: any) => cb(err, null))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await expect(cashu_mint_rpc_service.getMintInfo()).rejects.toBe(err);
	});

	it('unsupported method maps to support error', async () => {
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue({} as any);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await expect(cashu_mint_rpc_service.getMintInfo()).rejects.toBe(OrchardErrorCode.MintSupportError);
	});

	it('getQuoteTtl forwards empty request', async () => {
		const client = {GetQuoteTtl: jest.fn((req: any, cb: any) => cb(null, {mint_ttl: 1, melt_ttl: 2}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.getQuoteTtl();
		expect(client.GetQuoteTtl).toHaveBeenCalledWith({}, expect.any(Function));
	});

	it('updateName sends name including null', async () => {
		const client: any = {UpdateName: jest.fn((req: any, cb: any) => cb(null, {}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.updateName({name: 'mint'});
		expect(client.UpdateName).toHaveBeenCalledWith({name: 'mint'}, expect.any(Function));
		await cashu_mint_rpc_service.updateName({name: null});
		expect(client.UpdateName).toHaveBeenCalledWith({name: null}, expect.any(Function));
	});

	it('updateMotd sends motd', async () => {
		const client: any = {UpdateMotd: jest.fn((req: any, cb: any) => cb(null, {}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.updateMotd({motd: 'hi'});
		expect(client.UpdateMotd).toHaveBeenCalledWith({motd: 'hi'}, expect.any(Function));
	});

	it('updateShortDescription sends description', async () => {
		const client: any = {UpdateShortDescription: jest.fn((req: any, cb: any) => cb(null, {}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.updateShortDescription({description: 'd'});
		expect(client.UpdateShortDescription).toHaveBeenCalledWith({description: 'd'}, expect.any(Function));
	});

	it('updateLongDescription sends description', async () => {
		const client: any = {UpdateLongDescription: jest.fn((req: any, cb: any) => cb(null, {}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.updateLongDescription({description: 'dd'});
		expect(client.UpdateLongDescription).toHaveBeenCalledWith({description: 'dd'}, expect.any(Function));
	});

	it('updateIconUrl sends icon_url', async () => {
		const client: any = {UpdateIconUrl: jest.fn((req: any, cb: any) => cb(null, {}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.updateIconUrl({icon_url: 'http://x'});
		expect(client.UpdateIconUrl).toHaveBeenCalledWith({icon_url: 'http://x'}, expect.any(Function));
	});

	it('addUrl and removeUrl send url', async () => {
		const client: any = {
			AddUrl: jest.fn((req: any, cb: any) => cb(null, {})),
			RemoveUrl: jest.fn((req: any, cb: any) => cb(null, {})),
		};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.addUrl({url: 'u'});
		expect(client.AddUrl).toHaveBeenCalledWith({url: 'u'}, expect.any(Function));
		await cashu_mint_rpc_service.removeUrl({url: 'u'});
		expect(client.RemoveUrl).toHaveBeenCalledWith({url: 'u'}, expect.any(Function));
	});

	it('addContact and removeContact send method and info', async () => {
		const client: any = {
			AddContact: jest.fn((req: any, cb: any) => cb(null, {})),
			RemoveContact: jest.fn((req: any, cb: any) => cb(null, {})),
		};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.addContact({method: 'nostr', info: 'npub'});
		expect(client.AddContact).toHaveBeenCalledWith({method: 'nostr', info: 'npub'}, expect.any(Function));
		await cashu_mint_rpc_service.removeContact({method: 'nostr', info: 'npub'});
		expect(client.RemoveContact).toHaveBeenCalledWith({method: 'nostr', info: 'npub'}, expect.any(Function));
	});

	it('updateNut04 builds request with optional fields correctly', async () => {
		const client: any = {UpdateNut04: jest.fn((req: any, cb: any) => cb(null, {}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.updateNut04({unit: 'sat', method: 'bolt11'});
		expect(client.UpdateNut04).toHaveBeenCalledWith({unit: 'sat', method: 'bolt11'}, expect.any(Function));
		await cashu_mint_rpc_service.updateNut04({unit: 'sat', method: 'bolt11', disabled: true, min_amount: 1, max_amount: 10});
		expect(client.UpdateNut04).toHaveBeenCalledWith(
			{unit: 'sat', method: 'bolt11', disabled: true, min_amount: 1, max_amount: 10},
			expect.any(Function),
		);
		await cashu_mint_rpc_service.updateNut04({unit: 'sat', method: 'bolt11', description: true});
		expect(client.UpdateNut04).toHaveBeenCalledWith(
			{unit: 'sat', method: 'bolt11', options: {description: true}},
			expect.any(Function),
		);
	});

	it('updateNut05 builds request with optional fields correctly', async () => {
		const client: any = {UpdateNut05: jest.fn((req: any, cb: any) => cb(null, {}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.updateNut05({unit: 'sat', method: 'bolt11'});
		expect(client.UpdateNut05).toHaveBeenCalledWith({unit: 'sat', method: 'bolt11'}, expect.any(Function));
		await cashu_mint_rpc_service.updateNut05({unit: 'sat', method: 'bolt11', disabled: true, min_amount: 1, max_amount: 10});
		expect(client.UpdateNut05).toHaveBeenCalledWith(
			{unit: 'sat', method: 'bolt11', disabled: true, min_amount: 1, max_amount: 10},
			expect.any(Function),
		);
		await cashu_mint_rpc_service.updateNut05({unit: 'sat', method: 'bolt11', amountless: true});
		expect(client.UpdateNut05).toHaveBeenCalledWith({unit: 'sat', method: 'bolt11', options: {amountless: true}}, expect.any(Function));
	});

	it('updateQuoteTtl sends only provided fields', async () => {
		const client: any = {UpdateQuoteTtl: jest.fn((req: any, cb: any) => cb(null, {}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.updateQuoteTtl({});
		expect(client.UpdateQuoteTtl).toHaveBeenCalledWith({}, expect.any(Function));
		await cashu_mint_rpc_service.updateQuoteTtl({mint_ttl: 100});
		expect(client.UpdateQuoteTtl).toHaveBeenCalledWith({mint_ttl: 100}, expect.any(Function));
		await cashu_mint_rpc_service.updateQuoteTtl({melt_ttl: 200});
		expect(client.UpdateQuoteTtl).toHaveBeenCalledWith({melt_ttl: 200}, expect.any(Function));
		await cashu_mint_rpc_service.updateQuoteTtl({mint_ttl: 100, melt_ttl: 200});
		expect(client.UpdateQuoteTtl).toHaveBeenCalledWith({mint_ttl: 100, melt_ttl: 200}, expect.any(Function));
	});

	it('updateNut04Quote sends quote_id and state', async () => {
		const client: any = {UpdateNut04Quote: jest.fn((req: any, cb: any) => cb(null, {quote_id: 'q', state: 's'}))};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.updateNut04Quote({quote_id: 'q', state: 's'});
		expect(client.UpdateNut04Quote).toHaveBeenCalledWith({quote_id: 'q', state: 's'}, expect.any(Function));
	});

	it('rotateNextKeyset sends unit and optional fields when provided', async () => {
		const client: any = {
			RotateNextKeyset: jest.fn((req: any, cb: any) => cb(null, {id: '1', unit: 'sat', max_order: 1, input_fee_ppk: 2})),
		};
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue(client);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await cashu_mint_rpc_service.rotateNextKeyset({unit: 'sat'});
		expect(client.RotateNextKeyset).toHaveBeenCalledWith({unit: 'sat'}, expect.any(Function));
		await cashu_mint_rpc_service.rotateNextKeyset({unit: 'sat', max_order: 10});
		expect(client.RotateNextKeyset).toHaveBeenCalledWith({unit: 'sat', max_order: 10}, expect.any(Function));
		await cashu_mint_rpc_service.rotateNextKeyset({unit: 'sat', input_fee_ppk: 5});
		expect(client.RotateNextKeyset).toHaveBeenCalledWith({unit: 'sat', input_fee_ppk: 5}, expect.any(Function));
		await cashu_mint_rpc_service.rotateNextKeyset({unit: 'sat', max_order: 10, input_fee_ppk: 5});
		expect(client.RotateNextKeyset).toHaveBeenCalledWith({unit: 'sat', max_order: 10, input_fee_ppk: 5}, expect.any(Function));
	});
});
