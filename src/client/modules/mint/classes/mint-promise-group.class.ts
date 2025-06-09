import { MintUnit, OrchardMintPromiseGroup } from "@shared/generated.types";

export class MintPromiseGroup implements OrchardMintPromiseGroup {

    public id: number;
	public amount: number;
	public created_time: number;
	public keyset_ids: string[];
	public amounts: number[][];
	public unit: MintUnit;
	public notes_used: number;

	constructor(omp: OrchardMintPromiseGroup) {
        this.id = omp.created_time;
		this.amount = omp.amount;
		this.created_time = omp.created_time;
		this.keyset_ids = omp.keyset_ids;
		this.amounts = omp.amounts;
		this.unit = omp.unit;
		this.notes_used = omp.amounts.reduce((acc, curr) => acc + curr.length, 0);
	}
}