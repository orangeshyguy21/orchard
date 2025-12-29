/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintAnalyticsService} from './mintanalytics.service';

describe('MintAnalyticsService', () => {
	let mintAnalyticsService: MintAnalyticsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintAnalyticsService,
				{
					provide: CashuMintDatabaseService,
					useValue: {
						getMintAnalyticsBalances: jest.fn(),
						getMintAnalyticsMints: jest.fn(),
						getMintAnalyticsMelts: jest.fn(),
						getMintAnalyticsSwaps: jest.fn(),
						getMintAnalyticsFees: jest.fn(),
						getMintAnalyticsKeysets: jest.fn(),
					},
				},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mintAnalyticsService = module.get<MintAnalyticsService>(MintAnalyticsService);
	});

	it('should be defined', () => {
		expect(mintAnalyticsService).toBeDefined();
	});
});
