/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Native Dependencies */
import {ConfigService} from '@nestjs/config';
import {CdkService} from '@server/modules/cashu/cdk/cdk.service';
import {NutshellService} from '@server/modules/cashu/nutshell/nutshell.service';
/* Local Dependencies */
import {CashuMintRpcService} from './cashumintrpc.service';

describe('CashuMintRpcService', () => {
	let cashu_mint_rpc_service: CashuMintRpcService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CashuMintRpcService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CdkService, useValue: {initializeGrpcClient: jest.fn().mockReturnValue({})}},
				{provide: NutshellService, useValue: {initializeGrpcClient: jest.fn().mockReturnValue({})}},
			],
		}).compile();

		cashu_mint_rpc_service = module.get<CashuMintRpcService>(CashuMintRpcService);
	});

	it('should be defined', () => {
		expect(cashu_mint_rpc_service).toBeDefined();
	});
});
