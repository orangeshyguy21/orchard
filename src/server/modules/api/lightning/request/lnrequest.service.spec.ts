/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {LightningRequestService} from './lnrequest.service';

describe('LightningRequestService', () => {
	let lightning_request_service: LightningRequestService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningRequestService,
				{provide: LightningService, useValue: {getLightningRequest: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		lightning_request_service = module.get<LightningRequestService>(LightningRequestService);
	});

	it('should be defined', () => {
		expect(lightning_request_service).toBeDefined();
	});
});
