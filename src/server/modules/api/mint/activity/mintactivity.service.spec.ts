/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintActivityPeriod} from '@server/modules/cashu/mintdb/cashumintdb.enums';
import {MintQuoteState, MeltQuoteState, MintUnit} from '@server/modules/cashu/cashu.enums';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {MintActivityService} from './mintactivity.service';
import {OrchardMintActivitySummary} from './mintactivity.model';

/** Fixed "now" aligned to a day boundary for predictable bucket math */
const MOCK_NOW_SECONDS = 1700006400;

/** Helper: builds a mint quote with sensible defaults */
function makeMintQuote(overrides: Record<string, any> = {}) {
	return {
		id: 'mq1',
		amount: null,
		unit: MintUnit.sat,
		request: 'lnbc1',
		state: MintQuoteState.ISSUED,
		request_lookup_id: null,
		pubkey: null,
		created_time: MOCK_NOW_SECONDS - 3600,
		issued_time: MOCK_NOW_SECONDS - 3000,
		paid_time: null,
		amount_paid: 100,
		amount_issued: 100,
		payment_method: 'bolt11',
		...overrides,
	};
}

/** Helper: builds a melt quote with sensible defaults */
function makeMeltQuote(overrides: Record<string, any> = {}) {
	return {
		id: 'lq1',
		unit: MintUnit.sat,
		amount: 200,
		request: 'lnbc2',
		fee_reserve: 10,
		state: MeltQuoteState.PAID,
		payment_preimage: null,
		request_lookup_id: null,
		msat_to_pay: null,
		created_time: MOCK_NOW_SECONDS - 7200,
		paid_time: MOCK_NOW_SECONDS - 6000,
		payment_method: 'bolt11',
		...overrides,
	};
}

/** Helper: builds a swap with sensible defaults */
function makeSwap(overrides: Record<string, any> = {}) {
	return {
		operation_id: 'sw1',
		keyset_ids: ['ks1'],
		unit: MintUnit.sat,
		amount: 50,
		created_time: MOCK_NOW_SECONDS - 1800,
		fee: 1,
		...overrides,
	};
}

