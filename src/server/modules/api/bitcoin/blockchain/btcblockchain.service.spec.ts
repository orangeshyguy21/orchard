/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {BitcoinBlockchainService} from './btcblockchain.service';
import {OrchardBitcoinBlockchainInfo, OrchardBitcoinBlockCount} from './btcblockchain.model';

describe('BitcoinBlockchainService', () => {
	let bitcoin_blockchain_service: BitcoinBlockchainService;
	let bitcoin_rpc_service: jest.Mocked<BitcoinRpcService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinBlockchainService,
				{provide: BitcoinRpcService, useValue: {getBitcoinBlockchainInfo: jest.fn(), getBitcoinBlockCount: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		bitcoin_blockchain_service = module.get<BitcoinBlockchainService>(BitcoinBlockchainService);
		bitcoin_rpc_service = module.get(BitcoinRpcService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(bitcoin_blockchain_service).toBeDefined();
	});

	it('getBlockchainInfo returns OrchardBitcoinBlockchainInfo', async () => {
		bitcoin_rpc_service.getBitcoinBlockchainInfo.mockResolvedValue({
			chain: 'regtest',
			blocks: 1,
			headers: 1,
			bestblockhash: 'h',
			difficulty: 1,
			verificationprogress: 1,
			initialblockdownload: false,
			chainwork: 'c',
			size_on_disk: 1,
			pruned: false,
			pruneheight: null,
			automatic_pruning: null,
			prune_target_size: null,
			warnings: '',
		} as any);
		const result = await bitcoin_blockchain_service.getBlockchainInfo('TAG');
		expect(result).toBeInstanceOf(OrchardBitcoinBlockchainInfo);
	});

	it('getBlockCount returns OrchardBitcoinBlockCount', async () => {
		bitcoin_rpc_service.getBitcoinBlockCount.mockResolvedValue(123 as any);
		const result = await bitcoin_blockchain_service.getBlockCount('TAG');
		expect(result).toBeInstanceOf(OrchardBitcoinBlockCount);
		expect(result.height).toBe(123);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		bitcoin_rpc_service.getBitcoinBlockchainInfo.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.BitcoinRPCError);
		await expect(bitcoin_blockchain_service.getBlockchainInfo('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.BitcoinRPCError});
	});
});
