/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintMeltQuoteService} from './mintmeltquote.service';

describe('MintMeltQuoteService', () => {
	let mint_melt_quote_service: MintMeltQuoteService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintMeltQuoteService,
				{provide: CashuMintDatabaseService, useValue: {getMintMeltQuotes: jest.fn()}},
				{provide: CashuMintRpcService, useValue: {updateNut05: jest.fn()}},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_melt_quote_service = module.get<MintMeltQuoteService>(MintMeltQuoteService);
	});

	it('should be defined', () => {
		expect(mint_melt_quote_service).toBeDefined();
	});
});
