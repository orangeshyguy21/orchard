/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintPromiseService} from './mintpromise.service';

describe('MintPromiseService', () => {
	let mint_promise_service: MintPromiseService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintPromiseService,
				{provide: CashuMintDatabaseService, useValue: {getMintPromiseGroups: jest.fn()}},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_promise_service = module.get<MintPromiseService>(MintPromiseService);
	});

	it('should be defined', () => {
		expect(mint_promise_service).toBeDefined();
	});
});
