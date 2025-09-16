import {Test, TestingModule} from '@nestjs/testing';
import {LightningRequestService} from './lnrequest.service';

describe('LightningRequestService', () => {
	let service: LightningRequestService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [LightningRequestService],
		}).compile();

		service = module.get<LightningRequestService>(LightningRequestService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
