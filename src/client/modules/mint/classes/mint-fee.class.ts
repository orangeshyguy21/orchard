import {MintUnit, OrchardMintFee} from '@shared/generated.types';

export class MintFee implements OrchardMintFee {
	unit: MintUnit;
	keyset_balance: number;
	keyset_fees_paid: number;
	backend_balance: number;
	time: number;

	constructor(omf: OrchardMintFee) {
		this.unit = omf?.unit;
		this.keyset_balance = omf.keyset_balance;
		this.keyset_fees_paid = omf.keyset_fees_paid;
		this.backend_balance = omf.backend_balance;
		this.time = omf.time;
	}
}
