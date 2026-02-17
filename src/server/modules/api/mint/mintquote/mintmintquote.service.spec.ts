/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {CashuMintApiService} from '@server/modules/cashu/mintapi/cashumintapi.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintQuoteState, MintUnit} from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import {MintMintQuoteService} from './mintmintquote.service';
import {OrchardMintMintQuote} from './mintmintquote.model';

describe('MintMintQuoteService', () => {
	let mintMintQuoteService: MintMintQuoteService;
	let mintDbService: jest.Mocked<CashuMintDatabaseService>;
	let mintRpcService: jest.Mocked<CashuMintRpcService>;
	let mintApiService: jest.Mocked<CashuMintApiService>;
	let errorService: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintMintQuoteService,
				{provide: CashuMintDatabaseService, useValue: {getMintMintQuotes: jest.fn()}},
				{provide: CashuMintRpcService, useValue: {updateNut04: jest.fn(), updateNut04Quote: jest.fn()}},
				{provide: CashuMintApiService, useValue: {createMintNut04Quote: jest.fn()}},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mintMintQuoteService = module.get<MintMintQuoteService>(MintMintQuoteService);
		mintDbService = module.get(CashuMintDatabaseService);
		mintRpcService = module.get(CashuMintRpcService);
		mintApiService = module.get(CashuMintApiService);
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

	it('adminIssueMintNut04Quote creates quote then forces PAID state', async () => {
		mintApiService.createMintNut04Quote.mockResolvedValue({
			quote: 'q1',
			request: 'lnbc1...',
			amount: 21,
			unit: 'sat' as any,
		});

		const result = await mintMintQuoteService.adminIssueMintNut04Quote('TAG', {
			amount: 21,
			unit: 'sat' as any,
			method: 'bolt11',
		});

		expect(mintApiService.createMintNut04Quote).toHaveBeenCalledWith('bolt11', {
			amount: 21,
			unit: MintUnit.sat,
			description: undefined,
		});
		expect(mintRpcService.updateNut04Quote).toHaveBeenCalledWith({quote_id: 'q1', state: MintQuoteState.PAID});
		expect(result).toEqual({
			quote_id: 'q1',
			request: 'lnbc1...',
			amount: 21,
			unit: MintUnit.sat,
			state: MintQuoteState.PAID,
		});
	});

	it('adminIssueMintNut04Quote wraps API errors into OrchardApiError', async () => {
		mintApiService.createMintNut04Quote.mockRejectedValue(new Error('boom'));
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintRpcActionError});

		await expect(
			mintMintQuoteService.adminIssueMintNut04Quote('TAG', {amount: 10, unit: 'sat' as any, method: 'bolt11'}),
		).rejects.toBeInstanceOf(OrchardApiError);
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
