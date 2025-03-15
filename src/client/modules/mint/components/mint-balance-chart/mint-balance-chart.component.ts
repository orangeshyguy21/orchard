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
			const yAxisID = (unit === 'sat') ? 'ybtc' : `yfiat`;

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
					above: color.bg,
				},
				tension: 0.4,
				yAxisID: yAxisID,
			};
		});

		return {
			datasets,
		};
	}

	private getChartOptions(): ChartConfiguration['options'] {
		if (!this.mint_balances || this.mint_balances.length === 0) return {}

		// Find which fiat currencies are present
		const has_usd = this.mint_balances.some(item => item.unit === 'usd');
		const has_eur = this.mint_balances.some(item => item.unit === 'eur');

		// Set the appropriate axis label
		let fiat_axis_label = '';
		if (has_usd && has_eur) {
		fiat_axis_label = 'USD / EUR';
		} else if (has_usd) {
		fiat_axis_label = 'USD';
		} else if (has_eur) {
		fiat_axis_label = 'EUR';
		} else {
		fiat_axis_label = 'FIAT'; // Default fallback if neither USD nor EUR is present
		}
		
		// Create scales configuration
		const scales_config: any = {
			x: {
				type: 'time',
				time: {
					unit: this.selected_interval,
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
						// Convert timestamp to DateTime with locale-aware formatting
						return DateTime.fromMillis(value)
							.toLocaleString({
								month: 'short',
								day: 'numeric'
							});
					}
				},
				distribution: 'linear',
				bounds: 'data'
			},
			ybtc: {
				position: 'left',
				title: {
					display: true,
					text: 'SATS'
				},
				beginAtZero: false,
				grid: {
					display: true, // Enable gridlines for ybtc axis
					color: 'rgba(255, 255, 255, 0.1)'
				},
			},
			yfiat: {
				position: 'right',
				title: {
					display: true,
					text: fiat_axis_label
				},
				beginAtZero: false
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
