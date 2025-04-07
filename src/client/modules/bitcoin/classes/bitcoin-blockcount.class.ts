import { OrchardBitcoinBlockCount } from "@shared/generated.types";

export class BitcoinBlockCount implements OrchardBitcoinBlockCount {

	height: number;

	constructor(obc: OrchardBitcoinBlockCount) {
		this.height = obc.height;
	}
}