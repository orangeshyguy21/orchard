/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {Timezone, TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
import {MintAnalyticsInterval} from '@server/modules/cashu/mintdb/cashumintdb.enums';
import {MintUnit} from '@server/modules/cashu/cashu.enums';
/* Internal Dependencies */
import {OrchardMintAnalytics, OrchardMintKeysetsAnalytics} from './mintanalytics.model';
import {MintAnalyticsService} from './mintanalytics.service';

@Resolver()
export class MintAnalyticsResolver {
	private readonly logger = new Logger(MintAnalyticsResolver.name);

	constructor(private mintAnalyticsService: MintAnalyticsService) {}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_balances(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => MintAnalyticsInterval, nullable: true}) interval?: MintAnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_balances }';
		this.logger.debug(tag);
		return await this.mintAnalyticsService.getMintAnalyticsBalances(tag, {units, date_start, date_end, interval, timezone});
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_mints(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => MintAnalyticsInterval, nullable: true}) interval?: MintAnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_mints }';
		this.logger.debug(tag);
		return await this.mintAnalyticsService.getMintAnalyticsMints(tag, {units, date_start, date_end, interval, timezone});
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_melts(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => MintAnalyticsInterval, nullable: true}) interval?: MintAnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_melts }';
		this.logger.debug(tag);
		return await this.mintAnalyticsService.getMintAnalyticsMelts(tag, {units, date_start, date_end, interval, timezone});
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_swaps(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => MintAnalyticsInterval, nullable: true}) interval?: MintAnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_swaps }';
		this.logger.debug(tag);
		return await this.mintAnalyticsService.getMintAnalyticsSwaps(tag, {units, date_start, date_end, interval, timezone});
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_fees(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => MintAnalyticsInterval, nullable: true}) interval?: MintAnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_fees }';
		this.logger.debug(tag);
		return await this.mintAnalyticsService.getMintAnalyticsFees(tag, {units, date_start, date_end, interval, timezone});
	}

	@Query(() => [OrchardMintKeysetsAnalytics])
	async mint_analytics_keysets(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => MintAnalyticsInterval, nullable: true}) interval?: MintAnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintKeysetsAnalytics[]> {
		const tag = 'GET { mint_analytics_keysets }';
		this.logger.debug(tag);
		return await this.mintAnalyticsService.getMintAnalyticsKeysets(tag, {date_start, date_end, interval, timezone});
	}
}
