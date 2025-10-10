/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Local Dependencies */
import {FetchService} from './fetch.service';

describe('FetchService', () => {
	let fetch_service: FetchService;
	let _config_service: jest.Mocked<ConfigService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [FetchService, {provide: ConfigService, useValue: {get: jest.fn()}}],
		}).compile();

		fetch_service = module.get<FetchService>(FetchService);
		_config_service = module.get(ConfigService);
	});

	it('should be defined', () => {
		expect(fetch_service).toBeDefined();
	});

	it('uses direct fetch when no proxy configured', async () => {
		const fetch_mock = jest.fn().mockResolvedValue({ok: true});
		(global as any).fetch = fetch_mock;
		await fetch_service.fetchWithProxy('http://x', {method: 'GET'});
		expect(fetch_mock).toHaveBeenCalledWith('http://x', {method: 'GET'});
	});

	it('injects agent when proxy is configured', async () => {
		const module2: TestingModule = await Test.createTestingModule({
			providers: [FetchService, {provide: ConfigService, useValue: {get: jest.fn().mockReturnValue('socks5h://127.0.0.1:9050')}}],
		}).compile();
		const fetch_service_with_proxy = module2.get<FetchService>(FetchService);
		const fetch_mock = jest.fn().mockResolvedValue({ok: true});
		(global as any).fetch = fetch_mock;
		await fetch_service_with_proxy.fetchWithProxy('http://x', {headers: {a: 1}});
		const [, options] = fetch_mock.mock.calls[0];
		expect(options.agent).toBeDefined();
		expect(options.headers).toEqual({a: 1});
	});
});
