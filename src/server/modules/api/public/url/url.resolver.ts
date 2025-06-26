/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Local Dependencies */
import { PublicUrlService } from "./url.service";
import { OrchardPublicUrl } from "./url.model";

@Resolver(() => [OrchardPublicUrl])
export class PublicUrlResolver {

	private readonly logger = new Logger(PublicUrlResolver.name);

	constructor(
		private publicUrlService: PublicUrlService,
	) {}

	@Query(() => [OrchardPublicUrl])
	@UseGuards(GqlAuthGuard)
	async public_urls(@Args('urls', { type: () => [String] }) urls: string[]) : Promise<OrchardPublicUrl[]> {
		this.logger.debug('GET { public_urls }');
		return await this.publicUrlService.getUrlsData(urls);
	}
}