/* Vendor Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
/* Application Dependencies */
import {AgentService} from '@server/modules/ai/agent/agent.service';
import {MessageService} from '@server/modules/message/message.service';
import {AgentKey} from '@server/modules/ai/agent/agent.enums';
/* Local Dependencies */
import {ConversationService} from './conversation.service';
import {Conversation} from './conversation.entity';
import {ConversationStatus} from './conversation.enums';

describe('ConversationService', () => {
	let service: ConversationService;

	const mock_conversation_repo = {
		find: jest.fn().mockResolvedValue([]),
		findOne: jest.fn().mockResolvedValue(null),
		create: jest.fn().mockImplementation((dto) => dto),
		save: jest.fn().mockImplementation((entity) => Promise.resolve({id: 'conv-uuid', ...entity})),
		update: jest.fn().mockResolvedValue({affected: 1}),
		createQueryBuilder: jest.fn().mockReturnValue({
			update: jest.fn().mockReturnThis(),
			set: jest.fn().mockReturnThis(),
			where: jest.fn().mockReturnThis(),
			execute: jest.fn().mockResolvedValue({affected: 0}),
		}),
	};

	const mock_agent = {
		id: 'agent-uuid',
		agent_key: AgentKey.ORCHARD,
		name: 'Orchard',
		active: true,
		system_message: null,
		tools: null,
		schedules: '[]',
	};

	const mock_agent_service = {
		getAgentByKey: jest.fn().mockResolvedValue(mock_agent),
		getAgent: jest.fn().mockResolvedValue(mock_agent),
		getAgents: jest.fn().mockResolvedValue([mock_agent]),
		getAgentRuns: jest.fn().mockResolvedValue([]),
		runToolLoop: jest.fn().mockResolvedValue({
			result: 'Hello, operator!',
			tokens_used: 100,
			messages: [
				{role: 'system', content: 'sys'},
				{role: 'user', content: 'hi'},
				{role: 'assistant', content: 'Hello, operator!'},
			],
		}),
		buildRuntimeContext: jest.fn().mockReturnValue('[Runtime Context]\nAgent ID: agent-uuid'),
		buildSystemMessage: jest.fn().mockReturnValue('System message'),
		resolveToolNames: jest.fn().mockReturnValue([]),
	};

	const mock_message_service = {
		sendReply: jest.fn().mockResolvedValue(true),
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ConversationService,
				{provide: getRepositoryToken(Conversation), useValue: mock_conversation_repo},
				{provide: AgentService, useValue: mock_agent_service},
				{provide: MessageService, useValue: mock_message_service},
			],
		}).compile();
		service = module.get<ConversationService>(ConversationService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('handleIncomingMessage', () => {
		it('should create a conversation when none exists', async () => {
			mock_conversation_repo.findOne.mockResolvedValueOnce(null);

			await service.handleIncomingMessage({chat_id: 'chat-123', user_id: 'user-456', text: 'hello'});

			expect(mock_agent_service.getAgentByKey).toHaveBeenCalledWith(AgentKey.ORCHARD);
			expect(mock_conversation_repo.save).toHaveBeenCalled();
			expect(mock_agent_service.runToolLoop).toHaveBeenCalled();
			expect(mock_message_service.sendReply).toHaveBeenCalledWith('chat-123', 'Hello, operator!');
		});

		it('should reuse an active conversation', async () => {
			const now = Math.floor(Date.now() / 1000);
			mock_conversation_repo.findOne.mockResolvedValueOnce({
				id: 'existing-conv',
				chat_id: 'chat-123',
				status: ConversationStatus.ACTIVE,
				messages: JSON.stringify([{role: 'system', content: 'sys'}]),
				tokens_used: 50,
				last_activity_at: now,
			});

			await service.handleIncomingMessage({chat_id: 'chat-123', user_id: 'user-456', text: 'follow-up'});

			expect(mock_conversation_repo.save).not.toHaveBeenCalled();
			expect(mock_agent_service.runToolLoop).toHaveBeenCalled();
			const update_call = mock_conversation_repo.update.mock.calls[0];
			expect(update_call[0]).toBe('existing-conv');
			expect(update_call[1].tokens_used).toBe(150);
		});
	});

	describe('handleReset', () => {
		it('should expire active conversation and reply', async () => {
			const now = Math.floor(Date.now() / 1000);
			mock_conversation_repo.findOne.mockResolvedValueOnce({
				id: 'active-conv',
				chat_id: 'chat-123',
				status: ConversationStatus.ACTIVE,
				last_activity_at: now,
			});

			await service.handleReset({chat_id: 'chat-123', user_id: 'user-456'});

			expect(mock_conversation_repo.update).toHaveBeenCalledWith('active-conv', {status: ConversationStatus.EXPIRED});
			expect(mock_message_service.sendReply).toHaveBeenCalledWith('chat-123', 'Conversation reset. Send a message to start fresh.');
		});

		it('should reply even when no active conversation exists', async () => {
			mock_conversation_repo.findOne.mockResolvedValueOnce(null);

			await service.handleReset({chat_id: 'chat-123', user_id: 'user-456'});

			expect(mock_message_service.sendReply).toHaveBeenCalledWith('chat-123', 'Conversation reset. Send a message to start fresh.');
		});
	});

	describe('getActiveConversation', () => {
		it('should return null for expired conversations', async () => {
			const stale_time = Math.floor(Date.now() / 1000) - 7200;
			mock_conversation_repo.findOne.mockResolvedValueOnce({
				id: 'stale-conv',
				chat_id: 'chat-123',
				status: ConversationStatus.ACTIVE,
				last_activity_at: stale_time,
			});

			const result = await service.getActiveConversation('chat-123');

			expect(result).toBeNull();
			expect(mock_conversation_repo.update).toHaveBeenCalledWith('stale-conv', {status: ConversationStatus.EXPIRED});
		});
	});

	describe('createConversation', () => {
		it('should expire existing active conversations for the same chat', async () => {
			await service.createConversation(mock_agent as any, 'user-456', 'chat-123');

			expect(mock_conversation_repo.update).toHaveBeenCalledWith(
				{chat_id: 'chat-123', status: ConversationStatus.ACTIVE},
				{status: ConversationStatus.EXPIRED},
			);
			expect(mock_conversation_repo.save).toHaveBeenCalled();
		});
	});

	describe('cleanupExpiredConversations', () => {
		it('should bulk-expire stale conversations', async () => {
			await service.cleanupExpiredConversations();

			const qb = mock_conversation_repo.createQueryBuilder();
			expect(qb.update).toHaveBeenCalled();
			expect(qb.set).toHaveBeenCalledWith({status: ConversationStatus.EXPIRED});
		});
	});
});
