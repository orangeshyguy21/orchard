/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {OrchardPublicImage} from './image.model';

@Injectable()
export class PublicImageService {
	private readonly logger = new Logger(PublicImageService.name);

	constructor(
		private fetch_service: FetchService,
		private errorService: ErrorService,
	) {}

	async getImageData(tag: string, url: string): Promise<OrchardPublicImage> {
		try {
			const response = await this.fetch_service.fetchWithProxy(url);
			const content_type = response.headers.get('content-type');
			const buffer = Buffer.from(await response.arrayBuffer());
			return new OrchardPublicImage(buffer, content_type || 'image/jpeg');
		} catch (error) {
			const error_code = this.errorService.resolveError({
				logger: this.logger,
				error,
				msg: tag,
				errord: OrchardErrorCode.PublicAssetError,
			});
			throw new OrchardApiError(error_code);
		}
	}
}
