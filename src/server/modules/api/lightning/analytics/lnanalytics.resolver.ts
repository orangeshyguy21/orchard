/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {Timezone, TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
import {MintAnalyticsInterval} from '@server/modules/cashu/mintdb/cashumintdb.enums';
/* Local Dependencies */
import {OrchardLightningAnalytics} from './lnanalytics.model';
import {LightningAnalyticsService} from './lnanalytics.service';

type IntervalArg = 'day' | 'week' | 'month';

@Resolver()
export class LightningAnalyticsResolver {
	private readonly logger = new Logger(LightningAnalyticsResolver.name);

	constructor(private lightningAnalyticsService: LightningAnalyticsService) {}

	@Query(() => [OrchardLightningAnalytics])
	async lightning_analytics_outbound(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => MintAnalyticsInterval, nullable: true}) interval?: MintAnalyticsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
	): Promise<OrchardLightningAnalytics[]> {
		const tag = 'GET { lightning_analytics_outbound }';
		this.logger.debug(tag);
		return this.lightningAnalyticsService.getOutboundLiquiditySeries(tag, {date_start, date_end, interval, timezone});
	}
}
