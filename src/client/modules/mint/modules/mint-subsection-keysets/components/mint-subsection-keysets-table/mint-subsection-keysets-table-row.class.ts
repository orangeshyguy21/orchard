/* Native Dependencies */
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintAnalyticKeyset} from '@client/modules/mint/classes/mint-analytic.class';
import {MintKeysetProofCount} from '@client/modules/mint/classes/mint-keyset-proof-count.class';

export class MintSubsectionKeysetsTableRow {
	active: boolean;
	derivation_path_index: number;
	id: string;
	input_fee_ppk: number;
	unit: string;
	valid_from: number | null;
	valid_to: number | null;
	fees_paid: number | null;
	balance: number;
	proof_count: number;
    amounts: number[] | null;

	constructor(
		keyset: MintKeyset,
		keyset_analytics: MintAnalyticKeyset[],
		keyset_analytics_pre: MintAnalyticKeyset[],
		keyset_proof_count: MintKeysetProofCount | undefined,
	) {
		this.active = keyset.active;
		this.derivation_path_index = keyset.derivation_path_index;
		this.id = keyset.id;
		this.input_fee_ppk = keyset.input_fee_ppk;
		this.unit = keyset.unit;
		this.valid_from = keyset.valid_from;
		this.valid_to = keyset.valid_to;
		this.fees_paid = keyset.fees_paid;
		this.balance = this.getBalance(keyset_analytics, keyset_analytics_pre);
		this.proof_count = keyset_proof_count?.count ?? 0;
        this.amounts = keyset.amounts;
	}

	private getBalance(keyset_analytics: MintAnalyticKeyset[], keyset_analytics_pre: MintAnalyticKeyset[]): number {
		const balance = keyset_analytics.reduce((acc, curr) => acc + curr.amount, 0);
		const balance_pre = keyset_analytics_pre.reduce((acc, curr) => acc + curr.amount, 0);
		return balance_pre + balance;
	}
}
