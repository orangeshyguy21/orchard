/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {BitcoinUTXOracleService} from '@server/modules/bitcoin/utxoracle/utxoracle.service';
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {BitcoinOracleService} from './btcoracle.service';

describe('BitcoinOracleService', () => {
	let bitcoin_oracle_service: BitcoinOracleService;
	let error_service: jest.Mocked<ErrorService>;
	let utx_oracle: jest.Mocked<BitcoinUTXOracleService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinOracleService,
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
				{
					provide: BitcoinUTXOracleService,
					useValue: {
						runOracle: jest.fn(),
						getOraclePrice: jest.fn(),
						getOraclePriceRange: jest.fn(),
						saveOraclePrice: jest.fn(),
					},
				},
				{
					provide: BitcoinRpcService,
					useValue: {
						getBitcoinBlockchainInfo: jest.fn(),
					},
				},
			],
		}).compile();

		bitcoin_oracle_service = module.get<BitcoinOracleService>(BitcoinOracleService);
		error_service = module.get(ErrorService);
		utx_oracle = module.get(BitcoinUTXOracleService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(bitcoin_oracle_service).toBeDefined();
	});

	it('returns single oracle price when no timestamps provided', async () => {
		// arrange
		const mock_price = {id: '1', date: 1234567890, price: 50000};
		utx_oracle.getOraclePrice.mockResolvedValue(mock_price as any);

		// act
		const result = await bitcoin_oracle_service.getOracle('TAG');

		// assert
		expect(result).toHaveLength(1);
		expect(result[0]).toHaveProperty('price', 50000);
		expect(utx_oracle.getOraclePrice).toHaveBeenCalledTimes(1);
	});

	it('returns empty array when no oracle price exists', async () => {
		// arrange
		utx_oracle.getOraclePrice.mockResolvedValue(null);

		// act
		const result = await bitcoin_oracle_service.getOracle('TAG');

		// assert
		expect(result).toEqual([]);
		expect(utx_oracle.getOraclePrice).toHaveBeenCalledTimes(1);
	});

	it('returns price range when timestamps provided', async () => {
		// arrange
		const mock_prices = [
			{id: '1', date: 1234567890, price: 50000},
			{id: '2', date: 1234654290, price: 51000},
		];
		utx_oracle.getOraclePriceRange.mockResolvedValue(mock_prices as any);

		// act
		const result = await bitcoin_oracle_service.getOracle('TAG', 1234567890, 1234654290);

		// assert
		expect(result).toHaveLength(2);
		expect(result[0]).toHaveProperty('price', 50000);
		expect(result[1]).toHaveProperty('price', 51000);
		expect(utx_oracle.getOraclePriceRange).toHaveBeenCalledWith(1234567890, 1234654290);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		// arrange
		const error = new Error('boom');
		utx_oracle.getOraclePrice.mockRejectedValue(error);
		error_service.resolveError.mockReturnValue(OrchardErrorCode.BitcoinRPCError);

		// act & assert
		await expect(bitcoin_oracle_service.getOracle('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		expect(error_service.resolveError).toHaveBeenCalledWith(expect.anything(), error, 'MY_TAG', {
			errord: OrchardErrorCode.BitcoinRPCError,
		});
	});
});
