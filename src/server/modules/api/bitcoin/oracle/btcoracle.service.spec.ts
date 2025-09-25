/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {BitcoinUTXOracleService} from '@server/modules/bitcoin/utxoracle/utxoracle.service';
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
				{provide: BitcoinUTXOracleService, useValue: {runOracle: jest.fn()}},
			],
		}).compile();

		bitcoin_oracle_service = module.get<BitcoinOracleService>(BitcoinOracleService);
		error_service = module.get(ErrorService) as any;
		utx_oracle = module.get(BitcoinUTXOracleService) as any;
	});

	it('should be defined', () => {
		expect(bitcoin_oracle_service).toBeDefined();
	});

	it('returns oracle result on success', async () => {
		utx_oracle.runOracle.mockResolvedValue({central_price: 1} as any);
		const result = await bitcoin_oracle_service.getOracle('TAG', {recent_blocks: 10} as any);
		expect(result).toEqual({central_price: 1});
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		utx_oracle.runOracle.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.BitcoinRPCError);
		await expect(bitcoin_oracle_service.getOracle('MY_TAG', {recent_blocks: 10} as any)).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.BitcoinRPCError});
	});
});
