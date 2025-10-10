/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
/* Local Dependencies */
import {CoreService} from './core.service';

describe('CoreService', () => {
	let core_service: CoreService;
	let config_service: jest.Mocked<ConfigService>;
	let fetch_service: jest.Mocked<FetchService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CoreService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: FetchService, useValue: {fetchWithProxy: jest.fn()}},
			],
		}).compile();

		core_service = module.get<CoreService>(CoreService);
		config_service = module.get(ConfigService);
		fetch_service = module.get(FetchService);
	});

	it('should be defined', () => {
		expect(core_service).toBeDefined();
	});

	it('initializeRpc builds rpc url and auth headers', async () => {
		config_service.get.mockImplementation((key: string) => {
			switch (key) {
				case 'bitcoin.user':
					return 'rpcuser';
				case 'bitcoin.pass':
					return 'rpcpass';
				case 'bitcoin.host':
					return 'http://127.0.0.1';
				case 'bitcoin.port':
					return 18443;
				default:
					return undefined as any;
			}
		});
		// mock response of fetch
		const fake_json = jest.fn().mockResolvedValue({result: 'ok'});
		fetch_service.fetchWithProxy.mockResolvedValue({json: fake_json} as any);

		core_service.initializeRpc();
		await core_service.makeRpcRequest('getblockcount', []);

		const [url, options] = fetch_service.fetchWithProxy.mock.calls[0];
		expect(url).toBe('http://127.0.0.1:18443/');
		expect(options.method).toBe('POST');
		expect(options.headers['Content-Type']).toBe('application/json');
		expect(options.headers.Authorization).toMatch(/^Basic /);
		// body contains method and params
		const body_obj = JSON.parse(options.body);
		expect(body_obj.method).toBe('getblockcount');
		expect(body_obj.params).toEqual([]);
	});

	it('makeRpcRequest returns inner result', async () => {
		// minimal setup to avoid dependency on initializeRpc assertions
		config_service.get.mockReturnValueOnce('user');
		config_service.get.mockReturnValueOnce('pass');
		config_service.get.mockReturnValueOnce('http://h');
		config_service.get.mockReturnValueOnce(8332 as any);
		core_service.initializeRpc();
		fetch_service.fetchWithProxy.mockResolvedValue({json: jest.fn().mockResolvedValue({result: 123})} as any);
		const out = await core_service.makeRpcRequest('getblockcount', []);
		expect(out).toBe(123);
	});
});
