/**
 * Orchard server's own database reads. Distinct from the mint daemon's DB
 * — Orchard persists settings, oracle backfills, analytics checkpoints, and
 * users in `/app/data/orchard.db` (sqlite, WAL mode).
 */

/* Native Dependencies */
import {orchardDbQuery} from './_sql';
import type {ConfigInfo} from '@e2e/types/config';

export const orchard = {
	/** Latest oracle price stored by the Backfill Prices flow, in integer USD
	 *  per BTC (the `utxoracle.price` column). E.g. `50000` means $50,000/BTC.
	 *  Returns null if the table is empty — callers should already be gated
	 *  by `oracleHasRecentData` readiness, so a null here is a real failure. */
	oraclePrice(config: ConfigInfo): number | null {
		const out = orchardDbQuery(config, 'SELECT price FROM utxoracle ORDER BY date DESC LIMIT 1');
		if (out === '') return null;
		return parseInt(out, 10);
	},
};
