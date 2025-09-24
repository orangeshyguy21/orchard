/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {BitcoinUTXOracleService} from '@server/modules/bitcoin/utxoracle/utxoracle.service';
/* Local Dependencies */
import {BitcoinOracleService} from './btcoracle.service';

describe('BitcoinOracleService', () => {
	let bitcoin_oracle_service: BitcoinOracleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinOracleService,
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
				{provide: BitcoinUTXOracleService, useValue: {runOracle: jest.fn()}},
			],
		}).compile();

		bitcoin_oracle_service = module.get<BitcoinOracleService>(BitcoinOracleService);
	});

	it('should be defined', () => {
		expect(bitcoin_oracle_service).toBeDefined();
	});
});
