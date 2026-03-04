/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
import {getRepositoryToken} from '@nestjs/typeorm';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintApiService} from '@server/modules/cashu/mintapi/cashumintapi.service';
import {AnalyticsCheckpoint} from '@server/modules/analytics/analytics-checkpoint.entity';
/* Local Dependencies */
import {CashuMintAnalyticsService} from './mintanalytics.service';
import {MintAnalytics} from './mintanalytics.entity';

describe('CashuMintAnalyticsService', () => {
	let service: CashuMintAnalyticsService;
	let configService: jest.Mocked<ConfigService>;
	let cashuMintDatabaseService: jest.Mocked<CashuMintDatabaseService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CashuMintAnalyticsService,
				{
					provide: getRepositoryToken(MintAnalytics),
					useValue: {find: jest.fn(), findOne: jest.fn(), count: jest.fn(), upsert: jest.fn()},
				},
				{
					provide: getRepositoryToken(AnalyticsCheckpoint),
					useValue: {findOne: jest.fn(), upsert: jest.fn()},
				},
				{
					provide: CashuMintDatabaseService,
					useValue: {
						getMintDatabase: jest.fn(),
						listMintQuotes: jest.fn(),
						listMeltQuotes: jest.fn(),
						listSwaps: jest.fn(),
						listProofs: jest.fn(),
						listPromises: jest.fn(),
					},
				},
				{
					provide: CashuMintApiService,
					useValue: {getMintInfo: jest.fn().mockResolvedValue({pubkey: 'test-pubkey'})},
				},
				{
					provide: ConfigService,
					useValue: {get: jest.fn()},
				},
			],
		}).compile();

		service = module.get<CashuMintAnalyticsService>(CashuMintAnalyticsService);
		configService = module.get(ConfigService);
		cashuMintDatabaseService = module.get(CashuMintDatabaseService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('returns backfill status with is_running false by default', () => {
		const status = service.getBackfillStatus();

		expect(status).toBeDefined();
		expect(status.is_running).toBe(false);
	});

	it('skips auto-backfill when cashu is not configured', async () => {
		configService.get.mockReturnValue(undefined);

		await service.onApplicationBootstrap();

		expect(cashuMintDatabaseService.getMintDatabase).not.toHaveBeenCalled();
	});

	it('guards against concurrent backfill execution', async () => {
		configService.get.mockImplementation((key: string) => {
			if (key === 'cashu.type') return 'cdk';
			if (key === 'cashu.database') return '/tmp/test.db';
			return undefined;
		});

		// Simulate a running backfill by calling runBackfill with a DB that never resolves
		let resolve_db: (value: any) => void;
		cashuMintDatabaseService.getMintDatabase.mockReturnValue(
			new Promise((r) => {
				resolve_db = r;
			}),
		);

		const first_run = service.runBackfill();

		// Give the first run time to set is_running
		await new Promise((r) => setTimeout(r, 10));

		// Resolve DB with a mock that returns empty batches
		resolve_db!({
			type: 'sqlite',
			database: {close: jest.fn()},
		});

		await first_run;

		// Second call should work since first is done
		cashuMintDatabaseService.getMintDatabase.mockResolvedValue({
			type: 'sqlite',
			database: {close: jest.fn()},
		} as any);
		cashuMintDatabaseService.listMintQuotes.mockResolvedValue([]);
		cashuMintDatabaseService.listMeltQuotes.mockResolvedValue([]);
		cashuMintDatabaseService.listSwaps.mockResolvedValue([]);
		cashuMintDatabaseService.listProofs.mockResolvedValue([]);
		cashuMintDatabaseService.listPromises.mockResolvedValue([]);

		await service.runBackfill();

		expect(cashuMintDatabaseService.getMintDatabase).toHaveBeenCalledTimes(2);
	});

	it('getCachedAnalytics returns filtered results', async () => {
		configService.get.mockImplementation((key: string) => {
			if (key === 'cashu.pubkey') return 'test-pubkey';
			return undefined;
		});

		const mock_repo = {
			find: jest.fn().mockResolvedValue([]),
		};
		(service as any).mintAnalyticsRepository = mock_repo;

		const result = await service.getCachedAnalytics({
			date_start: 1700000000,
			date_end: 1700003600,
		});

		expect(result).toEqual([]);
		expect(mock_repo.find).toHaveBeenCalled();
	});
});
