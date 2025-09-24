/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {LightningWalletKitService} from '@server/modules/lightning/walletkit/lnwalletkit.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {LightningWalletService} from './lnwallet.service';

describe('LightningWalletService', () => {
	let lightning_wallet_service: LightningWalletService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningWalletService,
				{provide: LightningWalletKitService, useValue: {getLightningAddresses: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		lightning_wallet_service = module.get<LightningWalletService>(LightningWalletService);
	});

	it('should be defined', () => {
		expect(lightning_wallet_service).toBeDefined();
	});
});
