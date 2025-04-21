/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType } from 'chart.js';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { NonNullableMintChartSettings } from '@client/modules/chart/services/chart/chart.types';
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
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
import { ChartType } from '@client/modules/mint/enums/chart-type.enum';

@Component({
	selector: 'orc-mint-analytic-chart',
	standalone: false,
	templateUrl: './mint-analytic-chart.component.html',
	styleUrl: './mint-analytic-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintAnalyticChartComponent implements OnChanges {

	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() public title!: string;
	@Input() public locale!: string;
	@Input() public mint_analytics!: MintAnalytic[];
	@Input() public mint_analytics_pre!: MintAnalytic[];
	@Input() public chart_settings!: NonNullableMintChartSettings | undefined;
	@Input() public selected_type!: ChartType | undefined;
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
		switch(this.selected_type) {
			case ChartType.Summary:
				this.chart_type = 'line';
				this.chart_data = this.getAmountChartData();
				this.chart_options = this.getAmountChartOptions();
				break;
			case ChartType.Operations:
				this.chart_type = 'bar';
				this.chart_data = this.getOperationsChartData();	
				this.chart_options = this.getOperationsChartOptions();
				break;
			case ChartType.Volume:
				this.chart_type = 'bar';
				this.chart_data = this.getAmountChartData();
				this.chart_options = this.getAmountChartOptions();
				break;
		}
	}

	private getAmountChartData(): ChartConfiguration['data'] {
		if ( !this.mint_analytics || this.mint_analytics.length === 0 || !this.chart_settings ) return { datasets: [] };
		const timestamp_first = DateTime.fromSeconds(this.chart_settings.date_start).startOf('day').toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.chart_settings.date_end).startOf('day').toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.chart_settings.interval);
		const data_unit_groups = groupAnalyticsByUnit(this.mint_analytics);
		const data_unit_groups_prepended = prependData(data_unit_groups, this.mint_analytics_pre);
		const datasets = Object.entries(data_unit_groups_prepended).map(([unit, data], index) => {
			const data_keyed_by_timestamp = getDataKeyedByTimestamp(data, 'amount');
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

	private getAmountChartOptions(): ChartConfiguration['options'] {
		if ( !this.chart_data || this.chart_data.datasets.length === 0 || !this.chart_settings ) return {}
		const units = this.chart_data.datasets.map(item => item.label);
		const y_axis = getYAxis(units);
		const scales: ScaleChartOptions<'line'>['scales'] = {};
		scales['x'] = getXAxisConfig(this.chart_settings.interval, this.locale);
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
				}
			},
			interaction: {
				mode: 'index',
				axis: 'x',
				intersect: false
			}
		};
	}

	private getOperationsChartData(): ChartConfiguration['data'] {
		if ( !this.mint_analytics || this.mint_analytics.length === 0 || !this.chart_settings ) return { datasets: [] };
		const timestamp_first = DateTime.fromSeconds(this.chart_settings.date_start).startOf('day').toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.chart_settings.date_end).startOf('day').toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.chart_settings.interval);
		const data_unit_groups = groupAnalyticsByUnit(this.mint_analytics);
		const data_unit_groups_prepended = prependData(data_unit_groups, this.mint_analytics_pre);
		const datasets = Object.entries(data_unit_groups_prepended).map(([unit, data], index) => {
			const data_keyed_by_timestamp = getDataKeyedByTimestamp(data, 'operation_count');
			const color = this.chartService.getAssetColor(unit, index);
			const data_raw = getRawData(timestamp_range, data_keyed_by_timestamp, unit);

			return {
				data: data_raw,
				label: unit.toUpperCase(),
				backgroundColor: color.bg,
				borderColor: color.border,
				borderWidth: 1,
				borderRadius: 3,
				pointBackgroundColor: color.border,
				pointBorderColor: color.border,
				pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
				pointHoverBorderColor: color.border,
				fill: {
					target: 'origin',
					above: color.bg,
				},
				tension: 0.4,
			};
		});
		
		return { datasets };
	}

	private getOperationsChartOptions(): ChartConfiguration['options'] {
		if ( !this.chart_data || this.chart_data.datasets.length === 0 || !this.chart_settings ) return {}

		return {
			responsive: true,
			scales: {
				x: { 
					...getXAxisConfig(this.chart_settings.interval, this.locale),
					stacked: true 
				},
				y: {
					stacked: true,
					beginAtZero: true,
					title: {
						display: true,
						text: 'Operations'
					},
					ticks: {
						stepSize: 1,
						precision: 0
					}
				}
			},
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
				}
			},
			interaction: {
				mode: 'index',
				axis: 'x',
				intersect: false
			}
		};
	}
}
