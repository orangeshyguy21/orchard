/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository} from 'typeorm';
import {SchedulerRegistry} from '@nestjs/schedule';
import {CronJob} from 'cron';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {AiService} from '@server/modules/ai/ai.service';
import {AiMessage, AiTool, AiToolCall, AiStreamChunk} from '@server/modules/ai/ai.types';
import {AiMessageRole} from '@server/modules/ai/ai.enums';
import {SettingService} from '@server/modules/setting/setting.service';
import {SettingKey} from '@server/modules/setting/setting.enums';
/* Local Dependencies */
import {Agent} from './agent.entity';
import {AgentRun} from './agent-run.entity';
import {AgentKey, AgentRunStatus} from './agent.enums';
import {AGENTS} from './agent.agents';
import {ToolService} from '@server/modules/ai/tools/tool.service';

@Injectable()
export class AgentService implements OnModuleInit {
	private readonly logger = new Logger(AgentService.name);

	private static readonly MAX_TOOL_ITERATIONS = 10;

	constructor(
		@InjectRepository(Agent)
		private agentRepository: Repository<Agent>,
		@InjectRepository(AgentRun)
		private runRepository: Repository<AgentRun>,
		private schedulerRegistry: SchedulerRegistry,
		private aiService: AiService,
		private configService: ConfigService,
		private settingService: SettingService,
		private toolExecutor: ToolService,
	) {}

	async onModuleInit(): Promise<void> {
		await this.seedBuiltInAgents();
		await this.registerAllSchedules();
	}

	/* *******************************************************
		Seeding
	******************************************************** */

	/**
	 * Seeds built-in agents from the AGENTS registry if they do not already exist.
	 * Existing records are never overwritten — user customizations are preserved.
	 */
	private async seedBuiltInAgents(): Promise<void> {
		const now = DateTime.utc().toUnixInteger();
		for (const [key, definition] of Object.entries(AGENTS)) {
			const agent_key = key as AgentKey;
			const existing = await this.agentRepository.findOne({where: {agent_key}});
			if (existing) continue;
			const agent = this.agentRepository.create({
				agent_key,
				name: definition.name,
				description: definition.description,
				active: false,
				system_message: null,
				tools: JSON.stringify(definition.tools ?? []),
				schedules: JSON.stringify(definition.schedules ?? []),
				last_run_at: null,
				last_run_status: null,
				created_at: now,
				updated_at: now,
			});
			await this.agentRepository.save(agent);
			this.logger.log(`Seeded agent: ${definition.name} (${agent_key})`);
		}
	}

	/* *******************************************************
		Scheduling
	******************************************************** */

	/**
	 * Registers cron schedules for all active agents on boot.
	 */
	private async registerAllSchedules(): Promise<void> {
		const agents = await this.agentRepository.find();
		for (const agent of agents) {
			if (!agent.active) continue;
			const schedules: string[] = JSON.parse(agent.schedules);
			for (const cron_expression of schedules) {
				this.registerCronJob(agent, cron_expression);
			}
		}
	}

	/**
	 * Registers a single cron job for an agent + schedule expression.
	 * Job name format: agent:{agent.id}:{cron_expression}
	 */
	private registerCronJob(agent: Agent, cron_expression: string): void {
		const job_name = `agent:${agent.id}:${cron_expression}`;
		if (this.schedulerRegistry.doesExist('cron', job_name)) return;
		const job = new CronJob(cron_expression, async () => {
			await this.executeAgent(agent.id, cron_expression);
		});
		this.schedulerRegistry.addCronJob(job_name, job);
		job.start();
		this.logger.log(`Registered cron: ${job_name}`);
	}

	/**
	 * Removes all cron jobs registered for a specific agent.
	 */
	private removeCronJobsForAgent(agent_id: string): void {
		const all_jobs = this.schedulerRegistry.getCronJobs();
		const prefix = `agent:${agent_id}:`;
		all_jobs.forEach((_job, name) => {
			if (name.startsWith(prefix)) {
				this.schedulerRegistry.deleteCronJob(name);
				this.logger.log(`Removed cron: ${name}`);
			}
		});
	}

	/**
	 * Re-registers cron jobs for an agent after update.
	 */
	public async syncAgentSchedules(agent: Agent): Promise<void> {
		this.removeCronJobsForAgent(agent.id);
		if (!agent.active) return;
		const schedules: string[] = JSON.parse(agent.schedules);
		for (const cron_expression of schedules) {
			this.registerCronJob(agent, cron_expression);
		}
	}

	/* *******************************************************
		Execution
	******************************************************** */

