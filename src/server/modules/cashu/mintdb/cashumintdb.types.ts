/* Native Dependencies */
import { MintUnit, MintQuoteState } from "@server/modules/cashu/cashu.enums";

export type CashuMintBalance = {
	keyset: string;
	balance: number;
}   

export type CashuMintKeyset = {
	id: string;
	derivation_path: string;
	derivation_path_index: number;
	// seed: string;
	valid_from: number;
	valid_to: number;
	// first_seen: number;
	active: number;
	// version: string;
	unit: MintUnit;
	// encrypted_seed: string|null;
	// seed_encryption_method: string|null;
	input_fee_ppk: number;
}

export type CashuMintDatabaseVersion = {
	db: string;
	version: number;
}

export type CashuMintMeltQuote = {
	quote: string;
	method: string;
	request: string;
	checking_id: string;
	unit: string;
	amount: number;
	fee_reserve: number;
	paid: number;
	created_time: number;
	paid_time: number;
	fee_paid: number;
	proof: string;
	state: string;
	change: string;
	expiry: number;
}

export type CashuMintMintQuote = {
	id: string;
	amount: number;
	unit: MintUnit;
	request: string;
	state: MintQuoteState;
	request_lookup_id: string;
	pubkey: string;
	issued_time: number;
	created_time: number;
	paid_time: number;
}

export type CashuMintPromise = {
	amount: number;
	id: string;
	b_: string;
	c_: string;
	dleq_e: string;
	dleq_s: string;
	created: number;
	mint_quote: string;
	swap_id: string;
}

export type CashuMintProof = {
	amount: number;
	id: string;
	c: string;
	secret: string;
	y: string;
	witness: string;
	created: number;
	melt_quote: string;
}

export type CashuMintAnalytics = {
	unit: string;
	amount: number;
	created_time: number;
	operation_count: number;
}