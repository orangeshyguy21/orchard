/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {BitcoinMempoolService} from './btcmempool.service';

describe('BitcoinMempoolService', () => {
	let bitcoin_mempool_service: BitcoinMempoolService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinMempoolService,
				{provide: BitcoinRpcService, useValue: {getBitcoinMempool: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		bitcoin_mempool_service = module.get<BitcoinMempoolService>(BitcoinMempoolService);
	});

	it('should be defined', () => {
		expect(bitcoin_mempool_service).toBeDefined();
	});
});
