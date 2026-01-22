/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, OnDestroy, OnChanges, SimpleChanges, ViewChild, signal} from '@angular/core';
/* Vendor Dependencies */
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType, Plugin} from 'chart.js';
import {DateTime} from 'luxon';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {NonNullableMintDashboardSettings} from '@client/modules/settings/types/setting.types';
import {
	groupAnalyticsByUnit,
	prependData,
	getDataKeyedByTimestamp,
	getAmountData,
	getRawData,
	getAllPossibleTimestamps,
	getTimeInterval,
} from '@client/modules/chart/helpers/mint-chart-data.helpers';
import {
	getOutboundLiquidityData,
	getOutboundLiquidityVolumeData,
	getInitialOutboundMsat,
	getLightningTimestamps,
	getLightningTimeInterval,
} from '@client/modules/chart/helpers/lightning-chart-data.helpers';
import {
	getXAxisConfig,
	getBtcYAxisConfig,
	getTooltipTitle,
	getTooltipLabel,
} from '@client/modules/chart/helpers/mint-chart-options.helpers';
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import {MintAnalytic} from '@client/modules/mint/classes/mint-analytic.class';
import {LightningAnalytic} from '@client/modules/lightning/classes/lightning-analytic.class';
import {ChartType} from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import {LightningAnalyticsInterval} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-dashboard-balancesheet-chart',
	standalone: false,
	templateUrl: './mint-subsection-dashboard-balancesheet-chart.component.html',
	styleUrl: './mint-subsection-dashboard-balancesheet-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDashboardBalancesheetChartComponent implements OnDestroy, OnChanges {
	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	public locale = input.required<string>();
	public mint_analytics = input.required<MintAnalytic[]>();
	public mint_analytics_pre = input.required<MintAnalytic[]>();
	public lightning_analytics = input.required<LightningAnalytic[]>();
	public lightning_analytics_pre = input.required<LightningAnalytic[]>();
	public page_settings = input.required<NonNullableMintDashboardSettings>();
	public mint_genesis_time = input.required<number>();
	public selected_type = input.required<ChartType | null | undefined>();
	public loading = input.required<boolean>();
	public lightning_enabled = input.required<boolean>();

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];
	public chart_plugins: Plugin[] = [];
	public displayed = signal<boolean>(true);

	private subscriptions: Subscription = new Subscription();

	constructor(private chartService: ChartService) {
		this.subscriptions.add(this.getRemoveSubscription());
		this.subscriptions.add(this.getAddSubscription());
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && !changes['loading'].firstChange) {
			if (this.loading() === false) this.init();
		}
		if (changes['selected_type'] && !changes['selected_type'].firstChange) {
			this.init();
		}
	}

	private getRemoveSubscription(): Subscription {
		return this.chartService.onResizeStart().subscribe(() => {
			this.displayed.set(false);
		});
	}

	private getAddSubscription(): Subscription {
		return this.chartService.onResizeEnd().subscribe(() => {
			this.displayed.set(true);
		});
	}

	private init(): void {
		const has_mint_data = this.mint_analytics().length > 0 || this.mint_analytics_pre().length > 0;
		const has_lightning_data = this.lightning_analytics().length > 0 || this.lightning_analytics_pre().length > 0;
		if (!has_mint_data && !has_lightning_data) return;

		switch (this.selected_type()) {
			case ChartType.Totals:
				this.chart_type = 'line';
				this.chart_data = this.getBalanceSheetTotalsData();
				this.chart_options = this.getBalanceSheetChartOptions();
				this.initGlowPlugin();
				break;
			case ChartType.Volume:
				this.chart_type = 'bar';
				this.chart_data = this.getBalanceSheetVolumeData();
				this.chart_options = this.getBalanceSheetChartOptions();
				this.chart_plugins = [];
				break;
			case ChartType.Operations:
				this.chart_type = 'bar';
				this.chart_data = this.getBalanceSheetOperationsData();
				this.chart_options = this.getBalanceSheetOperationsOptions();
				this.chart_plugins = [];
				break;
		}

		if (this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
		setTimeout(() => {
			this.chart?.chart?.resize();
		});
		setTimeout(() => {
			this.displayed.set(true);
		}, 50);
	}

	/**
	 * Creates the glow effect plugin for chart points (line charts only)
	 */
	private initGlowPlugin(): void {
		if (!this.chart_data?.datasets || this.chart_data.datasets.length === 0) {
			this.chart_plugins = [];
			return;
		}
		const first_color = this.chart_data.datasets[0]?.borderColor as string;
		this.chart_plugins = first_color ? [this.chartService.createGlowPlugin(first_color)] : [];
	}

	/**
	 * Gets the balance sheet totals (cumulative) chart data
	 * Includes liability (mint balance) and asset (lightning outbound) for sat unit only
	 */
	private getBalanceSheetTotalsData(): ChartConfiguration['data'] {
		if (!this.page_settings()) return {datasets: []};

		const time_interval = getTimeInterval(this.page_settings().interval);
		const timestamp_first = DateTime.fromSeconds(this.page_settings().date_start).startOf(time_interval).toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.page_settings().date_end).startOf(time_interval).toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.page_settings().interval);

		const datasets: any[] = [];

		// Liability dataset (mint balance for sat unit)
		const sat_analytics = this.mint_analytics().filter((a) => a.unit === 'sat');
		const sat_analytics_pre = this.mint_analytics_pre().filter((a) => a.unit === 'sat');

		if (sat_analytics.length > 0 || sat_analytics_pre.length > 0) {
			const data_unit_groups = groupAnalyticsByUnit(sat_analytics.map((a) => ({...a})));
			const data_unit_groups_prepended = prependData(
				data_unit_groups,
				sat_analytics_pre.map((a) => ({...a})),
				timestamp_first,
			);

			if (data_unit_groups_prepended['sat']) {
				const data_keyed_by_timestamp = getDataKeyedByTimestamp(data_unit_groups_prepended['sat'], 'amount');
				const liability_data = getAmountData(timestamp_range, data_keyed_by_timestamp, 'sat', true);
				const liability_color = this.chartService.getAssetColor('liability', 0);
				const muted_liability_color = this.chartService.getMutedColor(liability_color.border);

				datasets.push({
					data: liability_data,
					label: 'sat (liability)',
					backgroundColor: (context: any) => this.chartService.createAreaGradient(context, liability_color.border),
					borderColor: muted_liability_color,
					borderWidth: 2,
					borderRadius: 0,
					pointBackgroundColor: muted_liability_color,
					pointBorderColor: muted_liability_color,
					pointBorderWidth: 2,
					pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
					pointHoverBorderColor: liability_color.border,
					pointHoverBorderWidth: 3,
					pointRadius: 0,
					pointHoverRadius: 4,
					fill: true,
					tension: 0.4,
					yAxisID: 'ybtc',
				});
			}
		}

		// Asset dataset (lightning outbound capacity)
		if (this.lightning_enabled() && (this.lightning_analytics().length > 0 || this.lightning_analytics_pre().length > 0)) {
			const initial_outbound_msat = getInitialOutboundMsat(this.lightning_analytics_pre());
			const asset_data = getOutboundLiquidityData(timestamp_range, this.lightning_analytics(), initial_outbound_msat);
			const asset_color = this.chartService.getAssetColor('asset', 1);
			const muted_asset_color = this.chartService.getMutedColor(asset_color.border);

			datasets.push({
				data: asset_data,
				label: 'sat (asset)',
				backgroundColor: (context: any) => this.chartService.createAreaGradient(context, asset_color.border),
				borderColor: muted_asset_color,
				borderWidth: 2,
				borderRadius: 0,
				pointBackgroundColor: muted_asset_color,
				pointBorderColor: muted_asset_color,
				pointBorderWidth: 2,
				pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
				pointHoverBorderColor: asset_color.border,
				pointHoverBorderWidth: 3,
				pointRadius: 0,
				pointHoverRadius: 4,
				fill: true,
				tension: 0.4,
				yAxisID: 'ybtc',
			});
		}

		return {datasets};
	}

	/**
	 * Gets the balance sheet volume (non-cumulative) chart data
	 */
	private getBalanceSheetVolumeData(): ChartConfiguration['data'] {
		if (!this.page_settings()) return {datasets: []};

		const time_interval = getTimeInterval(this.page_settings().interval);
		const timestamp_first = DateTime.fromSeconds(this.page_settings().date_start).startOf(time_interval).toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.page_settings().date_end).startOf(time_interval).toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.page_settings().interval);

		const datasets: any[] = [];

		// Liability dataset (mint balance for sat unit - non cumulative)
		const sat_analytics = this.mint_analytics().filter((a) => a.unit === 'sat');

		if (sat_analytics.length > 0) {
			const data_unit_groups = groupAnalyticsByUnit(sat_analytics.map((a) => ({...a})));
			if (data_unit_groups['sat']) {
				const data_keyed_by_timestamp = getDataKeyedByTimestamp(data_unit_groups['sat'], 'amount');
				const liability_data = getAmountData(timestamp_range, data_keyed_by_timestamp, 'sat', false);
				const liability_color = this.chartService.getAssetColor('liability', 0);

				datasets.push({
					data: liability_data,
					label: 'sat (liability)',
					backgroundColor: liability_color.bg,
					borderColor: liability_color.border,
					borderWidth: 1,
					borderRadius: 0,
					yAxisID: 'ybtc',
				});
			}
		}

		// Asset dataset (lightning outbound - non cumulative)
		if (this.lightning_enabled() && this.lightning_analytics().length > 0) {
			const asset_data = getOutboundLiquidityVolumeData(timestamp_range, this.lightning_analytics());
			const asset_color = this.chartService.getAssetColor('asset', 1);

			datasets.push({
				data: asset_data,
				label: 'sat (asset)',
				backgroundColor: asset_color.bg,
				borderColor: asset_color.border,
				borderWidth: 1,
				borderRadius: 0,
				yAxisID: 'ybtc',
			});
		}

		return {datasets};
	}

	/**
	 * Gets the operations chart data (operation counts from mint analytics)
	 */
	private getBalanceSheetOperationsData(): ChartConfiguration['data'] {
		if (!this.mint_analytics() || this.mint_analytics().length === 0 || !this.page_settings()) return {datasets: []};

		const timestamp_first = DateTime.fromSeconds(this.page_settings().date_start).startOf('day').toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.page_settings().date_end).startOf('day').toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.page_settings().interval);

		// Only sat unit for operations
		const sat_analytics = this.mint_analytics().filter((a) => a.unit === 'sat');
		if (sat_analytics.length === 0) return {datasets: []};

		const data_unit_groups = groupAnalyticsByUnit(sat_analytics.map((a) => ({...a})));
		const data_unit_groups_prepended = prependData(
			data_unit_groups,
			this.mint_analytics_pre().filter((a) => a.unit === 'sat'),
			timestamp_first,
		);

		const datasets = Object.entries(data_unit_groups_prepended).map(([unit, data], index) => {
			const data_keyed_by_timestamp = getDataKeyedByTimestamp(data, 'operation_count');
			const color = this.chartService.getAssetColor(unit, index);
			const data_raw = getRawData(timestamp_range, data_keyed_by_timestamp);

			return {
				data: data_raw,
				label: 'sat (operations)',
				backgroundColor: color.bg,
				borderColor: color.border,
				borderWidth: 1,
				borderRadius: 0,
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

		return {datasets};
	}

	/**
	 * Gets chart options for balance sheet (totals and volume)
	 */
	private getBalanceSheetChartOptions(): ChartConfiguration['options'] {
		if (!this.chart_data || this.chart_data.datasets.length === 0 || !this.page_settings) return {};

		const scales: ScaleChartOptions<'line'>['scales'] = {};
		scales['x'] = getXAxisConfig(this.page_settings().interval, this.locale());
		scales['ybtc'] = getBtcYAxisConfig({
			grid_color: this.chartService.getGridColor(),
			begin_at_zero: true,
			mark_zero_color: this.chartService.getGridColor('--mat-sys-surface-container-high'),
			locale: this.locale(),
		});

		return {
			responsive: true,
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
						label: (context: any) => getTooltipLabel(context, this.locale()),
						labelColor: (context: any) => {
							return {
								borderColor: context.dataset.borderColor,
								backgroundColor: context.dataset.borderColor,
								borderWidth: 2,
								borderRadius: 0,
							};
						},
					},
				},
				legend: {
					display: true,
					position: 'top',
				},
			},
			interaction: {
				mode: 'index',
				axis: 'x',
				intersect: false,
			},
		};
	}

	/**
	 * Gets chart options for operations chart
	 */
	private getBalanceSheetOperationsOptions(): ChartConfiguration['options'] {
		if (!this.chart_data || this.chart_data.datasets.length === 0 || !this.page_settings()) return {};

		return {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				x: {
					...getXAxisConfig(this.page_settings().interval, this.locale()),
					stacked: true,
				},
				y: {
					stacked: true,
					beginAtZero: true,
					title: {
						display: true,
						text: 'Operations',
					},
					ticks: {
						stepSize: 1,
						precision: 0,
						callback: (value: string | number) => Number(value).toLocaleString(this.locale()),
					},
					grid: {
						display: true,
						lineWidth: (context: any) => (context.tick.value === 0 ? 2 : 1),
						color: (context: any) =>
							context.tick.value === 0
								? this.chartService.getGridColor('--mat-sys-surface-container-high')
								: this.chartService.getGridColor(),
					},
				},
			},
			plugins: {
				tooltip: {
					enabled: true,
					mode: 'index',
					intersect: false,
					callbacks: {
						title: getTooltipTitle,
						label: (context: any) => getTooltipLabel(context, this.locale()),
						labelColor: (context: any) => ({
							borderColor: context.dataset.borderColor,
							backgroundColor: context.dataset.borderColor,
							borderWidth: 2,
							borderRadius: 0,
						}),
					},
				},
				legend: {
					display: true,
					position: 'top',
				},
			},
			interaction: {
				mode: 'index',
				axis: 'x',
				intersect: false,
			},
		};
	}

	private getAnnotations(): any {
		const min_x_value = this.findMinimumXValue(this.chart_data);
		const milli_genesis_time = DateTime.fromSeconds(this.mint_genesis_time()).startOf('day').toMillis();
		const display = milli_genesis_time >= min_x_value;
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
