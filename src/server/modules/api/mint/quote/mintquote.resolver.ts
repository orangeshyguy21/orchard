/* Core Dependencies */
import { Logger, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
/* Application Dependencies */
import { GqlAuthGuard } from '@server/modules/graphql/guards/auth.guard';
/* Local Dependencies */
import { MintQuoteService } from "./mintquote.service";
import { OrchardMintQuoteTtls } from './mintquote.model';
import { MintQuoteTtlUpdateInput } from './mintquote.input';

@Resolver(() => [OrchardMintQuoteTtls])
export class MintQuoteResolver {

	private readonly logger = new Logger(MintQuoteResolver.name);

	constructor(
		private mintQuoteService: MintQuoteService,
	) {}

	@Query(() => OrchardMintQuoteTtls)
	@UseGuards(GqlAuthGuard)
	async mint_quote_ttl(): Promise<OrchardMintQuoteTtls> {
		const tag = 'GET { mint_quote_ttl }';
		this.logger.debug(tag);
		return await this.mintQuoteService.getMintQuoteTtl(tag);
	}

	@Mutation(() => OrchardMintQuoteTtls)
	@UseGuards(GqlAuthGuard)
	async mint_quote_ttl_update(@Args('mint_quote_ttl_update') mint_quote_ttl_update: MintQuoteTtlUpdateInput): Promise<OrchardMintQuoteTtls> {
		const tag = 'MUTATION { mint_quote_ttl_update }';
		this.logger.debug(tag);
		return await this.mintQuoteService.updateMintQuoteTtl(tag, mint_quote_ttl_update);
	}
}