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
	public date_today = input.required<number>();
	public date_start = input.required<number>();
	public date_end = input.required<number>();
	public form_open = input.required<boolean>();
	public enabled_ai = input.required<boolean>();

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];
	public displayed: WritableSignal<boolean> = signal(true);

	private subscriptions: Subscription = new Subscription();

	constructor(private chartService: ChartService) {
		this.subscriptions.add(this.getRemoveSubscription());
		this.subscriptions.add(this.getAddSubscription());
		effect(() => {
			const done_loading = !this.loading();
			if (done_loading) this.init();
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

		// Calculate interpolated data for missing dates
		const interpolated_data = this.getInterpolatedData(formatted_data);

		const datasets: any[] = [
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
		];

		// Add interpolated dataset if there are missing dates
		if (interpolated_data.length > 0) {
			datasets.push({
				label: 'BTC/USD (Estimated)',
				data: interpolated_data,
				backgroundColor: 'rgba(128, 128, 128, 0.5)',
				borderColor: 'rgba(128, 128, 128, 0.8)',
				pointBackgroundColor: 'rgba(128, 128, 128, 0.8)',
				pointBorderColor: 'rgba(128, 128, 128, 0.8)',
				pointHoverBackgroundColor: 'rgba(128, 128, 128, 1)',
				pointHoverBorderColor: 'rgba(128, 128, 128, 1)',
				pointRadius: 4,
				pointHoverRadius: 6,
				showLine: false,
				yAxisID: 'y',
			});
		}

		return {
			datasets: datasets,
		};
	}

	/**
	 * Calculates interpolated values for missing dates in the data range
	 * @param {Array<{x: number, y: number}>} formatted_data - Sorted array of existing data points
	 * @returns {Array<{x: number, y: number, is_today?: boolean}>} Array of interpolated points
	 */
	private getInterpolatedData(formatted_data: Array<{x: number; y: number}>): Array<{x: number; y: number; is_today?: boolean}> {
		if (formatted_data.length === 0) {
			return [];
		}

		const start_date = DateTime.fromSeconds(this.date_start(), {zone: 'utc'}).startOf('day');
		const end_date = DateTime.fromSeconds(this.date_end(), {zone: 'utc'}).startOf('day');
		const today = DateTime.utc().startOf('day');

		// Create a Set of existing dates for quick lookup
		const existing_dates = new Set(formatted_data.map((point) => point.x));

		const interpolated_points: Array<{x: number; y: number; is_today?: boolean}> = [];

		// Iterate through each day in the range
		let current_date = start_date;
		while (current_date <= end_date) {
			const current_millis = current_date.toMillis();

			// Check if this date is missing from the actual data
			if (!existing_dates.has(current_millis)) {
				const interpolated_value = this.calculateInterpolatedValue(current_millis, formatted_data);

				if (interpolated_value !== null) {
					const point: {x: number; y: number; is_today?: boolean} = {
						x: current_millis,
						y: interpolated_value,
					};

					// Mark if this is today's date
					if (current_date.equals(today)) {
						point.is_today = true;
					}

					interpolated_points.push(point);
				}
			}

			current_date = current_date.plus({days: 1});
		}

		return interpolated_points;
	}

	/**
	 * Calculates the interpolated price value for a missing date
	 * @param {number} target_millis - The timestamp in milliseconds for the missing date
	 * @param {Array<{x: number, y: number}>} formatted_data - Sorted array of existing data points
	 * @returns {number | null} The interpolated price value or null if cannot be calculated
	 */
	private calculateInterpolatedValue(target_millis: number, formatted_data: Array<{x: number; y: number}>): number | null {
		// Find the closest data points before and after the target date
		let before_point: {x: number; y: number} | null = null;
		let after_point: {x: number; y: number} | null = null;

		for (const point of formatted_data) {
			if (point.x < target_millis) {
				before_point = point;
			} else if (point.x > target_millis) {
				if (after_point === null) {
					after_point = point;
				}
				break;
			}
		}

		// a) Only data before the target date exists
		if (before_point && !after_point) {
			return before_point.y;
		}

		// b) Data exists both before and after - linear interpolation
		if (before_point && after_point) {
			const time_diff = after_point.x - before_point.x;
			const value_diff = after_point.y - before_point.y;
			const time_from_before = target_millis - before_point.x;

			return before_point.y + (value_diff * time_from_before) / time_diff;
		}

		// c) Only data after the target date exists
		if (!before_point && after_point) {
			return after_point.y;
		}

		return null;
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
							const is_interpolated = context.dataset.label === 'BTC/USD (Estimated)';

							// For interpolated points, only show the status message
							if (is_interpolated) {
								const data_point = context.dataset.data[context.dataIndex];
								const today = DateTime.utc().startOf('day').toMillis();

								if (data_point.is_today || data_point.x === today) {
									return 'Calculated after UTC day close';
								} else {
									return 'Missing data';
								}
							}

							// For actual data points, show the price
							const price_label = `${context.dataset.label}: $${value.toLocaleString('en-US', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}`;

							return price_label;
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
