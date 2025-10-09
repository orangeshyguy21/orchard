/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {BtcTransactionService} from './btctransaction.service';
import {OrchardBitcoinTxFeeEstimate} from './btctransaction.model';

describe('BtcTransactionService', () => {
	let btc_transaction_service: BtcTransactionService;
	let bitcoin_rpc_service: jest.Mocked<BitcoinRpcService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BtcTransactionService,
				{provide: BitcoinRpcService, useValue: {getBitcoinFeeEstimate: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		btc_transaction_service = module.get<BtcTransactionService>(BtcTransactionService);
		bitcoin_rpc_service = module.get(BitcoinRpcService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(btc_transaction_service).toBeDefined();
	});

	it('maps fee estimates and returns OrchardBitcoinTxFeeEstimate[]', async () => {
		bitcoin_rpc_service.getBitcoinFeeEstimate.mockResolvedValueOnce(10 as any);
		bitcoin_rpc_service.getBitcoinFeeEstimate.mockResolvedValueOnce(20 as any);
		const result = await btc_transaction_service.getTransactionFeeEstimates('TAG', [1, 2]);
		expect(result).toHaveLength(2);
		expect(result[0]).toBeInstanceOf(OrchardBitcoinTxFeeEstimate);
		expect(bitcoin_rpc_service.getBitcoinFeeEstimate).toHaveBeenCalledWith(1);
		expect(bitcoin_rpc_service.getBitcoinFeeEstimate).toHaveBeenCalledWith(2);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		bitcoin_rpc_service.getBitcoinFeeEstimate.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.BitcoinRPCError);
		await expect(btc_transaction_service.getTransactionFeeEstimates('MY_TAG', [1])).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.BitcoinRPCError});
	});
});
