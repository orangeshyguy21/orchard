/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { AiService } from '@server/modules/ai/ai.service';
import { ErrorService } from '@server/modules/error/error.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
// import { OrchardBitcoinBlockCount } from './btcblockcount.model';

@Injectable()
export class AiModelService {

	private readonly logger = new Logger(AiModelService.name);
	
	constructor(
		private aiService: AiService,
		private errorService: ErrorService,
	) {}
	
	// Method to get the current block count
	async getModels(): Promise<any[]> {
		try {
			const models = await this.aiService.getModels();
			return models;
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.AiError,
				msg: 'Error getting ai models',
			});
			throw new OrchardApiError(error_code);
		}
	}
}