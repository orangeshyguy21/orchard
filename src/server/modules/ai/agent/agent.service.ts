/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository} from 'typeorm';
import {SchedulerRegistry} from '@nestjs/schedule';
import {CronJob} from 'cron';
import {DateTime} from 'luxon';
/* Local Dependencies */
import {Agent} from './agent.entity';
import {AgentRun} from './agent-run.entity';
import {AgentKey, AgentRunStatus} from './agent.enums';
import {AGENTS} from './agent.agents';

@Injectable()
export class AgentService implements OnModuleInit {
	private readonly logger = new Logger(AgentService.name);

	constructor(
		@InjectRepository(Agent)
		private agentRepository: Repository<Agent>,
		@InjectRepository(AgentRun)
		private runRepository: Repository<AgentRun>,
		private schedulerRegistry: SchedulerRegistry,
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
				tools: '[]',
				model: null,
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
	 * Creates a run record, executes the agent, and updates run status.
	 * AI invocation is stubbed for now — establishes the run lifecycle.
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
			// TODO: integrate actual AI execution
			const completed_at = DateTime.utc().toUnixInteger();
			await this.runRepository.update(saved_run.id, {
				status: AgentRunStatus.SUCCESS,
				completed_at,
				result: 'Agent executed (stub)',
			});
			await this.agentRepository.update(agent_id, {
				last_run_status: AgentRunStatus.SUCCESS,
				updated_at: completed_at,
			});
			this.logger.log(`Agent ${agent.name} completed successfully`);
			return {...saved_run, status: AgentRunStatus.SUCCESS, completed_at, result: 'Agent executed (stub)'};
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
		updates: Partial<Pick<Agent, 'name' | 'description' | 'active' | 'system_message' | 'tools' | 'model' | 'schedules'>>,
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
