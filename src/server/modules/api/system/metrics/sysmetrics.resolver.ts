/* Core Dependencies */
import {Logger} from '@nestjs/common';
import {Resolver, Query, Args} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {Timezone, TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
/* Native Dependencies */
import {SystemMetric, SystemMetricsInterval} from '@server/modules/system/metrics/sysmetrics.enums';
/* Local Dependencies */
import {OrchardSystemMetrics} from './sysmetrics.model';
import {ApiSystemMetricsService} from './sysmetrics.service';

@Resolver()
export class SystemMetricsResolver {
	private readonly logger = new Logger(SystemMetricsResolver.name);

	constructor(private apiSystemMetricsService: ApiSystemMetricsService) {}

	@Query(() => [OrchardSystemMetrics])
	async system_metrics(
		@Args('date_start', {type: () => UnixTimestamp, nullable: true}) date_start?: number,
		@Args('date_end', {type: () => UnixTimestamp, nullable: true}) date_end?: number,
		@Args('interval', {type: () => SystemMetricsInterval, nullable: true}) interval?: SystemMetricsInterval,
		@Args('timezone', {type: () => Timezone, nullable: true}) timezone?: TimezoneType,
		@Args('metrics', {type: () => [SystemMetric], nullable: true}) metrics?: SystemMetric[],
	): Promise<OrchardSystemMetrics[]> {
		const tag = 'GET { system_metrics }';
		this.logger.debug(tag);
		return await this.apiSystemMetricsService.getMetrics(tag, {date_start, date_end, interval, timezone, metrics});
	}
}
