/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Native Dependencies */
import {BitcoinBlock} from '@client/modules/bitcoin/classes/bitcoin-block.class';
import {BitcoinBlockTemplate} from '@client/modules/bitcoin/classes/bitcoin-block-template.class';
import {TreemapRect, generateTreemap} from '@client/modules/bitcoin/helpers/treemap.helpers';

const TREEMAP_SIZE = 128;

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

	public fullness = computed(() => (this.block()?.weight ?? 0) / 4_000_000);

	public treemap_rects = computed<TreemapRect[]>(() => {
		const block = this.block();
		if (!block || block.nTx <= 0) return [];
		return generateTreemap(block.nTx, TREEMAP_SIZE, TREEMAP_SIZE);
	});
}
