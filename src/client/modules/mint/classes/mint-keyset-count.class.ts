import {OrchardMintKeysetCount} from '@shared/generated.types';

export class MintKeysetCount {
	public id: string;
	public proof_count: number;
	public promise_count: number;

	constructor(omkc: OrchardMintKeysetCount) {
		this.id = omkc.id;
		this.proof_count = omkc.proof_count;
		this.promise_count = omkc.promise_count;
	}
}
