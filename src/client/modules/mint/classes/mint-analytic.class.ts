import {OrchardMintAnalytics, MintUnit, OrchardMintKeysetsAnalytics} from '@shared/generated.types';

export class MintAnalytic implements OrchardMintAnalytics {
	unit: MintUnit;
	amount: number;
    amount_oracle: number | null;
	created_time: number;
	operation_count: number;

	constructor(oma: OrchardMintAnalytics) {
		this.unit = oma.unit;
		this.amount = oma.amount;
        this.amount_oracle = oma.amount_oracle ?? null;
		this.created_time = oma.created_time;
		this.operation_count = oma.operation_count;
	}
}

export class MintAnalyticKeyset implements OrchardMintKeysetsAnalytics {
	keyset_id: string;
	amount: number;
	created_time: number;

	constructor(oma: OrchardMintKeysetsAnalytics) {
		this.keyset_id = oma.keyset_id;
		this.amount = oma.amount;
		this.created_time = oma.created_time;
	}
}
