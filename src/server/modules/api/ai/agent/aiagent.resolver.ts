/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
/* Native Dependencies */
import { AiAgent } from '@server/modules/ai/ai.enums';
/* Internal Dependencies */
import { AiAgentService } from "./aiagent.service";
import { OrchardAiAgent } from "./aiagent.model";

@Resolver(() => [OrchardAiAgent])
export class AiAgentResolver {

	private readonly logger = new Logger(AiAgentResolver.name);

	constructor(
		private aiAgentService: AiAgentService,
	) {}

	@Query(() => OrchardAiAgent)
	async ai_agent(
        @Args('agent', { type: () => AiAgent }) agent: AiAgent) : Promise<OrchardAiAgent> {
		const tag = 'GET { ai_agent }';
		this.logger.debug(tag);
		return await this.aiAgentService.getAgent(tag, agent);
	}
}