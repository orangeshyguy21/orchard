/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
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
	public block = input<BitcoinBlock | BitcoinBlockTemplate>();
	public height = input<number>();
	public is_template = input<boolean>(false);

	public fullness = computed(() => {
		return (this.block()?.weight ?? 0) / 4000000;
	});
}
