import { MintUnit, OrchardMintPromiseGroup } from "@shared/generated.types";

export class MintPromiseGroup implements OrchardMintPromiseGroup {

    id: number;
	amount: number;
	created_time: number;
	keyset_ids: string[];
	amounts: number[][];
	unit: MintUnit;

	constructor(omp: OrchardMintPromiseGroup) {
        this.id = omp.created_time;
		this.amount = omp.amount;
		this.created_time = omp.created_time;
		this.keyset_ids = omp.keyset_ids;
		this.amounts = omp.amounts;
		this.unit = omp.unit;
	}
}