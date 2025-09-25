/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {MintQuoteService} from './mintquote.service';
import {OrchardMintQuoteTtls} from './mintquote.model';

describe('MintQuoteService', () => {
	let mint_quote_service: MintQuoteService;
	let mint_rpc_service: jest.Mocked<CashuMintRpcService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintQuoteService,
				{provide: CashuMintRpcService, useValue: {getQuoteTtl: jest.fn(), updateQuoteTtl: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_quote_service = module.get<MintQuoteService>(MintQuoteService);
		mint_rpc_service = module.get(CashuMintRpcService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(mint_quote_service).toBeDefined();
	});

	it('getMintQuoteTtl returns OrchardMintQuoteTtls', async () => {
		mint_rpc_service.getQuoteTtl.mockResolvedValue({mint_ttl: 1, melt_ttl: 2} as any);
		const result = await mint_quote_service.getMintQuoteTtl('TAG');
		expect(result).toEqual({mint_ttl: 1, melt_ttl: 2});
	});

	it('updateMintQuoteTtl returns input and calls RPC', async () => {
		const input = {mint_ttl: 1, melt_ttl: 2} as any;
		const result = await mint_quote_service.updateMintQuoteTtl('TAG', input);
		expect(result).toEqual(input);
		expect(mint_rpc_service.updateQuoteTtl).toHaveBeenCalled();
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mint_rpc_service.getQuoteTtl.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintRpcActionError);
		await expect(mint_quote_service.getMintQuoteTtl('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
