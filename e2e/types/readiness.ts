/**
 * Backend-state types consumed by `helpers/ui/readiness.ts` and any spec/setup
 * that builds a custom predicate. Type-only file — no runtime exports.
 */

export interface BlockchainInfo {
	verificationprogress: number;
	initialblockdownload: boolean;
	blocks: number;
}

export interface OraclePrice {
	date: number;
	price: number;
}

export interface Readiness {
	bitcoin: BlockchainInfo;
	oracle_recent: OraclePrice[];
}

export interface ReadinessPredicate {
	(r: Readiness): {ok: boolean; reason: string};
}
