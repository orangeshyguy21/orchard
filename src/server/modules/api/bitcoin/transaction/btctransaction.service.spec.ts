/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {BtcTransactionService} from './btctransaction.service';

describe('BtcTransactionService', () => {
	let btc_transaction_service: BtcTransactionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BtcTransactionService,
				{provide: BitcoinRpcService, useValue: {getBitcoinFeeEstimate: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		btc_transaction_service = module.get<BtcTransactionService>(BtcTransactionService);
	});

	it('should be defined', () => {
		expect(btc_transaction_service).toBeDefined();
	});
});
