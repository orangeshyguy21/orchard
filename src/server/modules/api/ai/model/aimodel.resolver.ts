/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Internal Dependencies */
import { AiModelService } from "./aimodel.service";
import { OrchardAiModel } from "./aimodel.model";

@Resolver(() => [OrchardAiModel])
export class AiModelResolver {

	private readonly logger = new Logger(AiModelResolver.name);

	constructor(
		private aiModelService: AiModelService,
	) {}

	@Query(() => [OrchardAiModel])
	async ai_models() : Promise<OrchardAiModel[]> {
		this.logger.debug('GET { ai_models }');
		return await this.aiModelService.getModels();
	}
}