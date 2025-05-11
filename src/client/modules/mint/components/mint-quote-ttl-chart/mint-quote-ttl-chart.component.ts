/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
/* Vendor Dependencies */
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ScaleChartOptions, ChartType as ChartJsType } from 'chart.js';
import { DateTime } from 'luxon';
/* Native Dependencies */
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';
/* Shared Dependencies */
import { MintQuoteState } from '@shared/generated.types';

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
    public chart_type!: ChartJsType;
	public chart_data!: ChartConfiguration['data'];
	public chart_options!: ChartConfiguration['options'];

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
        const valid_quotes = this.mint_quotes.filter(quote => (quote.state === MintQuoteState.Issued && quote.created_time && quote.created_time > 0));
        const deltas = valid_quotes.map(quote => {
            const created_time = quote.created_time ?? 0;
            const end_time = quote.issued_time ?? quote.paid_time ?? 0;
            return end_time - created_time;
        });
        console.log(deltas);
        
		return {
			labels: valid_quotes.map(quote => quote.id),
			datasets: [{ data: deltas }]
		};
	}

	private getChartOptions(): ChartConfiguration['options'] {
		return {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		};
	}
}
