import {Test, TestingModule} from '@nestjs/testing';
import {BitcoinNetworkService} from './btcnetwork.service';

describe('BitcoinNetworkService', () => {
	let service: BitcoinNetworkService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [BitcoinNetworkService],
		}).compile();

		service = module.get<BitcoinNetworkService>(BitcoinNetworkService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
