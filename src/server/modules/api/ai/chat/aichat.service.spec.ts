/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {AiService} from '@server/modules/ai/ai.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {AiChatService} from './aichat.service';

describe('AiChatService', () => {
	let ai_chat_service: AiChatService;
	let ai_service: jest.Mocked<AiService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AiChatService,
				{provide: AiService, useValue: {streamChat: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		ai_chat_service = module.get<AiChatService>(AiChatService);
		ai_service = module.get(AiService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(ai_chat_service).toBeDefined();
	});

	it('streams chat and emits parsed chunks', async () => {
		// Arrange a ReadableStream-like body that yields two JSON lines
		const encoder = new TextEncoder();
		const chunks = [
			encoder.encode('{"model":"m","created_at":1,"message":{"role":"assistant","content":"hi"},"done":false}\n'),
			encoder.encode('{"model":"m","created_at":2,"message":{"role":"assistant","content":"bye"},"done":true}\n'),
		];
		const reader = {
			read: jest
				.fn()
				.mockResolvedValueOnce({done: false, value: chunks[0]})
				.mockResolvedValueOnce({done: false, value: chunks[1]})
				.mockResolvedValueOnce({done: true, value: undefined}),
		};
		const body = {getReader: () => reader} as any;
		ai_service.streamChat.mockResolvedValue(body);

		const received: any[] = [];
		ai_chat_service.onChatUpdate((chunk) => received.push(chunk));

		// Act
		const ok = await ai_chat_service.streamChat('TAG', {id: '1', model: 'm', agent: null, messages: []} as any);

		// Assert
		expect(ok).toBe(true);
		expect(received.length).toBe(2);
	});

	it('wraps errors via resolveError and throws OrchardApiError for stream errors', async () => {
		ai_service.streamChat.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.AiError);
		await expect(ai_chat_service.streamChat('MY_TAG', {id: '1', model: 'm', agent: null, messages: []} as any)).rejects.toBeInstanceOf(
			OrchardApiError,
		);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.AiError});
	});
});
