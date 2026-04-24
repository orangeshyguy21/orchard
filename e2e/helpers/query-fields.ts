/**
 * Field lists used by differential specs, by query name.
 *
 * Each constant enumerates the direct-passthrough fields Orchard returns
 * from a specific query — the subset whose values should agree with the
 * backend's native RPC output. Derived or Orchard-synthetic fields are
 * deliberately excluded (they belong to algorithmic-correctness tests).
 *
 * New pages that exercise the same query import the constant rather than
 * relisting fields; one place to update when Orchard's schema evolves.
 */

export const BITCOIN_BLOCKCHAIN_INFO_FIELDS = [
	'chain',
	'blocks',
	'headers',
	'bestblockhash',
	'difficulty',
	'chainwork',
	'pruned',
	'initialblockdownload',
] as const;

export const BITCOIN_NETWORK_INFO_FIELDS = [
	'version',
	'subversion',
	'protocolversion',
	'networkactive',
	'relayfee',
	'incrementalfee',
] as const;
