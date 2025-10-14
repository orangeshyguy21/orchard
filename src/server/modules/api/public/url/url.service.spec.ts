/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
/* Local Dependencies */
import {PublicUrlService} from './url.service';
import {OrchardPublicUrl} from './url.model';

describe('PublicUrlService', () => {
	let public_url_service: PublicUrlService;
	let fetch_service: jest.Mocked<FetchService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PublicUrlService, {provide: FetchService, useValue: {fetchWithProxy: jest.fn()}}],
		}).compile();

		public_url_service = module.get<PublicUrlService>(PublicUrlService);
		fetch_service = module.get(FetchService);
	});

	it('should be defined', () => {
		expect(public_url_service).toBeDefined();
	});

	it('returns OrchardPublicUrl[] with has_data=true when JSON parses', async () => {
		const response = {url: 'https://e/x', status: 200, json: async () => ({})} as any;
		fetch_service.fetchWithProxy.mockResolvedValue(response);
		const result = await public_url_service.getUrlsData(['https://e/x']);
		expect(result[0]).toBeInstanceOf(OrchardPublicUrl);
		expect(result[0].has_data).toBe(true);
		expect(result[0].status).toBe(200);
	});

	it('handles network errors and returns defaults', async () => {
		fetch_service.fetchWithProxy.mockRejectedValue(new Error('boom'));
		const result = await public_url_service.getUrlsData(['https://bad/x']);
		expect(result[0]).toBeInstanceOf(OrchardPublicUrl);
		expect(result[0].status).toBe(null);
		expect(result[0].has_data).toBe(false);
	});
});
