import {Test, TestingModule} from '@nestjs/testing';
import {BitcoinMempoolService} from './btcmempool.service';

describe('BitcoinMempoolService', () => {
	let service: BitcoinMempoolService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [BitcoinMempoolService],
		}).compile();

		service = module.get<BitcoinMempoolService>(BitcoinMempoolService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
