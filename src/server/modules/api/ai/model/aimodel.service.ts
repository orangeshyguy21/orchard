/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {AiService} from '@server/modules/ai/ai.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardAiModel} from './aimodel.model';

@Injectable()
export class AiModelService {
	private readonly logger = new Logger(AiModelService.name);

	constructor(
		private aiService: AiService,
		private errorService: ErrorService,
	) {}

	async getModels(tag: string): Promise<any[]> {
		try {
			const models = await this.aiService.getModels();
			return models.map((model) => new OrchardAiModel(model));
		} catch (error) {
			const error_code = this.errorService.resolveError({logger: this.logger, error, msg: tag, errord: OrchardErrorCode.AiError});
			throw new OrchardApiError(error_code);
		}
	}
}
