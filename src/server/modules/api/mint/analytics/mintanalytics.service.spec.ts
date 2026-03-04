/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintAnalyticsService} from '@server/modules/cashu/mintanalytics/mintanalytics.service';
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
					provide: CashuMintAnalyticsService,
					useValue: {
						getCachedAnalytics: jest.fn().mockResolvedValue([]),
						getBackfillStatus: jest.fn().mockReturnValue({is_running: false}),
					},
				},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mintAnalyticsService = module.get<MintAnalyticsService>(MintAnalyticsService);
	});

	it('should be defined', () => {
		expect(mintAnalyticsService).toBeDefined();
	});
});
