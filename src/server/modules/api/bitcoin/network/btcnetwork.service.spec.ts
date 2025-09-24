/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {BitcoinNetworkService} from './btcnetwork.service';

describe('BitcoinNetworkService', () => {
	let bitcoin_network_service: BitcoinNetworkService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinNetworkService,
				{provide: BitcoinRpcService, useValue: {getBitcoinNetworkInfo: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		bitcoin_network_service = module.get<BitcoinNetworkService>(BitcoinNetworkService);
	});

	it('should be defined', () => {
		expect(bitcoin_network_service).toBeDefined();
	});
});
