import {Test, TestingModule} from '@nestjs/testing';
import {TapdService} from './tapd.service';

describe('TapdService', () => {
	let service: TapdService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TapdService],
		}).compile();

		service = module.get<TapdService>(TapdService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
