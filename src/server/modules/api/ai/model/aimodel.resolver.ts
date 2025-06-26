/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
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
	@UseGuards(GqlAuthGuard)
	async ai_models() : Promise<OrchardAiModel[]> {
		const tag = 'GET { ai_models }';
		this.logger.debug(tag);
		return await this.aiModelService.getModels(tag);
	}
}