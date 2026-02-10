import {OrchardBitcoinBlock} from '@shared/generated.types';

export class BitcoinBlock implements OrchardBitcoinBlock {
	public chainwork: string;
	public hash: string;
	public height: number;
	public nTx: number;
	public size: number;
	public time: number;
	public weight: number;
	public feerate_low: number;
	public feerate_high: number;

	constructor(obn: OrchardBitcoinBlock) {
		this.chainwork = obn.chainwork;
		this.hash = obn.hash;
		this.height = obn.height;
		this.nTx = obn.nTx;
		this.size = obn.size;
		this.time = obn.time;
		this.weight = obn.weight;
		this.feerate_low = obn.feerate_low;
		this.feerate_high = obn.feerate_high;
	}
}
