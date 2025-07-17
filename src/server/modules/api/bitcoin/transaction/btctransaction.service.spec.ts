import {Test, TestingModule} from '@nestjs/testing';
import {BtcTransactionService} from './btctransaction.service';

describe('BtcTransactionService', () => {
	let service: BtcTransactionService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [BtcTransactionService],
		}).compile();

		service = module.get<BtcTransactionService>(BtcTransactionService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
