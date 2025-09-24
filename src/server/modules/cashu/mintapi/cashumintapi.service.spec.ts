/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Local Dependencies */
import {CashuMintApiService} from './cashumintapi.service';
import {ConfigService} from '@nestjs/config';
import {FetchService} from '@server/modules/fetch/fetch.service';

describe('CashuMintApiService', () => {
	let cashu_mint_api_service: CashuMintApiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CashuMintApiService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: FetchService, useValue: {fetchWithProxy: jest.fn().mockResolvedValue({json: jest.fn()})}},
			],
		}).compile();

		cashu_mint_api_service = module.get<CashuMintApiService>(CashuMintApiService);
	});

	it('should be defined', () => {
		expect(cashu_mint_api_service).toBeDefined();
	});
});
