/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { groupAnalyticsByUnit, addPreceedingData, getDataOrgainizedByTimestamp, getCumulativeData } from '@client/modules/chart/helpers/mint-chart.helpers';
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
import { AmountPipe } from '@client/modules/local/pipes/amount/amount.pipe';
/* Native Dependencies */
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';


@Component({
	selector: 'orc-mint-balance-chart',
	standalone: false,
	templateUrl: './mint-balance-chart.component.html',
	styleUrl: './mint-balance-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintBalanceChartComponent implements OnChanges {

	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() public locale!: string;
	@Input() public mint_balances!: MintAnalytic[];
	@Input() public mint_balances_preceeding!: MintAnalytic[];
	@Input() public selected_date_start!: number;
	@Input() public selected_date_end!: number;
	@Input() public loading!: boolean;

	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];

	constructor(
		private chartService: ChartService,
		private changeDetectorRef: ChangeDetectorRef
	) { }

	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.chart ? this.init() : this.reload();
		}
	}

	private async init(): Promise<void> {
		this.chart_data = this.getChartData();
		this.chart_options = this.getChartOptions();
		this.changeDetectorRef.detectChanges();
	}

	private async reload(): Promise<void> {
		this.chart_data = this.getChartData();
		this.chart_options = this.getChartOptions();
		this.changeDetectorRef.detectChanges();
	}

	private getChartData(): ChartConfiguration['data'] {
		if (!this.mint_balances || this.mint_balances.length === 0) return { datasets: [] };
		const first_timestamp = DateTime.fromSeconds(this.selected_date_start).startOf('day').toSeconds().toString();
		const last_timestamp = DateTime.fromSeconds(this.selected_date_end).startOf('day').toSeconds().toString();
		// Combine the balances and the preceding data for unique timestamps
		const all_analytics = this.mint_balances.concat(this.mint_balances_preceeding);
		// Group data by unit
		const grouped_by_unit = groupAnalyticsByUnit(this.mint_balances);
		// Add preceding data to the grouped data
		const grouped_by_unit_summary = addPreceedingData(grouped_by_unit, this.mint_balances_preceeding);
		// Get all unique timestamps and sort them
		const all_timestamps = all_analytics.map(item => item.created_time).concat([first_timestamp, last_timestamp]);
		const unqiue_timestamps = Array.from(new Set(all_timestamps)).sort();
		console.log('first_timestamp', first_timestamp);
		console.log('last_timestamp', last_timestamp);
		console.log('unqiue_timestamps', unqiue_timestamps);
		// Create datasets for each unit
		const datasets = Object.entries(grouped_by_unit_summary).map(([unit, data], index) => {
			// Create a map of timestamp to amount for this unit
			const timestamp_to_amount = getDataOrgainizedByTimestamp(data, first_timestamp, last_timestamp);
			// get unit color
			const color = this.chartService.getAssetColor(unit, index);
			// Calculate cumulative sum for each timestamp
			const cumulative_data = getCumulativeData(unqiue_timestamps, timestamp_to_amount, unit);

			return {
				data: cumulative_data,
				label: unit.toUpperCase(),
				backgroundColor: color.bg,
				borderColor: color.border,
				pointBackgroundColor: color.border,
				pointBorderColor: '#fff', // todo theme this
				pointHoverBackgroundColor: '#fff', // todo theme this
				pointHoverBorderColor: color.border,
				fill: {
					target: 'origin',
					above: color.bg  // Area will be filled with the background color
				},
				tension: 0.4,
				yAxisID: index === 0 ? 'y' : `y${index}`
			};
		});

		return {
			datasets,
		};
	}

	private getChartOptions(): ChartConfiguration['options'] {
		if (!this.mint_balances || this.mint_balances.length === 0) {
			return {};
		}

		// Get unique units for axis labels
		const unique_units = Array.from(new Set(this.mint_balances.map(item => item.unit)));
		
		// Create scales configuration
		const scales_config: any = {
			x: {
				type: 'time',
				time: {
					unit: 'day',
					displayFormats: {
						day: 'short'
					},
					tooltipFormat: 'full'
				},
				adapters: {
					date: {
						locale: this.locale
					}
				},
				ticks: {
					source: 'data',
					callback: (value: any) => {
						// Convert timestamp to DateTime with proper timezone
						return DateTime.fromMillis(value)
							.toFormat('MMM d');
					}
				},
				distribution: 'linear',
				bounds: 'data'
			},
			y: {
				position: 'left',
				title: {
					display: true,
					text: unique_units[0]?.toUpperCase() || ''
				},
				beginAtZero: true
			}
		};

		// Add additional y-axes for other units
		unique_units.slice(1).forEach((unit, index) => {
			const axis_id = `y${index + 1}`;
			scales_config[axis_id] = {
				position: index % 2 === 0 ? 'right' : 'left',
				grid: {
					drawOnChartArea: false
				},
				title: {
					display: true,
					text: unit.toUpperCase()
				}
			};
		});

		return {
			responsive: true,
			elements: {
				line: {
					tension: 0.5,
					cubicInterpolationMode: 'monotone',
				},
			},
			scales: scales_config,
			plugins: {
				tooltip: {
					enabled: true,
					mode: 'index',
					intersect: false,
					callbacks: {
						title: (tooltipItems: any) => {
							if (tooltipItems.length > 0) {
								// Use Luxon to properly handle the date with timezone and locale
								return DateTime.fromMillis(tooltipItems[0].parsed.x)
									.toLocaleString({
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									});
							}
							return '';
						},
						label: (context: any) => {
							const label = context.dataset.label || '';
							const value = context.parsed.y;
							return `${label}: ${value.toLocaleString(this.locale)}`;
						}
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



// SUM (promises) - SUM (proofs used) = balance





