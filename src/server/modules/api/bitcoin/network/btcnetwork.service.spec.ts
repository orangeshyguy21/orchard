/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {BitcoinNetworkService} from './btcnetwork.service';

describe('BitcoinNetworkService', () => {
	let bitcoin_network_service: BitcoinNetworkService;
	let bitcoin_rpc_service: jest.Mocked<BitcoinRpcService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BitcoinNetworkService,
				{
					provide: BitcoinRpcService,
					useValue: {getBitcoinNetworkInfo: jest.fn()},
				},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		bitcoin_network_service = module.get<BitcoinNetworkService>(BitcoinNetworkService);
		bitcoin_rpc_service = module.get(BitcoinRpcService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(bitcoin_network_service).toBeDefined();
	});

	it('maps network info and normalizes warnings to an array', async () => {
		// Arrange
		const rpc_info: any = {
			version: 1,
			subversion: '/Satoshi:28.0.0/',
			protocolversion: 70016,
			localservices: '0000000000000409',
			localservicesnames: ['NETWORK', 'WITNESS', 'COMPACT_FILTERS'],
			localrelay: true,
			timeoffset: 0,
			connections: 8,
			connections_in: 3,
			connections_out: 5,
			networkactive: true,
			networks: [{name: 'ipv4', limited: false, reachable: true, proxy: '', proxy_randomize_credentials: false}],
			relayfee: 0.00001,
			incrementalfee: 0.00001,
			localaddresses: [{address: '127.0.0.1', port: 8333, score: 1}],
			warnings: 'all good', // string form
		};
		bitcoin_rpc_service.getBitcoinNetworkInfo.mockResolvedValue(rpc_info);

		// Act
		const result = await bitcoin_network_service.getBitcoinNetworkInfo();

		// Assert
		expect(result.version).toBe(1);
		expect(result.subversion).toBe('/Satoshi:28.0.0/');
		expect(result.connections).toBe(8);
		expect(Array.isArray(result.warnings)).toBe(true);
		expect(result.warnings).toEqual(['all good']);
		expect(result.networks?.length).toBe(1);
		expect(result.localaddresses?.length).toBe(1);
	});

	it('wraps RPC errors via resolveError and throws OrchardApiError (default tag)', async () => {
		// Arrange
		const rpc_error = new Error('rpc failed');
		bitcoin_rpc_service.getBitcoinNetworkInfo.mockRejectedValue(rpc_error);
		error_service.resolveError.mockReturnValue(OrchardErrorCode.BitcoinRPCError);

		// Act
		await expect(bitcoin_network_service.getBitcoinNetworkInfo()).rejects.toBeInstanceOf(OrchardApiError);

		// Assert
		expect(error_service.resolveError).toHaveBeenCalled();
		const [, , tag_arg, code_arg] = error_service.resolveError.mock.calls[0];
		expect(tag_arg).toBe('GET { bitcoin_network_info }'); // default tag
		expect(code_arg).toEqual({errord: OrchardErrorCode.BitcoinRPCError});
	});

	it('uses custom tag in errors', async () => {
		// Arrange
		const rpc_error = new Error('rpc failed');
		bitcoin_rpc_service.getBitcoinNetworkInfo.mockRejectedValue(rpc_error);
		error_service.resolveError.mockReturnValue(OrchardErrorCode.BitcoinRPCError);

		// Act
		await expect(bitcoin_network_service.getBitcoinNetworkInfo('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);

		// Assert
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
	});
});
