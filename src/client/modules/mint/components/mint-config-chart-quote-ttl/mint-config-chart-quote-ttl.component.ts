/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType as ChartJsType } from 'chart.js';
/* Application Dependencies */
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
import { MintMeltQuote } from '@client/modules/mint/classes/mint-melt-quote.class';
/* Shared Dependencies */
import { MintAnalyticsInterval, MintQuoteState, MeltQuoteState } from '@shared/generated.types';
import { getTooltipLabel, getTooltipTitle, getXAxisConfig } from '@client/modules/chart/helpers/mint-chart-options.helpers';

@Component({
    selector: 'orc-mint-config-chart-quote-ttl',
    standalone: false,
    templateUrl: './mint-config-chart-quote-ttl.component.html',
    styleUrl: './mint-config-chart-quote-ttl.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigChartQuoteTtlComponent implements OnChanges {

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
    public metrics: {
        avg: number;
        median: number;
        max: number;
        min: number;
    } = {
        avg: 0,
        median: 0,
        max: 0,
        min: 0
    };

    constructor(
        private chartService: ChartService,
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
        if(changes['quote_ttl'] && !changes['quote_ttl'].firstChange) {
            this.initOptions();         
        }
        if(changes['form_hot'] && !changes['form_hot'].firstChange) {
            this.initOptions();
        }
	}

	private async init(): Promise<void> {
		this.chart_type = 'bar';
        const deltas = this.getDeltas();
        this.metrics = this.getMetrics(deltas);
        this.chart_data = this.getChartData(deltas);	
        this.initOptions();
	}

    private initOptions(): void {
        this.chart_options = this.getChartOptions();
        if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getFormAnnotation();
    }

    private getDeltas(): Record<string, number>[] {
        if( this.quotes.length === 0 ) return [];
        const quotes = this.nut === 'nut4' ? (this.quotes as MintMintQuote[]) : (this.quotes as MintMeltQuote[]);
        const valid_state = this.nut === 'nut4' ? MintQuoteState.Issued : MeltQuoteState.Paid;
        const valid_quotes = quotes
            .filter(quote => (quote.state === valid_state && quote.created_time && quote.created_time > 0))
            .sort((a, b) => (a.created_time ?? 0) - (b.created_time ?? 0));
        return valid_quotes.map(quote => {
            const created_time = quote.created_time ?? 0;
            const end_time = (quote instanceof MintMintQuote) ? quote.issued_time ?? quote.paid_time ?? 0 : quote.paid_time ?? 0;
            return {
                created_time,
                delta: end_time - created_time
            }
        });
    }

    private getMetrics(deltas: Record<string, number>[]): {
        avg: number;
        median: number;
        max: number;
        min: number;
    } {
        const values = deltas.map(delta => delta['delta']);
        return {
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
            max: Math.max(...values),
            min: Math.min(...values)
        };
    }

	private getChartData(deltas: Record<string, number>[]): ChartConfiguration['data'] {
        if( deltas.length === 0 ) return { datasets: [] };
        const color = this.chartService.getAssetColor('sat', 0);
        const data_prepped = deltas.map(delta => ({
            x: delta['created_time'] * 1000,
            y: delta['delta']
        }));

        const dataset = {
            data: data_prepped,
            backgroundColor: (this.nut === 'nut4') ? '#fffd9f' : '#9c2222',
            // backgroundColor: '#fffd9f',
            // backgroundColor: '#9c2222',
            // backgroundColor: '#ffd61f',
            // borderColor: color.border,
            borderWidth: 2,
            borderRadius: 3,
            pointBackgroundColor: color.border,
            pointBorderColor: color.border,
            pointHoverBackgroundColor: this.chartService.getPointHoverBackgroundColor(),
            pointHoverBorderColor: color.border,
            pointRadius: 0, // Add point size (radius in pixels)
            pointHoverRadius: 4, // Optional: size when hovered
            fill: {
                target: 'origin',
                above: color.bg,
            },
            tension: 0.4,
        };

        return { datasets: [dataset] };
	}

    private getChartOptions(): ChartConfiguration['options'] {
		if ( !this.chart_data || this.chart_data.datasets.length === 0 ) return {}
		// const scales: ScaleChartOptions<'bar'>['scales'] = {};
        const scales: any = {};
		scales['x'] = getXAxisConfig(MintAnalyticsInterval.Day, this.locale);
        scales['y'] = {
            position: 'left',
            title: {
                display: true,
                text: 'seconds'
            },
            beginAtZero: true,
            grid: {
                display: true,
                color: this.chartService.getGridColor()
            },
        }

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
						title: getTooltipTitle,
						label: (context: any) => getTooltipLabel(context, this.locale),
					}
				},
				legend: {
					display: false,
				},
			},
			interaction: {
				mode: 'index',
				axis: 'x',
				intersect: false
			}
		};
	}

    private getFormAnnotation(): any {
        const border_color = this.form_hot ? '#D5C4AC' : '#4c463d';
        const border_width = this.form_hot ? 2 : 1;
        const text_color = this.form_hot ? '#D5C4AC' : 'rgb(235, 225, 213)';
        const label_bg_color = this.form_hot ? '#695D49' : 'rgb(29, 27, 26)';
        const label_border_color = this.form_hot ? null : '#4c463d';
        return {
			annotations: {
                ttl : {
					type: 'line',
                    borderColor: border_color,
					borderWidth: border_width,
					display: true,
					label: {
						display:  true,
						content: 'Quote TTL',
						position: 'start',
                        backgroundColor: label_bg_color,
                        color: text_color,
                        font: {
                            size: 12,
                            weight: '300'
                        },
                        borderColor: label_border_color,
						borderWidth: 1,
					},
					scaleID: 'y',
					value: this.quote_ttl
				}
			}
		}
    }
}