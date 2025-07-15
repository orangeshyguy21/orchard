/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { BitcoinBlock } from '../../classes/bitcoin-block.class';
import { BitcoinBlockTemplate } from '../../classes/bitcoin-block-template.class';

@Component({
	selector: 'orc-bitcoin-block',
	standalone: false,
	templateUrl: './bitcoin-block.component.html',
	styleUrl: './bitcoin-block.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BitcoinBlockComponent {

	@Input() block?: BitcoinBlock;
	@Input() block_template?: BitcoinBlockTemplate;

}
