/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType } from 'chart.js';
import { DateTime } from 'luxon';
/* Application Dependencies */
import { ChartService } from '@client/modules/chart/services/chart/chart.service';
import { getAllPossibleTimestamps, getDataKeyedByTimestamp } from '@client/modules/chart/helpers/mint-chart-data.helpers';
/* Native Dependencies */
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
/* Shared Dependencies */
import { MintAnalyticsInterval, MintQuoteState } from '@shared/generated.types';
import { getTooltipLabel, getTooltipTitle, getXAxisConfig } from '@client/modules/chart/helpers/mint-chart-options.helpers';

@Component({
    selector: 'orc-mint-quote-ttl-chart',
    standalone: false,
    templateUrl: './mint-quote-ttl-chart.component.html',
    styleUrl: './mint-quote-ttl-chart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintQuoteTtlChartComponent implements OnChanges {

    @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

    @Input() mint_quotes: MintMintQuote[] = [];
    @Input() loading!: boolean;
    @Input() locale!: string;

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
	}

	private async init(): Promise<void> {
		this.chart_type = 'bar';
        this.chart_data = this.getChartData();	
        this.chart_options = this.getChartOptions();
	}

	private getChartData(): ChartConfiguration['data'] {
        if( this.mint_quotes.length === 0 ) return { datasets: [] };
        const valid_quotes = this.mint_quotes
            .filter(quote => (quote.state === MintQuoteState.Issued && quote.created_time && quote.created_time > 0))
            .sort((a, b) => (a.created_time ?? 0) - (b.created_time ?? 0));
        const deltas = valid_quotes.map(quote => {
            const created_time = quote.created_time ?? 0;
            const end_time = quote.issued_time ?? quote.paid_time ?? 0;
            return {
                created_time,
                delta: end_time - created_time
            }
        });
        const color = this.chartService.getAssetColor('sat', 0);
        const data_prepped = deltas.map(delta => ({
            x: delta.created_time * 1000,
            y: delta.delta
        }));

        const dataset = {
            data: data_prepped,
            backgroundColor: color.bg,
            borderColor: color.border,
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
		const y_axis = 'seconds';
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
}
