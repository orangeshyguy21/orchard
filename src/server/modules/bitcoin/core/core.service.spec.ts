/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
/* Local Dependencies */
import {CoreService} from './core.service';

describe('CoreService', () => {
	let core_service: CoreService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CoreService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: FetchService, useValue: {fetchWithProxy: jest.fn()}},
			],
		}).compile();

		core_service = module.get<CoreService>(CoreService);
	});

	it('should be defined', () => {
		expect(core_service).toBeDefined();
	});
});
