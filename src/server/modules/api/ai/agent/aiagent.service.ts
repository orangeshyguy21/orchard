/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Native Dependencies */
import {AiAgent} from '@server/modules/ai/ai.enums';
import {AI_AGENTS} from '@server/modules/ai/ai.agents';
/* Local Dependencies */
import {OrchardAiAgent} from './aiagent.model';

@Injectable()
export class AiAgentService {
	private readonly logger = new Logger(AiAgentService.name);

	constructor(private errorService: ErrorService) {}

	async getAgent(tag: string, agent_name: AiAgent): Promise<OrchardAiAgent> {
		try {
			const agent = AI_AGENTS[agent_name];
			if (!agent) throw OrchardErrorCode.AiAgentNotFoundError;
			return new OrchardAiAgent(agent);
		} catch (error) {
			const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.AiError,
			});
			throw new OrchardApiError(orchard_error);
		}
	}
}
