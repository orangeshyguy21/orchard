/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintCountService} from './mintcount.service';

describe('MintCountService', () => {
	let mint_count_service: MintCountService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintCountService,
				{
					provide: CashuMintDatabaseService,
					useValue: {
						getMintCountMintQuotes: jest.fn(),
						getMintCountMeltQuotes: jest.fn(),
						getMintCountProofGroups: jest.fn(),
						getMintCountPromiseGroups: jest.fn(),
					},
				},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_count_service = module.get<MintCountService>(MintCountService);
	});

	it('should be defined', () => {
		expect(mint_count_service).toBeDefined();
	});
});
