/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {LightningInfoService} from './lninfo.service';

describe('LightningInfoService', () => {
	let lightning_info_service: LightningInfoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningInfoService,
				{provide: LightningService, useValue: {getLightningInfo: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		lightning_info_service = module.get<LightningInfoService>(LightningInfoService);
	});

	it('should be defined', () => {
		expect(lightning_info_service).toBeDefined();
	});
});
