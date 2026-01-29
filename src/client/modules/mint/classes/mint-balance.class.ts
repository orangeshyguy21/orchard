import {OrchardMintBalance} from '@shared/generated.types';

export class MintBalance implements OrchardMintBalance {
    keyset: string;
	balance: number;
    balance_oracle: number | null;

	constructor(omb: OrchardMintBalance) {
        this.keyset = omb?.keyset || '';
		this.balance = omb?.balance || 0;
		this.balance_oracle = omb?.balance_oracle || null;
	}
}
