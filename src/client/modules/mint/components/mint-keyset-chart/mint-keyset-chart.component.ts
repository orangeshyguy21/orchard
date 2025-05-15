/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType } from 'chart.js';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { NonNullableMintKeysetsSettings } from '@client/modules/chart/services/chart/chart.types';
import { 
	groupAnalyticsByUnit,
	prependData,
	getDataKeyedByTimestamp,
	getAmountData,
	getRawData,
	getAllPossibleTimestamps,
	getYAxisId,
} from '@client/modules/chart/helpers/mint-chart-data.helpers';
import { 
	getXAxisConfig,
	getYAxis,
	getBtcYAxisConfig,
	getFiatYAxisConfig,
	getTooltipTitle,
	getTooltipLabel,
} from '@client/modules/chart/helpers/mint-chart-options.helpers';
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import { MintKeyset } from '@client/modules/mint/classes/mint-keyset.class';
import { MintAnalyticKeyset } from '@client/modules/mint/classes/mint-analytic.class';
/* Shared Dependencies */
import { MintAnalyticsInterval } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-keyset-chart',
	standalone: false,
	templateUrl: './mint-keyset-chart.component.html',
	styleUrl: './mint-keyset-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintKeysetChartComponent {

	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() public locale!: string;
	@Input() public interval!: MintAnalyticsInterval;
	@Input() public keysets!: MintKeyset[];
	@Input() public keysets_analytics!: MintAnalyticKeyset[];
	@Input() public keysets_analytics_pre!: MintAnalyticKeyset[];
	@Input() public chart_settings!: NonNullableMintKeysetsSettings | undefined;
	@Input() public mint_genesis_time!: number;
	@Input() public loading!: boolean;

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];

	constructor(
		private chartService: ChartService,
	) { }

	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
		if(changes['selected_type'] && !changes['selected_type'].firstChange ) {
			this.init();
		}
	}

	private async init(): Promise<void> {
		this.chart_type = 'line';
		this.chart_data = this.getChartData();
		this.chart_options = this.getChartOptions();
		// if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
	}

	private getChartData(): ChartConfiguration['data'] {
		if( !this.chart_settings ) return { datasets: [] };
		if( (!this.keysets_analytics || this.keysets_analytics.length === 0) && (!this.keysets_analytics_pre || this.keysets_analytics_pre.length === 0) ) return { datasets: [] };
		const timestamp_first = DateTime.fromSeconds(this.chart_settings.date_start).startOf('day').toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.chart_settings.date_end).startOf('day').toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.interval);
		const data_keyset_groups = this.keysets_analytics.reduce((groups, analytic) => {
			const id = analytic.keyset_id;
			groups[id] = groups[id] || [];
			groups[id].push(analytic);
			return groups;
		}, {} as Record<string, MintAnalyticKeyset[]>);
		const data_unit_groups_prepended = this.prependData(data_keyset_groups, this.keysets_analytics_pre, timestamp_first);
		const datasets = Object.entries(data_unit_groups_prepended).map(([unit, data], index) => {
			const data_keyed_by_timestamp = data.reduce((acc, item) => {
				acc[item.created_time] = item.amount;
				return acc;
			}, {} as Record<string, number>);
			const color = this.chartService.getAssetColor(unit, index);
			const cumulative = this.chart_type === 'line';
			const data_prepped = getAmountData(timestamp_range, data_keyed_by_timestamp, unit, cumulative)
			const yAxisID = getYAxisId(unit);

			return {
				data: data_prepped,
				label: unit.toUpperCase(),
				backgroundColor: color.bg,
				borderColor: color.border,
				borderWidth: 2,
				borderRadius: 3,
				pointBackgroundColor: color.border,
				pointBorderColor: color.border,
				pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
				pointHoverBorderColor: color.border,
				pointRadius: 0, // Add point size (radius in pixels)
				pointHoverRadius: 4, // Optional: size when hovered
				fill: {
					target: 'origin',
					above: color.bg,
				},
				tension: 0.4,
				yAxisID: yAxisID,
			};
		});
		
		return { datasets };
	}

	private prependData(analytics: Record<string, MintAnalyticKeyset[]>, preceding_data: MintAnalyticKeyset[], timestamp_first: number): Record<string, MintAnalyticKeyset[]> {
		if( preceding_data.length === 0 ) return analytics;
		if( Object.keys(analytics).length === 0 ) return preceding_data.reduce((groups, analytic) => {
			analytic.created_time = timestamp_first;
			groups[analytic.keyset_id] = groups[analytic.keyset_id] || [];
			groups[analytic.keyset_id].push(analytic);
			return groups;
		}, {} as Record<string, MintAnalyticKeyset[]>);
	
		for (const id in analytics) {
			const analytics_for_id = analytics[id];
			const preceding_data_for_id = preceding_data.find(p => p.keyset_id === id);
			if( !preceding_data_for_id ) continue;
			preceding_data_for_id.created_time = timestamp_first;
			const matching_datapoint = analytics_for_id.find(a => a.created_time === preceding_data_for_id.created_time);
			if( !matching_datapoint ) {
				analytics_for_id.unshift(preceding_data_for_id);
			}else{
				matching_datapoint.amount = matching_datapoint.amount + preceding_data_for_id.amount;
			}
		}
		return analytics;
	}

	private getChartOptions(): ChartConfiguration['options'] {
		if ( !this.chart_data || this.chart_data.datasets.length === 0 || !this.chart_settings ) return {}
		const units = this.chart_data.datasets.map(item => item.label);
		const y_axis = getYAxis(units);
		const scales: ScaleChartOptions<'line'>['scales'] = {};
		scales['x'] = getXAxisConfig(this.interval, this.locale);
		if( y_axis.includes('ybtc') ) scales['ybtc'] = getBtcYAxisConfig({
			grid_color: this.chartService.getGridColor()
		});
		if( y_axis.includes('yfiat') ) scales['yfiat'] = getFiatYAxisConfig({
			units,
			show_grid: !y_axis.includes('ybtc'),
			grid_color: this.chartService.getGridColor()
		});

		return {
			responsive: true,
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
					mode: 'index',
					intersect: false,
					callbacks: {
						title: getTooltipTitle,
						label: (context: any) => getTooltipLabel(context, this.locale),
					}
				},
				legend: {
					display: true,
					position: 'top'
				},
			},
			interaction: {
				mode: 'index',
				axis: 'x',
				intersect: false
			}
		};
	}

}
