/**
 * Mint daemon source-of-truth reads. NUT-06 `/v1/info` via docker-exec curl/wget;
 * balances/fees/keysets via the daemon's database (cdk: postgres or sqlite,
 * nutshell: postgres or sqlite). Differential oracle for the bs spec.
 */

/* Native Dependencies */
import {dockerExec} from './docker-cli';
import {cached} from './_cache';
import {mintDbQuery, parseSqlBoolean} from './_sql';
import type {ConfigInfo, MintUnit} from '@e2e/types/config';
import type {MintNutInfo} from '@e2e/types/mint';

export const mint = {
	/** Read mint state straight from the daemon. Both nutshell and cdk
	 *  expose NUT-06 at `/v1/info` over their in-container loopback port,
	 *  reachable via docker exec. */
	getInfo(config: ConfigInfo): MintNutInfo {
		return cached(`mint.getInfo:${config.name}`, () => {
			// 127.0.0.1 not localhost — cdk-mintd's container has no `localhost`
			// entry in /etc/hosts. nutshell ships curl, cdk-mintd ships wget;
			// `sh -c` chains so the call survives whichever tool is in $PATH.
			const url = `http://127.0.0.1:${config.mintPort}/v1/info`;
			const cmd = `curl -fsS ${url} 2>/dev/null || wget -qO- ${url}`;
			const out = dockerExec(['exec', config.containers.mint, 'sh', '-c', cmd]);
			return JSON.parse(out) as MintNutInfo;
		});
	},

	/** Outstanding ecash liability for the given mint unit, summed across all
	 *  keysets of that unit, straight from the mint database — what
	 *  `orc-mint-general-balance-sheet` displays as the row's liabilities
	 *  figure (the component's `getRows` aggregates per-keyset values into
	 *  one row per unit the same way). NOT cached: ecash supply mutates as
	 *  tests mint/melt; this is the differential oracle the spec asserts UI
	 *  values against.
	 *
	 *  cdk: `keyset_amounts.total_issued - total_redeemed` (matches Orchard's
	 *  `getBalances` resolver in `cdk.service.ts`), joined to `keyset` for unit.
	 *  nutshell: the `balance` view (defined as `s_issued - s_used`), keyed
	 *  by `keyset`, joined to `keysets` for unit. */
	balance(config: ConfigInfo, unit: MintUnit): number {
		const sql =
			config.mint === 'cdk'
				? `SELECT COALESCE(SUM(total_issued - total_redeemed), 0) FROM keyset_amounts ka JOIN keyset k ON k.id = ka.keyset_id WHERE k.unit = '${unit}'`
				: `SELECT COALESCE(SUM(b.balance), 0) FROM balance b JOIN keysets k ON k.id = b.keyset WHERE k.unit = '${unit}'`;
		const out = mintDbQuery(config, sql);
		return parseInt(out, 10);
	},

	/** Total fees the mint has collected for the given unit, summed across all
	 *  its keysets, straight from the mint database — what
	 *  `orc-mint-general-balance-sheet` displays in the expanded row's
	 *  "Fee revenue" high-card (the component's `getRows` aggregates per-keyset
	 *  `keyset.fees_paid` into one row per unit the same way). NOT cached:
	 *  fees grow as melts/swaps land mid-test.
	 *
	 *  cdk: `keyset_amounts.fee_collected`, joined to `keyset` for unit
	 *  (matches Orchard's `getKeysets` resolver, which selects this column
	 *  aliased as `fees_paid`).
	 *  nutshell: the `keysets` table carries `fees_paid` directly. */
	feesPaid(config: ConfigInfo, unit: MintUnit): number {
		const sql =
			config.mint === 'cdk'
				? `SELECT COALESCE(SUM(ka.fee_collected), 0) FROM keyset_amounts ka JOIN keyset k ON k.id = ka.keyset_id WHERE k.unit = '${unit}'`
				: `SELECT COALESCE(SUM(fees_paid), 0) FROM keysets WHERE unit = '${unit}'`;
		const out = mintDbQuery(config, sql);
		return parseInt(out, 10);
	},

	/** Provisioned keysets straight from the mint database, in the same shape
	 *  the bs row-chip renders (`Gen N` + `NNN ppk`). NOT cached: rotation can
	 *  add new keysets mid-test.
	 *
	 *  cdk stores the parsed `derivation_path_index` as its own column; nutshell
	 *  only stores the full `derivation_path` and Orchard's nutshell service
	 *  extracts the trailing `/N'?$` segment as the index — this helper mirrors
	 *  that extraction. The legacy-keyset reconciler (`reconcileLegacyKeysetIndices`)
	 *  in nutshell.service.ts only kicks in for keysets with `valid_from = null`,
	 *  which the regtest fixtures don't produce, so the simple regex matches
	 *  Orchard's output for every keyset in test stacks. */
	keysets(config: ConfigInfo): Array<{
		id: string;
		unit: MintUnit;
		active: boolean;
		derivation_path_index: number;
		input_fee_ppk: number;
	}> {
		const sql =
			config.mint === 'cdk'
				? `SELECT id, unit, active, derivation_path_index, COALESCE(input_fee_ppk, 0) FROM keyset ORDER BY id`
				: `SELECT id, unit, active, derivation_path, COALESCE(input_fee_ppk, 0) FROM keysets ORDER BY id`;
		const out = mintDbQuery(config, sql);
		if (out === '') return [];
		return out.split('\n').map((line) => {
			const [id, unit, active_str, third, ppk_str] = line.split('|');
			// cdk's third column is the parsed index; nutshell's is the full path
			// and Orchard extracts the trailing `/N'?` segment as the index.
			const nutshell_match = third.match(/\/(\d+)'?$/);
			const derivation_path_index =
				config.mint === 'cdk' ? parseInt(third, 10) : nutshell_match ? parseInt(nutshell_match[1], 10) : 0;
			return {
				id,
				unit: unit as MintUnit,
				active: parseSqlBoolean(active_str),
				derivation_path_index,
				input_fee_ppk: parseInt(ppk_str, 10),
			};
		});
	},
};
