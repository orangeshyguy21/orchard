/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
/* Application Dependencies */
import {Roles} from '@server/modules/auth/decorators/auth.decorator';
import {UserRole} from '@server/modules/user/user.enums';
/* Local Dependencies */
import {AiAgentService} from './aiagent.service';
import {OrchardAgent, OrchardAgentRun} from './aiagent.model';

@Resolver(() => [OrchardAgent])
export class AiAgentResolver {
	private readonly logger = new Logger(AiAgentResolver.name);

	constructor(private aiAgentService: AiAgentService) {}

	/* *******************************************************
		Queries
	******************************************************** */

	@Query(() => [OrchardAgent], {description: 'Get all AI agents'})
	async ai_agents(): Promise<OrchardAgent[]> {
		const tag = 'GET { ai_agents }';
		this.logger.debug(tag);
		return await this.aiAgentService.getAgents(tag);
	}

	@Query(() => OrchardAgent, {description: 'Get an AI agent by ID'})
	async ai_agent(@Args('id', {description: 'Agent identifier'}) id: string): Promise<OrchardAgent> {
		const tag = 'GET { ai_agent }';
		this.logger.debug(tag);
		return await this.aiAgentService.getAgent(tag, id);
	}

	@Query(() => [OrchardAgentRun], {description: 'Get execution runs for an AI agent'})
	async ai_agent_runs(
		@Args('agent_id', {description: 'Agent identifier to filter runs'}) agent_id: string,
		@Args('page', {type: () => Int, nullable: true, defaultValue: 0, description: 'Page number for pagination'}) page: number,
		@Args('page_size', {type: () => Int, nullable: true, defaultValue: 20, description: 'Number of runs per page'}) page_size: number,
		@Args('notified', {nullable: true, description: 'Filter by notification status'}) notified?: boolean,
	): Promise<OrchardAgentRun[]> {
		const tag = 'GET { ai_agent_runs }';
		this.logger.debug(tag);
		return await this.aiAgentService.getAgentRuns(tag, {agent_id, page, page_size, notified});
	}

	/* *******************************************************
		Mutations
	******************************************************** */

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardAgent, {description: 'Update an AI agent configuration'})
	async ai_agent_update(
		@Args('id', {description: 'Agent identifier'}) id: string,
		@Args('name', {nullable: true, description: 'New agent name'}) name: string,
		@Args('description', {nullable: true, description: 'New agent description'}) description: string,
		@Args('active', {nullable: true, description: 'Whether the agent should be active'}) active: boolean,
		@Args('model', {nullable: true, description: 'LLM model identifier'}) model: string,
		@Args('system_message', {nullable: true, description: 'New system message for the agent'}) system_message: string,
		@Args('tools', {type: () => [String], nullable: true, description: 'List of tool identifiers to assign'}) tools: string[],
		@Args('schedules', {type: () => [String], nullable: true, description: 'Cron schedules for automatic execution'})
		schedules: string[],
	): Promise<OrchardAgent> {
		const tag = 'MUTATION { ai_agent_update }';
		this.logger.debug(tag);
		return await this.aiAgentService.updateAgent(tag, id, {name, description, active, model, system_message, tools, schedules});
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardAgentRun, {description: 'Execute an AI agent immediately'})
	async ai_agent_execute(@Args('id', {description: 'Agent identifier'}) id: string): Promise<OrchardAgentRun> {
		const tag = 'MUTATION { ai_agent_execute }';
		this.logger.debug(tag);
		return await this.aiAgentService.executeAgent(tag, id);
	}
}
