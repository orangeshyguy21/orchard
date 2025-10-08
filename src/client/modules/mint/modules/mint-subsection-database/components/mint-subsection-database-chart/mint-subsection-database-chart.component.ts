/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ChangeDetectorRef} from '@angular/core';
/* Vendor Dependencies */
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartType as ChartJsType} from 'chart.js';
import {DateTime} from 'luxon';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {AmountPipe} from '@client/modules/local/pipes/amount/amount.pipe';
import {DataType} from '@client/modules/orchard/enums/data.enum';
import {NonNullableMintDatabaseSettings} from '@client/modules/settings/types/setting.types';
import {getYAxisId} from '@client/modules/chart/helpers/mint-chart-data.helpers';
import {
	getYAxis,
	getBtcYAxisConfig,
	getFiatYAxisConfig,
	getTooltipTitleExact,
	getTooltipLabel,
} from '@client/modules/chart/helpers/mint-chart-options.helpers';
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import {MintSubsectionDatabaseData} from '@client/modules/mint/modules/mint-subsection-database/classes/mint-subsection-database-data.class';
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
import {MintProofGroup} from '@client/modules/mint/classes/mint-proof-group.class';
import {MintPromiseGroup} from '@client/modules/mint/classes/mint-promise-group.class';

@Component({
	selector: 'orc-mint-subsection-database-chart',
	standalone: false,
	templateUrl: './mint-subsection-database-chart.component.html',
	styleUrl: './mint-subsection-database-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseChartComponent implements OnChanges, OnDestroy {
	@ViewChild(BaseChartDirective) public chart?: BaseChartDirective;

	@Input() public locale!: string;
	@Input() public data!: MintSubsectionDatabaseData;
	@Input() public filter!: string;
	@Input() public page_settings!: NonNullableMintDatabaseSettings | undefined;
	@Input() public mint_genesis_time!: number;
	@Input() public loading!: boolean;
	@Input() public state_enabled!: boolean;

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];
	public displayed: boolean = true;

	public get mints_data(): MintMintQuote[] {
		if (this.data.type === DataType.MintMints) return this.data.source.filteredData;
		return [];
	}
	public get melts_data(): MintMeltQuote[] {
		if (this.data.type === DataType.MintMelts) return this.data.source.filteredData;
		return [];
	}
	public get proofs_data(): MintProofGroup[] {
		if (this.data.type === DataType.MintProofGroups) return this.data.source.filteredData;
		return [];
	}
	public get promises_data(): MintPromiseGroup[] {
		if (this.data.type === DataType.MintPromiseGroups) return this.data.source.filteredData;
		return [];
	}

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
		if (changes['filter'] && !changes['filter'].firstChange) {
			this.chart_data = this.getChartData();
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
		this.chart_type = 'scatter';
		this.chart_data = this.getChartData();
		this.chart_options = this.getChartOptions();
		if (this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
	}

	private getChartData(): ChartConfiguration['data'] {
		if (this.data.type === DataType.MintMints) return this.getMintsData();
		if (this.data.type === DataType.MintMelts) return this.getMeltsData();
		if (this.data.type === DataType.MintProofGroups) return this.getProofsData();
		if (this.data.type === DataType.MintPromiseGroups) return this.getPromisesData();
		return {datasets: []};
	}

	private getMintsData(): ChartConfiguration['data'] {
		if (!this.page_settings) return {datasets: []};
		if (!this.data?.source || this.data?.source.data.length === 0) return {datasets: []};
		const data_unit_groups = this.mints_data.reduce(
			(groups, entity) => {
				const unit = entity.unit;
				groups[unit] = groups[unit] || [];
				groups[unit].push(entity);
				return groups;
			},
			{} as Record<string, MintMintQuote[]>,
		);
		return this.getDatasets(data_unit_groups);
	}

	private getMeltsData(): ChartConfiguration['data'] {
		if (!this.page_settings) return {datasets: []};
		if (!this.data?.source || this.data?.source.data.length === 0) return {datasets: []};
		const data_unit_groups = this.melts_data.reduce(
			(groups, entity) => {
				const unit = entity.unit;
				groups[unit] = groups[unit] || [];
				groups[unit].push(entity);
				return groups;
			},
			{} as Record<string, MintMeltQuote[]>,
		);
		return this.getDatasets(data_unit_groups);
	}

	private getProofsData(): ChartConfiguration['data'] {
		if (!this.page_settings) return {datasets: []};
		if (!this.data?.source || this.data?.source.data.length === 0) return {datasets: []};
		const data_unit_groups = this.proofs_data.reduce(
			(groups, entity) => {
				const unit = entity.unit;
				groups[unit] = groups[unit] || [];
				groups[unit].push(entity);
				return groups;
			},
			{} as Record<string, MintProofGroup[]>,
		);
		return this.getDatasets(data_unit_groups);
	}

	private getPromisesData(): ChartConfiguration['data'] {
		if (!this.page_settings) return {datasets: []};
		if (!this.data?.source || this.data?.source.data.length === 0) return {datasets: []};
		const data_unit_groups = this.promises_data.reduce(
			(groups, entity) => {
				const unit = entity.unit;
				groups[unit] = groups[unit] || [];
				groups[unit].push(entity);
				return groups;
			},
			{} as Record<string, MintPromiseGroup[]>,
		);
		return this.getDatasets(data_unit_groups);
	}

	private getDatasets(
		data_unit_groups: Record<string, MintMintQuote[] | MintMeltQuote[] | MintProofGroup[] | MintPromiseGroup[]>,
	): ChartConfiguration['data'] {
		const datasets = Object.entries(data_unit_groups).map(([unit, data], index) => {
			const color = this.chartService.getAssetColor(unit, index);
			const custom_opacity = this.chartService.hexToRgba(color.border, 0.75);
			const data_prepped = data.map((entity) => ({
				x: (entity.created_time ?? 0) * 1000,
				y: AmountPipe.getConvertedAmount(unit, this.getEffectiveAmount(entity)),
				state: 'state' in entity ? entity.state : undefined,
			}));
			const yAxisID = getYAxisId(unit);
			return {
				data: data_prepped,
				label: unit.toUpperCase(),
				backgroundColor: custom_opacity,
				borderColor: custom_opacity,
				pointBackgroundColor: custom_opacity,
				pointBorderColor: custom_opacity,
				pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
				pointHoverBorderColor: custom_opacity,
				pointRadius: 3,
				pointHoverRadius: 4,
				pointStyle: (context: any) => {
					const entity = data[context.dataIndex];
					const state = 'state' in entity ? entity.state : undefined;
					return this.chartService.getStatePointStyle(this.data.type, state);
				},
				tension: 0.4,
				yAxisID: yAxisID,
			};
		});

		return {datasets};
	}

	private getEffectiveAmount(entity: MintMintQuote | MintMeltQuote | MintProofGroup | MintPromiseGroup): number {
		if (entity instanceof MintMintQuote) return entity.amount_paid;
		return entity.amount;
	}

	private getChartOptions(): ChartConfiguration['options'] {
		if (!this.chart_data || this.chart_data.datasets.length === 0) return {};
		const data = (this.chart_data.datasets[0]?.data as {x: number; y: number}[]) || [];
		const min_time = this.page_settings?.date_start ? this.page_settings.date_start * 1000 : Date.now();
		const max_time = this.page_settings?.date_end ? this.page_settings.date_end * 1000 : Date.now();
		const min_amount = data.length ? Math.min(...data.map((d) => d.y)) : 0;
		const max_amount = data.length ? Math.max(...data.map((d) => d.y)) : 0;
		const span_days = (max_time - min_time) / (1000 * 60 * 60 * 24);
		const time_unit = span_days > 90 ? 'month' : span_days > 21 ? 'week' : span_days >= 1 ? 'day' : 'hour';
		const use_log_scale = max_amount / min_amount >= 100;
		const step_size = 1;

		const units = this.chart_data.datasets.map((item) => item.label);
		const y_axis = getYAxis(units);
		const scales: any = {};
		if (y_axis.includes('ybtc'))
			scales['ybtc'] = {
				...getBtcYAxisConfig({
					grid_color: this.chartService.getGridColor(),
				}),
				type: use_log_scale ? 'logarithmic' : 'linear',
				beginAtZero: !use_log_scale,
				ticks: use_log_scale
					? {
							callback: function (value: number, index: number, values: number[]): string | null {
								return value === 1 || Math.log10(value) % 1 === 0 ? value.toString() : null;
							},
						}
					: {},
			};
		if (y_axis.includes('yfiat'))
			scales['yfiat'] = {
				...getFiatYAxisConfig({
					units,
					show_grid: !y_axis.includes('ybtc'),
					grid_color: this.chartService.getGridColor(),
				}),
				type: use_log_scale ? 'logarithmic' : 'linear',
				beginAtZero: !use_log_scale,
				ticks: use_log_scale
					? {
							callback: function (value: number, index: number, values: number[]): string | null {
								return value === 1 || Math.log10(value) % 1 === 0 ? value.toString() : null;
							},
						}
					: {},
			};

		scales['x'] = {
			type: 'time',
			time: {
				unit: time_unit,
				stepSize: step_size,
				displayFormats: {
					month: 'MMM yyyy',
					week: 'MMM d',
					day: 'MMM d',
					hour: 'HH:mm',
				},
			},
			grid: {
				display: true,
				color: this.chartService.getGridColor(),
			},
			min: min_time,
			max: max_time,
			ticks: {
				source: 'auto', // Ensures ticks are generated uniformly
				autoSkip: false, // Show all ticks for the chosen unit
				maxRotation: 0,
				minRotation: 0,
			},
		};

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
						title: getTooltipTitleExact,
						label: (context: any) => getTooltipLabel(context, this.locale),
					},
				},
				legend: {
					display: false,
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
		const min_x_value = this.findMinimumXValue(this.chart_data);
		const milli_genesis_time = DateTime.fromSeconds(this.mint_genesis_time).startOf('day').toMillis();
		const display = milli_genesis_time >= min_x_value ? true : false;
		const config = this.chartService.getFormAnnotationConfig(false);
		return {
			annotations: {
				annotation: {
					type: 'line',
					borderColor: config.border_color,
					borderWidth: config.border_width,
					display: display,
					label: {
						display: true,
						content: 'Mint Genesis',
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
					value: milli_genesis_time,
				},
			},
		};
	}

	private findMinimumXValue(chartData: ChartConfiguration['data']): number {
		if (!chartData?.datasets || chartData.datasets.length === 0) return 0;
		const all_x_values = chartData.datasets.flatMap((dataset) => dataset.data.map((point: any) => point.x));
		return Math.min(...all_x_values);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
