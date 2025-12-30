/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
/* Local Dependencies */
import {AiService} from './ai.service';

describe('AiService', () => {
	let aiService: AiService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AiService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: FetchService, useValue: {fetchWithProxy: jest.fn()}},
			],
		}).compile();

		aiService = module.get<AiService>(AiService);
	});

	it('should be defined', () => {
		expect(aiService).toBeDefined();
	});
});
