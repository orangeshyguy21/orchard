/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
/* Local Dependencies */
import { PublicUrlService } from "./url.service";
import { OrchardPublicUrl } from "./url.model";

@Resolver(() => OrchardPublicUrl)
export class PublicUrlResolver {

	private readonly logger = new Logger(PublicUrlResolver.name);

	constructor(
		private publicUrlService: PublicUrlService,
	) {}

	@Query(() => OrchardPublicUrl)
	async public_url(@Args('url') url: string) : Promise<OrchardPublicUrl> {
		this.logger.debug('GET { public_url }');
		return await this.publicUrlService.getUrlData(url);
	}
}
