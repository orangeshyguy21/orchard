/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
/* Application Dependencies */
import { SettingService } from '@client/modules/settings/services/setting/setting.service';
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

	@Input() public analytic_balances!: MintAnalytic[];
	@Input() public loading!: boolean;

	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];

	private locale: any;

	constructor(
		private settingService: SettingService,
		private changeDetectorRef: ChangeDetectorRef
	) { }


	public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.chart ? this.init() : this.reload();
		}
	}

	private async init(): Promise<void> {
		// should probably check if data is available
		this.locale = await this.settingService.getLocaleModule();
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
		if (!this.analytic_balances || this.analytic_balances.length === 0) {
			return {
				datasets: [],
				labels: []
			};
		}

		// Group data by unit
		const grouped_by_unit = this.analytic_balances.reduce((acc, item) => {
			if (!acc[item.unit]) {
				acc[item.unit] = [];
			}
			acc[item.unit].push(item);
			return acc;
		}, {} as Record<string, MintAnalytic[]>);

		console.log('grouped_by_unit', grouped_by_unit);

		// Get all unique timestamps and sort them
		const all_timestamps = Array.from(new Set(this.analytic_balances.map(item => item.created_time))).sort();
		
		// Create datasets for each unit
		const datasets = Object.entries(grouped_by_unit).map(([unit, data], index) => {
			// Create a map of timestamp to amount for this unit
			const timestamp_to_amount = data.reduce((acc, item) => {
				acc[item.created_time] = item.amount;
				return acc;
			}, {} as Record<string, number>);

			// Use asset-specific colors from token.scss
			const asset_colors: Record<string, { bg: string, border: string }> = {
				'sat': { 
					bg: 'rgba(247, 147, 26, 0.3)', 
					border: 'rgb(247, 147, 26)' 
				},
				'usd': { 
					bg: 'rgba(132, 176, 141, 0.3)', 
					border: 'rgb(132, 176, 141)' 
				},
				'eur': { 
					bg: 'rgba(138, 170, 216, 0.3)', 
					border: 'rgb(138, 170, 216)' 
				},
			};

			// Fallback colors if the unit doesn't match known assets
			const fallback_colors = [
				{ bg: 'rgba(54, 162, 235, 0.3)', border: 'rgb(54, 162, 235)' },
				{ bg: 'rgba(255, 99, 132, 0.3)', border: 'rgb(255, 99, 132)' },
				{ bg: 'rgba(75, 192, 192, 0.3)', border: 'rgb(75, 192, 192)' }
			];

			// Get color based on unit or use fallback
			const unit_lower = unit.toLowerCase();
			const color = asset_colors[unit_lower] || fallback_colors[index % fallback_colors.length];

			// Calculate cumulative sum for each timestamp
			let running_sum = 0;
			const cumulative_data = all_timestamps.map(timestamp => {
				running_sum += timestamp_to_amount[timestamp] || 0;
				return {
					x: Number(timestamp) * 1000,
					y: running_sum
				};
			});

			return {
				data: cumulative_data,
				label: unit.toUpperCase(),
				backgroundColor: color.bg,
				borderColor: color.border,
				pointBackgroundColor: color.border,
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
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
			labels: [] // Not needed when using time scale with x/y point format
		};
	}

	private getChartOptions(): ChartConfiguration['options'] {
		if (!this.analytic_balances || this.analytic_balances.length === 0) {
			return {};
		}

		// Get unique units for axis labels
		const unique_units = Array.from(new Set(this.analytic_balances.map(item => item.unit)));
		
		// Create scales configuration
		const scales_config: any = {
			x: {
				type: 'time',
				adapters: {
					date: {
						locale: this.locale
					}
				},
				time: {
					unit: 'day',
					displayFormats: {
						day: 'MMM d'
					}
				}
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
								const date = new Date(tooltipItems[0].parsed.x);
								return date.toLocaleDateString(this.locale?.code || 'en-US', {
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
							return `${label}: ${value.toLocaleString(this.locale?.code || 'en-US')}`;
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