	/**
	 * Creates a run record, executes the agent via LLM with tool calling, and updates run status.
	 */
	public async executeAgent(agent_id: string, schedule_trigger: string | null = null): Promise<AgentRun> {
		const now = DateTime.utc().toUnixInteger();
		const agent = await this.agentRepository.findOne({where: {id: agent_id}});
		if (!agent) throw new Error(`Agent not found: ${agent_id}`);

		const run = this.runRepository.create({
			agent,
			status: AgentRunStatus.RUNNING,
			schedule_trigger,
			started_at: now,
			completed_at: null,
			result: null,
			error: null,
			tokens_used: null,
		});
		const saved_run = await this.runRepository.save(run);

		await this.agentRepository.update(agent_id, {
			last_run_at: now,
			last_run_status: AgentRunStatus.RUNNING,
			updated_at: now,
		});

		try {
			const {result, tokens_used} = await this.runAgentLoop(agent);
			const completed_at = DateTime.utc().toUnixInteger();
			await this.runRepository.update(saved_run.id, {
				status: AgentRunStatus.SUCCESS,
				completed_at,
				result,
				tokens_used,
			});
			await this.agentRepository.update(agent_id, {
				last_run_status: AgentRunStatus.SUCCESS,
				updated_at: completed_at,
			});
			this.logger.log(`Agent ${agent.name} completed successfully`);
			return {...saved_run, status: AgentRunStatus.SUCCESS, completed_at, result, tokens_used};
		} catch (error) {
			const completed_at = DateTime.utc().toUnixInteger();
			await this.runRepository.update(saved_run.id, {
				status: AgentRunStatus.ERROR,
				completed_at,
				error: error.message,
			});
			await this.agentRepository.update(agent_id, {
				last_run_status: AgentRunStatus.ERROR,
				updated_at: completed_at,
			});
			this.logger.error(`Agent ${agent.name} failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Runs the LLM tool-call loop for an agent.
	 * Sends the system message and tools to the LLM, processes tool calls,
	 * and iterates until the LLM returns content or the iteration cap is hit.
	 */
	private async runAgentLoop(agent: Agent): Promise<{result: string; tokens_used: number}> {
		const model_setting = await this.settingService.getSetting(SettingKey.AI_SERVER_MODEL);
		const model = model_setting?.value;
		if (!model) throw new Error('No AI model configured (ai.server.model)');

		const tool_names: string[] = JSON.parse(agent.tools);
		const tool_schemas = this.toolExecutor.getToolSchemas(tool_names);

		const base_message =
			agent.system_message ?? 'You are a monitoring agent. Use your tools to gather data, then provide a concise analysis.';
		const system_message: AiMessage = {
			role: AiMessageRole.SYSTEM,
			content: `${base_message}\n\n${this.buildRuntimeContext(agent)}`,
		};

		const messages: AiMessage[] = [system_message, {role: AiMessageRole.USER, content: 'Run your analysis now.'}];

		let total_tokens = 0;

		for (let iteration = 0; iteration < AgentService.MAX_TOOL_ITERATIONS; iteration++) {
			const response = await this.collectStreamResponse(model, messages, tool_schemas);
			total_tokens += (response.usage?.prompt_tokens ?? 0) + (response.usage?.completion_tokens ?? 0);

			if (response.message.tool_calls?.length) {
				messages.push(response.message);
				for (const tool_call of response.message.tool_calls) {
					const tool_result = await this.toolExecutor.executeTool(tool_call.function.name, tool_call.function.arguments);
					messages.push({role: AiMessageRole.FUNCTION, content: JSON.stringify(tool_result)});
				}
			} else {
				return {result: response.message.content, tokens_used: total_tokens};
			}
		}

		return {result: 'Agent reached maximum tool iterations without producing a final response.', tokens_used: total_tokens};
	}

	/**
	 * Collects a full streamed response into a single chunk with accumulated content and tool calls.
	 * Accumulates content and tool_calls from intermediate chunks so the result is vendor-agnostic.
	 */
	private async collectStreamResponse(model: string, messages: AiMessage[], tools: AiTool[]): Promise<AiStreamChunk> {
		let final_chunk: AiStreamChunk | null = null;
		let accumulated_content = '';
		const accumulated_tool_calls: AiToolCall[] = [];

		for await (const chunk of this.aiService.streamRaw(model, messages, tools)) {
			if (chunk.done) {
				final_chunk = chunk;
			} else {
				accumulated_content += chunk.message.content ?? '';
				if (chunk.message.tool_calls?.length) {
					accumulated_tool_calls.push(...chunk.message.tool_calls);
				}
			}
		}

		if (!final_chunk) {
			throw new Error('Stream ended without a done chunk');
		}

		/* Prefer accumulated stream content over the done chunk's content */
		final_chunk.message.content = accumulated_content || final_chunk.message.content;

		/* Merge tool calls: use accumulated if present, fall back to done chunk's */
		if (accumulated_tool_calls.length) {
			final_chunk.message.tool_calls = accumulated_tool_calls;
		}

		return final_chunk;
	}

	/* *******************************************************
		Runtime Context
	******************************************************** */

	/** Builds a runtime context string to append to agent system messages */
	private buildRuntimeContext(agent: Agent): string {
		const now = DateTime.utc();
		const version = this.configService.get<string>('mode.version');

		const services: string[] = [];
		const bitcoin = this.configService.get<string>('bitcoin.type');
		const lightning = this.configService.get<string>('lightning.type');
		const mint = this.configService.get<string>('cashu.type');
		if (bitcoin) services.push(`bitcoin (${bitcoin})`);
		if (lightning) services.push(`lightning (${lightning})`);
		if (mint) services.push(`mint (${mint})`);
		const schedules: string[] = JSON.parse(agent.schedules);
		const cadence = schedules.length ? schedules.map((s) => this.describeCadence(s)).join('; ') : 'on-demand only';

		return [
			'[Runtime Context]',
			`Current time: ${now.toISO()} (unix: ${now.toUnixInteger()})`,
			`App version: ${version}`,
			`Configured services: ${services.length ? services.join(', ') : 'none'}`,
			`Schedule: ${cadence}`,
		].join('\n');
	}

	/**
	 * Converts a cron expression into a cadence description the agent can reason about.
	 * Focuses on the interval between runs so the agent knows what time window to analyze.
	 */
	private describeCadence(cron: string): string {
		const parts = cron.trim().split(/\s+/);
		if (parts.length !== 5) return `custom (${cron})`;
		const [minute, hour, day_of_month, _month, day_of_week] = parts;

		/* Sub-hourly */
		if (hour === '*' && minute.startsWith('*/')) {
			const mins = parseInt(minute.slice(2), 10);
			return `every ${mins} minutes — focus on the last ${mins} minutes of activity`;
		}

		/* Hourly */
		if (hour === '*') {
			return 'every hour — focus on the last hour of activity';
		}

		/* Every N hours */
		if (hour.startsWith('*/')) {
			const hrs = parseInt(hour.slice(2), 10);
			return `every ${hrs} hours — focus on the last ${hrs} hours of activity`;
		}

		/* Monthly */
		if (day_of_month !== '*' && day_of_week === '*') {
			return `monthly on day ${day_of_month} at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')} UTC — focus on the last 30 days of activity`;
		}

		/* Weekly */
		if (day_of_month === '*' && day_of_week !== '*') {
			return 'weekly — focus on the last 7 days of activity';
		}

		/* Daily */
		if (day_of_month === '*' && day_of_week === '*') {
			return `daily at ${hour.padStart(2, '0')}:${minute.padStart(2, '0')} UTC — focus on the last 24 hours of activity`;
		}

		return `custom (${cron})`;
	}

	/* *******************************************************
		Data Access
	******************************************************** */

	/** Find all agents */
	public async getAgents(): Promise<Agent[]> {
		return this.agentRepository.find({order: {created_at: 'ASC'}});
	}

	/** Find a single agent by ID */
	public async getAgent(id: string): Promise<Agent | null> {
		return this.agentRepository.findOne({where: {id}});
	}

	/** Get runs for an agent, most recent first, capped at 100 */
	public async getAgentRuns(agent_id: string): Promise<AgentRun[]> {
		return this.runRepository.find({
			where: {agent: {id: agent_id}},
			order: {started_at: 'DESC'},
			take: 100,
		});
	}

	/** Update an agent and re-sync its cron schedules */
	public async updateAgent(
		id: string,
		updates: Partial<Pick<Agent, 'name' | 'description' | 'active' | 'system_message' | 'tools' | 'schedules'>>,
	): Promise<Agent> {
		const agent = await this.agentRepository.findOne({where: {id}});
		if (!agent) throw new Error(`Agent not found: ${id}`);
		const now = DateTime.utc().toUnixInteger();
		Object.assign(agent, updates, {updated_at: now});
		const saved = await this.agentRepository.save(agent);
		await this.syncAgentSchedules(saved);
		return saved;
	}

	/* *******************************************************
		Retention
	******************************************************** */

	/**
	 * Deletes runs older than the most recent 100 for each agent.
	 * Called by TaskService on a schedule.
	 */
	public async cleanupOldRuns(): Promise<void> {
		const agents = await this.agentRepository.find();
		for (const agent of agents) {
			const boundary_runs = await this.runRepository.find({
				where: {agent: {id: agent.id}},
				order: {started_at: 'DESC'},
				skip: 100,
				take: 1,
			});
			if (boundary_runs.length === 0) continue;
			const cutoff = boundary_runs[0].started_at;
			await this.runRepository
				.createQueryBuilder()
				.delete()
				.where('agent_id = :agent_id AND started_at <= :cutoff', {agent_id: agent.id, cutoff})
				.execute();
			this.logger.log(`Cleaned up old runs for agent ${agent.name}`);
		}
	}
}
