import {Test, TestingModule} from '@nestjs/testing';
import {LightningWalletService} from './lnwallet.service';

describe('LightningWalletService', () => {
	let service: LightningWalletService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [LightningWalletService],
		}).compile();

		service = module.get<LightningWalletService>(LightningWalletService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
