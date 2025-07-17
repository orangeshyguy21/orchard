import {OrchardBitcoinBlockCount} from '@shared/generated.types';

export class BitcoinBlockCount implements OrchardBitcoinBlockCount {
	public height: number;

	constructor(obc: OrchardBitcoinBlockCount) {
		this.height = obc.height;
	}
}
