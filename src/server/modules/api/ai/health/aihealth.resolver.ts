/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query} from '@nestjs/graphql';
/* Internal Dependencies */
import {AiHealthService} from './aihealth.service';
import {OrchardAiHealth} from './aihealth.model';

@Resolver(() => OrchardAiHealth)
export class AiHealthResolver {
	private readonly logger = new Logger(AiHealthResolver.name);

	constructor(private aiHealthService: AiHealthService) {}

	@Query(() => OrchardAiHealth)
	async ai_health(): Promise<OrchardAiHealth> {
		const tag = 'GET { ai_health }';
		this.logger.debug(tag);
		return await this.aiHealthService.checkHealth(tag);
	}
}
