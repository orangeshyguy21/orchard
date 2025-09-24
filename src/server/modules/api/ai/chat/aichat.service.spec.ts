/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {AiService} from '@server/modules/ai/ai.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {AiChatService} from './aichat.service';

describe('AiChatService', () => {
	let ai_chat_service: AiChatService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AiChatService,
				{provide: AiService, useValue: {streamChat: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		ai_chat_service = module.get<AiChatService>(AiChatService);
	});

	it('should be defined', () => {
		expect(ai_chat_service).toBeDefined();
	});
});
