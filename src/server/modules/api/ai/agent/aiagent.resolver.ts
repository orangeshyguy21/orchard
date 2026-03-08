/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
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

	@Query(() => [OrchardAgent])
	async ai_agents(): Promise<OrchardAgent[]> {
		const tag = 'GET { ai_agents }';
		this.logger.debug(tag);
		return await this.aiAgentService.getAgents(tag);
	}

	@Query(() => OrchardAgent)
	async ai_agent(@Args('id') id: string): Promise<OrchardAgent> {
		const tag = 'GET { ai_agent }';
		this.logger.debug(tag);
		return await this.aiAgentService.getAgent(tag, id);
	}

	@Query(() => [OrchardAgentRun])
	async ai_agent_runs(@Args('agent_id') agent_id: string): Promise<OrchardAgentRun[]> {
		const tag = 'GET { ai_agent_runs }';
		this.logger.debug(tag);
		return await this.aiAgentService.getAgentRuns(tag, agent_id);
	}

	/* *******************************************************
		Mutations
	******************************************************** */

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardAgent)
	async ai_agent_update(
		@Args('id') id: string,
		@Args('name', {nullable: true}) name: string,
		@Args('description', {nullable: true}) description: string,
		@Args('active', {nullable: true}) active: boolean,
		@Args('system_message', {nullable: true}) system_message: string,
		@Args('tools', {type: () => [String], nullable: true}) tools: string[],
		@Args('schedules', {type: () => [String], nullable: true}) schedules: string[],
	): Promise<OrchardAgent> {
		const tag = 'MUTATION { ai_agent_update }';
		this.logger.debug(tag);
		return await this.aiAgentService.updateAgent(tag, id, {name, description, active, system_message, tools, schedules});
	}

	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@Mutation(() => OrchardAgentRun)
	async ai_agent_execute(@Args('id') id: string): Promise<OrchardAgentRun> {
		const tag = 'MUTATION { ai_agent_execute }';
		this.logger.debug(tag);
		return await this.aiAgentService.executeAgent(tag, id);
	}
}
