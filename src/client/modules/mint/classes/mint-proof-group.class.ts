import { MintProofState, MintUnit, OrchardMintProofGroup } from "@shared/generated.types";

export class MintProofGroup implements OrchardMintProofGroup {

	amount: number;
	created_time: number;
	keyset_id: string;
	proofs: number[];
	state: MintProofState;
	unit: MintUnit;

	constructor(omp: OrchardMintProofGroup) {
		this.amount = omp.amount;
		this.created_time = omp.created_time;
		this.keyset_id = omp.keyset_id;
		this.proofs = omp.proofs;
		this.state = omp.state;
		this.unit = omp.unit;
	}
}