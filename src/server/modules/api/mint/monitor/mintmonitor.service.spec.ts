/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {MintMonitorService} from './mintmonitor.service';
import {OrchardMintMonitor} from './mintmonitor.model';

describe('MintMonitorService', () => {
	let mintMonitorService: MintMonitorService;
	let mintDbService: jest.Mocked<CashuMintDatabaseService>;
	let errorService: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintMonitorService,
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn().mockReturnValue('/tmp/orchard.db'),
					},
				},
				{
					provide: CashuMintDatabaseService,
					useValue: {
						getMintCountMintQuotes: jest.fn(),
						getMintCountMeltQuotes: jest.fn(),
						getMintCountProofGroups: jest.fn(),
						getMintCountPromiseGroups: jest.fn(),
					},
				},
				{
					provide: MintService,
					useValue: {withDbClient: jest.fn((fn: any) => fn({}))},
				},
				{
					provide: ErrorService,
					useValue: {resolveError: jest.fn()},
				},
			],
		}).compile();

		mintMonitorService = module.get<MintMonitorService>(MintMonitorService);
		mintDbService = module.get(CashuMintDatabaseService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mintMonitorService).toBeDefined();
	});

	it('getMintMonitor returns db and host metrics snapshot', async () => {
		mintDbService.getMintCountMintQuotes.mockResolvedValueOnce(10 as any).mockResolvedValueOnce(3 as any);
		mintDbService.getMintCountMeltQuotes.mockResolvedValueOnce(6 as any).mockResolvedValueOnce(2 as any);
		mintDbService.getMintCountProofGroups.mockResolvedValue(4 as any);
		mintDbService.getMintCountPromiseGroups.mockResolvedValue(8 as any);
		jest.spyOn(mintMonitorService as any, 'getHostMetrics').mockReturnValue({
			disk_free_bytes: 1000,
			disk_total_bytes: 5000,
			cpu_cores: 8,
			cpu_load_1m: 2,
			cpu_load_5m: 1.5,
			cpu_load_15m: 1.2,
			cpu_usage_percent: 25,
		});

		const result = await mintMonitorService.getMintMonitor('TAG');
		expect(result).toBeInstanceOf(OrchardMintMonitor);
		expect(result.db_entries_total).toBe(28);
		expect(result.mint_quotes_total).toBe(10);
		expect(result.melt_quotes_total).toBe(6);
		expect(result.proof_groups_total).toBe(4);
		expect(result.promise_groups_total).toBe(8);
		expect(result.request_count_recent).toBe(5);
		expect(result.recent_window_hours).toBe(24);
		expect(result.disk_free_bytes).toBe(1000);
		expect(result.disk_total_bytes).toBe(5000);
		expect(result.cpu_cores).toBe(8);
		expect(result.cpu_usage_percent).toBe(25);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mintDbService.getMintCountMintQuotes.mockRejectedValue(new Error('boom'));
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintDatabaseSelectError});
		await expect(mintMonitorService.getMintMonitor('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
