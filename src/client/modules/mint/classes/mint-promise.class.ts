import {OrchardMintPromise} from '@shared/generated.types';

export class MintPromise implements OrchardMintPromise {
	amount: number;
	b_: string;
	c_: string;
	created?: number;
	dleq_e?: string;
	dleq_s?: string;
	id?: string;
	mint_quote?: string;
	swap_id?: string;

	constructor(omp: OrchardMintPromise) {
		this.amount = omp.amount;
		this.b_ = omp.b_;
		this.c_ = omp.c_;
		this.created = omp.created;
		this.dleq_e = omp.dleq_e || undefined;
		this.dleq_s = omp.dleq_s || undefined;
		this.id = omp.id || undefined;
		this.mint_quote = omp.mint_quote || undefined;
		this.swap_id = omp.swap_id || undefined;
	}
}
