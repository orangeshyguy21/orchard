import {OrchardMintKeysetProofCount} from '@shared/generated.types';

export class MintKeysetProofCount {
	public id: string;
	public count: number;

	constructor(omkpc: OrchardMintKeysetProofCount) {
		this.id = omkpc.id;
		this.count = omkpc.count;
	}
}
