/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { 
	groupAnalyticsByUnit,
	prependData,
	getDataKeyedByTimestamp,
	getCumulativeData,
	getAllPossibleTimestamps
} from '@client/modules/chart/helpers/mint-chart.helpers';
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import { MintAnalytic } from '@client/modules/mint/classes/mint-analytic.class';
/* Shared Dependencies */
import { MintAnalyticsInterval } from '@shared/generated.types';


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
	@Input() public selected_interval!: MintAnalyticsInterval;
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
		const timestamp_first = DateTime.fromSeconds(this.selected_date_start).startOf('day').toSeconds();
		const timestamp_last = DateTime.fromSeconds(this.selected_date_end).startOf('day').toSeconds();
		const timestamp_range = getAllPossibleTimestamps(timestamp_first, timestamp_last, this.selected_interval);
		const data_unit_groups = groupAnalyticsByUnit(this.mint_balances);
		const data_unit_groups_prepended = prependData(data_unit_groups, this.mint_balances_preceeding);
		const datasets = Object.entries(data_unit_groups_prepended).map(([unit, data], index) => {
			const data_keyed_by_timestamp = getDataKeyedByTimestamp(data);
			const color = this.chartService.getAssetColor(unit, index);
			const data_rel = getCumulativeData(timestamp_range, data_keyed_by_timestamp, unit);

			return {
				data: data_rel,
				label: unit.toUpperCase(),
				backgroundColor: color.bg,
				borderColor: color.border,
				pointBackgroundColor: color.border,
				pointBorderColor: color.border,
				pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
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





