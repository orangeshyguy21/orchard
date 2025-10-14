/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {AiService} from '@server/modules/ai/ai.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {AiModelService} from './aimodel.service';
import {OrchardAiModel} from './aimodel.model';

describe('AiModelService', () => {
	let ai_model_service: AiModelService;
	let ai_service: jest.Mocked<AiService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AiModelService,
				{provide: AiService, useValue: {getModels: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		ai_model_service = module.get<AiModelService>(AiModelService);
		ai_service = module.get(AiService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(ai_model_service).toBeDefined();
	});

	it('returns OrchardAiModel[] on success', async () => {
		ai_service.getModels.mockResolvedValue([{name: 'm'}] as any);
		const result = await ai_model_service.getModels('TAG');
		expect(result[0]).toBeInstanceOf(OrchardAiModel);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		ai_service.getModels.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.AiError);
		await expect(ai_model_service.getModels('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.AiError});
	});
});
