/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
/* Native Dependencies */
import {BitcoinBlock} from '@client/modules/bitcoin/classes/bitcoin-block.class';
import {BitcoinBlockTemplate} from '@client/modules/bitcoin/classes/bitcoin-block-template.class';

@Component({
	selector: 'orc-bitcoin-general-block',
	standalone: false,
	templateUrl: './bitcoin-general-block.component.html',
	styleUrl: './bitcoin-general-block.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitcoinGeneralBlockComponent {
	@Input() block?: BitcoinBlock | BitcoinBlockTemplate;
	@Input() height?: number;
	@Input() is_template: boolean = false;

	public get fullness(): number {
		return (this.block?.weight ?? 0) / 4000000;
	}
}
