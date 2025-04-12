/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
/* Local Dependencies */
import { MintQuoteService } from "./mintquote.service";
import { MintQuoteTtlOutput } from './mintquote.model';
import { UpdateQuoteTtlInput } from './mintquote.input';

@Resolver(() => [MintQuoteTtlOutput])
export class MintQuoteResolver {

	private readonly logger = new Logger(MintQuoteResolver.name);

	constructor(
		private mintQuoteService: MintQuoteService,
	) {}

	@Query(() => MintQuoteTtlOutput)
	async mint_quote_ttl(): Promise<MintQuoteTtlOutput> {
		this.logger.debug(`QUERY { mint_quote_ttl }`);
		return await this.mintQuoteService.getMintQuoteTtl();
	}

	@Mutation(() => MintQuoteTtlOutput)
	async update_mint_quote_ttl(@Args('updateQuoteTtlInput') updateQuoteTtlInput: UpdateQuoteTtlInput): Promise<MintQuoteTtlOutput> {
		this.logger.debug(`MUTATION { update_mint_quote_ttl }`);
		return await this.mintQuoteService.updateMintQuoteTtl(updateQuoteTtlInput);
	}
}