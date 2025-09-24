/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Native Dependencies */
import {CoreService} from '@server/modules/bitcoin/core/core.service';
/* Local Dependencies */
import {BitcoinRpcService} from './btcrpc.service';

describe('BitcoinRpcService', () => {
	let bitcoin_rpc_service: BitcoinRpcService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinRpcService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CoreService, useValue: {initializeRpc: jest.fn(), makeRpcRequest: jest.fn()}},
			],
		}).compile();

		bitcoin_rpc_service = module.get<BitcoinRpcService>(BitcoinRpcService);
	});

	it('should be defined', () => {
		expect(bitcoin_rpc_service).toBeDefined();
	});
});
