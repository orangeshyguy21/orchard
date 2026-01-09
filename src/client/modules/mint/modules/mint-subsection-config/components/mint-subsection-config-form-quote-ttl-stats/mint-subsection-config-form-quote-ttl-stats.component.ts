/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Application Dependencies */
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
/* Native Dependencies */
import {MintConfigStats} from '@client/modules/mint/modules/mint-subsection-config/types/mint-config-stats.type';

@Component({
	selector: 'orc-mint-subsection-config-form-quote-ttl-stats',
	standalone: false,
	templateUrl: './mint-subsection-config-form-quote-ttl-stats.component.html',
	styleUrl: './mint-subsection-config-form-quote-ttl-stats.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigFormQuoteTtlStatsComponent {
	public loading = input.required<boolean>();
	public stats = input.required<MintConfigStats>();
}
