import {OrchardBitcoinOraclePrice} from '@shared/generated.types';

export class BitcoinOraclePrice implements OrchardBitcoinOraclePrice {
	public date: number;
	public price: number;

	constructor(obp: OrchardBitcoinOraclePrice) {
		this.date = obp.date;
		this.price = obp.price;
	}
}
