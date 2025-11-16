/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, effect, signal, WritableSignal, OnDestroy} from '@angular/core';
/* Vendor Dependencies */
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType} from 'chart.js';
import {DateTime} from 'luxon';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';

@Component({
	selector: 'orc-bitcoin-subsection-oracle-chart',
	standalone: false,
	templateUrl: './bitcoin-subsection-oracle-chart.component.html',
	styleUrl: './bitcoin-subsection-oracle-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinSubsectionOracleChartComponent implements OnDestroy {
	public loading = input.required<boolean>();
	public data = input.required<BitcoinOraclePrice[]>();
	public date_start = input.required<number>();
	public date_end = input.required<number>();

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];
	public displayed: WritableSignal<boolean> = signal(true);

	private subscriptions: Subscription = new Subscription();

	constructor(private chartService: ChartService) {
		this.subscriptions.add(this.getRemoveSubscription());
		this.subscriptions.add(this.getAddSubscription());
		effect(() => {
			this.init();
		});
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
		if (this.loading()) return;
		this.chart_type = 'line';
		this.chart_data = this.getChartData();
		this.chart_options = this.getChartOptions();
	}

	/**
	 * Transforms BitcoinOraclePrice data into Chart.js format
	 * @returns {ChartConfiguration['data']} Chart data with x/y coordinates
	 */
	private getChartData(): ChartConfiguration['data'] {
		const price_data = this.data();

		if (!price_data || price_data.length === 0) {
			return {datasets: []};
		}

		// Convert data to {x, y} format where x is milliseconds at midnight UTC and y is price
		const formatted_data = price_data.map((point) => ({
			x: DateTime.fromSeconds(point.date, {zone: 'utc'}).startOf('day').toMillis(),
			y: point.price,
		}));

		// Sort by date to ensure proper line rendering
		formatted_data.sort((a, b) => a.x - b.x);

		const color = this.chartService.getAssetColor('usd', 0);

		return {
			datasets: [
				{
					label: 'BTC/USD',
					data: formatted_data,
					backgroundColor: color.bg,
					borderColor: color.border,
					borderWidth: 2,
					pointBackgroundColor: color.border,
					pointBorderColor: color.border,
					pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
					pointHoverBorderColor: color.border,
					pointRadius: 3,
					pointHoverRadius: 5,
					fill: {
						target: 'origin',
						above: color.bg,
					},
					tension: 0.4,
					yAxisID: 'y',
				},
			],
		};
	}

	/**
	 * Configures chart display options including scales, tooltips, and legend
	 * @returns {ChartConfiguration['options']} Chart configuration options
	 */
	private getChartOptions(): ChartConfiguration['options'] {
		if (!this.chart_data || this.chart_data.datasets.length === 0) {
			return {};
		}

		const scales: any = {
			x: {
				type: 'time',
				time: {
					unit: 'day',
					displayFormats: {
						day: 'MMM d',
					},
					tooltipFormat: 'PPP',
				},
				adapters: {
					date: {
						zone: 'UTC',
					},
				},
				ticks: {
					source: 'data',
					callback: (value: any) => {
						return DateTime.fromMillis(value, {zone: 'utc'}).toFormat('MMM d');
					},
				},
				bounds: 'data',
				title: {
					display: true,
					text: 'Date (UTC)',
				},
				grid: {
					display: false,
				},
			},
			y: {
				position: 'left',
				title: {
					display: true,
					text: 'Price (USD)',
				},
				beginAtZero: false,
				grid: {
					display: true,
					color: this.chartService.getGridColor(),
				},
				ticks: {
					callback: function (value: any) {
						return '$' + value.toLocaleString();
					},
				},
			},
		};

		return {
			maintainAspectRatio: false,
			elements: {
				line: {
					tension: 0.4,
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
						title: (tooltipItems: any) => {
							if (tooltipItems.length > 0) {
								return DateTime.fromMillis(tooltipItems[0].parsed.x, {zone: 'utc'}).toLocaleString({
									year: 'numeric',
									month: 'short',
									day: 'numeric',
								});
							}
							return '';
						},
						label: (context: any) => {
							const value = context.parsed.y;
							return `${context.dataset.label}: $${value.toLocaleString('en-US', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}`;
						},
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

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
