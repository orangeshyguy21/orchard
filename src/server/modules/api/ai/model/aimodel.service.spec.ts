/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {AiService} from '@server/modules/ai/ai.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {AiModelService} from './aimodel.service';

describe('AiModelService', () => {
	let ai_model_service: AiModelService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AiModelService,
				{provide: AiService, useValue: {getModels: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		ai_model_service = module.get<AiModelService>(AiModelService);
	});

	it('should be defined', () => {
		expect(ai_model_service).toBeDefined();
	});
});
