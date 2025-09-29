/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ChangeDetectorRef} from '@angular/core';
/* Vendor Dependencies */
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType} from 'chart.js';
import {DateTime} from 'luxon';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {NonNullableMintKeysetsSettings} from '@client/modules/settings/types/setting.types';
import {getAmountData, getAllPossibleTimestamps, getYAxisId, getTimeInterval} from '@client/modules/chart/helpers/mint-chart-data.helpers';
import {
	getXAxisConfig,
	getYAxis,
	getBtcYAxisConfig,
	getFiatYAxisConfig,
	getTooltipTitle,
	getTooltipLabel,
} from '@client/modules/chart/helpers/mint-chart-options.helpers';
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintAnalyticKeyset} from '@client/modules/mint/classes/mint-analytic.class';
/* Shared Dependencies */
import {MintAnalyticsInterval} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-keyset-chart',
	standalone: false,
	templateUrl: './mint-keyset-chart.component.html',
	styleUrl: './mint-keyset-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintKeysetChartComponent implements OnChanges, OnDestroy {
	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() public locale!: string;
	@Input() public interval!: MintAnalyticsInterval;
	@Input() public keysets!: MintKeyset[];
	@Input() public keysets_analytics!: MintAnalyticKeyset[];
	@Input() public keysets_analytics_pre!: MintAnalyticKeyset[];
	@Input() public page_settings!: NonNullableMintKeysetsSettings | undefined;
	@Input() public mint_genesis_time!: number;
	@Input() public loading!: boolean;

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];
	public displayed: boolean = true;

	private subscriptions: Subscription = new Subscription();

	constructor(
		private chartService: ChartService,
		private cdr: ChangeDetectorRef,
	) {
		this.subscriptions.add(this.getRemoveSubscription());
		this.subscriptions.add(this.getAddSubscription());
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && this.loading === false) {
			this.init();
		}
	}

	private getRemoveSubscription(): Subscription {
		return this.chartService.onResizeStart().subscribe(() => {
			this.displayed = false;
			this.cdr.detectChanges();
		});
	}
	private getAddSubscription(): Subscription {
		return this.chartService.onResizeEnd().subscribe(() => {
			this.displayed = true;
			this.cdr.detectChanges();
		});
	}

	private async init(): Promise<void> {
		this.chart_type = 'line';
		const valid_keysets_ids = this.keysets
			.filter((keyset) => this.page_settings?.status.includes(keyset.active))
			.filter((keyset) => this.page_settings?.units.includes(keyset.unit))
			.map((keyset) => keyset.id);
		const valid_analytics = this.keysets_analytics.filter((analytic) => valid_keysets_ids.includes(analytic.keyset_id));
		const valid_analytics_pre = this.keysets_analytics_pre.filter((analytic) => valid_keysets_ids.includes(analytic.keyset_id));
		this.chart_data = this.getChartData(valid_analytics, valid_analytics_pre);
		this.chart_options = this.getChartOptions(valid_keysets_ids);
		if (this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
	}

	private getChartData(valid_analytics: MintAnalyticKeyset[], valid_analytics_pre: MintAnalyticKeyset[]): ChartConfiguration['data'] {
		if (!this.page_settings) return {datasets: []};
		if ((!valid_analytics || valid_analytics.length === 0) && (!valid_analytics_pre || valid_analytics_pre.length === 0))
			return {datasets: []};
		const time_interval = getTimeInterval(this.interval);
		const timestamp_first = DateTime.fromSeconds(this.page_settings.date_start).startOf(time_interval).toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.page_settings.date_end).startOf(time_interval).toSeconds();
		const data_keyset_groups = valid_analytics.reduce(
			(groups, analytic) => {
				const id = analytic.keyset_id;
				groups[id] = groups[id] || [];
				groups[id].push(analytic);
				return groups;
			},
			{} as Record<string, MintAnalyticKeyset[]>,
		);
		const data_keyset_groups_prepended = this.prependData(data_keyset_groups, valid_analytics_pre, timestamp_first);
		const datasets = Object.entries(data_keyset_groups_prepended).map(([keyset_id, data], index) => {
			const keyset = this.keysets.find((k) => k.id === keyset_id);
			const unit = keyset?.unit || '';
			const keyset_genesis_time = keyset
				? DateTime.fromSeconds(keyset.valid_from).startOf(time_interval).toSeconds()
				: timestamp_first;
			const min_x = Math.max(keyset_genesis_time, timestamp_first);
			const timestamp_range = getAllPossibleTimestamps(min_x, timestamp_last, this.interval);
			const data_keyed_by_timestamp = data.reduce(
				(acc, item) => {
					acc[item.created_time] = item.amount;
					return acc;
				},
				{} as Record<string, number>,
			);
			const color = this.chartService.getAssetColor(unit, index);
			const cumulative = this.chart_type === 'line';
			let data_prepped = getAmountData(timestamp_range, data_keyed_by_timestamp, unit, cumulative);

			if (data_prepped[0].x === keyset_genesis_time * 1000) {
				data_prepped = [{x: data_prepped[0].x, y: 0}, ...data_prepped];
			}

			if (keyset && !keyset.active) {
				const successor_keyset = this.keysets.find((k) => k.derivation_path_index === keyset?.derivation_path_index + 1);
				const successor_keyset_genesis_time = successor_keyset
					? DateTime.fromSeconds(successor_keyset.valid_from).startOf(time_interval).toSeconds()
					: timestamp_last;
				const death_sentance = Math.min(successor_keyset_genesis_time, timestamp_last) * 1000;
				const time_of_death_index = data_prepped.findIndex((d) => d.x >= death_sentance && d.y === 0);
				if (time_of_death_index !== -1) data_prepped = data_prepped.slice(0, time_of_death_index + 1);
			}
			const yAxisID = getYAxisId(unit);
			const label = keyset ? `${unit.toUpperCase()} Gen ${keyset.derivation_path_index}` : keyset_id;

			return {
				data: data_prepped,
				label: label,
				backgroundColor: color.bg,
				borderColor: color.border,
				borderWidth: 2,
				borderRadius: 3,
				pointBackgroundColor: color.border,
				pointBorderColor: color.border,
				pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
				pointHoverBorderColor: color.border,
				pointRadius: 0,
				pointHoverRadius: 4,
				fill: {
					target: 'origin',
					above: color.bg,
				},
				tension: 0.4,
				yAxisID: yAxisID,
				borderDash: keyset && !keyset.active ? [5, 5] : undefined,
			};
		});

		return {datasets};
	}

	private prependData(
		analytics: Record<string, MintAnalyticKeyset[]>,
		preceding_data: MintAnalyticKeyset[],
		timestamp_first: number,
	): Record<string, MintAnalyticKeyset[]> {
		if (preceding_data.length === 0) return analytics;
		if (Object.keys(analytics).length === 0)
			return preceding_data.reduce(
				(groups, analytic) => {
					analytic.created_time = timestamp_first;
					groups[analytic.keyset_id] = groups[analytic.keyset_id] || [];
					groups[analytic.keyset_id].push(analytic);
					return groups;
				},
				{} as Record<string, MintAnalyticKeyset[]>,
			);

		for (const id in analytics) {
			const analytics_for_id = analytics[id];
			const preceding_data_for_id = preceding_data.find((p) => p.keyset_id === id);
			if (!preceding_data_for_id) continue;
			preceding_data_for_id.created_time = timestamp_first;
			const matching_datapoint = analytics_for_id.find((a) => a.created_time === preceding_data_for_id.created_time);
			if (!matching_datapoint) {
				analytics_for_id.unshift(preceding_data_for_id);
			} else {
				matching_datapoint.amount = matching_datapoint.amount + preceding_data_for_id.amount;
			}
		}
		return analytics;
	}

	private getChartOptions(valid_keysets_ids: string[]): ChartConfiguration['options'] {
		if (!this.chart_data || this.chart_data.datasets.length === 0 || !this.page_settings) return {};
		const units = this.keysets.filter((keyset) => valid_keysets_ids.includes(keyset.id)).map((keyset) => keyset.unit.toUpperCase());
		const y_axis = getYAxis(units);
		const scales: ScaleChartOptions<'line'>['scales'] = {};
		scales['x'] = getXAxisConfig(this.interval, this.locale);
		if (y_axis.includes('ybtc')) {
			scales['ybtc'] = getBtcYAxisConfig({
				grid_color: this.chartService.getGridColor(),
				begin_at_zero: true,
			});
		}
		if (y_axis.includes('yfiat')) {
			scales['yfiat'] = getFiatYAxisConfig({
				units,
				show_grid: !y_axis.includes('ybtc'),
				grid_color: this.chartService.getGridColor(),
				begin_at_zero: true,
			});
		}

		return {
			maintainAspectRatio: false,
			elements: {
				line: {
					tension: 0.5,
					cubicInterpolationMode: 'monotone',
				},
			},
			scales: scales,
			plugins: {
				tooltip: {
					enabled: true,
					mode: 'nearest',
					intersect: false,
					callbacks: {
						title: getTooltipTitle,
						label: (context: any) => getTooltipLabel(context, this.locale),
					},
				},
				legend: {
					display: true,
					position: 'top',
					labels: {
						padding: 15,
						font: {
							size: 12,
						},
					},
				},
			},
			interaction: {
				mode: 'nearest',
				axis: 'x',
				intersect: false,
			},
		};
	}

	private getAnnotations(): any {
		const min_x_value = this.findMinimumXValue(this.chart_data) / 1000;
		const max_x_value = this.findMaximumXValue(this.chart_data) / 1000;
		const config = this.chartService.getFormAnnotationConfig(false);
		const annotations: Record<string, any> = {};
		this.keysets
			.filter((keyset) => keyset.valid_from >= min_x_value && keyset.valid_from <= max_x_value)
			.filter((keyset) => this.page_settings?.status.includes(keyset.active))
			.filter((keyset) => this.page_settings?.units.includes(keyset.unit))
			.forEach((keyset) => {
				const milli_keyset_time = DateTime.fromSeconds(keyset.valid_from).startOf('day').toMillis();
				const display_keyset = milli_keyset_time >= min_x_value ? true : false;
				const label = this.getAnnotationLabel(keyset);
				annotations[`keyset_${keyset.id}`] = {
					type: 'line',
					borderColor: config.border_color,
					borderWidth: config.border_width,
					display: display_keyset,
					label: {
						display: true,
						content: label,
						position: 'start',
						backgroundColor: config.label_bg_color,
						color: config.text_color,
						font: {
							size: 12,
							weight: '300',
						},
						borderColor: config.label_border_color,
						borderWidth: 1,
					},
					scaleID: 'x',
					value: milli_keyset_time,
				};
			});
		return {annotations};
	}

	private findMinimumXValue(chartData: ChartConfiguration['data']): number {
		if (!chartData?.datasets || chartData.datasets.length === 0) return 0;
		const all_x_values = chartData.datasets.flatMap((dataset) => dataset.data.map((point: any) => point.x));
		return Math.min(...all_x_values);
	}

	private findMaximumXValue(chartData: ChartConfiguration['data']): number {
		if (!chartData?.datasets || chartData.datasets.length === 0) return 0;
		const all_x_values = chartData.datasets.flatMap((dataset) => dataset.data.map((point: any) => point.x));
		const max_x_value = Math.max(...all_x_values);
		return DateTime.fromMillis(max_x_value).endOf('day').toMillis();
	}

	private getAnnotationLabel(keyset: MintKeyset): string {
		if (this.mint_genesis_time === keyset.valid_from) return `Mint Genesis`;
		return `${keyset.unit.toUpperCase()} Rotation ${keyset.derivation_path_index}`;
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
