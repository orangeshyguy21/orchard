/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {PublicImageService} from './image.service';

describe('PublicImageService', () => {
	let public_image_service: PublicImageService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PublicImageService,
				{provide: FetchService, useValue: {fetchWithProxy: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		public_image_service = module.get<PublicImageService>(PublicImageService);
	});

	it('should be defined', () => {
		expect(public_image_service).toBeDefined();
	});
});
