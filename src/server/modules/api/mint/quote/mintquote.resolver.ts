/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
/* Local Dependencies */
import { MintQuoteService } from "./mintquote.service";
import { OrchardMintQuoteTtls } from './mintquote.model';
import { UpdateQuoteTtlInput } from './mintquote.input';

@Resolver(() => [OrchardMintQuoteTtls])
export class MintQuoteResolver {

	private readonly logger = new Logger(MintQuoteResolver.name);

	constructor(
		private mintQuoteService: MintQuoteService,
	) {}

	@Query(() => OrchardMintQuoteTtls)
	async mint_quote_ttl(): Promise<OrchardMintQuoteTtls> {
		this.logger.debug(`QUERY { mint_quote_ttl }`);
		return await this.mintQuoteService.getMintQuoteTtl();
	}

	@Mutation(() => OrchardMintQuoteTtls)
	async update_mint_quote_ttl(@Args('updateQuoteTtlInput') updateQuoteTtlInput: UpdateQuoteTtlInput): Promise<OrchardMintQuoteTtls> {
		this.logger.debug(`MUTATION { update_mint_quote_ttl }`);
		return await this.mintQuoteService.updateMintQuoteTtl(updateQuoteTtlInput);
	}
}