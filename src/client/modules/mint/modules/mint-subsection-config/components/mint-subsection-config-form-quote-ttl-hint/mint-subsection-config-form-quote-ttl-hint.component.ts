/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, effect, signal} from '@angular/core';
/* Application Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
/* Shared Dependencies */
import {MintQuoteState, MeltQuoteState} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-form-quote-ttl-hint',
	standalone: false,
	templateUrl: './mint-subsection-config-form-quote-ttl-hint.component.html',
	styleUrl: './mint-subsection-config-form-quote-ttl-hint.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormQuoteTtlHintComponent {
	public nut = input.required<'nut4' | 'nut5'>();
	public quotes = input.required<MintMintQuote[] | MintMeltQuote[]>();
	public loading = input.required<boolean>();
	public quote_ttl = input.required<number>();

	public coverage = signal<number | null>(null);

	constructor() {
		effect(() => {
			const loading = this.loading();
			console.log('loading', loading);
			if (!loading) this.setCoverage();
		});

		effect(() => {
			const quote_ttl = this.quote_ttl();
			if (quote_ttl) this.setCoverage();
		});
	}

	private setCoverage(): void {
		console.log('setCoverage');
		const deltas = this.getDeltas();
		const coverage = this.getCoverage(deltas);
		console.log('coverage', coverage);
		this.coverage.set(coverage);
	}

	private getDeltas(): Record<string, number>[] {
		if (this.quotes().length === 0) return [];
		const quotes = this.nut() === 'nut4' ? (this.quotes() as MintMintQuote[]) : (this.quotes() as MintMeltQuote[]);
		const valid_state = this.nut() === 'nut4' ? MintQuoteState.Issued : MeltQuoteState.Paid;
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

	private getCoverage(deltas: Record<string, number>[]): number {
		const values = deltas.map((delta) => delta['delta']);
		const values_under_ttl = values.filter((value) => value <= this.quote_ttl());
		return (values_under_ttl.length / values.length) * 100 || 0;
	}
}
