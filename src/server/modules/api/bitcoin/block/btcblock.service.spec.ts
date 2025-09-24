/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {BitcoinBlockService} from './btcblock.service';
import {OrchardBitcoinBlock, OrchardBitcoinBlockTemplate} from './btcblock.model';

describe('BitcoinBlockService', () => {
	let bitcoin_block_service: BitcoinBlockService;
	let bitcoin_rpc_service: jest.Mocked<BitcoinRpcService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinBlockService,
				{provide: BitcoinRpcService, useValue: {getBitcoinBlock: jest.fn(), getBitcoinBlockTemplate: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		bitcoin_block_service = module.get<BitcoinBlockService>(BitcoinBlockService);
		bitcoin_rpc_service = module.get(BitcoinRpcService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(bitcoin_block_service).toBeDefined();
	});

	it('returns OrchardBitcoinBlock on getBlock', async () => {
		bitcoin_rpc_service.getBitcoinBlock.mockResolvedValue({
			hash: 'h',
			height: 1,
			time: 0,
			chainwork: 'c',
			nTx: 1,
			weight: 100,
			tx: [{txid: 'a', vin: [], vout: [], fee: 1, vsize: 100}],
		} as any);
		const result = await bitcoin_block_service.getBlock('TAG', 'hash');
		expect(result).toBeInstanceOf(OrchardBitcoinBlock);
		expect(bitcoin_rpc_service.getBitcoinBlock).toHaveBeenCalledWith('hash');
	});

	it('returns OrchardBitcoinBlockTemplate on getBlockTemplate', async () => {
		bitcoin_rpc_service.getBitcoinBlockTemplate.mockResolvedValue({
			height: 1,
			transactions: [{txid: 'a', fee: 1, weight: 400, depends: []}],
		} as any);
		const result = await bitcoin_block_service.getBlockTemplate('TAG');
		expect(result).toBeInstanceOf(OrchardBitcoinBlockTemplate);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		const err = new Error('boom');
		bitcoin_rpc_service.getBitcoinBlock.mockRejectedValue(err);
		error_service.resolveError.mockReturnValue(OrchardErrorCode.BitcoinRPCError);
		await expect(bitcoin_block_service.getBlock('MY_TAG', 'hash')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.BitcoinRPCError});
	});
});
