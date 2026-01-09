/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, ViewChild, OnChanges, OnDestroy, SimpleChanges, ChangeDetectorRef} from '@angular/core';
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
	selector: 'orc-mint-subsection-config-chart-method',
	standalone: false,
	templateUrl: './mint-subsection-config-chart-method.component.html',
	styleUrl: './mint-subsection-config-chart-method.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigChartMethodComponent implements OnChanges, OnDestroy {
	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

	@Input() nut!: 'nut4' | 'nut5';
	@Input() quotes!: MintMintQuote[] | MintMeltQuote[];
	@Input() loading!: boolean;
	@Input() locale!: string;
	@Input() unit!: string;
	@Input() method!: string;
	@Input() min_amount!: number;
	@Input() max_amount!: number;
	@Input() min_hot!: boolean;
	@Input() max_hot!: boolean;

	public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];
	public displayed: boolean = true;
	public metrics: {
		avg: number;
		median: number;
		max: number;
		min: number;
		over_max: number;
		under_min: number;
	} = {
		avg: 0,
		median: 0,
		max: 0,
		min: 0,
		over_max: 0,
		under_min: 0,
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
		if (changes['min_amount'] && !changes['min_amount'].firstChange) {
			this.initOptions();
			const amounts = this.getAmounts();
			this.metrics = this.getMetrics(amounts);
		}
		if (changes['max_amount'] && !changes['max_amount'].firstChange) {
			this.initOptions();
			const amounts = this.getAmounts();
			this.metrics = this.getMetrics(amounts);
		}
		if (changes['min_hot'] && !changes['min_hot'].firstChange) {
			this.initOptions();
		}
		if (changes['max_hot'] && !changes['max_hot'].firstChange) {
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
		const amounts = this.getAmounts();
		this.metrics = this.getMetrics(amounts);
		this.chart_data = this.getChartData(amounts);
		this.initOptions();
	}

	private initOptions(): void {
		this.chart_options = this.getChartOptions();
		if (this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getFormAnnotation();
	}

	private getAmounts(): Record<string, number>[] {
		if (this.quotes.length === 0) return [];
		const quotes = this.nut === 'nut4' ? (this.quotes as MintMintQuote[]) : (this.quotes as MintMeltQuote[]);
		const valid_state = this.nut === 'nut4' ? MintQuoteState.Issued : MeltQuoteState.Paid;
		const valid_quotes = quotes
			.filter((quote) => quote.state === valid_state && quote.created_time && quote.created_time > 0 && quote.unit === this.unit)
			.sort((a, b) => (a.created_time ?? 0) - (b.created_time ?? 0));

		return valid_quotes.map((quote) => ({
			created_time: quote.created_time ?? 0,
			amount: this.getEffectiveAmount(quote),
		}));
	}

	private getEffectiveAmount(entity: MintMintQuote | MintMeltQuote): number {
		if (entity instanceof MintMintQuote) return entity.amount_issued;
		return entity.amount;
	}

	private getMetrics(amounts: Record<string, number>[]): {
		avg: number;
		median: number;
		max: number;
		min: number;
		over_max: number;
		under_min: number;
	} {
		const values = amounts.map((amount) => amount['amount']);
		return {
			avg: avg(values),
			median: median(values),
			max: max(values),
			min: min(values),
			over_max: values.filter((value) => value > this.max_amount).length,
			under_min: values.filter((value) => value < this.min_amount).length,
		};
	}

	private getChartData(amounts: Record<string, number>[]): ChartConfiguration['data'] {
		if (amounts.length === 0) return {datasets: []};
		const data_prepped = amounts.map((amount) => ({
			x: amount['created_time'] * 1000,
			y: amount['amount'],
		}));
		const color = this.chartService.getAssetColor(this.unit, 0);
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
		const use_log_scale = this.metrics.max / this.metrics.min >= 100;
		const step_size = 1;

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
				text: this.unit,
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
		const min_config = this.chartService.getFormAnnotationConfig(this.min_hot);
		const max_config = this.chartService.getFormAnnotationConfig(this.max_hot);
		return {
			annotations: {
				min: {
					type: 'line',
					borderColor: min_config.border_color,
					borderWidth: min_config.border_width,
					display: true,
					label: {
						display: true,
						content: 'Min Amount',
						position: 'start',
						backgroundColor: min_config.label_bg_color,
						color: min_config.text_color,
						font: {
							size: 12,
							weight: '300',
						},
						borderColor: min_config.label_border_color,
						borderWidth: 1,
					},
					scaleID: 'y',
					value: this.min_amount,
				},
				max: {
					type: 'line',
					borderColor: max_config.border_color,
					borderWidth: max_config.border_width,
					display: true,
					label: {
						display: true,
						content: 'Max Amount',
						position: 'start',
						backgroundColor: max_config.label_bg_color,
						color: max_config.text_color,
						font: {
							size: 12,
							weight: '300',
						},
						borderColor: max_config.label_border_color,
						borderWidth: 1,
					},
					scaleID: 'y',
					value: this.max_amount,
				},
			},
		};
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
