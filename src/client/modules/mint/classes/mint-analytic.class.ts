import {OrchardMintAnalytics, MintUnit, OrchardMintKeysetsAnalytics} from '@shared/generated.types';

export class MintAnalytic implements OrchardMintAnalytics {
	unit: MintUnit;
	amount: string;
	date: number;

	constructor(oma: OrchardMintAnalytics) {
		this.unit = oma.unit;
		this.amount = oma.amount;
		this.date = oma.date;
	}
}

export class MintAnalyticKeyset implements OrchardMintKeysetsAnalytics {
	keyset_id: string;
	amount: string;
	date: number;

	constructor(oma: OrchardMintKeysetsAnalytics) {
		this.keyset_id = oma.keyset_id;
		this.amount = oma.amount;
		this.date = oma.date;
	}
}
