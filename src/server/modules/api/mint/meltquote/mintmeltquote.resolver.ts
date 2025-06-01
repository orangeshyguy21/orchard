/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
/* Application Dependencies */
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { Timezone, TimezoneType } from "@server/modules/graphql/scalars/timezone.scalar";
import { MintUnit, MeltQuoteState } from "@server/modules/cashu/cashu.enums";
/* Local Dependencies */
import { MintMeltQuoteService } from "./mintmeltquote.service";
import { OrchardMintMeltQuote } from "./mintmeltquote.model";
import { MintNut05UpdateInput } from "./mintmeltquote.input";
import { OrchardMintNut05Update } from "./mintmeltquote.model";

@Resolver()
export class MintMeltQuoteResolver {

    private readonly logger = new Logger(MintMeltQuoteResolver.name);

    constructor(
      	private mintMeltQuoteService: MintMeltQuoteService,
    ) {}

    @Query(() => [OrchardMintMeltQuote])
    async mint_melt_quotes(
		@Args('unit', { type: () => [MintUnit], nullable: true }) unit?: MintUnit[],
		@Args('state', { type: () => [MeltQuoteState], nullable: true }) state?: MeltQuoteState[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
		@Args('timezone', { type: () => Timezone, nullable: true }) timezone?: TimezoneType,
	) : Promise<OrchardMintMeltQuote[]> {
      	this.logger.debug('GET { mint_melt_quotes }');
		return await this.mintMeltQuoteService.getMintMeltQuotes({ unit, state, date_start, date_end, timezone });
    }

	@Mutation(() => OrchardMintNut05Update)
	async mint_nut05_update(@Args('mint_nut05_update') mint_nut05_update: MintNut05UpdateInput): Promise<OrchardMintNut05Update> {
		this.logger.debug(`MUTATION { mint_nut05_update }`);
		return await this.mintMeltQuoteService.updateMintNut05(mint_nut05_update);
	}
}