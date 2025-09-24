/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Local Dependencies */
import {ErrorService} from './error.service';

describe('ErrorService', () => {
	let error_service: ErrorService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ErrorService],
		}).compile();

		error_service = module.get<ErrorService>(ErrorService);
	});

	it('should be defined', () => {
		expect(error_service).toBeDefined();
	});
});
