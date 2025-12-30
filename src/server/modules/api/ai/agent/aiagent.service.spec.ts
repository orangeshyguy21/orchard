/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {AiAgent} from '@server/modules/ai/ai.enums';
/* Local Dependencies */
import {AiAgentService} from './aiagent.service';

describe('AiAgentService', () => {
	let aiAgentService: AiAgentService;
	let errorService: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AiAgentService, {provide: ErrorService, useValue: {resolveError: jest.fn()}}],
		}).compile();

		aiAgentService = module.get<AiAgentService>(AiAgentService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(aiAgentService).toBeDefined();
	});

	it('returns agent when found', async () => {
		const agent = await aiAgentService.getAgent('TAG', AiAgent.DEFAULT);
		expect(agent).toBeDefined();
	});

	it('wraps errors via resolveError and throws OrchardApiError when agent missing', async () => {
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.AiError});
		await expect(aiAgentService.getAgent('MY_TAG', 'missing' as any)).rejects.toBeInstanceOf(OrchardApiError);
		const calls = errorService.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.AiError});
	});
});
