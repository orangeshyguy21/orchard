/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType as ChartJsType } from 'chart.js';
/* Application Dependencies */
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
/* Native Dependencies */
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
/* Shared Dependencies */
import { MintAnalyticsInterval, MintQuoteState } from '@shared/generated.types';
import { getTooltipLabel, getTooltipTitle, getXAxisConfig } from '@client/modules/chart/helpers/mint-chart-options.helpers';


@Component({
	selector: 'orc-mint-config-method-chart',
	standalone: false,
	templateUrl: './mint-config-method-chart.component.html',
	styleUrl: './mint-config-method-chart.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintConfigMethodChartComponent {

	@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    @Input() mint_quotes: MintMintQuote[] = [];
    @Input() loading!: boolean;
    @Input() locale!: string;
    @Input() unit!: string;
    @Input() method!: string;
    @Input() min_amount!: number;
    @Input() max_amount!: number;

    public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];

    constructor(
        private chartService: ChartService,
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
		if(changes['loading'] && this.loading === false) {
			this.init();
		}
        if(changes['min_amount'] && !changes['min_amount'].firstChange) {
            this.chart_options = this.getChartOptions();
            if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
        }
		if(changes['max_amount'] && !changes['max_amount'].firstChange) {
            this.chart_options = this.getChartOptions();
            if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
        }

	}

	private async init(): Promise<void> {
		this.chart_type = 'bar';
        this.chart_data = this.getChartData();	
        this.chart_options = this.getChartOptions();
        if(this.chart_options?.plugins) this.chart_options.plugins.annotation = this.getAnnotations();
	}

	private getChartData(): ChartConfiguration['data'] {
        if( this.mint_quotes.length === 0 ) return { datasets: [] };
		// @todo will need to filter by method as well
        const valid_quotes = this.mint_quotes
            .filter(quote => 
				(quote.state === MintQuoteState.Issued
				&& quote.created_time
				&& quote.created_time > 0
				&& quote.unit === this.unit)
			)
            .sort((a, b) => (a.created_time ?? 0) - (b.created_time ?? 0));
        const color = this.chartService.getAssetColor('sat', 0);
        const data_prepped = valid_quotes.map(quote => ({
            x: (quote.created_time ?? 0) * 1000,
            y: quote.amount
        }));

        const dataset = {
            data: data_prepped,
            backgroundColor: color.border,
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
                text: this.unit
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

    private getAnnotations(): any {
		return {
			annotations: {
                min : {
					type: 'line',
					borderColor: this.chartService.getAnnotationBorderColor(),
					borderWidth: 1,
					display: true,
					label: {
						display:  true,
						content: 'Min Amount',
						position: 'start',
						backgroundColor: 'rgb(29, 27, 26)',
						borderColor: this.chartService.getAnnotationBorderColor(),
						borderWidth: 1,
					},
					scaleID: 'y',
					value: this.min_amount
				},
				max : {
					type: 'line',
					borderColor: this.chartService.getAnnotationBorderColor(),
					borderWidth: 1,
					display: true,
					label: {
						display:  true,
						content: 'Max Amount',
						position: 'start',
						backgroundColor: 'rgb(29, 27, 26)',
						borderColor: this.chartService.getAnnotationBorderColor(),
						borderWidth: 1,
					},
					scaleID: 'y',
					value: this.max_amount
				}
			}
		}
    }
}
