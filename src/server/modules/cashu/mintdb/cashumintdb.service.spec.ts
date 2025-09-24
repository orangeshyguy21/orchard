/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Local Dependencies */
import {CashuMintDatabaseService} from './cashumintdb.service';
import {ConfigService} from '@nestjs/config';
import {NutshellService} from '@server/modules/cashu/nutshell/nutshell.service';
import {CdkService} from '@server/modules/cashu/cdk/cdk.service';

describe('CashuMintDatabaseService', () => {
	let cashu_mint_database_service: CashuMintDatabaseService;

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
	});

	it('should be defined', () => {
		expect(cashu_mint_database_service).toBeDefined();
	});
});
