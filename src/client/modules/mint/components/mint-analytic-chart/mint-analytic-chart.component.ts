/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType } from 'chart.js';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
/* Application Dependencies */
import { NonNullableMintDashboardSettings } from '@client/modules/settings/types/setting.types';
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('150ms ease-in', style({ opacity: 1 }))
			]),
			transition(':leave', [
				animate('150ms ease-out', style({ opacity: 0 }))
			])
		])
	]
})
export class MintAnalyticChartComponent implements OnChanges, OnDestroy {

	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() public locale!: string;
	@Input() public mint_analytics!: MintAnalytic[];
	@Input() public mint_analytics_pre!: MintAnalytic[];
	@Input() public page_settings!: NonNullableMintDashboardSettings | undefined;
	@Input() public mint_genesis_time!: number;
	@Input() public selected_type!: ChartType | undefined;
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
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
		if(changes['selected_type'] && !changes['selected_type'].firstChange ) {
			this.init();
		}
	}

	private getRemoveSubscription(): Subscription {
		return this.chartService.onResizeStart()
			.subscribe(() => {
				this.displayed = false;
				this.cdr.detectChanges();
			});
	}
	private getAddSubscription(): Subscription {
		return this.chartService.onResizeEnd()
			.subscribe(() => {
				this.displayed = true;
				this.cdr.detectChanges();
			});
	}

	private async init(): Promise<void> {
		switch(this.selected_type) {
			case ChartType.Summary:
				this.chart_type = 'line';
				this.chart_data = this.getAmountChartData();
				this.chart_options = this.getAmountChartOptions();
				if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
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
		if( !this.page_settings ) return { datasets: [] };
		if( (!this.mint_analytics || this.mint_analytics.length === 0) && (!this.mint_analytics_pre || this.mint_analytics_pre.length === 0) ) return { datasets: [] };
		const timestamp_first = DateTime.fromSeconds(this.page_settings.date_start).startOf('day').toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.page_settings.date_end).startOf('day').toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.page_settings.interval);
		const data_unit_groups = groupAnalyticsByUnit(this.mint_analytics);
		const data_unit_groups_prepended = prependData(data_unit_groups, this.mint_analytics_pre, timestamp_first);
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
		if ( !this.chart_data || this.chart_data.datasets.length === 0 || !this.page_settings ) return {}
		const units = this.chart_data.datasets.map(item => item.label);
		const y_axis = getYAxis(units);
		const scales: ScaleChartOptions<'line'>['scales'] = {};
		scales['x'] = getXAxisConfig(this.page_settings.interval, this.locale);
		if( y_axis.includes('ybtc') ) scales['ybtc'] = getBtcYAxisConfig({
			grid_color: this.chartService.getGridColor()
		});
		if( y_axis.includes('yfiat') ) scales['yfiat'] = getFiatYAxisConfig({
			units,
			show_grid: !y_axis.includes('ybtc'),
			grid_color: this.chartService.getGridColor()
		});

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

	private getOperationsChartData(): ChartConfiguration['data'] {
		if ( !this.mint_analytics || this.mint_analytics.length === 0 || !this.page_settings ) return { datasets: [] };
		const timestamp_first = DateTime.fromSeconds(this.page_settings.date_start).startOf('day').toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.page_settings.date_end).startOf('day').toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.page_settings.interval);
		const data_unit_groups = groupAnalyticsByUnit(this.mint_analytics);
		const data_unit_groups_prepended = prependData(data_unit_groups, this.mint_analytics_pre, timestamp_first);
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
		if ( !this.chart_data || this.chart_data.datasets.length === 0 || !this.page_settings ) return {}

		return {
			responsive: true,
			scales: {
				x: { 
					...getXAxisConfig(this.page_settings.interval, this.locale),
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

	private getAnnotations(): any {
		const min_x_value = this.findMinimumXValue(this.chart_data);
		const milli_genesis_time = DateTime.fromSeconds(this.mint_genesis_time).startOf('day').toMillis();
		const display = (milli_genesis_time >= min_x_value) ? true : false;
		const config = this.chartService.getFormAnnotationConfig(false);
		return {
			annotations: {
				annotation : {
					type: 'line',
					borderColor: config.border_color,
					borderWidth: config.border_width,
					display: display,
					label: {
						display:  true,
						content: 'Mint Genesis',
						position: 'start',
						backgroundColor: config.label_bg_color,
						color: config.text_color,
						font: {
							size: 12,
							weight: '300'
						},
						borderColor: config.label_border_color,
						borderWidth: 1,
					},
					scaleID: 'x',
					value: milli_genesis_time
				}
			}
		}
	}

	private findMinimumXValue(chartData: ChartConfiguration['data']): number {
		if (!chartData?.datasets || chartData.datasets.length === 0) return 0;
		const all_x_values = chartData.datasets.flatMap(dataset => 
		  	dataset.data.map((point: any) => point.x)
		);
		return Math.min(...all_x_values);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}