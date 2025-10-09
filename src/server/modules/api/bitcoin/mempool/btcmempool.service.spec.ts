/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {BitcoinMempoolService} from './btcmempool.service';
import {OrchardBitcoinMempoolTransaction} from './btcmempool.model';

describe('BitcoinMempoolService', () => {
	let bitcoin_mempool_service: BitcoinMempoolService;
	let bitcoin_rpc_service: jest.Mocked<BitcoinRpcService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinMempoolService,
				{provide: BitcoinRpcService, useValue: {getBitcoinMempool: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		bitcoin_mempool_service = module.get<BitcoinMempoolService>(BitcoinMempoolService);
		bitcoin_rpc_service = module.get(BitcoinRpcService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(bitcoin_mempool_service).toBeDefined();
	});

	it('returns OrchardBitcoinMempoolTransaction[]', async () => {
		bitcoin_rpc_service.getBitcoinMempool.mockResolvedValue({
			txid1: {
				vsize: 100,
				weight: 400,
				time: 0,
				height: 1,
				descendantcount: 0,
				descendantsize: 0,
				ancestorcount: 0,
				ancestorsize: 0,
				wtxid: 'w',
				fees: {base: 1, modified: 1, ancestor: 1, descendant: 1},
				depends: [],
				spentby: [],
				'bip125-replaceable': false,
				unbroadcast: false,
			},
		} as any);
		const result = await bitcoin_mempool_service.getBitcoinMempoolTransactions('TAG');
		expect(result[0]).toBeInstanceOf(OrchardBitcoinMempoolTransaction);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		bitcoin_rpc_service.getBitcoinMempool.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.BitcoinRPCError);
		await expect(bitcoin_mempool_service.getBitcoinMempoolTransactions('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.BitcoinRPCError});
	});
});
