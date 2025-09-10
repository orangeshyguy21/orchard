/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Native Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
/* Shared Dependencies */
import {MintQuoteState} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-data-mint-bolt12',
	standalone: false,
	templateUrl: './mint-data-mint-bolt12.component.html',
	styleUrl: './mint-data-mint-bolt12.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintDataMintBolt12Component {
	public quote = input.required<MintMintQuote>();

	public percentage_issued = computed(() => {
		const q = this.quote();
		const pct = (q.amount_issued / q.amount_paid) * 100;
		return Math.max(0, Math.min(100, pct));
	});

	public spinner_class = computed(() => {
		const state = this.quote().state;
		if (state === MintQuoteState.Unpaid || state === MintQuoteState.Pending) return 'orc-default-progress-spinner';
		if (state === MintQuoteState.Paid) return 'orc-intermediate-progress-spinner';
		if (state === MintQuoteState.Issued) return 'orc-success-progress-spinner';
		return 'orc-default-progress-spinner';
	});
}
