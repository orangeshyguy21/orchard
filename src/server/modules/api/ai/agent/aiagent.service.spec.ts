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
	let ai_agent_service: AiAgentService;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AiAgentService, {provide: ErrorService, useValue: {resolveError: jest.fn()}}],
		}).compile();

		ai_agent_service = module.get<AiAgentService>(AiAgentService);
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(ai_agent_service).toBeDefined();
	});

	it('returns agent when found', async () => {
		const agent = await ai_agent_service.getAgent('TAG', AiAgent.DEFAULT);
		expect(agent).toBeDefined();
	});

	it('wraps errors via resolveError and throws OrchardApiError when agent missing', async () => {
		error_service.resolveError.mockReturnValue(OrchardErrorCode.AiError);
		await expect(ai_agent_service.getAgent('MY_TAG', 'missing' as any)).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.AiError});
	});
});
