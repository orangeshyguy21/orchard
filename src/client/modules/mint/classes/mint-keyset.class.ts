import { OrchardMintKeyset } from "@shared/generated.types";

export class MintKeyset implements OrchardMintKeyset {
	
	active: boolean;
	derivation_path: string;
	encrypted_seed?: string | null;
	first_seen: number;
	id: string;
	input_fee_ppk: number;
	seed: string;
	seed_encryption_method?: string | null;
	unit: string;
	valid_from: number;
	valid_to: number;
	version: string;

	constructor(omk: OrchardMintKeyset) {
		this.active = omk.active;
		this.derivation_path = omk.derivation_path;
		this.encrypted_seed = omk.encrypted_seed;
		this.first_seen = omk.first_seen;
		this.id = omk.id;
		this.input_fee_ppk = omk.input_fee_ppk;
		this.seed = omk.seed;
		this.seed_encryption_method = omk.seed_encryption_method;
		this.unit = omk.unit;
		this.valid_from = omk.valid_from;
		this.valid_to = omk.valid_to;
		this.version = omk.version;
	}
}	