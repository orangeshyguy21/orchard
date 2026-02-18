/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {BitcoinOraclePrice} from '@client/modules/bitcoin/classes/bitcoin-oracle-price.class';

export function eligibleForOracleConversion(unit: string): boolean {
	return unit === 'sat' || unit === 'msat' || unit === 'btc';
}

export function oracleConvertToUSDCents(amount_btc: number | null, price_usd: number | null, unit: string): number | null {
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

export function findNearestOraclePrice(oracle_map: Map<number, number>, target_timestamp: number): BitcoinOraclePrice | null {
	if (oracle_map.size === 0) return null;
	const target_day = DateTime.fromSeconds(target_timestamp).startOf('day').toSeconds();
	const exact_match = oracle_map.get(target_day);
	if (exact_match) return new BitcoinOraclePrice({date: target_day, price: exact_match});
	let nearest_price: number | null = null;
	let smallest_diff = Infinity;
	for (const [timestamp, price] of oracle_map) {
		const diff = Math.abs(timestamp - target_day);
		if (diff < smallest_diff) {
			smallest_diff = diff;
			nearest_price = price;
		}
	}
	return nearest_price ? new BitcoinOraclePrice({date: target_day, price: nearest_price}) : null;
}
