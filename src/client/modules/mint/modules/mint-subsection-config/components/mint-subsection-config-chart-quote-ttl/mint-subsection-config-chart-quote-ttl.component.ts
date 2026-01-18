/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	input,
	viewChild,
	OnDestroy,
	signal,
	HostListener,
	SimpleChanges,
	OnChanges,
} from '@angular/core';
/* Vendor Dependencies */
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartType as ChartJsType, Plugin} from 'chart.js';
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
export class MintSubsectionConfigChartQuoteTtlComponent implements OnChanges, OnDestroy {
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
	public chart_plugins: Plugin[] = [];
	public displayed = signal<boolean>(false);
	public stats = input.required<MintConfigStats>();

	private subscriptions: Subscription = new Subscription();
	private resize_timeout: ReturnType<typeof setTimeout> | null = null;

	constructor(private chartService: ChartService) {
		this.subscriptions.add(this.getRemoveSubscription());
		this.subscriptions.add(this.getAddSubscription());
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && this.loading() === false) {
			this.displayed.set(true);
			this.init();
		}
		if (changes['quote_ttl'] && !changes['quote_ttl'].firstChange) {
			this.initOptions();
		}
		if (changes['form_hot'] && !changes['form_hot'].firstChange) {
			this.initOptions();
		}
	}

	/**
	 * Handles window resize events by hiding the chart during resize
	 * and showing it again after a debounce delay to prevent layout instability
	 */
	@HostListener('window:resize')
	onWindowResize(): void {
		this.displayed.set(false);
		if (this.resize_timeout) {
			clearTimeout(this.resize_timeout);
		}
		this.resize_timeout = setTimeout(() => {
			this.displayed.set(true);
		}, 150);
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
		const muted_color = this.chartService.getMutedColor(color.border, 0.5);
		const data_prepped = deltas
			.map((delta) => ({
				x: delta['created_time'] * 1000,
				y: delta['delta'],
			}))
			.sort((a, b) => a.x - b.x);
		const dataset = {
			label: 'Processing time',
			data: data_prepped,
			backgroundColor: muted_color,
			borderColor: muted_color,
			pointBackgroundColor: muted_color,
			pointBorderColor: muted_color,
			pointBorderWidth: 1,
			pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
			pointHoverBorderColor: color.border,
			pointHoverBorderWidth: 2,
			pointRadius: 3,
			pointHoverRadius: 5,
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
			display: false,
			min: min_time,
			max: max_time,
		};
		scales['y'] = {
			type: use_log_scale ? 'logarithmic' : 'linear',
			min: use_log_scale ? 1 : undefined,
			display: false,
			beginAtZero: !use_log_scale,
		};

		return {
			responsive: true,
			elements: {
				point: {
					radius: 3,
					hoverRadius: 5,
					borderWidth: 1,
					hoverBorderWidth: 2,
				},
			},
			scales: scales,
			plugins: {
				tooltip: {
					enabled: true,
					mode: 'nearest',
					intersect: true,
					callbacks: {
						title: getTooltipTitleExact,
						label: (context: any) => getTooltipLabel(context, this.locale()) + ' seconds',
					},
				},
				legend: {
					display: false,
				},
			},
			interaction: {
				mode: 'nearest',
				intersect: true,
			},
			animation: {
				duration: 750,
				easing: 'easeOutQuart',
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
		if (this.resize_timeout) clearTimeout(this.resize_timeout);
	}
}
