/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, ViewChild, OnChanges, OnDestroy, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {trigger, transition, style, animate} from '@angular/animations';
/* Vendor Dependencies */
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartType as ChartJsType} from 'chart.js';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {ChartService} from '@client/modules/chart/services/chart/chart.service';
import {getTooltipLabel, getTooltipTitleExact} from '@client/modules/chart/helpers/mint-chart-options.helpers';
import {avg, median, max, min} from '@client/modules/math/helpers';
/* Native Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
/* Shared Dependencies */
import {MintQuoteState, MeltQuoteState} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-config-chart-quote-ttl',
	standalone: false,
	templateUrl: './mint-config-chart-quote-ttl.component.html',
	styleUrl: './mint-config-chart-quote-ttl.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('150ms ease-in', style({ opacity: 1 })),
			]),
			transition(':leave', [
				animate('150ms ease-out', style({ opacity: 0 })),
			]),
		]),
	],
})
export class MintConfigChartQuoteTtlComponent implements OnChanges, OnDestroy {
	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() nut!: 'nut4' | 'nut5';
	@Input() quotes: MintMintQuote[] | MintMeltQuote[] = [];

	@Input() loading!: boolean;
	@Input() locale!: string;
	@Input() quote_ttl!: number;
	@Input() form_hot!: boolean;

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];
	public displayed: boolean = true;
	public metrics: {
		avg: number;
		median: number;
		max: number;
		min: number;
		coverage: number;
	} = {
		avg: 0,
		median: 0,
		max: 0,
		min: 0,
		coverage: 0,
	};

	private subscriptions: Subscription = new Subscription();

	constructor(
		private chartService: ChartService,
		private cdr: ChangeDetectorRef,
	) {
		this.subscriptions.add(this.getRemoveSubscription());
		this.subscriptions.add(this.getAddSubscription());
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading'] && this.loading === false) {
			this.init();
		}
		if (changes['quote_ttl'] && !changes['quote_ttl'].firstChange) {
			this.initOptions();
			const deltas = this.getDeltas();
			this.metrics = this.getMetrics(deltas);
		}
		if (changes['form_hot'] && !changes['form_hot'].firstChange) {
			this.initOptions();
		}
	}

	private getRemoveSubscription(): Subscription {
		return this.chartService.onResizeStart().subscribe(() => {
			this.displayed = false;
			this.cdr.detectChanges();
		});
	}
	private getAddSubscription(): Subscription {
		return this.chartService.onResizeEnd().subscribe(() => {
			this.displayed = true;
			this.cdr.detectChanges();
		});
	}

	private async init(): Promise<void> {
		this.chart_type = 'scatter';
		const deltas = this.getDeltas();
		this.metrics = this.getMetrics(deltas);
		this.chart_data = this.getChartData(deltas);
		this.initOptions();
	}

	private initOptions(): void {
		this.chart_options = this.getChartOptions();
		if (this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getFormAnnotation();
	}

	private getDeltas(): Record<string, number>[] {
		if (this.quotes.length === 0) return [];
		const quotes = this.nut === 'nut4' ? (this.quotes as MintMintQuote[]) : (this.quotes as MintMeltQuote[]);
		const valid_state = this.nut === 'nut4' ? MintQuoteState.Issued : MeltQuoteState.Paid;
		const valid_quotes = quotes
			.filter((quote) => quote.state === valid_state && quote.created_time && quote.created_time > 0)
			.sort((a, b) => (a.created_time ?? 0) - (b.created_time ?? 0));
		return valid_quotes.map((quote) => {
			const created_time = quote.created_time ?? 0;
			const end_time = quote instanceof MintMintQuote ? (quote.issued_time ?? quote.paid_time ?? 0) : (quote.paid_time ?? 0);
			return {
				created_time,
				delta: end_time - created_time,
			};
		});
	}

	private getMetrics(deltas: Record<string, number>[]): {
		avg: number;
		median: number;
		max: number;
		min: number;
		coverage: number;
	} {
		const values = deltas.map((delta) => delta['delta']);
		const values_under_ttl = values.filter((value) => value <= this.quote_ttl);
		return {
			avg: avg(values),
			median: median(values),
			max: max(values),
			min: min(values),
			coverage: (values_under_ttl.length / values.length) * 100,
		};
	}

	private getChartData(deltas: Record<string, number>[]): ChartConfiguration['data'] {
		if (deltas.length === 0) return {datasets: []};
		const color_index = this.nut === 'nut4' ? 0 : 4;
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
		const use_log_scale = this.metrics.max / this.metrics.min >= 100;

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
						callback: function (value: number, index: number, values: number[]): string | null {
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
						label: (context: any) => getTooltipLabel(context, this.locale),
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
		const config = this.chartService.getFormAnnotationConfig(this.form_hot);
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
					value: this.quote_ttl,
				},
			},
		};
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
