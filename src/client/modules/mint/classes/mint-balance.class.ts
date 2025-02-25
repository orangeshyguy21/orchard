import { OrchardMintBalance } from "@shared/generated.types";

export class MintBalance implements OrchardMintBalance {

	balance: number;
	keyset: string;

	constructor(omb: OrchardMintBalance) {
		this.balance = omb.balance;
		this.keyset = omb.keyset;
	}
}