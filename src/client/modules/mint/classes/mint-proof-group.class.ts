import {MintProofState, MintUnit, OrchardMintProofGroup} from '@shared/generated.types';

export class MintProofGroup implements OrchardMintProofGroup {
	public id: number;
	public amount: number;
	public created_time: number;
	public keyset_ids: string[];
	public amounts: number[][];
	public state: MintProofState;
	public unit: MintUnit;
	public notes_used: number;

	constructor(omp: OrchardMintProofGroup) {
		this.id = omp.created_time;
		this.amount = omp.amount;
		this.created_time = omp.created_time;
		this.keyset_ids = omp.keyset_ids;
		this.amounts = omp.amounts;
		this.state = omp.state;
		this.unit = omp.unit;
		this.notes_used = omp.amounts.reduce((acc, curr) => acc + curr.length, 0);
	}
}
