/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository} from 'typeorm';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {AgentService} from '@server/modules/ai/agent/agent.service';
import {AgentRunStatus} from '@server/modules/ai/agent/agent.enums';
import {Agent} from '@server/modules/ai/agent/agent.entity';
import {AgentKey} from '@server/modules/ai/agent/agent.enums';
import {AiMessage} from '@server/modules/ai/ai.types';
import {AiMessageRole} from '@server/modules/ai/ai.enums';
import {AiAgentContext} from '@server/modules/ai/tools/tool.types';
import {MessageService} from '@server/modules/message/message.service';
/* Local Dependencies */
import {Conversation} from './conversation.entity';
import {ConversationStatus} from './conversation.enums';

@Injectable()
export class ConversationService implements OnModuleInit {
	private readonly logger = new Logger(ConversationService.name);

	private static readonly IDLE_TIMEOUT_SECONDS = 3600;
	private static readonly MAX_MESSAGES = 50;
	private static readonly COMPRESS_THRESHOLD = 500;

	constructor(
		@InjectRepository(Conversation)
		private conversationRepository: Repository<Conversation>,
		private agentService: AgentService,
		private messageService: MessageService,
	) {}

	async onModuleInit(): Promise<void> {
		this.messageService.onMessage(async (chat_id, user_id, text) => {
			await this.handleIncomingMessage(chat_id, user_id, text);
		});
	}

	/* *******************************************************
		Incoming Message Handler
	******************************************************** */

	/** Handle an incoming user message: get or create conversation, run agent, reply */
	public async handleIncomingMessage(chat_id: string, user_id: string, text: string): Promise<void> {
		const agent = await this.agentService.getAgentByKey(AgentKey.ORCHARD);
		if (!agent) {
			this.logger.warn('ORCHARD agent not found — cannot start conversation');
			return;
		}

		let conversation = await this.getActiveConversation(chat_id);
		if (!conversation) {
			conversation = await this.createConversation(agent, user_id, chat_id);
		}

		const messages: AiMessage[] = JSON.parse(conversation.messages);
		this.compressPreviousTurns(messages);
		messages.push({role: AiMessageRole.USER, content: text});

		const tool_names = this.agentService.resolveToolNames(agent);
		const agent_context: AiAgentContext = {agent_id: agent.id, agent_name: agent.name};

		const loop_result = await this.agentService.runToolLoop({messages, tool_names, agent_context});

		this.truncateHistory(loop_result.messages);

		const now = DateTime.utc().toUnixInteger();
		await this.conversationRepository.update(conversation.id, {
			messages: JSON.stringify(loop_result.messages),
			tokens_used: conversation.tokens_used + loop_result.tokens_used,
			last_activity_at: now,
		});

		await this.messageService.sendReply(chat_id, loop_result.result);
	}

	/* *******************************************************
		Context Management
	******************************************************** */

	/**
	 * Replace large function results from previous turns with a short placeholder.
	 * Only messages before the last user message are compressed; the current turn is untouched.
	 */
	private compressPreviousTurns(messages: AiMessage[]): void {
		const last_user_idx = messages.findLastIndex(m => m.role === AiMessageRole.USER);
		if (last_user_idx <= 0) return;

		const is_large_result = (m: AiMessage) =>
			m.role === AiMessageRole.FUNCTION && m.content.length > ConversationService.COMPRESS_THRESHOLD;

		for (let i = 0; i < last_user_idx; i++) {
			if (is_large_result(messages[i])) {
				messages[i] = {...messages[i], content: '[Result processed]'};
			}
		}
	}

	/**
	 * Enforce max message count by dropping the oldest messages after the system message.
	 * System message (index 0) is always preserved.
	 * Mutates the array in place.
	 */
	private truncateHistory(messages: AiMessage[]): void {
		if (messages.length <= ConversationService.MAX_MESSAGES) return;
		const excess = messages.length - ConversationService.MAX_MESSAGES;
		messages.splice(1, excess);
	}

	/* *******************************************************
		Conversation Lifecycle
	******************************************************** */

	/** Find the active conversation for a chat, auto-expiring stale ones */
	public async getActiveConversation(chat_id: string): Promise<Conversation | null> {
		const conversation = await this.conversationRepository.findOne({
			where: {chat_id, status: ConversationStatus.ACTIVE},
		});
		if (!conversation) return null;

		const now = DateTime.utc().toUnixInteger();
		if (now - conversation.last_activity_at > ConversationService.IDLE_TIMEOUT_SECONDS) {
			await this.expireConversation(conversation.id);
			return null;
		}

		return conversation;
	}

	/** Create a new conversation, expiring any existing active one for this chat */
	public async createConversation(agent: Agent, user_id: string, chat_id: string): Promise<Conversation> {
		await this.conversationRepository.update(
			{chat_id, status: ConversationStatus.ACTIVE},
			{status: ConversationStatus.EXPIRED},
		);

		const system_message = await this.buildConversationSystemMessage(agent);
		const messages: AiMessage[] = [{role: AiMessageRole.SYSTEM, content: system_message}];

		const now = DateTime.utc().toUnixInteger();
		const conversation = this.conversationRepository.create({
			source_agent: agent,
			user_id,
			chat_id,
			status: ConversationStatus.ACTIVE,
			messages: JSON.stringify(messages),
			tokens_used: 0,
			created_at: now,
			last_activity_at: now,
		});

		return this.conversationRepository.save(conversation);
	}

	/** Build the system message with runtime context and recent agent run summaries */
	private async buildConversationSystemMessage(agent: Agent): Promise<string> {
		const base = this.agentService.buildSystemMessage(agent);

		const agents = await this.agentService.getAgents();
		const run_results = await Promise.all(
			agents.map((a) => this.agentService.getAgentRuns({agent_id: a.id, page_size: 3, notified: true}).then((runs) => ({agent: a, runs}))),
		);

		const recent_summaries: string[] = [];
		for (const {agent: a, runs} of run_results) {
			for (const run of runs) {
				if (run.status === AgentRunStatus.SUCCESS && run.result) {
					const summary = run.result.length > 300 ? run.result.slice(0, 300) + '...' : run.result;
					recent_summaries.push(`[${a.name}] ${summary}`);
				}
			}
		}

		if (!recent_summaries.length) return base;
		return `${base}\n\n[Recent Agent Activity]\n${recent_summaries.join('\n')}`;
	}

	/** Expire a single conversation */
	public async expireConversation(id: string): Promise<void> {
		await this.conversationRepository.update(id, {status: ConversationStatus.EXPIRED});
	}

	/** Bulk-expire all stale active conversations */
	public async cleanupExpiredConversations(): Promise<void> {
		const cutoff = DateTime.utc().toUnixInteger() - ConversationService.IDLE_TIMEOUT_SECONDS;
		const result = await this.conversationRepository
			.createQueryBuilder()
			.update()
			.set({status: ConversationStatus.EXPIRED})
			.where('status = :status AND last_activity_at < :cutoff', {
				status: ConversationStatus.ACTIVE,
				cutoff,
			})
			.execute();

		if (result.affected) {
			this.logger.log(`Expired ${result.affected} stale conversations`);
		}
	}
}
