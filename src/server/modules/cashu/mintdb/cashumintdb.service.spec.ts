/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Local Dependencies */
import {CashuMintDatabaseService} from './cashumintdb.service';
import {ConfigService} from '@nestjs/config';
import {NutshellService} from '@server/modules/cashu/nutshell/nutshell.service';
import {CdkService} from '@server/modules/cashu/cdk/cdk.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';

describe('CashuMintDatabaseService', () => {
	let cashu_mint_database_service: CashuMintDatabaseService;
	let config_service: jest.Mocked<ConfigService>;
	let nutshell_service: jest.Mocked<NutshellService>;
	let cdk_service: jest.Mocked<CdkService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CashuMintDatabaseService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: NutshellService, useValue: {}},
				{provide: CdkService, useValue: {}},
			],
		}).compile();

		cashu_mint_database_service = module.get<CashuMintDatabaseService>(CashuMintDatabaseService);
		config_service = module.get(ConfigService) as any;
		nutshell_service = module.get(NutshellService) as any;
		cdk_service = module.get(CdkService) as any;
	});

	it('should be defined', () => {
		expect(cashu_mint_database_service).toBeDefined();
	});

	it('getMintDatabase returns postgres client without connecting', async () => {
		config_service.get.mockImplementation((k: string) => {
			if (k === 'cashu.database_type') return 'postgres';
			if (k === 'cashu.database') return 'postgres://user:pass@localhost:5432/db';
			return undefined as any;
		});
		await cashu_mint_database_service.onModuleInit();
		const db = await cashu_mint_database_service.getMintDatabase();
		expect(db.type).toBeDefined();
	});

	it('delegates by type for balances', async () => {
		(nutshell_service.getMintBalances as any) = jest.fn().mockResolvedValue([{keyset: 'k', balance: 1}]);
		(cdk_service.getMintBalances as any) = jest.fn().mockResolvedValue([{keyset: 'k', balance: 2}]);
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'nutshell' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		const out1 = await cashu_mint_database_service.getMintBalances({} as any);
		expect(out1[0].balance).toBe(1);
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'cdk' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		const out2 = await cashu_mint_database_service.getMintBalances({} as any);
		expect(out2[0].balance).toBe(2);
	});

	it('getMintFees delegates for nutshell and errors for cdk', async () => {
		(nutshell_service.getMintFees as any) = jest.fn().mockResolvedValue([]);
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'nutshell' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		await expect(cashu_mint_database_service.getMintFees({} as any)).resolves.toEqual([]);
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'cdk' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		await expect(cashu_mint_database_service.getMintFees({} as any)).rejects.toBe(OrchardErrorCode.MintSupportError);
	});
});
