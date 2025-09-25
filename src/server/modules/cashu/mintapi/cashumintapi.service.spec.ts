/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Local Dependencies */
import {CashuMintApiService} from './cashumintapi.service';
import {ConfigService} from '@nestjs/config';
import {FetchService} from '@server/modules/fetch/fetch.service';

describe('CashuMintApiService', () => {
	let cashu_mint_api_service: CashuMintApiService;
	let config_service: jest.Mocked<ConfigService>;
	let fetch_service: jest.Mocked<FetchService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CashuMintApiService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: FetchService, useValue: {fetchWithProxy: jest.fn().mockResolvedValue({json: jest.fn()})}},
			],
		}).compile();

		cashu_mint_api_service = module.get<CashuMintApiService>(CashuMintApiService);
		config_service = module.get(ConfigService) as any;
		fetch_service = module.get(FetchService) as any;
	});

	it('should be defined', () => {
		expect(cashu_mint_api_service).toBeDefined();
	});

	it('fetches mint info from configured endpoint', async () => {
		config_service.get.mockReturnValue('https://mint');
		const json = jest.fn().mockResolvedValue({name: 'Mint'});
		fetch_service.fetchWithProxy.mockResolvedValue({json} as any);
		const out = await cashu_mint_api_service.getMintInfo();
		expect(fetch_service.fetchWithProxy).toHaveBeenCalledWith('https://mint/v1/info', {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
		});
		expect(out).toEqual({name: 'Mint'});
	});
});
