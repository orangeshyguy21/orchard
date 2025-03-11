/* Core Dependencies */
import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
/* Application Dependencies */
import { OrchardApiErrors } from "@server/modules/graphql/errors/orchard.errors";
import { UnixTimestamp } from "@server/modules/graphql/scalars/unixtimestamp.scalar";
import { Timezone, TimezoneType } from "@server/modules/graphql/scalars/timezone.scalar";
import { MintUnit, MintAnalyticsInterval } from '@server/modules/cashumintdb/cashumintdb.enums';
/* Internal Dependencies */
import { OrchardMintAnalytics } from "./mintanalytics.model";
import { MintAnalyticsService } from "./mintanalytics.service";

@Resolver(() => [OrchardMintAnalytics])
export class MintAnalyticsResolver {

	private readonly logger = new Logger(MintAnalyticsResolver.name);

	constructor(
		private mintAnalyticsService: MintAnalyticsService,
	) {}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_balances(
		@Args('units', { type: () => [MintUnit], nullable: true }) units?: MintUnit[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
		@Args('interval', { type: () => MintAnalyticsInterval, nullable: true }) interval?: MintAnalyticsInterval,
		@Args('timezone', { type: () => Timezone, nullable: true }) timezone?: TimezoneType,
	) : Promise<OrchardMintAnalytics[]> {
		try {
			this.logger.debug('GET { mint_analytics_balances }');
			return this.mintAnalyticsService.getMintAnalyticsBalances({ units, date_start, date_end, interval, timezone });
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
	}
}




// @Resolver(() => [OrchardMintPromise])
// export class MintPromiseResolver {

// 	private readonly logger = new Logger(MintPromiseResolver.name);

// 	constructor(
// 		private mintPromiseService: MintPromiseService,
// 	) {}

// 	@Query(() => [OrchardMintPromise])
// 	async mint_promises(
// 		@Args('id_keysets', { type: () => [String], nullable: true }) id_keysets?: string[],
// 		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
// 		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
// 	) : Promise<OrchardMintPromise[]> {
// 		try {
// 			this.logger.debug('GET { mint_promises }');
// 			return this.mintPromiseService.getMintPromises({ id_keysets, date_start, date_end });
// 		} catch (error) {
// 			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
// 		} 
// 	}
// }
