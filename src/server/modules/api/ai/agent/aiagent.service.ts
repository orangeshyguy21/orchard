/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Native Dependencies */
import {AgentService} from '@server/modules/ai/agent/agent.service';
/* Local Dependencies */
import {OrchardAgent, OrchardAgentRun} from './aiagent.model';

@Injectable()
export class AiAgentService {
	private readonly logger = new Logger(AiAgentService.name);

	constructor(
		private agentService: AgentService,
		private errorService: ErrorService,
	) {}

	/** Retrieves all agents */
	async getAgents(tag: string): Promise<OrchardAgent[]> {
		try {
			const agents = await this.agentService.getAgents();
			return agents.map((agent) => new OrchardAgent(agent));
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AgentError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	/** Retrieves a single agent by ID */
	async getAgent(tag: string, id: string): Promise<OrchardAgent> {
		try {
			const agent = await this.agentService.getAgent(id);
			if (!agent) throw OrchardErrorCode.AgentNotFoundError;
			return new OrchardAgent(agent);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AgentError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	/** Retrieves runs for an agent */
	async getAgentRuns(tag: string, agent_id: string): Promise<OrchardAgentRun[]> {
		try {
			const runs = await this.agentService.getAgentRuns(agent_id);
			return runs.map((run) => new OrchardAgentRun(run));
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AgentError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	/** Updates an agent's configuration */
	async updateAgent(
		tag: string,
		id: string,
		updates: {
			name?: string;
			description?: string;
			active?: boolean;
			system_message?: string;
			model?: string;
			tools?: string[];
			schedules?: string[];
		},
	): Promise<OrchardAgent> {
		try {
			const serialized: Record<string, any> = {};
			if (updates.name !== undefined) serialized.name = updates.name;
			if (updates.description !== undefined) serialized.description = updates.description;
			if (updates.active !== undefined) serialized.active = updates.active;
			if (updates.system_message !== undefined) serialized.system_message = updates.system_message;
			if (updates.model !== undefined) serialized.model = updates.model;
			if (updates.tools !== undefined) serialized.tools = JSON.stringify(updates.tools);
			if (updates.schedules !== undefined) serialized.schedules = JSON.stringify(updates.schedules);
			const agent = await this.agentService.updateAgent(id, serialized);
			return new OrchardAgent(agent);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AgentError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}

	/** Manually triggers an agent execution */
	async executeAgent(tag: string, id: string): Promise<OrchardAgentRun> {
		try {
			const run = await this.agentService.executeAgent(id);
			return new OrchardAgentRun(run);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AgentError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
