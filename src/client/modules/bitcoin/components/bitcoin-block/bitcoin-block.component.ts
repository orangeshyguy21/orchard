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

	@Input() block?: BitcoinBlock | BitcoinBlockTemplate;
	@Input() is_template: boolean = false;

	public get block_time(): number {
		if( !this.block ) return 0;
		if( this.is_template ) return 0;
		return (this.block as BitcoinBlock).time;
	}
}
