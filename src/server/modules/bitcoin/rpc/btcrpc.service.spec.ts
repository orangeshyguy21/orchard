/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Native Dependencies */
import {CoreService} from '@server/modules/bitcoin/core/core.service';
/* Local Dependencies */
import {BitcoinRpcService} from './btcrpc.service';
import {BitcoinType} from '@server/modules/bitcoin/bitcoin.enums';

describe('BitcoinRpcService', () => {
	let bitcoin_rpc_service: BitcoinRpcService;
	let config_service: jest.Mocked<ConfigService>;
	let core_service: jest.Mocked<CoreService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinRpcService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CoreService, useValue: {initializeRpc: jest.fn(), makeRpcRequest: jest.fn()}},
			],
		}).compile();

		bitcoin_rpc_service = module.get<BitcoinRpcService>(BitcoinRpcService);
		config_service = module.get(ConfigService) as any;
		core_service = module.get(CoreService) as any;
		// make service think we're CORE
		config_service.get.mockReturnValue(BitcoinType.CORE);
		await bitcoin_rpc_service.onModuleInit();
	});

	it('should be defined', () => {
		expect(bitcoin_rpc_service).toBeDefined();
	});

	it('initializes CORE rpc on module init', async () => {
		expect(core_service.initializeRpc).toHaveBeenCalled();
	});

	it('delegates blockchain calls to CoreService', async () => {
		core_service.makeRpcRequest.mockResolvedValueOnce(100);
		await expect(bitcoin_rpc_service.getBitcoinBlockCount()).resolves.toBe(100);
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('getblockcount', []);

		core_service.makeRpcRequest.mockResolvedValueOnce({chain: 'regtest'} as any);
		await bitcoin_rpc_service.getBitcoinBlockchainInfo();
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('getblockchaininfo', []);

		core_service.makeRpcRequest.mockResolvedValueOnce({} as any);
		await bitcoin_rpc_service.getBitcoinBlock('h');
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('getblock', ['h', 2]);

		core_service.makeRpcRequest.mockResolvedValueOnce('h');
		await bitcoin_rpc_service.getBitcoinBlockHash(5);
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('getblockhash', [5]);

		core_service.makeRpcRequest.mockResolvedValueOnce({} as any);
		await bitcoin_rpc_service.getBitcoinBlockHeader('h');
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('getblockheader', ['h', true]);

		core_service.makeRpcRequest.mockResolvedValueOnce('raw');
		await bitcoin_rpc_service.getBitcoinBlockRaw('h');
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('getblock', ['h', 0]);
	});

	it('delegates network/mempool/mining/utilities calls', async () => {
		core_service.makeRpcRequest.mockResolvedValueOnce({} as any);
		await bitcoin_rpc_service.getBitcoinNetworkInfo();
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('getnetworkinfo', []);

		core_service.makeRpcRequest.mockResolvedValueOnce({} as any);
		await bitcoin_rpc_service.getBitcoinMempool();
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('getrawmempool', [true]);

		core_service.makeRpcRequest.mockResolvedValueOnce({} as any);
		await bitcoin_rpc_service.getBitcoinBlockTemplate();
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('getblocktemplate', [{rules: ['segwit'], mode: 'template'}]);

		core_service.makeRpcRequest.mockResolvedValueOnce({} as any);
		await bitcoin_rpc_service.getBitcoinFeeEstimate(6);
		expect(core_service.makeRpcRequest).toHaveBeenCalledWith('estimatesmartfee', [6]);
	});
});
