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
			return await this.mintAnalyticsService.getMintAnalyticsBalances({ units, date_start, date_end, interval, timezone });
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_mints(
		@Args('units', { type: () => [MintUnit], nullable: true }) units?: MintUnit[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
		@Args('interval', { type: () => MintAnalyticsInterval, nullable: true }) interval?: MintAnalyticsInterval,
		@Args('timezone', { type: () => Timezone, nullable: true }) timezone?: TimezoneType,
	) : Promise<OrchardMintAnalytics[]> {
		try {
			this.logger.debug('GET { mint_analytics_mints }');
			return await this.mintAnalyticsService.getMintAnalyticsMints({ units, date_start, date_end, interval, timezone });
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
	}	

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_melts(
		@Args('units', { type: () => [MintUnit], nullable: true }) units?: MintUnit[],
		@Args('date_start', { type: () => UnixTimestamp, nullable: true }) date_start?: number,
		@Args('date_end', { type: () => UnixTimestamp, nullable: true }) date_end?: number,
		@Args('interval', { type: () => MintAnalyticsInterval, nullable: true }) interval?: MintAnalyticsInterval,
		@Args('timezone', { type: () => Timezone, nullable: true }) timezone?: TimezoneType,
	) : Promise<OrchardMintAnalytics[]> {
		try {
			this.logger.debug('GET { mint_analytics_melts }');
			return await this.mintAnalyticsService.getMintAnalyticsMelts({ units, date_start, date_end, interval, timezone });
		} catch (error) {
			throw new GraphQLError(OrchardApiErrors.MintDatabaseSelectError);
		} 
	}
}