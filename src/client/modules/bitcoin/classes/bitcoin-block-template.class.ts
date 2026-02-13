import {OrchardBitcoinBlockTemplate} from '@shared/generated.types';

export class BitcoinBlockTemplate implements OrchardBitcoinBlockTemplate {
	public height: number;
	public feerate_low: number;
	public feerate_high: number;
	public size: number;
	public weight: number;
	public nTx: number;

	constructor(block_template: OrchardBitcoinBlockTemplate) {
		this.height = block_template.height;
		this.feerate_low = block_template.feerate_low;
		this.feerate_high = block_template.feerate_high;
		this.size = block_template.size;
		this.weight = block_template.weight;
		this.nTx = block_template.nTx;
	}
}
