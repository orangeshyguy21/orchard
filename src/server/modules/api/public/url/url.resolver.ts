/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {Public} from '@server/modules/auth/decorators/auth.decorator';
/* Local Dependencies */
import {PublicUrlService} from './url.service';
import {OrchardPublicUrl} from './url.model';

@Resolver(() => [OrchardPublicUrl])
export class PublicUrlResolver {
	private readonly logger = new Logger(PublicUrlResolver.name);

	constructor(private publicUrlService: PublicUrlService) {}

	@Public()
	@Query(() => [OrchardPublicUrl])
	async public_urls(@Args('urls', {type: () => [String]}) urls: string[]): Promise<OrchardPublicUrl[]> {
		this.logger.debug('GET { public_urls }');
		return await this.publicUrlService.getUrlsData(urls);
	}
}
