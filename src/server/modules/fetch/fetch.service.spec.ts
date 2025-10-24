/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {ConfigService} from '@nestjs/config';
/* Vendor Dependencies */
import {SocksProxyAgent} from 'socks-proxy-agent';
/* Local Dependencies */
import {FetchService} from './fetch.service';

describe('FetchService', () => {
	let fetch_service: FetchService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [FetchService, {provide: ConfigService, useValue: {get: jest.fn()}}],
		}).compile();

		fetch_service = module.get<FetchService>(FetchService);
	});

	it('should be defined', () => {
		expect(fetch_service).toBeDefined();
	});

	it('should initialize without proxy when config is not set', async () => {
		expect(fetch_service['agent']).toBeNull();
	});

	it('should initialize with Tor proxy when configured', async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [FetchService, {provide: ConfigService, useValue: {get: jest.fn().mockReturnValue('socks5h://127.0.0.1:9050')}}],
		}).compile();
		const service_with_proxy = module.get<FetchService>(FetchService);
		expect(service_with_proxy['agent']).toBeDefined();
		expect(service_with_proxy['agent']).toBeInstanceOf(SocksProxyAgent);
	});
});
