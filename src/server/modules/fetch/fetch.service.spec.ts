/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
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
});
