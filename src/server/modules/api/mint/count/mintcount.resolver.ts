/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
/* Application Dependencies */
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { Timezone, TimezoneType } from "@server/modules/graphql/scalars/timezone.scalar";
import { MintUnit, MintQuoteState, MeltQuoteState } from "@server/modules/cashu/cashu.enums";
/* Local Dependencies */
import { MintCountService } from "./mintcount.service";
import { OrchardMintCount } from "./mintcount.model";

@Resolver(() => OrchardMintCount)
export class MintCountResolver {

	private readonly logger = new Logger(MintCountResolver.name);

	constructor(
		private mintCountService: MintCountService,
	) {}

	@Query(() => OrchardMintCount)
	async mint_count_mint_quotes(
		@Args('units', { type: () => [MintUnit], nullable: true }) units?: MintUnit[],
		@Args('states', { type: () => [MintQuoteState], nullable: true }) states?: MintQuoteState[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
		@Args('timezone', { type: () => Timezone, nullable: true }) timezone?: TimezoneType,
	) : Promise<OrchardMintCount> {
		this.logger.debug('GET { mint_count_mint_quotes }');
		return await this.mintCountService.getMintCountMintQuotes({ units, states, date_start, date_end, timezone });
	}

	@Query(() => OrchardMintCount)
	async mint_count_melt_quotes(
		@Args('units', { type: () => [MintUnit], nullable: true }) units?: MintUnit[],
		@Args('states', { type: () => [MeltQuoteState], nullable: true }) states?: MeltQuoteState[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
		@Args('timezone', { type: () => Timezone, nullable: true }) timezone?: TimezoneType,
	) : Promise<OrchardMintCount> {
		this.logger.debug('GET { mint_count_melt_quotes }');
		return await this.mintCountService.getMintCountMeltQuotes({ units, states, date_start, date_end, timezone });
	}
}