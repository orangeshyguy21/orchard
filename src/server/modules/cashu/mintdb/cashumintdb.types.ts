/* Native Dependencies */
import { MintUnit, MintQuoteState, MeltQuoteState, MintProofState } from "@server/modules/cashu/cashu.enums";

export type CashuMintBalance = {
	keyset: string;
	balance: number;
}   

export type CashuMintKeyset = {
	id: string;
	derivation_path: string;
	derivation_path_index: number;
	valid_from: number;
	valid_to: number;
	active: number;
	unit: MintUnit;
	input_fee_ppk: number;
}

export type CashuMintMeltQuote = {
	id: string;
	unit: MintUnit;
	amount: number;
	request: string;
	fee_reserve: number;
	state: MeltQuoteState;
	payment_preimage: string | null;
	request_lookup_id: string;
	msat_to_pay: number | null;
	created_time: number;
	paid_time: number;
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

export type CashuMintProofGroup = {
	amount: number;
	created_time: number;
	keyset_ids: string[];
	unit: MintUnit;
	state: MintProofState;
	proofs: number[][];
}

export type CashuMintAnalytics = {
	unit: string;
	amount: number;
	created_time: number;
	operation_count: number;
}

export type CashuMintKeysetsAnalytics = {
	keyset_id: string;
	amount: number;
	created_time: number;
}

export type CashuMintCount = {
	count: number;
}

