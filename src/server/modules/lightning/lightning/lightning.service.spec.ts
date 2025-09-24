/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Native Dependencies */
import {LndService} from '@server/modules/lightning/lnd/lnd.service';
import {ClnService} from '@server/modules/lightning/cln/cln.service';
/* Local Dependencies */
import {LightningService} from './lightning.service';

describe('LightningService', () => {
	let lightning_service: LightningService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: LndService, useValue: {initializeLightningClient: jest.fn(), mapLndRequest: jest.fn()}},
				{
					provide: ClnService,
					useValue: {
						initializeLightningClient: jest.fn(),
						mapClnInfo: jest.fn(),
						mapClnChannelBalance: jest.fn(),
						mapClnRequest: jest.fn(),
					},
				},
			],
		}).compile();

		lightning_service = module.get<LightningService>(LightningService);
	});

	it('should be defined', () => {
		expect(lightning_service).toBeDefined();
	});
});
