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
import {MintMeltQuoteService} from './mintmeltquote.service';
import {OrchardMintMeltQuote, OrchardMintNut05Update} from './mintmeltquote.model';

describe('MintMeltQuoteService', () => {
	let mint_melt_quote_service: MintMeltQuoteService;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let mint_rpc_service: jest.Mocked<CashuMintRpcService>;
	let error_service: jest.Mocked<ErrorService>;

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
		mint_db_service = module.get(CashuMintDatabaseService);
		mint_rpc_service = module.get(CashuMintRpcService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mint_melt_quote_service).toBeDefined();
	});

	it('getMintMeltQuotes returns OrchardMintMeltQuote[]', async () => {
		mint_db_service.getMintMeltQuotes.mockResolvedValue([{id: 'q', unit: 'sat'}] as any);
		const result = await mint_melt_quote_service.getMintMeltQuotes('TAG', {} as any);
		expect(result[0]).toBeInstanceOf(OrchardMintMeltQuote);
	});

	it('updateMintNut05 returns input and calls RPC', async () => {
		const input = {unit: 'sat', method: 'bolt11'} as any;
		const result = await mint_melt_quote_service.updateMintNut05('TAG', input);
		expect(result).toEqual(input);
		expect(mint_rpc_service.updateNut05).toHaveBeenCalled();
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mint_db_service.getMintMeltQuotes.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseSelectError);
		await expect(mint_melt_quote_service.getMintMeltQuotes('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintDatabaseSelectError});
	});
});
