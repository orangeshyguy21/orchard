import { MintProofState, MintUnit, OrchardMintProofGroup } from "@shared/generated.types";

export class MintProofGroup implements OrchardMintProofGroup {

    id: number;
	amount: number;
	created_time: number;
	keyset_ids: string[];
	proofs: number[][];
	state: MintProofState;
	unit: MintUnit;

	constructor(omp: OrchardMintProofGroup) {
        this.id = omp.created_time;
		this.amount = omp.amount;
		this.created_time = omp.created_time;
		this.keyset_ids = omp.keyset_ids;
		this.proofs = omp.proofs;
		this.state = omp.state;
		this.unit = omp.unit;
	}
}