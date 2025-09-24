/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {BitcoinBlockchainService} from './btcblockchain.service';

describe('BitcoinBlockchainService', () => {
	let bitcoin_blockchain_service: BitcoinBlockchainService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinBlockchainService,
				{provide: BitcoinRpcService, useValue: {getBitcoinBlockchainInfo: jest.fn(), getBitcoinBlockCount: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		bitcoin_blockchain_service = module.get<BitcoinBlockchainService>(BitcoinBlockchainService);
	});

	it('should be defined', () => {
		expect(bitcoin_blockchain_service).toBeDefined();
	});
});
