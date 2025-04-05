import { MintUnit, OrchardMintKeyset } from "@shared/generated.types";

export class MintKeyset implements OrchardMintKeyset {
	
	active: boolean;
	derivation_path: string;
	derivation_path_index: number;
	id: string;
	input_fee_ppk: number;
	seed_encryption_method?: string | null;
	unit: MintUnit;
	valid_from: number;
	valid_to: number;

	constructor(omk: OrchardMintKeyset) {
		this.active = omk.active;
		this.derivation_path = omk.derivation_path;
		this.derivation_path_index = omk.derivation_path_index;
		this.id = omk.id;
		this.input_fee_ppk = omk.input_fee_ppk;
		this.unit = omk.unit as MintUnit;
		this.valid_from = omk.valid_from;
		this.valid_to = omk.valid_to;
	}
}	