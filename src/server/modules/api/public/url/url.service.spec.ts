/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
/* Local Dependencies */
import {PublicUrlService} from './url.service';

describe('PublicUrlService', () => {
	let public_url_service: PublicUrlService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PublicUrlService, {provide: FetchService, useValue: {fetchWithProxy: jest.fn()}}],
		}).compile();

		public_url_service = module.get<PublicUrlService>(PublicUrlService);
	});

	it('should be defined', () => {
		expect(public_url_service).toBeDefined();
	});
});
