/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Native Dependencies */
import {LndService} from '@server/modules/lightning/lnd/lnd.service';
import {ClnService} from '@server/modules/lightning/cln/cln.service';
/* Local Dependencies */
import {LightningWalletKitService} from './lnwalletkit.service';

describe('LightningWalletKitService', () => {
	let lightning_wallet_kit_service: LightningWalletKitService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LightningWalletKitService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: LndService, useValue: {initializeWalletKitClient: jest.fn()}},
				{provide: ClnService, useValue: {initializeWalletKitClient: jest.fn(), mapClnAddresses: jest.fn()}},
			],
		}).compile();

		lightning_wallet_kit_service = module.get<LightningWalletKitService>(LightningWalletKitService);
	});

	it('should be defined', () => {
		expect(lightning_wallet_kit_service).toBeDefined();
	});
});
