import {OrchardMintBalance} from '@shared/generated.types';

export class MintBalance implements OrchardMintBalance {
    keyset: string;
	balance: number;

	constructor(omb: OrchardMintBalance) {
        this.keyset = omb?.keyset || '';
		this.balance = omb?.balance || 0;
	}
}
