/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {Timezone, TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
import {AnalyticsInterval} from '@server/modules/analytics/analytics.enums';
import {MintUnit} from '@server/modules/cashu/cashu.enums';
import {MintAnalyticsMetric} from '@server/modules/cashu/mintanalytics/mintanalytics.enums';
/* Local Dependencies */
import {
	OrchardMintAnalytics,
	OrchardMintAnalyticsMetric,
	OrchardMintKeysetsAnalytics,
	OrchardMintAnalyticsBackfillStatus,
} from './mintanalytics.model';
import {MintAnalyticsService} from './mintanalytics.service';

/** [DEBUG] Convert unix timestamp to human-readable string */
const debugTs = (ts?: number): string => (ts ? `${ts} (${new Date(ts * 1000).toISOString()})` : 'undefined');

@Resolver()
export class MintAnalyticsResolver {
	private readonly logger = new Logger(MintAnalyticsResolver.name);

	constructor(private mintAnalyticsService: MintAnalyticsService) {}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_balances(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_balances }';
		this.logger.debug(`${tag} args: units=${JSON.stringify(units)}, date_start=${debugTs(date_start)}, date_end=${debugTs(date_end)}, interval=${interval}, timezone=${timezone}`);
		const result = await this.mintAnalyticsService.getMintAnalyticsBalances(tag, {units, date_start, date_end, interval, timezone});
		this.logger.debug(`${tag} result: ${JSON.stringify(result)}`);
		return result;
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_mints(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_mints }';
		this.logger.debug(`${tag} args: units=${JSON.stringify(units)}, date_start=${debugTs(date_start)}, date_end=${debugTs(date_end)}, interval=${interval}, timezone=${timezone}`);
		const result = await this.mintAnalyticsService.getMintAnalyticsMints(tag, {units, date_start, date_end, interval, timezone});
		this.logger.debug(`${tag} result: ${JSON.stringify(result)}`);
		return result;
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_melts(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_melts }';
		this.logger.debug(`${tag} args: units=${JSON.stringify(units)}, date_start=${debugTs(date_start)}, date_end=${debugTs(date_end)}, interval=${interval}, timezone=${timezone}`);
		const result = await this.mintAnalyticsService.getMintAnalyticsMelts(tag, {units, date_start, date_end, interval, timezone});
		this.logger.debug(`${tag} result: ${JSON.stringify(result)}`);
		return result;
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_swaps(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_swaps }';
		this.logger.debug(`${tag} args: units=${JSON.stringify(units)}, date_start=${debugTs(date_start)}, date_end=${debugTs(date_end)}, interval=${interval}, timezone=${timezone}`);
		const result = await this.mintAnalyticsService.getMintAnalyticsSwaps(tag, {units, date_start, date_end, interval, timezone});
		this.logger.debug(`${tag} result: ${JSON.stringify(result)}`);
		return result;
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_fees(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_fees }';
		this.logger.debug(`${tag} args: units=${JSON.stringify(units)}, date_start=${debugTs(date_start)}, date_end=${debugTs(date_end)}, interval=${interval}, timezone=${timezone}`);
		const result = await this.mintAnalyticsService.getMintAnalyticsFees(tag, {units, date_start, date_end, interval, timezone});
		this.logger.debug(`${tag} result: ${JSON.stringify(result)}`);
		return result;
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_proofs(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_proofs }';
		this.logger.debug(`${tag} args: units=${JSON.stringify(units)}, date_start=${debugTs(date_start)}, date_end=${debugTs(date_end)}, interval=${interval}, timezone=${timezone}`);
		const result = await this.mintAnalyticsService.getMintAnalyticsProofs(tag, {units, date_start, date_end, interval, timezone});
		this.logger.debug(`${tag} result: ${JSON.stringify(result)}`);
		return result;
	}

	@Query(() => [OrchardMintAnalytics])
	async mint_analytics_promises(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintAnalytics[]> {
		const tag = 'GET { mint_analytics_promises }';
		this.logger.debug(`${tag} args: units=${JSON.stringify(units)}, date_start=${debugTs(date_start)}, date_end=${debugTs(date_end)}, interval=${interval}, timezone=${timezone}`);
		const result = await this.mintAnalyticsService.getMintAnalyticsPromises(tag, {units, date_start, date_end, interval, timezone});
		this.logger.debug(`${tag} result: ${JSON.stringify(result)}`);
		return result;
	}

	@Query(() => [OrchardMintAnalyticsMetric])
	async mint_analytics_metrics(
		@Args('units', {type: () => [MintUnit], nullable: true}) units?: MintUnit[],
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
		@Args('metrics', {type: () => [MintAnalyticsMetric], nullable: true}) metrics?: MintAnalyticsMetric[],
	): Promise<OrchardMintAnalyticsMetric[]> {
		const tag = 'GET { mint_analytics_metrics }';
		this.logger.debug(`${tag} args: units=${JSON.stringify(units)}, date_start=${debugTs(date_start)}, date_end=${debugTs(date_end)}, interval=${interval}, timezone=${timezone}, metrics=${JSON.stringify(metrics)}`);
		const result = await this.mintAnalyticsService.getAnalyticsMetrics(tag, {units, date_start, date_end, interval, timezone, metrics});
		this.logger.debug(`${tag} result: ${JSON.stringify(result)}`);
		return result;
	}

	@Query(() => [OrchardMintKeysetsAnalytics])
	async mint_analytics_keysets(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => AnalyticsInterval, nullable: true}) interval?: AnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardMintKeysetsAnalytics[]> {
		const tag = 'GET { mint_analytics_keysets }';
		this.logger.debug(`${tag} args: date_start=${debugTs(date_start)}, date_end=${debugTs(date_end)}, interval=${interval}, timezone=${timezone}`);
		const result = await this.mintAnalyticsService.getMintAnalyticsKeysets(tag, {date_start, date_end, interval, timezone});
		this.logger.debug(`${tag} result: ${JSON.stringify(result)}`);
		return result;
	}

	@Query(() => OrchardMintAnalyticsBackfillStatus)
	mint_analytics_backfill_status(): OrchardMintAnalyticsBackfillStatus {
		const tag = 'GET { mint_analytics_backfill_status }';
		this.logger.debug(tag);
		return this.mintAnalyticsService.getBackfillStatus(tag);
	}
}
