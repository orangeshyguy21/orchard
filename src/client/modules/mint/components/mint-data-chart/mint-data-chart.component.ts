/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType as ChartJsType } from 'chart.js';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { MintDataType } from '@client/modules/mint/enums/chart-type.enum';
import { NonNullableMintDatabaseSettings } from '@client/modules/settings/types/setting.types';
import { 
	getYAxisId,
} from '@client/modules/chart/helpers/mint-chart-data.helpers';
import { 
	getYAxis,
	getBtcYAxisConfig,
	getFiatYAxisConfig,
} from '@client/modules/chart/helpers/mint-chart-options.helpers';
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import { MintData } from '@client/modules/mint/components/mint-subsection-database/mint-subsection-database.component';
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';

@Component({
	selector: 'orc-mint-data-chart',
	standalone: false,
	templateUrl: './mint-data-chart.component.html',
	styleUrl: './mint-data-chart.component.scss',
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
export class MintDataChartComponent {

	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() public locale!: string;
	@Input() public data!: MintData;
	@Input() public page_settings!: NonNullableMintDatabaseSettings | undefined;
	@Input() public mint_genesis_time!: number;
	@Input() public loading!: boolean;

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];

	public get mints_data(): MintMintQuote[] {
		if( this.data.type === MintDataType.Mints ) return this.data.entities;
		return [];
	}

	constructor(
		private chartService: ChartService,
	) { }

	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
	}

	private async init(): Promise<void> {
		this.chart_type = 'scatter';
		this.chart_data = this.getChartData();
		this.chart_options = this.getChartOptions();
		if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
	}

	private getChartData(): ChartConfiguration['data'] {
		if( this.data.type === MintDataType.Mints ) return this.getMintsData();
		return { datasets: [] };
		// if( this.data.type === MintDataType.Melts ) return this.getMeltsData();
	}

	private getMintsData(): ChartConfiguration['data'] {
		if( !this.page_settings ) return { datasets: [] };
		if( (!this.data?.entities || this.data?.entities.length === 0) ) return { datasets: [] };
		const data_unit_groups = this.mints_data.reduce((groups, entity) => {
			const unit = entity.unit;
			groups[unit] = groups[unit] || [];
			groups[unit].push(entity);
			return groups;
		}, {} as Record<string, MintMintQuote[]>);
		const datasets = Object.entries(data_unit_groups).map(([unit, data], index) => {
			const color = this.chartService.getAssetColor(unit, index);
			const data_prepped = data.map( entity => ({
				x: (entity.created_time ?? 0) * 1000,
				y: entity.amount
			}));
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
				pointRadius: 3,
				pointHoverRadius: 4,
				tension: 0.4,
				yAxisID: yAxisID,
			};
		});
		
		return { datasets };
	}

	private getChartOptions(): ChartConfiguration['options'] {
		if (!this.chart_data || this.chart_data.datasets.length === 0) return {};
		const data = this.chart_data.datasets[0]?.data as { x: number, y: number }[] || [];
		const min_time = data.length ? Math.min(...data.map(d => d.x)) : Date.now();
		const max_time = data.length ? Math.max(...data.map(d => d.x)) : Date.now();
		const span_days = (max_time - min_time) / (1000 * 60 * 60 * 24);
		const time_unit = span_days > 90 ? 'month' : span_days > 21 ? 'week' : 'day';
		// const use_log_scale = this.metrics.max / this.metrics.min >= 100;
		const use_log_scale = false; 
		const step_size = 1;

		const units = this.chart_data.datasets.map(item => item.label);
		const y_axis = getYAxis(units);
		const scales: any = {};
		if( y_axis.includes('ybtc') ) scales['ybtc'] = getBtcYAxisConfig({
			grid_color: this.chartService.getGridColor()
		});
		if( y_axis.includes('yfiat') ) scales['yfiat'] = getFiatYAxisConfig({
			units,
			show_grid: !y_axis.includes('ybtc'),
			grid_color: this.chartService.getGridColor()
		});

		scales['x'] = {
			type: 'time',
			time: {
				unit: time_unit,
				stepSize: step_size,
				displayFormats: {
					month: 'MMM yyyy',
					week: 'MMM d',
					day: 'MMM d',
				}
			},
			grid: {
				display: true,
				color: this.chartService.getGridColor()
			},
			min: min_time,
			max: max_time,
			ticks: {
				source: 'auto', // Ensures ticks are generated uniformly
				autoSkip: false, // Show all ticks for the chosen unit
				maxRotation: 0,
				minRotation: 0,
			}
		};
	
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
					// callbacks: {
					// 	title: getTooltipTitleExact,
					// 	label: (context: any) => getTooltipLabel(context, this.locale),
					// }
				},
				legend: {
					display: false,
				},
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
}