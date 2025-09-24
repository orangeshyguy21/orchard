/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintService} from './mint.service';

describe('MintService', () => {
	let mint_service: MintService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintService,
				{provide: CashuMintDatabaseService, useValue: {getMintDatabase: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_service = module.get<MintService>(MintService);
	});

	it('should be defined', () => {
		expect(mint_service).toBeDefined();
	});
});