describe('MintActivityService', () => {
	let mintActivityService: MintActivityService;
	let mintDbService: jest.Mocked<CashuMintDatabaseService>;
	let errorService: jest.Mocked<ErrorService>;
	let date_now_spy: jest.SpyInstance;

	beforeEach(async () => {
		date_now_spy = jest.spyOn(Date, 'now').mockReturnValue(MOCK_NOW_SECONDS * 1000);

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintActivityService,
				{
					provide: CashuMintDatabaseService,
					useValue: {
						getMintMintQuotes: jest.fn().mockResolvedValue([]),
						getMintMeltQuotes: jest.fn().mockResolvedValue([]),
						getMintSwaps: jest.fn().mockResolvedValue([]),
					},
				},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mintActivityService = module.get<MintActivityService>(MintActivityService);
		mintDbService = module.get(CashuMintDatabaseService);
		errorService = module.get(ErrorService);
	});

	afterEach(() => {
		date_now_spy.mockRestore();
	});

	it('should be defined', () => {
		expect(mintActivityService).toBeDefined();
	});

	it('returns zero summary when no quotes or swaps exist', async () => {
		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week);
		expect(result).toBeInstanceOf(OrchardMintActivitySummary);
		expect(result.total_operations).toBe(0);
		expect(result.total_volume).toBe(0);
		expect(result.mint_count).toBe(0);
		expect(result.melt_count).toBe(0);
		expect(result.swap_count).toBe(0);
		expect(result.mint_completed_pct).toBe(0);
		expect(result.melt_completed_pct).toBe(0);
		expect(result.mint_avg_time).toBe(0);
		expect(result.melt_avg_time).toBe(0);
	});

	it('fetches correct date ranges for each period', async () => {
		await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.day);
		const day_calls = mintDbService.getMintMintQuotes.mock.calls;
		const current_args = day_calls[day_calls.length - 2][1];
		const prior_args = day_calls[day_calls.length - 1][1];
		expect(current_args.date_start).toBe(MOCK_NOW_SECONDS - 86400);
		expect(current_args.date_end).toBe(MOCK_NOW_SECONDS);
		expect(prior_args.date_start).toBe(MOCK_NOW_SECONDS - 86400 * 2);
		expect(prior_args.date_end).toBe(MOCK_NOW_SECONDS - 86400);

		await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.three_day);
		const three_calls = mintDbService.getMintMintQuotes.mock.calls;
		const three_current = three_calls[three_calls.length - 2][1];
		expect(three_current.date_start).toBe(MOCK_NOW_SECONDS - 259200);
	});

	it('computes counts, volumes, and deltas from quote/swap data', async () => {
		const current_mint = makeMintQuote({amount_issued: 100});
		const prior_mints = [makeMintQuote({amount_issued: 50}), makeMintQuote({amount_issued: 50})];
		const current_melt = makeMeltQuote({amount: 200, state: MeltQuoteState.PAID});
		const current_swap = makeSwap({amount: 50});

		mintDbService.getMintMintQuotes.mockResolvedValueOnce([current_mint]).mockResolvedValueOnce(prior_mints);
		mintDbService.getMintMeltQuotes.mockResolvedValueOnce([current_melt]).mockResolvedValueOnce([]);
		mintDbService.getMintSwaps.mockResolvedValueOnce([current_swap]).mockResolvedValueOnce([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week);

		expect(result.mint_count).toBe(1);
		expect(result.melt_count).toBe(1);
		expect(result.swap_count).toBe(1);
		expect(result.total_operations).toBe(3);
		expect(result.total_volume).toBe(350);
	});

	it('computes positive delta when current exceeds prior', async () => {
		mintDbService.getMintMintQuotes.mockResolvedValueOnce([makeMintQuote(), makeMintQuote()]).mockResolvedValueOnce([makeMintQuote()]);
		mintDbService.getMintMeltQuotes.mockResolvedValue([]);
		mintDbService.getMintSwaps.mockResolvedValue([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week);
		expect(result.mint_count_delta).toBe(100);
	});

	it('computes negative delta when current is less than prior', async () => {
		mintDbService.getMintMintQuotes.mockResolvedValueOnce([makeMintQuote()]).mockResolvedValueOnce([makeMintQuote(), makeMintQuote()]);
		mintDbService.getMintMeltQuotes.mockResolvedValue([]);
		mintDbService.getMintSwaps.mockResolvedValue([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week);
		expect(result.mint_count_delta).toBe(-50);
	});

	it('returns 100 delta when prior is zero and current has data', async () => {
		mintDbService.getMintMintQuotes.mockResolvedValueOnce([makeMintQuote()]).mockResolvedValueOnce([]);
		mintDbService.getMintMeltQuotes.mockResolvedValue([]);
		mintDbService.getMintSwaps.mockResolvedValue([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week);
		expect(result.mint_count_delta).toBe(100);
	});

	it('returns 0 delta when both periods are zero', async () => {
		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week);
		expect(result.mint_count_delta).toBe(0);
		expect(result.total_operations_delta).toBe(0);
	});

	it('computes completed percentage for mint quotes', async () => {
		const issued = makeMintQuote({state: MintQuoteState.ISSUED});
		const unpaid = makeMintQuote({state: MintQuoteState.UNPAID});

		mintDbService.getMintMintQuotes.mockResolvedValueOnce([issued, unpaid]).mockResolvedValueOnce([]);
		mintDbService.getMintMeltQuotes.mockResolvedValue([]);
		mintDbService.getMintSwaps.mockResolvedValue([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week);
		expect(result.mint_completed_pct).toBe(50);
	});

	it('computes average time for issued mint quotes', async () => {
		const q1 = makeMintQuote({created_time: 1000, issued_time: 1600});
		const q2 = makeMintQuote({created_time: 2000, issued_time: 2200});

		mintDbService.getMintMintQuotes.mockResolvedValueOnce([q1, q2]).mockResolvedValueOnce([]);
		mintDbService.getMintMeltQuotes.mockResolvedValue([]);
		mintDbService.getMintSwaps.mockResolvedValue([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week);
		expect(result.mint_avg_time).toBe(400);
	});

	it('computes completed percentage and avg time for melt quotes', async () => {
		const paid = makeMeltQuote({state: MeltQuoteState.PAID, created_time: 1000, paid_time: 1500, amount: 300});
		const unpaid = makeMeltQuote({state: MeltQuoteState.UNPAID, amount: 100});

		mintDbService.getMintMintQuotes.mockResolvedValue([]);
		mintDbService.getMintMeltQuotes.mockResolvedValueOnce([paid, unpaid]).mockResolvedValueOnce([]);
		mintDbService.getMintSwaps.mockResolvedValue([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week);
		expect(result.melt_completed_pct).toBe(50);
		expect(result.melt_avg_time).toBe(500);
	});

	it('produces sparkline buckets covering the full period', async () => {
		mintDbService.getMintMintQuotes.mockResolvedValue([]);
		mintDbService.getMintMeltQuotes.mockResolvedValue([]);
		mintDbService.getMintSwaps.mockResolvedValue([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week, 'UTC');
		expect(result.mint_sparkline.length).toBe(7);
		expect(result.mint_sparkline.every((b) => b.amount === 0)).toBe(true);
	});

	it('places records into correct sparkline buckets', async () => {
		const period_start = MOCK_NOW_SECONDS - 86400;
		const bucket_seconds = 3600;
		const record_time = period_start + 1800;
		const expected_bucket = Math.floor(record_time / bucket_seconds) * bucket_seconds;

		const swap = makeSwap({created_time: record_time, amount: 42});

		mintDbService.getMintMintQuotes.mockResolvedValue([]);
		mintDbService.getMintMeltQuotes.mockResolvedValue([]);
		mintDbService.getMintSwaps.mockResolvedValueOnce([swap]).mockResolvedValueOnce([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.day, 'UTC');
		const filled = result.swap_sparkline.find((b) => b.amount > 0);
		expect(filled).toBeDefined();
		expect(filled!.created_time).toBe(expected_bucket);
		expect(filled!.amount).toBe(42);
	});

	it('uses melt amount only for PAID melt quotes in sparkline', async () => {
		const paid_melt = makeMeltQuote({state: MeltQuoteState.PAID, amount: 300, created_time: MOCK_NOW_SECONDS - 3600});
		const unpaid_melt = makeMeltQuote({state: MeltQuoteState.UNPAID, amount: 500, created_time: MOCK_NOW_SECONDS - 3600});

		mintDbService.getMintMintQuotes.mockResolvedValue([]);
		mintDbService.getMintMeltQuotes.mockResolvedValueOnce([paid_melt, unpaid_melt]).mockResolvedValueOnce([]);
		mintDbService.getMintSwaps.mockResolvedValue([]);

		const result = await mintActivityService.getMintActivitySummary('TAG', MintActivityPeriod.week, 'UTC');
		const total_melt_volume = result.melt_sparkline.reduce((sum, b) => sum + b.amount, 0);
		expect(total_melt_volume).toBe(300);
	});

	it('wraps database errors via ErrorService and throws OrchardApiError', async () => {
		mintDbService.getMintMintQuotes.mockRejectedValue(new Error('db down'));
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintDatabaseSelectError});

		await expect(mintActivityService.getMintActivitySummary('MY_TAG', MintActivityPeriod.week)).rejects.toBeInstanceOf(OrchardApiError);
		const calls = errorService.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintDatabaseSelectError});
	});
});
