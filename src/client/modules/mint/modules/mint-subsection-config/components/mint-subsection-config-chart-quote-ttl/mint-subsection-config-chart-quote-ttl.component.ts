/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, effect, viewChild, OnDestroy, signal} from '@angular/core';
/* Vendor Dependencies */
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartType as ChartJsType} from 'chart.js';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
import {getTooltipLabel, getTooltipTitleExact} from '@client/modules/chart/helpers/mint-chart-options.helpers';
/* Native Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
/* Native Dependencies */
import {MintConfigStats} from '@client/modules/mint/modules/mint-subsection-config/types/mint-config-stats.type';

@Component({
	selector: 'orc-mint-subsection-config-chart-quote-ttl',
	standalone: false,
	templateUrl: './mint-subsection-config-chart-quote-ttl.component.html',
	styleUrl: './mint-subsection-config-chart-quote-ttl.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigChartQuoteTtlComponent implements OnDestroy {
	chart = viewChild(BaseChartDirective);

	public nut = input.required<'nut4' | 'nut5'>();
	public quotes = input<MintMintQuote[] | MintMeltQuote[]>([]);
	public loading = input.required<boolean>();
	public locale = input.required<string>();
	public quote_ttl = input.required<number>();
	public form_hot = input.required<boolean>();
	public deltas = input.required<Record<string, number>[]>();

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];
	public displayed = signal<boolean>(true);
	public stats = input.required<MintConfigStats>();

	private subscriptions: Subscription = new Subscription();
	private initialized = false;

	constructor(private chartService: ChartService) {
		this.subscriptions.add(this.getRemoveSubscription());
		this.subscriptions.add(this.getAddSubscription());

		effect(() => {
			const loading = this.loading();
			if (!loading && !this.initialized) {
				this.initialized = true;
				this.init();
			}
		});

		effect(() => {
			const quote_ttl = this.quote_ttl();
			if (this.initialized && quote_ttl !== undefined) {
				this.initOptions();
			}
		});

		effect(() => {
			const form_hot = this.form_hot();
			if (this.initialized && form_hot !== undefined) {
				this.initOptions();
			}
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

	private async init(): Promise<void> {
		this.chart_type = 'scatter';
		this.chart_data = this.getChartData(this.deltas());
		this.initOptions();
	}

	private initOptions(): void {
		this.chart_options = this.getChartOptions();
		if (this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getFormAnnotation();
	}

	private getChartData(deltas: Record<string, number>[]): ChartConfiguration['data'] {
		if (deltas.length === 0) return {datasets: []};
		const color_index = this.nut() === 'nut4' ? 0 : 4;
		const color = this.chartService.getThemeColor(color_index);
		const data_prepped = deltas.map((delta) => ({
			x: delta['created_time'] * 1000,
			y: delta['delta'],
		}));
		const dataset = {
			data: data_prepped,
			borderColor: color.border,
			pointBackgroundColor: color.border,
			pointBorderColor: color.border,
			pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
			pointHoverBorderColor: color.border,
			pointRadius: 3,
			pointHoverRadius: 4,
			tension: 0.4,
		};
		return {datasets: [dataset]};
	}

	private getChartOptions(): ChartConfiguration['options'] {
		if (!this.chart_data || this.chart_data.datasets.length === 0) return {};
		const data = (this.chart_data.datasets[0]?.data as {x: number; y: number}[]) || [];
		const min_time = data.length ? Math.min(...data.map((d) => d.x)) : Date.now();
		const max_time = data.length ? Math.max(...data.map((d) => d.x)) : Date.now();
		const span_days = (max_time - min_time) / (1000 * 60 * 60 * 24);
		const time_unit = span_days > 90 ? 'month' : span_days > 21 ? 'week' : 'day';
		const step_size = 1;
		const use_log_scale = this.stats().max / this.stats().min >= 100;

		const scales: any = {};
		scales['x'] = {
			type: 'time',
			time: {
				unit: time_unit,
				stepSize: step_size,
				displayFormats: {
					month: 'MMM yyyy',
					week: 'MMM d',
					day: 'MMM d',
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
		scales['y'] = {
			position: 'left',
			type: use_log_scale ? 'logarithmic' : 'linear',
			title: {
				display: true,
				text: 'seconds',
			},
			beginAtZero: !use_log_scale,
			grid: {
				display: true,
				color: this.chartService.getGridColor(),
			},
			ticks: use_log_scale
				? {
						callback: function (value: number): string | null {
							return value === 1 || Math.log10(value) % 1 === 0 ? value.toString() : null;
						},
					}
				: {},
		};

		return {
			responsive: true,
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
						title: getTooltipTitleExact,
						label: (context: any) => getTooltipLabel(context, this.locale()),
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

	private getFormAnnotation(): any {
		const config = this.chartService.getFormAnnotationConfig(this.form_hot());
		return {
			annotations: {
				ttl: {
					type: 'line',
					borderColor: config.border_color,
					borderWidth: config.border_width,
					display: true,
					label: {
						display: true,
						content: 'Quote TTL',
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
					scaleID: 'y',
					value: this.quote_ttl(),
				},
			},
		};
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
