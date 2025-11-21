/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
import {getRepositoryToken} from '@nestjs/typeorm';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
/* Local Dependencies */
import {BitcoinUTXOracleService} from './utxoracle.service';
import {UTXOracle} from './utxoracle.entity';

describe('BitcoinUTXOracleService', () => {
	let bitcoin_utx_oracle_service: BitcoinUTXOracleService;
	let config_service: jest.Mocked<ConfigService>;
	let bitcoin_rpc_service: jest.Mocked<BitcoinRpcService>;

	// mock repository for UTXOracle
	const mock_repository = {
		findOne: jest.fn(),
		find: jest.fn(),
		create: jest.fn(),
		save: jest.fn(),
		update: jest.fn(),
	};

	beforeEach(async () => {
		// reset all mocks before each test
		jest.clearAllMocks();

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
				{
					provide: getRepositoryToken(UTXOracle),
					useValue: mock_repository,
				},
			],
		}).compile();

		bitcoin_utx_oracle_service = module.get<BitcoinUTXOracleService>(BitcoinUTXOracleService);
		config_service = module.get(ConfigService);
		bitcoin_rpc_service = module.get(BitcoinRpcService);
	});

	it('should be defined', () => {
		expect(bitcoin_utx_oracle_service).toBeDefined();
	});

	it('runOracle recent mode returns structured result', async () => {
		config_service.get.mockReturnValue(undefined);
		bitcoin_rpc_service.getBitcoinBlockCount.mockResolvedValue(1000);
		// stub blocks in consensus window [1000-6-144 .. 1000-6]
		const mk_block = (height: number) => ({
			time: 1700000000 + height,
			tx: [
				{txid: `cb${height}`, vin: [{coinbase: 'x'}], vout: [{value: 6}]},
				{txid: `t${height}`, vin: [{txid: `p${height}`, vout: 0}], vout: [{value: 0.01}, {value: 0.02}]},
			],
		});
		bitcoin_rpc_service.getBitcoinBlockHash.mockImplementation(async (h: number) => `h${h}`);
		bitcoin_rpc_service.getBitcoinBlock.mockImplementation(async (_hash: string) => mk_block(parseInt(_hash.slice(1))) as any);

		const out = await bitcoin_utx_oracle_service.runOracle({});
		expect(out.block_window.start).toBeGreaterThan(0);
		expect(out.block_window.end).toBeGreaterThan(out.block_window.start);
		expect(typeof out.central_price).toBe('number');
		expect(typeof out.deviation_pct).toBe('number');
		expect(out.bounds).toHaveProperty('min');
		expect(out.bounds).toHaveProperty('max');
	});

	it('runOracle date mode validates format', async () => {
		await expect(bitcoin_utx_oracle_service.runOracle({date: 'bad'} as any)).rejects.toThrow();
	});
});
