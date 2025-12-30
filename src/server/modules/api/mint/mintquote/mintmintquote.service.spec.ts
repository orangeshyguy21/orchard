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
	let mintMintQuoteService: MintMintQuoteService;
	let mintDbService: jest.Mocked<CashuMintDatabaseService>;
	let mintRpcService: jest.Mocked<CashuMintRpcService>;
	let errorService: jest.Mocked<ErrorService>;

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

		mintMintQuoteService = module.get<MintMintQuoteService>(MintMintQuoteService);
		mintDbService = module.get(CashuMintDatabaseService);
		mintRpcService = module.get(CashuMintRpcService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mintMintQuoteService).toBeDefined();
	});

	it('getMintMintQuotes returns OrchardMintMintQuote[]', async () => {
		mintDbService.getMintMintQuotes.mockResolvedValue([{id: 'q', unit: 'sat'}] as any);
		const result = await mintMintQuoteService.getMintMintQuotes('TAG', {} as any);
		expect(result[0]).toBeInstanceOf(OrchardMintMintQuote);
	});

	it('updateMintNut04 returns input and calls RPC', async () => {
		const input = {unit: 'sat', method: 'bolt11'} as any;
		const result = await mintMintQuoteService.updateMintNut04('TAG', input);
		expect(result).toEqual(input);
		expect(mintRpcService.updateNut04).toHaveBeenCalled();
	});

	it('updateMintNut04Quote returns result from RPC', async () => {
		mintRpcService.updateNut04Quote.mockResolvedValue({quote_id: '1', state: 'PAID'} as any);
		const result = await mintMintQuoteService.updateMintNut04Quote('TAG', {quote_id: '1', state: 'PAID'} as any);
		expect(result).toEqual({quote_id: '1', state: 'PAID'});
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mintDbService.getMintMintQuotes.mockRejectedValue(new Error('boom'));
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintDatabaseSelectError});
		await expect(mintMintQuoteService.getMintMintQuotes('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = errorService.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintDatabaseSelectError});
	});
});
