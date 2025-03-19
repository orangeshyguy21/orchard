/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { MintUnit, MintQuoteStatus } from "@server/modules/cashu/cashu.enums";
/* Local Dependencies */
import { MintMintQuoteService } from "./mintmintquote.service";
import { OrchardMintMintQuote } from "./mintmintquote.model";

@Resolver(() => [OrchardMintMintQuote])
export class MintMintQuoteResolver {

	private readonly logger = new Logger(MintMintQuoteResolver.name);

	constructor(
		private mintMintQuoteService: MintMintQuoteService,
	) {}

	@Query(() => [OrchardMintMintQuote])
	async mint_mint_quotes(
		@Args('unit', { type: () => [MintUnit], nullable: true }) unit?: MintUnit[],
		@Args('status', { type: () => [MintQuoteStatus], nullable: true }) status?: MintQuoteStatus[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
	) : Promise<OrchardMintMintQuote[]> {
		try {
			this.logger.debug('GET { mint_mint_quotes }');
			return await this.mintMintQuoteService.getMintMintQuotes({ unit, status, date_start, date_end });
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
	}
}