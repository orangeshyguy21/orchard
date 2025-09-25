/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Native Dependencies */
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

	it('unsupported method maps to support error', async () => {
		(cdk_service.initializeGrpcClient as jest.Mock).mockReturnValue({} as any);
		config_service.get.mockReturnValue('cdk');
		await cashu_mint_rpc_service.onModuleInit();
		await expect(cashu_mint_rpc_service.getMintInfo()).rejects.toBe(OrchardErrorCode.MintSupportError);
	});
});
