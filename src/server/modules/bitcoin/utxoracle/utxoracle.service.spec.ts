/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
/* Local Dependencies */
import {BitcoinUTXOracleService} from './utxoracle.service';

describe('BitcoinUTXOracleService', () => {
	let bitcoin_utx_oracle_service: BitcoinUTXOracleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinUTXOracleService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{
					provide: BitcoinRpcService,
					useValue: {
						getBitcoinBlockCount: jest.fn(),
						getBitcoinBlockHash: jest.fn(),
						getBitcoinBlockHeader: jest.fn(),
						getBitcoinBlock: jest.fn(),
					},
				},
			],
		}).compile();

		bitcoin_utx_oracle_service = module.get<BitcoinUTXOracleService>(BitcoinUTXOracleService);
	});

	it('should be defined', () => {
		expect(bitcoin_utx_oracle_service).toBeDefined();
	});
});
