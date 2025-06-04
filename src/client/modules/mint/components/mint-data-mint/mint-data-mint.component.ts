/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { MintMintQuote } from '@client/modules/mint/classes/mint-mint-quote.class';

@Component({
	selector: 'orc-mint-data-mint',
	standalone: false,
	templateUrl: './mint-data-mint.component.html',
	styleUrl: './mint-data-mint.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintDataMintComponent {

	@Input() quote!: MintMintQuote;

}