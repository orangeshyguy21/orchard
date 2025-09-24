/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {AiAgentService} from './aiagent.service';

describe('AiAgentService', () => {
	let ai_agent_service: AiAgentService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AiAgentService, {provide: ErrorService, useValue: {resolveError: jest.fn()}}],
		}).compile();

		ai_agent_service = module.get<AiAgentService>(AiAgentService);
	});

	it('should be defined', () => {
		expect(ai_agent_service).toBeDefined();
	});
});
