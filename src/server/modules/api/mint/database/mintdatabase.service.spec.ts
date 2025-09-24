/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Native Dependencies */
import {MintService} from '@server/modules/api/mint/mint.service';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintDatabaseService} from './mintdatabase.service';

describe('MintDatabaseService', () => {
	let mint_database_service: MintDatabaseService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintDatabaseService,
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: CashuMintDatabaseService, useValue: {createBackup: jest.fn(), restoreBackup: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_database_service = module.get<MintDatabaseService>(MintDatabaseService);
	});

	it('should be defined', () => {
		expect(mint_database_service).toBeDefined();
	});
});
