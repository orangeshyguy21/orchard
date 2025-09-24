/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintQuoteService} from './mintquote.service';

describe('MintQuoteService', () => {
	let mint_quote_service: MintQuoteService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintQuoteService,
				{provide: CashuMintRpcService, useValue: {getQuoteTtl: jest.fn(), updateQuoteTtl: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_quote_service = module.get<MintQuoteService>(MintQuoteService);
	});

	it('should be defined', () => {
		expect(mint_quote_service).toBeDefined();
	});
});
