/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintMintQuoteService} from './mintmintquote.service';

describe('MintMintQuoteService', () => {
	let mint_mint_quote_service: MintMintQuoteService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintMintQuoteService,
				{provide: CashuMintDatabaseService, useValue: {getMintMintQuotes: jest.fn()}},
				{provide: CashuMintRpcService, useValue: {updateNut04: jest.fn(), updateNut04Quote: jest.fn()}},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_mint_quote_service = module.get<MintMintQuoteService>(MintMintQuoteService);
	});

	it('should be defined', () => {
		expect(mint_mint_quote_service).toBeDefined();
	});
});
