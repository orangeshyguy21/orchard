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
			this.init();
		}
	}

	private async init(): Promise<void> {
		// should probably check if data is available
		this.locale = await this.resolveLocale();
		this.chart_data = this.getChartData();
		this.chart_options = this.getChartOptions();
		this.changeDetectorRef.detectChanges();
	}

	private async resolveLocale(): Promise<any> {
		return await this.settingService.getLocaleModule();
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

		// Get all unique timestamps and sort them
		const all_timestamps = Array.from(new Set(this.analytic_balances.map(item => item.created_time))).sort();
		
		// Format dates for labels
		const labels = all_timestamps.map(timestamp => {
			const date = new Date(Number(timestamp) * 1000);
			return date.toLocaleDateString(this.locale?.code || 'en-US', { 
				month: 'short', 
				day: 'numeric' 
			});
		});

		// Create datasets for each unit
		const datasets = Object.entries(grouped_by_unit).map(([unit, data], index) => {
			// Create a map of timestamp to amount for this unit
			const timestamp_to_amount = data.reduce((acc, item) => {
				acc[item.created_time] = item.amount;
				return acc;
			}, {} as Record<string, number>);

			// Colors based on index
			const colors = [
				{ bg: 'rgba(148,159,177,0.2)', border: 'rgba(148,159,177,1)' },
				{ bg: 'rgba(77,83,96,0.2)', border: 'rgba(77,83,96,1)' },
				{ bg: 'rgba(255,0,0,0.3)', border: 'red' }
			];
			const color_index = index % colors.length;

			return {
				data: all_timestamps.map(timestamp => timestamp_to_amount[timestamp] || 0),
				label: unit.toUpperCase(),
				backgroundColor: colors[color_index].bg,
				borderColor: colors[color_index].border,
				pointBackgroundColor: colors[color_index].border,
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: colors[color_index].border,
				fill: 'origin',
				yAxisID: index === 0 ? 'y' : `y${index}`
			};
		});

		return {
			datasets,
			labels
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
			y: {
				position: 'left',
				title: {
					display: true,
					text: unique_units[0]?.toUpperCase() || ''
				}
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
				},
			},
			scales: scales_config,
			plugins: {
				tooltip: {
					callbacks: {
						label: (context: any) => {
							const label = context.dataset.label || '';
							const value = context.parsed.y;
							return `${label}: ${value.toLocaleString(this.locale?.code || 'en-US')}`;
						}
					}
				}
			}
		};
	}
}
