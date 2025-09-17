import {Test, TestingModule} from '@nestjs/testing';
import {ClnService} from './cln.service';

describe('ClnService', () => {
	let service: ClnService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ClnService],
		}).compile();

		service = module.get<ClnService>(ClnService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
