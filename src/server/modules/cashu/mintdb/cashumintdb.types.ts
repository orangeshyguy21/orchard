/* Vendor Dependencies */
import {Database} from 'better-sqlite3';
import {Client} from 'pg';
/* Native Dependencies */
import {MintUnit, MintQuoteState, MeltQuoteState, MintProofState} from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import {MintDatabaseType} from '@server/modules/cashu/mintdb/cashumintdb.enums';

export type CashuMintDatabase = CashuMintSqliteDatabase | CashuMintPostgresDatabase;
type CashuMintSqliteDatabase = {
	type: MintDatabaseType.sqlite;
	database: Database;
};
type CashuMintPostgresDatabase = {
	type: MintDatabaseType.postgres;
	database: InstanceType<typeof Client>;
};

export type CashuMintBalance = {
	keyset: string;
	balance: number;
};

export type CashuMintKeyset = {
	id: string;
	derivation_path: string;
	derivation_path_index: number;
	valid_from: number;
	valid_to: number | null;
	active: number;
	unit: MintUnit;
	input_fee_ppk: number | null;
	fees_paid: number | null;
};

export type CashuMintMeltQuote = {
	id: string;
	unit: MintUnit;
	amount: number;
	request: string;
	fee_reserve: number;
	state: MeltQuoteState;
	payment_preimage: string | null;
	request_lookup_id: string | null;
	msat_to_pay: number | null;
	created_time: number;
	paid_time: number | null;
};

export type CashuMintMintQuote = {
	id: string;
	amount: number;
	unit: MintUnit;
	request: string;
	state: MintQuoteState;
	request_lookup_id: string | null;
	pubkey: string | null;
	created_time: number;
	issued_time: number | null;
	paid_time: number | null;
};

export type CashuMintProofGroup = {
	amount: number;
	created_time: number;
	keyset_ids: string[];
	unit: MintUnit;
	state: MintProofState;
	amounts: number[][];
};

export type CashuMintPromiseGroup = {
	amount: number;
	created_time: number;
	keyset_ids: string[];
	unit: MintUnit;
	amounts: number[][];
};

export type CashuMintAnalytics = {
	unit: string;
	amount: number;
	created_time: number;
	operation_count: number;
};

export type CashuMintKeysetsAnalytics = {
	keyset_id: string;
	amount: number;
	created_time: number;
};

export type CashuMintCount = {
	count: number;
};

export type CashuMintFee = {
	unit: MintUnit;
	keyset_balance: number;
	keyset_fees_paid: number;
	backend_balance: number;
	time: number;
};
