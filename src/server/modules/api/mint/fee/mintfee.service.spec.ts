import {Test, TestingModule} from '@nestjs/testing';
import {MintfeeService} from './mintfee.service';

describe('MintfeeService', () => {
	let service: MintfeeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MintfeeService],
		}).compile();

		service = module.get<MintfeeService>(MintfeeService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
