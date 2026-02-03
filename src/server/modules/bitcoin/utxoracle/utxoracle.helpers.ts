/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {MintUnit} from '@server/modules/cashu/cashu.enums';
import {UTXOracle} from '@server/modules/bitcoin/utxoracle/utxoracle.entity';

export function oracleConvertToUSDCents(amount_btc: number | null, price_usd: number | null, unit: string | MintUnit): number | null {
	if (amount_btc === null) return null;
	if (price_usd === null) return null;
	const unit_lower = unit.toLowerCase();
	switch (unit_lower) {
		case 'sat':
			return Math.round((amount_btc / 100_000_000) * price_usd * 100);
		case 'msat':
			return Math.round((amount_btc / 100_000_000_000) * price_usd * 100);
		case 'btc':
			return Math.round(amount_btc * price_usd * 100);
		default:
			return null;
	}
}

export function findNearestOraclePrice(oracle_map: Map<number, UTXOracle>, target_timestamp: number): UTXOracle | null {
	if (oracle_map.size === 0) return null;
	const target_day = DateTime.fromSeconds(target_timestamp).startOf('day').toSeconds();
	const exact_match = oracle_map.get(target_day);
	if (exact_match) return exact_match;
	return Array.from(oracle_map.values()).reduce((nearest, price) => {
		const nearest_diff = Math.abs(nearest.date - target_day);
		const current_diff = Math.abs(price.date - target_day);
		return current_diff < nearest_diff ? price : nearest;
	}, Array.from(oracle_map.values())[0]);
}
