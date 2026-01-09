/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, effect, signal} from '@angular/core';
/* Application Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
import {avg, median, max, min} from '@client/modules/math/helpers';
/* Shared Dependencies */
import {MintQuoteState, MeltQuoteState} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-form-quote-ttl-stats',
	standalone: false,
	templateUrl: './mint-subsection-config-form-quote-ttl-stats.component.html',
	styleUrl: './mint-subsection-config-form-quote-ttl-stats.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormQuoteTtlStatsComponent {
	public nut = input.required<'nut4' | 'nut5'>();
	public quotes = input.required<MintMintQuote[] | MintMeltQuote[]>();
	public loading = input.required<boolean>();
	public stats = input.required<{
		avg: number;
		median: number;
		max: number;
		min: number;
	}>();
}
