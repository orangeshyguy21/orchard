/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {LightningBalanceService} from './lnbalance.service';

describe('LightningBalanceService', () => {
	let lightning_balance_service: LightningBalanceService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningBalanceService,
				{provide: LightningService, useValue: {getLightningChannelBalance: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		lightning_balance_service = module.get<LightningBalanceService>(LightningBalanceService);
	});

	it('should be defined', () => {
		expect(lightning_balance_service).toBeDefined();
	});
});
