/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {MintMintQuoteService} from './mintmintquote.service';
import {OrchardMintMintQuote} from './mintmintquote.model';

describe('MintMintQuoteService', () => {
	let mint_mint_quote_service: MintMintQuoteService;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let mint_rpc_service: jest.Mocked<CashuMintRpcService>;
	let error_service: jest.Mocked<ErrorService>;

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
		mint_db_service = module.get(CashuMintDatabaseService);
		mint_rpc_service = module.get(CashuMintRpcService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mint_mint_quote_service).toBeDefined();
	});

	it('getMintMintQuotes returns OrchardMintMintQuote[]', async () => {
		mint_db_service.getMintMintQuotes.mockResolvedValue([{id: 'q', unit: 'sat'}] as any);
		const result = await mint_mint_quote_service.getMintMintQuotes('TAG', {} as any);
		expect(result[0]).toBeInstanceOf(OrchardMintMintQuote);
	});

	it('updateMintNut04 returns input and calls RPC', async () => {
		const input = {unit: 'sat', method: 'bolt11'} as any;
		const result = await mint_mint_quote_service.updateMintNut04('TAG', input);
		expect(result).toEqual(input);
		expect(mint_rpc_service.updateNut04).toHaveBeenCalled();
	});

	it('updateMintNut04Quote returns result from RPC', async () => {
		mint_rpc_service.updateNut04Quote.mockResolvedValue({quote_id: '1', state: 'PAID'} as any);
		const result = await mint_mint_quote_service.updateMintNut04Quote('TAG', {quote_id: '1', state: 'PAID'} as any);
		expect(result).toEqual({quote_id: '1', state: 'PAID'});
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mint_db_service.getMintMintQuotes.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseSelectError);
		await expect(mint_mint_quote_service.getMintMintQuotes('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintDatabaseSelectError});
	});
});
