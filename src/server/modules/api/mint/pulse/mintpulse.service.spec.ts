/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {MintPulseService} from './mintpulse.service';
import {OrchardMintPulse} from './mintpulse.model';

describe('MintPulseService', () => {
	let mintPulseService: MintPulseService;
	let mintDbService: jest.Mocked<CashuMintDatabaseService>;
	let errorService: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintPulseService,
				{
					provide: CashuMintDatabaseService,
					useValue: {
						getMintCountMintQuotes: jest.fn().mockResolvedValue(0),
						getMintCountMeltQuotes: jest.fn().mockResolvedValue(0),
						getMintCountSwaps: jest.fn().mockResolvedValue(0),
					},
				},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mintPulseService = module.get<MintPulseService>(MintPulseService);
		mintDbService = module.get(CashuMintDatabaseService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mintPulseService).toBeDefined();
	});

	it('getMintPulse returns OrchardMintPulse with aggregated counts', async () => {
		mintDbService.getMintCountMintQuotes.mockResolvedValue(10 as any);
		mintDbService.getMintCountMeltQuotes.mockResolvedValue(5 as any);
		mintDbService.getMintCountSwaps.mockResolvedValue(3 as any);

		const result = await mintPulseService.getMintPulse('TAG');
		expect(result).toBeInstanceOf(OrchardMintPulse);
		expect(result.current_24h.mint_count).toBe(10);
		expect(result.current_24h.melt_count).toBe(5);
		expect(result.current_24h.swap_count).toBe(3);
		expect(result.mint_quote_rate).toBeDefined();
		expect(result.melt_quote_rate).toBeDefined();
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mintDbService.getMintCountMintQuotes.mockRejectedValue(new Error('boom'));
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintDatabaseSelectError});
		await expect(mintPulseService.getMintPulse('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
