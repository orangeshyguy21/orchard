/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {ErrorService} from '@server/modules/error/error.service';
import {TaprootAssetsService} from '@server/modules/tapass/tapass/tapass.service';
import {TaprootAssetsInfo} from '@server/modules/tapass/tapass/tapass.types';
/* Local Dependencies */
import {OrchardTaprootAssetsInfo} from './tapinfo.model';

@Injectable()
export class TaprootAssetsInfoService {
	private readonly logger = new Logger(TaprootAssetsInfoService.name);

	constructor(
		private taprootAssetsService: TaprootAssetsService,
		private errorService: ErrorService,
	) {}

	async getTaprootAssetsInfo(tag: string): Promise<OrchardTaprootAssetsInfo> {
		try {
			const ta_info: TaprootAssetsInfo = await this.taprootAssetsService.getTaprootAssetsInfo();
			return new OrchardTaprootAssetsInfo(ta_info);
		} catch (error) {
			const error_code = this.errorService.resolveError({
				logger: this.logger,
				error,
				msg: tag,
				errord: OrchardErrorCode.TaprootAssetsRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
