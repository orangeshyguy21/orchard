/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, OnDestroy, OnChanges, SimpleChanges, ViewChild, signal, computed} from '@angular/core';
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
	convertChartDataWithOracle,
	getYAxisIdWithOracle,
} from '@client/modules/chart/helpers/mint-chart-data.helpers';
import {eligibleForOracleConversion} from '@client/modules/bitcoin/helpers/oracle.helpers';
import {
	getOutboundLiquidityData,
	getOutboundLiquidityVolumeData,
	getInitialOutboundMsat,
	correctLastPointWithLiveBalance,
} from '@client/modules/chart/helpers/lightning-chart-data.helpers';
import {
	getXAxisConfig,
	getYAxis,
	getBtcYAxisConfig,
	getFiatYAxisConfig,
	getTooltipTitle,
	getTooltipLabel,
} from '@client/modules/chart/helpers/mint-chart-options.helpers';
import {LocalAmountPipe} from '@client/modules/local/pipes/local-amount/local-amount.pipe';
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
import {LightningBalance} from '@client/modules/lightning/classes/lightning-balance.class';
import {LightningAnalyticsBackfillStatus} from '@client/modules/lightning/classes/lightning-analytics-backfill-status.class';
/* Native Dependencies */
import {MintAnalytic} from '@client/modules/mint/classes/mint-analytic.class';
import {LightningAnalytic} from '@client/modules/lightning/classes/lightning-analytic.class';
import {ChartType} from '@client/modules/mint/enums/chart-type.enum';
/* Shared Dependencies */
import {LightningAnalyticsInterval} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-dashboard-balance-chart',
	standalone: false,
	templateUrl: './mint-subsection-dashboard-balance-chart.component.html',
	styleUrl: './mint-subsection-dashboard-balance-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDashboardBalanceChartComponent implements OnDestroy, OnChanges {
	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	public locale = input.required<string>();
	public mint_analytics = input.required<MintAnalytic[]>();
	public mint_analytics_pre = input.required<MintAnalytic[]>();
	public bitcoin_oracle_price_map = input.required<Map<number, number> | null>();
	public lightning_balance = input.required<LightningBalance | null>();
	public lightning_analytics_backfill_status = input.required<LightningAnalyticsBackfillStatus | null>();
	public lightning_analytics = input.required<LightningAnalytic[]>();
	public lightning_analytics_pre = input.required<LightningAnalytic[]>();
	public page_settings = input.required<NonNullableMintDashboardSettings>();
	public oracle_used = input.required<boolean>();
	public mint_genesis_time = input.required<number>();
	public selected_type = input.required<ChartType | null | undefined>();
	public loading = input.required<boolean>();
	public lightning_enabled = input.required<boolean>();
	public device_mobile = input.required<boolean>();

	public chart_type!: ChartJsType;
	public chart_data = signal<ChartConfiguration['data']>({datasets: []});
	public chart_options!: ChartConfiguration['options'];
	public chart_plugins: Plugin[] = [];
	public displayed = signal<boolean>(true);
	public hidden_datasets = signal<Set<number>>(new Set());

	public liability_datasets = computed(
		() =>
			this.chart_data()
				.datasets?.map((d, i) => ({...d, _index: i}))
				.filter((d) => (d as any)._type === 'liability') ?? [],
	);
	public asset_datasets = computed(
		() =>
			this.chart_data()
				.datasets?.map((d, i) => ({...d, _index: i}))
				.filter((d) => (d as any)._type === 'asset') ?? [],
	);

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
		if (changes['oracle_used'] && !changes['oracle_used'].firstChange) {
			this.init();
		}
	}

	private canUseOracle(): boolean {
		const oracle_used = this.page_settings().oracle_used;
		const oracle_map = this.bitcoin_oracle_price_map();
		return !!(oracle_used && oracle_map && oracle_map.size > 0);
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
				this.chart_data.set(this.getBalanceSheetTotalsData());
				this.chart_options = this.getBalanceSheetChartOptions();
				this.initGlowPlugin();
				break;
			case ChartType.Volume:
				this.chart_type = 'bar';
				this.chart_data.set(this.getBalanceSheetVolumeData());
				this.chart_options = this.getBalanceSheetChartOptions();
				this.chart_plugins = [];
				break;
			case ChartType.Operations:
				this.chart_type = 'bar';
				this.chart_data.set(this.getBalanceSheetOperationsData());
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
		const data = this.chart_data();
		if (!data?.datasets || data.datasets.length === 0) {
			this.chart_plugins = [];
			return;
		}
		const first_color = data.datasets[0]?.borderColor as string;
		this.chart_plugins = first_color ? [this.chartService.createGlowPlugin(first_color)] : [];
	}

	/**
	 * Gets the balance sheet totals (cumulative) chart data
	 * Includes all unit liabilities and asset (lightning outbound) for sat
	 */
	private getBalanceSheetTotalsData(): ChartConfiguration['data'] {
		if (!this.page_settings()) return {datasets: []};

		const can_use_oracle = this.canUseOracle();
		const oracle_map = this.bitcoin_oracle_price_map();

		const time_interval = getTimeInterval(this.page_settings().interval);
		const timestamp_first = DateTime.fromSeconds(this.page_settings().date_start).startOf(time_interval).toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.page_settings().date_end).startOf(time_interval).toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.page_settings().interval);

		const datasets: any[] = [];

		// Liability datasets for all units (mint balances)
		const data_unit_groups = groupAnalyticsByUnit(this.mint_analytics().map((a) => ({...a})));
		const data_unit_groups_prepended = prependData(
			data_unit_groups,
			this.mint_analytics_pre().map((a) => ({...a})),
			timestamp_first,
		);

		Object.entries(data_unit_groups_prepended).forEach(([unit, data], index) => {
			const data_keyed_by_timestamp = getDataKeyedByTimestamp(data, 'amount');
			const raw_liability_data = getAmountData(timestamp_range, data_keyed_by_timestamp, unit, true);
			const liability_data = convertChartDataWithOracle(raw_liability_data, unit, oracle_map, can_use_oracle);
			const color = this.chartService.getAssetColor(unit, index);
			const muted_color = this.chartService.getMutedColor(color.border);
			const yAxisID = getYAxisIdWithOracle(unit, can_use_oracle);

			datasets.push({
				data: liability_data,
				label: unit.toUpperCase(),
				_type: 'liability',
				backgroundColor: (context: any) => this.chartService.createAreaGradient(context, color.border),
				borderColor: muted_color,
				borderWidth: 2,
				borderRadius: 0,
				pointBackgroundColor: muted_color,
				pointBorderColor: muted_color,
				pointBorderWidth: 2,
				pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
				pointHoverBorderColor: color.border,
				pointHoverBorderWidth: 3,
				pointRadius: 0,
				pointHoverRadius: 4,
				fill: true,
				tension: 0.4,
				yAxisID: yAxisID,
			});
		});

		// Asset dataset (lightning outbound capacity)
		if (this.lightning_enabled() && (this.lightning_analytics().length > 0 || this.lightning_analytics_pre().length > 0)) {
			const initial_outbound_msat = getInitialOutboundMsat(this.lightning_analytics_pre());
			const raw_asset_data = getOutboundLiquidityData(timestamp_range, this.lightning_analytics(), initial_outbound_msat);
			const live_balance_sat = LocalAmountPipe.getConvertedAmount('msat', this.lightning_balance()?.local_balance ?? 0);
			const interval = this.page_settings().interval as unknown as LightningAnalyticsInterval;
			const corrected_asset_data = correctLastPointWithLiveBalance(raw_asset_data, live_balance_sat, interval);
			const asset_data = convertChartDataWithOracle(corrected_asset_data, 'sat', oracle_map, can_use_oracle);
			const asset_color = this.chartService.getAssetColor('sat', 0);
			const muted_asset_color = this.chartService.getMutedColor(asset_color.border);

			datasets.push({
				data: asset_data,
				label: 'SAT',
				_type: 'asset',
				borderColor: muted_asset_color,
				borderWidth: 2,
				borderDash: [6, 4],
				pointBackgroundColor: muted_asset_color,
				pointBorderColor: muted_asset_color,
				pointBorderWidth: 2,
				pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
				pointHoverBorderColor: asset_color.border,
				pointHoverBorderWidth: 3,
				pointRadius: 0,
				pointHoverRadius: 4,
				fill: false,
				tension: 0.4,
				yAxisID: getYAxisIdWithOracle('sat', can_use_oracle),
			});
		}

		return {datasets};
	}

	/**
	 * Gets the balance sheet volume (non-cumulative) chart data
	 */
	private getBalanceSheetVolumeData(): ChartConfiguration['data'] {
		if (!this.page_settings()) return {datasets: []};

		const can_use_oracle = this.canUseOracle();
		const oracle_map = this.bitcoin_oracle_price_map();

		const time_interval = getTimeInterval(this.page_settings().interval);
		const timestamp_first = DateTime.fromSeconds(this.page_settings().date_start).startOf(time_interval).toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.page_settings().date_end).startOf(time_interval).toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.page_settings().interval);

		const datasets: any[] = [];

		// Liability datasets for all units (non cumulative)
		const data_unit_groups = groupAnalyticsByUnit(this.mint_analytics().map((a) => ({...a})));

		Object.entries(data_unit_groups).forEach(([unit, data], index) => {
			const data_keyed_by_timestamp = getDataKeyedByTimestamp(data, 'amount');
			const raw_volume_data = getAmountData(timestamp_range, data_keyed_by_timestamp, unit, false);
			const volume_data = convertChartDataWithOracle(raw_volume_data, unit, oracle_map, can_use_oracle);
			const color = this.chartService.getAssetColor(unit, index);
			const yAxisID = getYAxisIdWithOracle(unit, can_use_oracle);

			datasets.push({
				data: volume_data,
				label: unit.toUpperCase(),
				_type: 'liability',
				backgroundColor: (context: any) => this.chartService.createAreaGradient(context, color.border),
				borderColor: color.border,
				borderWidth: 1,
				borderRadius: 0,
				yAxisID: yAxisID,
			});
		});

		// Asset dataset (lightning outbound - non cumulative) - outline style
		if (this.lightning_enabled() && this.lightning_analytics().length > 0) {
			const raw_asset_data = getOutboundLiquidityVolumeData(timestamp_range, this.lightning_analytics());
			const asset_data = convertChartDataWithOracle(raw_asset_data, 'sat', oracle_map, can_use_oracle);
			const asset_color = this.chartService.getAssetColor('sat', 0);

			datasets.push({
				data: asset_data,
				label: 'SAT',
				_type: 'asset',
				backgroundColor: this.chartService.createStripePattern(asset_color.border),
				borderColor: asset_color.border,
				borderWidth: 1,
				borderSkipped: false,
				borderRadius: 0,
				yAxisID: getYAxisIdWithOracle('sat', can_use_oracle),
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

		const data_unit_groups = groupAnalyticsByUnit(this.mint_analytics().map((a) => ({...a})));
		const data_unit_groups_prepended = prependData(data_unit_groups, this.mint_analytics_pre(), timestamp_first);

		const datasets = Object.entries(data_unit_groups_prepended).map(([unit, data], index) => {
			const data_keyed_by_timestamp = getDataKeyedByTimestamp(data, 'operation_count');
			const color = this.chartService.getAssetColor(unit, index);
			const data_raw = getRawData(timestamp_range, data_keyed_by_timestamp);

			return {
				data: data_raw,
				label: unit.toUpperCase(),
				_type: 'liability',
				backgroundColor: (context: any) => this.chartService.createAreaGradient(context, color.border),
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
		const data = this.chart_data();
		if (!data || data.datasets.length === 0 || !this.page_settings) return {};

		const can_use_oracle = this.canUseOracle();

		// When oracle is used, BTC units become USD for axis purposes
		const effective_units = data.datasets.map((item) => {
			const label = item.label?.toLowerCase() ?? '';
			if (can_use_oracle && eligibleForOracleConversion(label)) return 'usd';
			return item.label;
		});
		const y_axis = getYAxis(effective_units);
		const scales: ScaleChartOptions<'line'>['scales'] = {};
		scales['x'] = getXAxisConfig(this.page_settings().interval, this.locale());

		if (y_axis.includes('ybtc')) {
			scales['ybtc'] = getBtcYAxisConfig({
				grid_color: this.chartService.getGridColor(),
				begin_at_zero: true,
				mark_zero_color: this.chartService.getGridColor('--mat-sys-surface-container-high'),
				locale: this.locale(),
			});
		}
		if (y_axis.includes('yfiat')) {
			const is_only_axis = !y_axis.includes('ybtc');
			scales['yfiat'] = getFiatYAxisConfig({
				units: effective_units,
				show_grid: is_only_axis,
				grid_color: this.chartService.getGridColor(),
				begin_at_zero: true,
				locale: this.locale(),
				position: is_only_axis ? 'left' : 'right',
				is_cents: can_use_oracle,
			});
		}

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
					itemSort: (a: any, b: any) => {
						const type_order: Record<string, number> = {asset: 0, liability: 1};
						return (type_order[a.dataset._type] ?? 2) - (type_order[b.dataset._type] ?? 2);
					},
					callbacks: {
						title: getTooltipTitle,
						beforeLabel: (context: any) => {
							const type = context.dataset._type;
							const all_items = context.chart.tooltip.dataPoints;
							const sorted = [...all_items].sort((a: any, b: any) => {
								const order: Record<string, number> = {asset: 0, liability: 1};
								return (order[a.dataset._type] ?? 2) - (order[b.dataset._type] ?? 2);
							});
							const first_of_type = sorted.find((p: any) => p.dataset._type === type);
							if (first_of_type?.datasetIndex === context.datasetIndex) {
								return type === 'asset' ? 'Assets' : 'Liabilities';
							}
							return '';
						},
						label: (context: any) => this.chartService.formatOracleTooltipLabel(context, can_use_oracle),
						labelColor: (context: any) => ({
							borderColor: context.dataset.borderColor,
							backgroundColor: context.dataset.borderColor,
							borderWidth: 2,
							borderRadius: 0,
						}),
					},
				},
				legend: {
					display: false,
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
		const data = this.chart_data();
		if (!data || data.datasets.length === 0 || !this.page_settings()) return {};

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
					display: false,
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
		const min_x_value = this.findMinimumXValue(this.chart_data());
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

	public toggleDataset(dataset: any): void {
		const chart = this.chart?.chart;
		if (!chart) return;
		const index = dataset._index;
		const is_visible = chart.isDatasetVisible(index);
		chart.setDatasetVisibility(index, !is_visible);
		chart.update();
		this.hidden_datasets.update((set) => {
			const new_set = new Set(set);
			is_visible ? new_set.add(index) : new_set.delete(index);
			return new_set;
		});
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
