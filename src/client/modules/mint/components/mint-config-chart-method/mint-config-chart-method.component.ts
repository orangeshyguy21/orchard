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
	selector: 'orc-mint-config-chart-method',
	standalone: false,
	templateUrl: './mint-config-chart-method.component.html',
	styleUrl: './mint-config-chart-method.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigChartMethodComponent implements OnChanges {

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
        if(changes['min_amount'] && !changes['min_amount'].firstChange) {
            this.initOptions();
        }
		if(changes['max_amount'] && !changes['max_amount'].firstChange) {
            this.initOptions();
        }
		if(changes['min_hot'] && !changes['min_hot'].firstChange) {
            this.initOptions();
        }
		if(changes['max_hot'] && !changes['max_hot'].firstChange) {
            this.initOptions();
        }
	}

	private async init(): Promise<void> {
		this.chart_type = 'line';
		const amounts = this.getAmounts();
		this.metrics = this.getMetrics(amounts);
        this.chart_data = this.getChartData(amounts);	
        this.initOptions();
	}

	private initOptions(): void {
        this.chart_options = this.getChartOptions();
        if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getFormAnnotation();
    }

	private getAmounts(): Record<string, number>[] {
		if( this.quotes.length === 0 ) return [];
		const quotes = this.nut === 'nut4' ? (this.quotes as MintMintQuote[]) : (this.quotes as MintMeltQuote[]);
		const valid_state = this.nut === 'nut4' ? MintQuoteState.Issued : MeltQuoteState.Paid;
        const valid_quotes = quotes
            .filter(quote => 
				(quote.state === valid_state
				&& quote.created_time
				&& quote.created_time > 0
				&& quote.unit === this.unit)
			)
            .sort((a, b) => (a.created_time ?? 0) - (b.created_time ?? 0));
       
        return valid_quotes.map(quote => ({
            created_time: quote.created_time ?? 0,
            amount: quote.amount
        }));
	}

	private getMetrics(amounts: Record<string, number>[]): {
        avg: number;
        median: number;
        max: number;
        min: number;
    } {
        const values = amounts.map(amount => amount['amount']);
        return {
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
            max: Math.max(...values),
            min: Math.min(...values)
        };
    }

	private getChartData(amounts: Record<string, number>[]): ChartConfiguration['data'] {
        if( amounts.length === 0 ) return { datasets: [] };       
        const data_prepped = amounts.map( amount => ({
            x: amount['created_time'] * 1000,
            y: amount['amount']
        }));
		const color = this.chartService.getAssetColor(this.unit, 0);
        const dataset = {
            data: data_prepped,
            backgroundColor: color.border,
            borderColor: color.border,
            borderWidth: 1,
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

    // private getChartOptions(): ChartConfiguration['options'] {
	// 	if ( !this.chart_data || this.chart_data.datasets.length === 0 ) return {}
	// 	// const scales: ScaleChartOptions<'bar'>['scales'] = {};
    //     const scales: any = {};
	// 	scales['x'] = getXAxisConfig(MintAnalyticsInterval.Day, this.locale);
    //     scales['y'] = {
    //         position: 'left',
    //         title: {
    //             display: true,
    //             text: this.unit
    //         },
    //         beginAtZero: true,
    //         grid: {
    //             display: true,
    //             color: this.chartService.getGridColor()
    //         },
    //     }

	// 	return {
	// 		responsive: true,
	// 		elements: {
	// 			line: {
	// 				tension: 0.5,
	// 				cubicInterpolationMode: 'monotone',
	// 			},
	// 		},
	// 		scales: scales,
	// 		plugins: {
	// 			tooltip: {
	// 				enabled: true,
	// 				mode: 'index',
	// 				intersect: false,
	// 				callbacks: {
	// 					title: getTooltipTitle,
	// 					label: (context: any) => getTooltipLabel(context, this.locale),
	// 				}
	// 			},
	// 			legend: {
	// 				display: false,
	// 			},
	// 		},
	// 		interaction: {
	// 			mode: 'index',
	// 			axis: 'x',
	// 			intersect: false
	// 		}
	// 	};
	// }

	private getChartOptions(): ChartConfiguration['options'] {
		if (!this.chart_data || this.chart_data.datasets.length === 0) return {};
	
		// Calculate min/max dates from data
		const data = this.chart_data.datasets[0]?.data as any[] || [];
		const min_time = data.length ? Math.min(...data.map(d => d.x)) : Date.now();
		const max_time = data.length ? Math.max(...data.map(d => d.x)) : Date.now();
	
		// Calculate span in days
		const span_days = (max_time - min_time) / (1000 * 60 * 60 * 24);
	
		// Decide unit and step size
		let time_unit: 'month' | 'week' | 'day' = 'day';
		let step_size = 1;
		if (span_days > 90) {
			time_unit = 'month';
		} else if (span_days > 21) {
			time_unit = 'week';
		} else {
			time_unit = 'day';
		}
	
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
				}
			},
			min: min_time,
			max: max_time,
			ticks: {
				source: 'auto', // Ensures ticks are generated uniformly
				autoSkip: false, // Show all ticks for the chosen unit
				maxRotation: 0,
				minRotation: 0,
			},
			grid: {
				display: true,
				color: this.chartService.getGridColor()
			}
		};
		scales['y'] = {
			position: 'left',
			title: {
				display: true,
				text: this.unit
			},
			beginAtZero: true,
			grid: {
				display: true,
				color: this.chartService.getGridColor()
			},
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
		const min_border_color = this.min_hot ? '#D5C4AC' : '#4c463d';
        const min_border_width = this.min_hot ? 2 : 1;
        const min_text_color = this.min_hot ? '#D5C4AC' : 'rgb(235, 225, 213)';
        const min_label_bg_color = this.min_hot ? '#695D49' : 'rgb(29, 27, 26)';
        const min_label_border_color = this.min_hot ? null : '#4c463d';

		const max_border_color = this.max_hot ? '#D5C4AC' : '#4c463d';
        const max_border_width = this.max_hot ? 2 : 1;
        const max_text_color = this.max_hot ? '#D5C4AC' : 'rgb(235, 225, 213)';
        const max_label_bg_color = this.max_hot ? '#695D49' : 'rgb(29, 27, 26)';
        const max_label_border_color = this.max_hot ? null : '#4c463d';



        // return {
		// 	annotations: {
        //         ttl : {
		// 			type: 'line',
        //             borderColor: border_color,
		// 			borderWidth: border_width,
		// 			display: true,
		// 			label: {
		// 				display:  true,
		// 				content: 'Quote TTL',
		// 				position: 'start',
        //                 backgroundColor: label_bg_color,
        //                 color: text_color,
        //                 font: {
        //                     size: 12,
        //                     weight: '300'
        //                 },
        //                 borderColor: label_border_color,
		// 				borderWidth: 1,
		// 			},
		// 			scaleID: 'y',
		// 			value: this.quote_ttl
		// 		}
		// 	}
		// }

		return {
			annotations: {
                min : {
					type: 'line',
					borderColor: min_border_color,
					borderWidth: min_border_width,
					display: true,
					label: {
						display:  true,
						content: 'Min Amount',
						position: 'start',
						backgroundColor: min_label_bg_color,
						color: min_text_color,
						font: {
							size: 12,
							weight: '300'
						},
						borderColor: min_label_border_color,
						borderWidth: 1,
					},
					scaleID: 'y',
					value: this.min_amount
				},
				max : {
					type: 'line',
					borderColor: max_border_color,
					borderWidth: max_border_width,
					display: true,
					label: {
						display:  true,
						content: 'Max Amount',
						position: 'start',
						backgroundColor: max_label_bg_color,
						color: max_text_color,
						font: {
							size: 12,
							weight: '300'
						},
						borderColor: max_label_border_color,
						borderWidth: 1,
					},
					scaleID: 'y',
					value: this.max_amount
				}
			}
		}
    }
}
