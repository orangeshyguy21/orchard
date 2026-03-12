/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Native Dependencies */
import {AiAssistant} from '@server/modules/ai/assistant/ai.assistant.enums';
/* Internal Dependencies */
import {AiAssistantService} from './aiassistant.service';
import {OrchardAiAssistant} from './aiassistant.model';

@Resolver(() => [OrchardAiAssistant])
export class AiAssistantResolver {
	private readonly logger = new Logger(AiAssistantResolver.name);

	constructor(private aiAssistantService: AiAssistantService) {}

	@Query(() => OrchardAiAssistant)
	async ai_assistant(@Args('assistant', {type: () => AiAssistant}) assistant: AiAssistant): Promise<OrchardAiAssistant> {
		const tag = 'GET { ai_assistant }';
		this.logger.debug(tag);
		return await this.aiAssistantService.getAssistant(tag, assistant);
	}
}
