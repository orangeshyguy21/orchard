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

export type CashuMintProofGroup = {
	amount: number;
	created_time: number;
	keyset_ids: string[];
	unit: MintUnit;
	state: MintProofState;
	amounts: number[][];
}

export type CashuMintPromiseGroup = {
	amount: number;
	created_time: number;
	keyset_ids: string[];
	unit: MintUnit;
	amounts: number[][];
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

